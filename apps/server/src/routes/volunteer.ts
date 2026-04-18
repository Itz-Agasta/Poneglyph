import { env } from "@Poneglyph/env/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context, Next } from "hono";
import { Pool } from "pg";
import { z } from "zod";

type VolunteerBindings = {
  Variables: {
    userId: string;
  };
};

type InterestTag = {
  id: string;
  name: string;
  slug: string;
};

const pool = new Pool({ connectionString: env.DATABASE_URL });

const SESSION_COOKIE_CANDIDATES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session-token",
  "__Secure-better-auth.session-token",
];

const interestsSchema = z.object({
  interests: z.array(z.string().min(1)).min(1),
});

const profileUpdateSchema = z.object({
  description: z.string().trim().max(4000).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  pastWorks: z.array(z.string().trim().min(1).max(160)).max(50).optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  isOpenToWork: z.boolean().optional(),
  wantsToStartOrg: z.boolean().optional(),
  wantsToHire: z.boolean().optional(),
});

function parseCookieHeader(cookieHeader: string | undefined): Map<string, string> {
  const result = new Map<string, string>();
  if (!cookieHeader) {
    return result;
  }

  for (const chunk of cookieHeader.split(";")) {
    const trimmed = chunk.trim();
    if (!trimmed) {
      continue;
    }

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, equalIndex).trim();
    const value = decodeURIComponent(trimmed.slice(equalIndex + 1).trim());
    result.set(key, value);
  }

  return result;
}

function extractSessionToken(c: Context<VolunteerBindings>): string | null {
  const authorization = c.req.header("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice("Bearer ".length).trim();
    if (token) {
      return token;
    }
  }

  const cookies = parseCookieHeader(c.req.header("Cookie"));
  for (const name of SESSION_COOKIE_CANDIDATES) {
    const value = cookies.get(name);
    if (value) {
      return value;
    }
  }

  return null;
}

async function requireAuthenticatedUser(
  c: Context<VolunteerBindings>,
  next: Next,
): Promise<void> {
  const sessionToken = extractSessionToken(c);
  if (!sessionToken) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  const sessionResult = await pool.query<{ user_id: string }>(
    `SELECT user_id
     FROM session
     WHERE token = $1
       AND expires_at > NOW()
     LIMIT 1`,
    [sessionToken],
  );

  if (sessionResult.rowCount === 0) {
    throw new HTTPException(401, { message: "Invalid or expired session" });
  }

  const sessionRow = sessionResult.rows[0];
  if (!sessionRow) {
    throw new HTTPException(401, { message: "Invalid or expired session" });
  }

  c.set("userId", sessionRow.user_id);
  await next();
}

function getAuthenticatedUserId(c: Context<VolunteerBindings>): string {
  const userId = c.get("userId");
  if (!userId) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  return userId;
}

function countWordsExcludingSpaces(value: string): number {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function normalizeNullableText(value: string | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asInterestTagArray(input: unknown): InterestTag[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return null;
      }

      const value = item as Partial<InterestTag>;
      if (
        typeof value.id !== "string" ||
        typeof value.name !== "string" ||
        typeof value.slug !== "string"
      ) {
        return null;
      }

      return {
        id: value.id,
        name: value.name,
        slug: value.slug,
      };
    })
    .filter((item): item is InterestTag => item !== null);
}

function normalizeInterests(interests: string[]): string[] {
  return [...new Set(interests.map((value) => value.trim().toLowerCase()).filter(Boolean))];
}

export const volunteerRoutes = new Hono<VolunteerBindings>();

volunteerRoutes.get("/metadata/interests", async (c) => {
  const result = await pool.query<{ slug: string }>(
    `SELECT slug
     FROM tags
     ORDER BY name ASC`,
  );

  const interests = result.rows.map((row) => row.slug);
  return c.json({ count: interests.length, interests });
});

volunteerRoutes.use("/volunteers/*", requireAuthenticatedUser);

