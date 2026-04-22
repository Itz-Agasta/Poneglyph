import { auth } from "@Poneglyph/auth";
import { db } from "@Poneglyph/db";
import { volunteer } from "@Poneglyph/db/schema/users";
import { count, and, inArray, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context, Next } from "hono";

type DiscoverBindings = {
  Variables: {
    userId: string;
  };
};

async function requireAuthenticatedUser(c: Context<DiscoverBindings>, next: Next): Promise<void> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const userId = session?.user?.id;

  if (!userId) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  c.set("userId", userId);
  await next();
}

export const discoverRoutes = new Hono<DiscoverBindings>();

const MAX_LIMIT = 100;

discoverRoutes.use("/volunteers", requireAuthenticatedUser);
discoverRoutes.use("/volunteers/*", requireAuthenticatedUser);

discoverRoutes.get("/volunteers", async (c) => {
  const pageRaw = c.req.query("page") ?? "1";
  const limitRaw = c.req.query("limit") ?? "10";
  const city = c.req.query("city")?.trim();
  const tagsRaw = c.req.query("tags")?.trim();

  const page = Number.parseInt(pageRaw, 10);
  const limit = Number.parseInt(limitRaw, 10);

  if (!Number.isInteger(page) || page < 1) {
    return c.json({ error: "Query param 'page' must be a positive integer" }, 400);
  }

  if (!Number.isInteger(limit) || limit < 1) {
    return c.json({ error: "Query param 'limit' must be a positive integer" }, 400);
  }

  const cappedLimit = Math.min(limit, MAX_LIMIT);
  const offset = (page - 1) * cappedLimit;
  const filters: string[] = [];

  const tagSlugs = tagsRaw
    ? [
        ...new Set(
          tagsRaw
            .split(",")
            .map((value) => value.trim().toLowerCase())
            .filter(Boolean),
        ),
      ]
    : [];

  if (tagSlugs.length > 0) {
    const matchingTags = await db.query.tags.findMany({
      where: (fields, { inArray }) => inArray(fields.slug, tagSlugs),
      with: {
        volunteerTags: {
          columns: {
            volunteerId: true,
          },
        },
      },
      columns: {
        slug: true,
      },
    });

    const matchingVolunteerRows: Array<{ volunteerId: string }> = matchingTags.flatMap(
      (tag) => tag.volunteerTags as Array<{ volunteerId: string }>,
    );
    const tagCounts = new Map<string, number>();
    for (const row of matchingVolunteerRows) {
      tagCounts.set(row.volunteerId, (tagCounts.get(row.volunteerId) || 0) + 1);
    }

    const matchedVolunteerIDs = [
      ...new Set(matchingVolunteerRows.map((row) => row.volunteerId)),
    ].filter((id) => (tagCounts.get(id) || 0) >= tagSlugs.length);

    if (matchedVolunteerIDs.length === 0) {
      return c.json({ data: [], total: 0, page, limit: cappedLimit, totalPages: 0 }, 200);
    }

    filters.push(...matchedVolunteerIDs);
  }

  const conditions = [];
  if (city) conditions.push(eq(sql`lower(${volunteer.city})`, city.toLowerCase()));
  if (filters.length > 0) conditions.push(inArray(volunteer.userId, filters));
  const condition =
    conditions.length === 0
      ? undefined
      : conditions.length === 1
        ? conditions[0]
        : and(...conditions);

  const [rows, [{ total }]] = await Promise.all([
    db.query.volunteer.findMany({
      where: condition ? () => condition : undefined,
      limit: cappedLimit,
      offset,
      orderBy: (fields, { asc }) => [asc(fields.userId)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        volunteerTags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      columns: {
        description: true,
        city: true,
        pastWorks: true,
      },
    }),
    db
      .select({ total: count() })
      .from(volunteer)
      .where(condition)
      .then((result) => result as [{ total: number }]),
  ]);

  return c.json(
    {
      data: rows.map((record) => ({
        userId: record.user?.id,
        name: record.user?.name,
        image: record.user?.image,
        description: record.description,
        city: record.city,
        pastWorks: record.pastWorks,
        tags: record.volunteerTags.map((item) => item.tag),
      })),
      total,
      page,
      limit: cappedLimit,
      totalPages: Math.ceil(total / cappedLimit),
    },
    200,
  );
});

discoverRoutes.get("/volunteers/:targetUserId", async (c) => {
  const targetUserId = c.req.param("targetUserId").trim();

  if (!targetUserId) {
    return c.json({ error: "Target volunteer id is required" }, 400);
  }

  const volunteerRecord = await db.query.volunteer.findFirst({
    where: (fields, { eq }) => eq(fields.userId, targetUserId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    columns: {
      description: true,
      city: true,
      pastWorks: true,
    },
  });

  if (!volunteerRecord || !volunteerRecord.user) {
    return c.json({ error: "Target volunteer not found" }, 404);
  }

  return c.json({
    volunteer: {
      userId: volunteerRecord.user.id,
      name: volunteerRecord.user.name,
      image: volunteerRecord.user.image,
      description: volunteerRecord.description,
      city: volunteerRecord.city,
      pastWorks: volunteerRecord.pastWorks,
    },
  });
});
