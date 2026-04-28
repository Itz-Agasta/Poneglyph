import { z } from "zod";

export const VolunteerListQuerySchema = z.object({
  city: z.string().optional(),
  tags: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const VolunteerParamSchema = z.object({
  targetUserId: z.string().trim().min(1),
});

export const VolunteerUpsertSchema = z.object({
  description: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  bio: z.string().max(2000).optional(),
  pastWorks: z.array(z.string().max(200)).max(20).optional(),
  isOpenToWork: z.boolean().optional(),
  wantsToStartOrg: z.boolean().optional(),
  tags: z.array(z.string().max(100)).max(10).optional(),
});
