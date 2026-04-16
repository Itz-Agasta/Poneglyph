import { z } from "zod";

import { DatasetStatusSchema, FileTypeSchema } from "./enums";
import { PaginationQuerySchema } from "./pagination";
import { TagSchema } from "./tag";

// ---------------------------------------------------------------------------
// Full dataset — returned by GET /datasets/:id
// The internal `embedding` vector is intentionally excluded from API responses
// ---------------------------------------------------------------------------
export const DatasetSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string().nullable(),
  sourceId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().nullable(),
  thumbnailS3Key: z.string().nullable(),
  summary: z.string().nullable(),
  publicationDate: z.string().datetime().nullable(),
  publisher: z.string().max(255).nullable(),
  language: z.string().max(10),
  s3Keys: z.array(z.string()).nullable(),
  fileTypes: z.array(FileTypeSchema).nullable(),
  sourceUrl: z.string().url().nullable(),
  status: DatasetStatusSchema,
  viewCount: z.number().int().nonnegative(),
  downloadCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Optionally joined — present when the endpoint eager-loads tags
  tags: z.array(TagSchema).optional(),
});

export type Dataset = z.infer<typeof DatasetSchema>;

// ---------------------------------------------------------------------------
// List item — lightweight shape for cards and paginated lists
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Create — POST body for volunteer dataset submission
// ---------------------------------------------------------------------------
export const CreateDatasetSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  sourceId: z.string().uuid(),
  fileTypes: z.array(FileTypeSchema).min(1, "At least one file type is required"),
  publisher: z.string().max(255).optional(),
  language: z.string().max(10).default("en"),
  tagIds: z.array(z.string().uuid()).optional(),
  sourceUrl: z.string().url().optional(),
  publicationDate: z.string().datetime().optional(),
});

export type CreateDatasetInput = z.infer<typeof CreateDatasetSchema>;

// ---------------------------------------------------------------------------
// Update status — PATCH body for NGO / admin moderation
// Requires rejectionReason when status is "rejected"
// ---------------------------------------------------------------------------
export const UpdateDatasetStatusSchema = z
  .object({
    status: DatasetStatusSchema,
    rejectionReason: z.string().min(1).max(1000).optional(),
  })
  .refine(
    (data) =>
      data.status !== "rejected" || data.rejectionReason !== undefined,
    {
      message: "A rejection reason is required when status is 'rejected'",
      path: ["rejectionReason"],
    },
  );

export type UpdateDatasetStatusInput = z.infer<typeof UpdateDatasetStatusSchema>;

// ---------------------------------------------------------------------------
// Query — GET /datasets search + filter + sort params
// Extends the shared pagination schema
// ---------------------------------------------------------------------------
export const DatasetQuerySchema = PaginationQuerySchema.extend({
  q: z.string().max(500).optional(),
  status: DatasetStatusSchema.optional(),
  fileType: FileTypeSchema.optional(),
  // Comma-separated tag slugs or IDs accepted as a repeated query param
  tags: z.array(z.string()).optional(),
  language: z.string().max(10).optional(),
  sortBy: z
    .enum(["createdAt", "viewCount", "downloadCount", "publicationDate"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type DatasetQuery = z.infer<typeof DatasetQuerySchema>;
