import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  varchar,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { tags } from "./data";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const volunteer = pgTable(
  "volunteer",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    description: text("description"),
    city: varchar("city", { length: 100 }),
    pastWorks: text("past_works").array().notNull().default([]),
    bio: text("bio"),
    isOpenToWork: boolean("is_open_to_work").default(false).notNull(),
    wantsToStartOrg: boolean("wants_to_start_org").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_volunteer_city").on(table.city)],
);

export const volunteerTags = pgTable(
  "volunteer_tags",
  {
    volunteerId: text("volunteer_id")
      .notNull()
      .references(() => volunteer.userId, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_volunteer_tags_tag_id").on(table.tagId),
    primaryKey({
      name: "volunteer_tags_pk",
      columns: [table.volunteerId, table.tagId],
    }),
  ],
);

export const volunteerRelations = relations(volunteer, ({ one, many }) => ({
  user: one(user, {
    fields: [volunteer.userId],
    references: [user.id],
  }),
  volunteerTags: many(volunteerTags),
}));

export const volunteerTagsRelations = relations(volunteerTags, ({ one }) => ({
  volunteer: one(volunteer, {
    fields: [volunteerTags.volunteerId],
    references: [volunteer.userId],
  }),
  tag: one(tags, {
    fields: [volunteerTags.tagId],
    references: [tags.id],
  }),
}));
