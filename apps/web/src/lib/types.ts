import { z } from "zod";

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});
export type Tag = z.infer<typeof TagSchema>;

const DatasetStatusSchema = z.enum(["pending", "approved", "rejected", "archived"]);
const FileTypeSchema = z.enum(["pdf", "csv", "xlsx", "xls", "json", "docx", "other"]);

export const DatasetListItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  thumbnailS3Key: z.string().nullable(),
  publisher: z.string().nullable(),
  language: z.string(),
  fileTypes: z.array(FileTypeSchema).nullable(),
  status: DatasetStatusSchema,
  viewCount: z.number().int().nonnegative(),
  downloadCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  tags: z.array(TagSchema).optional(),
});
export type DatasetListItem = z.infer<typeof DatasetListItemSchema>;

export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });
}

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
