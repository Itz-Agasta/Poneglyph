import { env } from "@Poneglyph/env/server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context, Next } from "hono";
import { Pool } from "pg";

type DiscoverBindings = {
  Variables: {
    userId: string;
  };
};

const pool = new Pool({ connectionString: env.DATABASE_URL });

const SESSION_COOKIE_CANDIDATES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session-token",
  "__Secure-better-auth.session-token",
];

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

function extractSessionToken(c: Context<DiscoverBindings>): string | null {
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
  c: Context<DiscoverBindings>,
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

export const discoverRoutes = new Hono<DiscoverBindings>();

discoverRoutes.use("/volunteers/*", requireAuthenticatedUser);

discoverRoutes.get("/volunteers/:targetUserId", async (c) => {
  const targetUserId = c.req.param("targetUserId").trim();

  if (!targetUserId) {
    return c.json({ error: "Target volunteer id is required" }, 400);
  }

  const result = await pool.query<{
    id: string;
    name: string;
    image: string | null;
    description: string | null;
    city: string | null;
    past_works: string[] | null;
  }>(
    `SELECT
       u.id,
       u.name,
       u.image,
       v.description,
       v.city,
       v.past_works
     FROM volunteer v
     INNER JOIN "user" u ON u.id = v.user_id
     WHERE v.user_id = $1
     LIMIT 1`,
    [targetUserId],
  );

  if (result.rowCount === 0) {
    return c.json({ error: "Target volunteer not found" }, 404);
  }

  const row = result.rows[0];
  if (!row) {
    return c.json({ error: "Target volunteer not found" }, 404);
  }

  return c.json({
    volunteer: {
      userId: row.id,
      name: row.name,
      image: row.image,
      description: row.description,
      city: row.city,
      pastWorks: row.past_works ?? [],
    },
  });
});
