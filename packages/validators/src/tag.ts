import { z } from "zod";

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});
export type Tag = z.infer<typeof TagSchema>;

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(100),
});
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
