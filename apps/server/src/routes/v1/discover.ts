import { db } from "@Poneglyph/db";
import { volunteer } from "@Poneglyph/db/schema/users";
import { tags as tagsTable, volunteerTags } from "@Poneglyph/db/schema/data";
import { VolunteerListQuerySchema, VolunteerParamSchema } from "@Poneglyph/schemas/volunteer";
import { zValidator } from "@hono/zod-validator";
import { count, and, inArray, eq, desc, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import { requireAuth } from "../../middleware/auth";

export const discoverRouter = new Hono();

/**
 * GET /api/discover/volunteers
 * Paginated volunteer listing with filters.
 *   - page        (default: 1)
 *   - limit       (default: 20, max: 100)
 *   - city        (optional) filter by city
 *   - tags        (optional) filter by tag slugs (comma-separated)
 */
discoverRouter.get(
  "/volunteers",
  requireAuth,
  zValidator("query", VolunteerListQuerySchema),
  async (c) => {
    const { page, limit, city, tags } = c.req.valid("query");
    const offset = (page - 1) * limit;
    const matchedVolunteerIds: string[] = [];

    const tagSlugs = tags
      ? [
          ...new Set(
            tags
              .split(",")
              .map((tag) => tag.trim().toLowerCase())
              .filter(Boolean),
          ),
        ]
      : [];

    if (tagSlugs.length > 0) {
      // Step 1: resolve slugs → tag IDs (if any slug is unknown, no volunteer can match)
      const matchedTagRows = await db
        .select({ id: tagsTable.id })
        .from(tagsTable)
        .where(inArray(tagsTable.slug, tagSlugs));

      if (matchedTagRows.length !== tagSlugs.length) {
        return c.json({ data: [], total: 0, page, limit, totalPages: 0 }, 200);
      }

      const tagIds = matchedTagRows.map((t) => t.id);

      // Step 2: volunteers that hold ALL the requested tags
      const volunteerRows = await db
        .select({ volunteerId: volunteerTags.volunteerId })
        .from(volunteerTags)
        .where(inArray(volunteerTags.tagId, tagIds))
        .groupBy(volunteerTags.volunteerId)
        .having(eq(count(volunteerTags.tagId), tagIds.length));

      if (volunteerRows.length === 0) {
        return c.json({ data: [], total: 0, page, limit, totalPages: 0 }, 200);
      }

      matchedVolunteerIds.push(...volunteerRows.map((r) => r.volunteerId));
    }

    const conditions: SQL[] = [];
    const normalizedCity = city?.trim().toLowerCase();

    if (normalizedCity) conditions.push(eq(sql`lower(${volunteer.city})`, normalizedCity));
    if (matchedVolunteerIds.length > 0) conditions.push(inArray(volunteer.userId, matchedVolunteerIds));

    const condition =
      conditions.length === 0
        ? undefined
        : conditions.length === 1
          ? conditions[0]
          : and(...conditions);

    const [rows, totalRows] = await Promise.all([
      db.query.volunteer.findMany({
        where: condition,
        limit,
        offset,
        orderBy: (fields) => [desc(fields.createdAt)],
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
      db.select({ total: count() }).from(volunteer).where(condition),
    ]);

    const total = totalRows[0]?.total ?? 0;

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
        limit,
        totalPages: Math.ceil(total / limit),
      },
      200,
    );
  },
);

/**
 * GET /api/discover/volunteers/:targetUserId
 * Volunteer detail by user ID.
 * Returns full volunteer profile with tags.
 */
discoverRouter.get(
  "/volunteers/:targetUserId",
  requireAuth,
  zValidator("param", VolunteerParamSchema),
  async (c) => {
    const { targetUserId } = c.req.valid("param");

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
        tags: volunteerRecord.volunteerTags.map((item) => item.tag),
      },
    });
  },
);
