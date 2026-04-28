import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@Poneglyph/db";
import { volunteer, volunteerTags, tags } from "@Poneglyph/db/schema";
import { VolunteerUpsertSchema } from "@Poneglyph/schemas/volunteer";
import { requireAuth } from "../../middleware/auth";
import { eq } from "drizzle-orm";

export const volunteerRouter = new Hono();

/**
 * GET /api/volunteer/me
 * Fetch current user's volunteer profile
 */
volunteerRouter.get("/me", requireAuth, async (c) => {
  const user = c.get("user")!;

  const volunteerRecord = await db.query.volunteer.findFirst({
    where: (fields) => eq(fields.userId, user.id),
    with: {
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
  });

  if (!volunteerRecord) {
    return c.json({ volunteer: null }, 200);
  }

  return c.json(
    {
      volunteer: {
        description: volunteerRecord.description,
        city: volunteerRecord.city,
        bio: volunteerRecord.bio,
        pastWorks: volunteerRecord.pastWorks,
        isOpenToWork: volunteerRecord.isOpenToWork,
        wantsToStartOrg: volunteerRecord.wantsToStartOrg,
        tags: volunteerRecord.volunteerTags.map((vt) => vt.tag),
      },
    },
    200,
  );
});

/**
 * POST /api/volunteer/me
 * Upsert current user's volunteer profile
 */
volunteerRouter.post("/me", requireAuth, zValidator("json", VolunteerUpsertSchema), async (c) => {
  const user = c.get("user")!;
  const {
    description,
    city,
    bio,
    pastWorks,
    isOpenToWork,
    wantsToStartOrg,
    tags: tagSlugs,
  } = c.req.valid("json");

  // Upsert volunteer profile
  await db
    .insert(volunteer)
    .values({
      userId: user.id,
      description: description || null,
      city: city || null,
      bio: bio || null,
      pastWorks: pastWorks || [],
      isOpenToWork: isOpenToWork ?? false,
      wantsToStartOrg: wantsToStartOrg ?? null,
    })
    .onConflictDoUpdate({
      target: volunteer.userId,
      set: {
        description: description || null,
        city: city || null,
        bio: bio || null,
        pastWorks: pastWorks || [],
        isOpenToWork: isOpenToWork ?? false,
        wantsToStartOrg: wantsToStartOrg ?? null,
        updatedAt: new Date(),
      },
    });

  // Handle tags if provided
  if (tagSlugs && tagSlugs.length > 0) {
    // Delete all existing volunteer tags
    await db.delete(volunteerTags).where(eq(volunteerTags.volunteerId, user.id));

    // Get or create tags
    const tagIds: string[] = [];
    for (const slug of tagSlugs) {
      // First try to get existing tag
      const existingTag = await db.query.tags.findFirst({
        where: (fields) => eq(fields.slug, slug),
      });

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        // Create new tag
        const result = await db
          .insert(tags)
          .values({
            name: slug,
            slug: slug,
          })
          .returning({ id: tags.id });

        if (result.length > 0) {
          tagIds.push(result[0].id);
        }
      }
    }

    // Insert new volunteer tags
    if (tagIds.length > 0) {
      await db.insert(volunteerTags).values(
        tagIds.map((tagId) => ({
          volunteerId: user.id,
          tagId,
        })),
      );
    }
  } else {
    // Delete all tags if empty array provided
    await db.delete(volunteerTags).where(eq(volunteerTags.volunteerId, user.id));
  }

  // Fetch and return updated profile
  const updatedRecord = await db.query.volunteer.findFirst({
    where: (fields) => eq(fields.userId, user.id),
    with: {
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
  });

  if (!updatedRecord) {
    return c.json({ error: "Failed to fetch updated profile" }, 500);
  }

  return c.json(
    {
      volunteer: {
        description: updatedRecord.description,
        city: updatedRecord.city,
        bio: updatedRecord.bio,
        pastWorks: updatedRecord.pastWorks,
        isOpenToWork: updatedRecord.isOpenToWork,
        wantsToStartOrg: updatedRecord.wantsToStartOrg,
        tags: updatedRecord.volunteerTags.map((vt) => vt.tag),
      },
    },
    200,
  );
});