volunteerRoutes.post("/volunteers/me/activate", async (c) => {
  const userId = getAuthenticatedUserId(c);

  const result = await pool.query(
    `INSERT INTO volunteer (
       user_id,
       past_works,
       is_open_to_work,
       wants_to_start_org,
       wants_to_hire
     )
     VALUES ($1, '{}'::text[], false, false, false)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId],
  );

  return c.json({
    message:
      result.rowCount === 1
        ? "Volunteer profile created"
        : "Volunteer profile already exists",
    volunteerProfileCreated: result.rowCount === 1,
  });
});

volunteerRoutes.get("/volunteers/me", async (c) => {
  const userId = getAuthenticatedUserId(c);

  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    image: string | null;
    description: string | null;
    city: string | null;
    past_works: string[] | null;
    bio: string | null;
    is_open_to_work: boolean;
    wants_to_start_org: boolean;
    wants_to_hire: boolean;
    interests: unknown;
  }>(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.image,
       v.description,
       v.city,
       v.past_works,
       v.bio,
       v.is_open_to_work,
       v.wants_to_start_org,
       v.wants_to_hire,
       COALESCE(
         (
           SELECT json_agg(
             json_build_object(
               'id', t.id,
               'name', t.name,
               'slug', t.slug
             )
             ORDER BY t.name ASC
           )
           FROM volunteer_tags vt
           INNER JOIN tags t ON t.id = vt.tag_id
           WHERE vt.volunteer_id = v.user_id
         ),
         '[]'::json
       ) AS interests
     FROM volunteer v
     INNER JOIN "user" u ON u.id = v.user_id
     WHERE v.user_id = $1
     LIMIT 1`,
    [userId],
  );

  if (result.rowCount === 0) {
    return c.json({ error: "Volunteer profile not found" }, 404);
  }

  const row = result.rows[0];
  if (!row) {
    return c.json({ error: "Volunteer profile not found" }, 404);
  }

  return c.json({
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      image: row.image,
    },
    interests: asInterestTagArray(row.interests),
    city: row.city,
    bio: row.bio,
    description: row.description,
    pastWorks: row.past_works ?? [],
    isOpenToWork: row.is_open_to_work,
    wantsToStartOrg: row.wants_to_start_org,
    wantsToHire: row.wants_to_hire,
  });
});

