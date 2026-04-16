import { z } from "zod";

// ---- Source type ----
export const SourceTypeSchema = z.enum(["upload", "external_url", "api"]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

// ---- Dataset status ----
export const DatasetStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "archived",
]);
export type DatasetStatus = z.infer<typeof DatasetStatusSchema>;

// ---- File type ----
export const FileTypeSchema = z.enum([
  "pdf",
  "csv",
  "xlsx",
  "xls",
  "json",
  "docx",
  "other",
]);
export type FileType = z.infer<typeof FileTypeSchema>;

// ---- Sync status ----
export const SyncStatusSchema = z.enum(["running", "completed", "failed"]);
export type SyncStatus = z.infer<typeof SyncStatusSchema>;
