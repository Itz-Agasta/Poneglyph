import { auth } from "@Poneglyph/auth";
import { db } from "@Poneglyph/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context, Next } from "hono";

type DiscoverBindings = {
  Variables: {
    userId: string;
  };
};

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
