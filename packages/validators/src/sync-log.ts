import { z } from "zod";
import { SyncStatusSchema } from "./enums";

export const SyncLogSchema = z.object({
  id: z.string().uuid(),
  sourceId: z.string().uuid(),
  syncStatus: SyncStatusSchema,
  totalFound: z.number().int().nonnegative(),
  added: z.number().int().nonnegative(),
  updated: z.number().int().nonnegative(),
  archived: z.number().int().nonnegative(),
  errorCount: z.number().int().nonnegative(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  error: z.string().nullable(),
});

export type SyncLog = z.infer<typeof SyncLogSchema>;
