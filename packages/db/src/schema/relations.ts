import { relations } from "drizzle-orm";

import { sources, volunteerTags } from "./data";
import { organisation, user, volunteer } from "./users";

export const volunteerRelations = relations(volunteer, ({ one, many }) => ({
  user: one(user, {
    fields: [volunteer.userId],
    references: [user.id],
  }),
  volunteerTags: many(volunteerTags),
}));

export const organisationRelations = relations(organisation, ({ one, many }) => ({
  user: one(user, {
    fields: [organisation.userId],
    references: [user.id],
  }),
  sources: many(sources),
}));