volunteerRoutes.put("/volunteers/me", async (c) => {
  const userId = getAuthenticatedUserId(c);
  const body = await c.req.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request payload",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const description = normalizeNullableText(parsed.data.description);
  const bio = normalizeNullableText(parsed.data.bio);

  if (typeof description === "string" && countWordsExcludingSpaces(description) > 200) {
    return c.json(
      {
        error: "Description exceeds max allowed word count",
        field: "description",
        maxWords: 200,
      },
      400,
    );
  }

  if (typeof bio === "string" && countWordsExcludingSpaces(bio) > 20) {
    return c.json(
      {
        error: "Bio exceeds max allowed word count",
        field: "bio",
        maxWords: 20,
      },
      400,
    );
  }

  const city = normalizeNullableText(parsed.data.city);
  const pastWorks =
    parsed.data.pastWorks === undefined
      ? undefined
      : [...new Set(parsed.data.pastWorks.map((value) => value.trim()).filter(Boolean))];

  const updates: string[] = [];
  const values: Array<string | boolean | string[] | null> = [userId];

  if (description !== undefined) {
    updates.push(`description = $${values.length + 1}`);
    values.push(description);
  }

  if (city !== undefined) {
    updates.push(`city = $${values.length + 1}`);
    values.push(city);
  }

  if (pastWorks !== undefined) {
    updates.push(`past_works = $${values.length + 1}::text[]`);
    values.push(pastWorks);
  }

  if (bio !== undefined) {
    updates.push(`bio = $${values.length + 1}`);
    values.push(bio);
  }

  if (parsed.data.isOpenToWork !== undefined) {
    updates.push(`is_open_to_work = $${values.length + 1}`);
    values.push(parsed.data.isOpenToWork);
  }

  if (parsed.data.wantsToStartOrg !== undefined) {
    updates.push(`wants_to_start_org = $${values.length + 1}`);
    values.push(parsed.data.wantsToStartOrg);
  }

  if (parsed.data.wantsToHire !== undefined) {
    updates.push(`wants_to_hire = $${values.length + 1}`);
    values.push(parsed.data.wantsToHire);
  }

  if (updates.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  updates.push("updated_at = NOW()");

  const result = await pool.query(
    `UPDATE volunteer
     SET ${updates.join(", ")}
     WHERE user_id = $1`,
    values,
  );

  if (result.rowCount === 0) {
    return c.json({ error: "Volunteer profile not found" }, 404);
  }

  return c.json({ message: "Volunteer profile updated" });
});

volunteerRoutes.put("/volunteers/me/interests", async (c) => {
  const userId = getAuthenticatedUserId(c);
  const body = await c.req.json().catch(() => null);
  const parsed = interestsSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request payload",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  const slugs = normalizeInterests(parsed.data.interests);

  const profileExists = await pool.query(
    `SELECT user_id
     FROM volunteer
     WHERE user_id = $1
     LIMIT 1`,
    [userId],
  );

  if (profileExists.rowCount === 0) {
    return c.json({ error: "Volunteer profile not found" }, 404);
  }

  const tagResult = await pool.query<InterestTag>(
    `SELECT id, name, slug
     FROM tags
     WHERE slug = ANY($1::text[])
     ORDER BY name ASC`,
    [slugs],
  );

  const foundBySlug = new Set(tagResult.rows.map((row) => row.slug));
  const invalidSlugs = slugs.filter((slug) => !foundBySlug.has(slug));

  if (invalidSlugs.length > 0) {
    return c.json(
      {
        error: "Some interests do not exist in tags",
        invalidSlugs,
      },
      400,
    );
  }

  const tagIds = tagResult.rows.map((row) => row.id);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `DELETE FROM volunteer_tags
       WHERE volunteer_id = $1`,
      [userId],
    );

    if (tagIds.length > 0) {
      await client.query(
        `INSERT INTO volunteer_tags (volunteer_id, tag_id)
         SELECT $1, UNNEST($2::uuid[])
         ON CONFLICT (volunteer_id, tag_id) DO NOTHING`,
        [userId, tagIds],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return c.json({
    message: "Interests updated",
    interests: slugs,
  });
});

volunteerRoutes.get("/volunteers/me/suggestions", async (c) => {
  const userId = getAuthenticatedUserId(c);

  const result = await pool.query<{
    id: string;
    name: string;
    image: string | null;
    common_interests: string[] | null;
    interests_score: number;
  }>(
    `WITH self_interests AS (
       SELECT COALESCE(array_agg(DISTINCT vt.tag_id), ARRAY[]::uuid[]) AS self_tag_ids
       FROM volunteer_tags vt
       WHERE vt.volunteer_id = $1
     )
     SELECT
       u.id,
       u.name,
       u.image,
       COALESCE(
         array_agg(DISTINCT t.slug) FILTER (WHERE vt.tag_id = ANY(si.self_tag_ids)),
         ARRAY[]::text[]
       ) AS common_interests,
       CASE
         WHEN (cardinality(si.self_tag_ids) + COUNT(DISTINCT vt.tag_id) - COUNT(DISTINCT vt.tag_id) FILTER (WHERE vt.tag_id = ANY(si.self_tag_ids))) = 0 THEN 0
         ELSE (
           COUNT(DISTINCT vt.tag_id) FILTER (WHERE vt.tag_id = ANY(si.self_tag_ids))::double precision /
           (cardinality(si.self_tag_ids) + COUNT(DISTINCT vt.tag_id) - COUNT(DISTINCT vt.tag_id) FILTER (WHERE vt.tag_id = ANY(si.self_tag_ids)))::double precision
         )
       END AS interests_score
     FROM volunteer v
     INNER JOIN "user" u ON u.id = v.user_id
     CROSS JOIN self_interests si
     LEFT JOIN volunteer_tags vt ON vt.volunteer_id = v.user_id
     LEFT JOIN tags t ON t.id = vt.tag_id
     WHERE v.user_id <> $1
     GROUP BY u.id, u.name, u.image, si.self_tag_ids
     HAVING cardinality(si.self_tag_ids) = 0
        OR COUNT(DISTINCT vt.tag_id) FILTER (WHERE vt.tag_id = ANY(si.self_tag_ids)) > 0
     ORDER BY interests_score DESC, u.name ASC
     LIMIT $2`,
    [userId, 20],
  );

  const suggestions = result.rows
    .map((row) => ({
      userId: row.id,
      name: row.name,
      image: row.image,
      commonInterests: row.common_interests ?? [],
      score: Number(Number(row.interests_score ?? 0).toFixed(6)),
      reasons:
        (row.common_interests ?? []).length > 0
          ? [`Shares ${(row.common_interests ?? []).length} interest(s)`]
          : [],
    }))
    .filter((item) => item.score > 0 || item.commonInterests.length > 0);

  return c.json({ source: "computed", suggestions });
});

volunteerRoutes.post("/volunteers/:targetUserId/view", async (c) => {
  const viewerId = getAuthenticatedUserId(c);
  const targetUserId = c.req.param("targetUserId");

  if (viewerId === targetUserId) {
    return c.json({ message: "Self-profile views are ignored" });
  }

  const targetExists = await pool.query(
    `SELECT user_id
     FROM volunteer
     WHERE user_id = $1
     LIMIT 1`,
    [targetUserId],
  );

  if (targetExists.rowCount === 0) {
    return c.json({ error: "Target volunteer not found" }, 404);
  }

  return c.json({
    message: "Profile view received",
    targetUserId,
  });
});

volunteerRoutes.post("/volunteers/me/profile-image", async (c) => {
  getAuthenticatedUserId(c);
  const formData = await c.req.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return c.json({ error: "Expected multipart form-data with image file" }, 400);
  }

  return c.json({ message: "Profile image upload is disabled" });
});
