import { z } from "zod";
import { SourceTypeSchema } from "./enums";

export const SourceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().nullable(),
  name: z.string().min(1).max(50),
  url: z.string().url().nullable(),
  sourceType: SourceTypeSchema,
  isVerified: z.boolean(),
});

export type Source = z.infer<typeof SourceSchema>;

export const CreateSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or fewer"),
  url: z.string().url("Must be a valid URL").optional(),
  sourceType: SourceTypeSchema,
});

export type CreateSourceInput = z.infer<typeof CreateSourceSchema>;

export const UpdateSourceSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  url: z.string().url().nullable().optional(),
  isVerified: z.boolean().optional(),
});

export type UpdateSourceInput = z.infer<typeof UpdateSourceSchema>;
