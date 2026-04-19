import { auth } from "@Poneglyph/auth";
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

async function requireAuthenticatedUser(
  c: Context<DiscoverBindings>,
  next: Next,
): Promise<void> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const userId = session?.user?.id;

  if (!userId) {
    throw new HTTPException(401, { message: "Authentication required" });
  }

  c.set("userId", userId);
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
