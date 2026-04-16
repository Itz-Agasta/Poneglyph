import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { uploadFile, getPresignedUrl } from "../lib/s3";
import { publishUploadMessage, type AttachmentInfo } from "../lib/queue";

const upload = new Hono();

// File type → mime type mapping matching the DB file_type enum
const MIME_TO_FILE_TYPE: Record<string, string> = {
  "application/pdf": "pdf",
  "text/csv": "csv",
  "application/json": "json",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function resolveFileType(mime: string): string {
  return MIME_TO_FILE_TYPE[mime] ?? "other";
}

/**
 * POST /api/upload
 * Accepts multipart/form-data with:
 *   - title        (required)
 *   - description  (required)
 *   - summary      (optional)
 *   - publisher    (optional)
 *   - tags         (optional, comma-separated)
 *   - files        (one or more attachments)
 *
 * Uploads files to R2, enqueues processing job, returns upload_id.
 */
upload.post("/", async (c) => {
  // Better-auth session check
  const session = c.get("user" as never) as { id: string } | undefined;
  const userId = session?.id ?? "anonymous";

  let formData: FormData;
  try {
    formData = await c.req.formData();
  } catch {
    return c.json({ error: "Expected multipart/form-data" }, 400);
  }

  const title = formData.get("title");
  const description = formData.get("description");
  if (!title || !description) {
    return c.json({ error: "title and description are required" }, 400);
  }

  const summary = formData.get("summary")?.toString() ?? undefined;
  const publisher = formData.get("publisher")?.toString() ?? undefined;
  const tagsRaw = formData.get("tags")?.toString() ?? "";
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  // Collect all uploaded files
  const fileEntries = formData.getAll("files") as File[];
  if (fileEntries.length === 0) {
    return c.json({ error: "At least one file is required" }, 400);
  }

  const uploadId = crypto.randomUUID();

  // Upload each file to R2 and generate a presigned URL
  const attachments: AttachmentInfo[] = [];
  for (const file of fileEntries) {
    const ext = file.name.split(".").pop() ?? "bin";
    const key = `uploads/${uploadId}/${crypto.randomUUID()}.${ext}`;
    const buffer = await file.arrayBuffer();

    await uploadFile(key, buffer, file.type || "application/octet-stream");
    const presignedUrl = await getPresignedUrl(key);

    attachments.push({
      s3_key: key,
      presigned_url: presignedUrl,
      mime_type: file.type || "application/octet-stream",
      file_type: resolveFileType(file.type),
    });
  }

  // Publish to RabbitMQ — worker handles everything from here
  await publishUploadMessage({
    upload_id: uploadId,
    user_id: userId,
    title: title.toString(),
    description: description.toString(),
    summary,
    publisher,
    tags,
    attachments,
    callback_url: `${c.req.url.split("/api/")[0]}/api/upload/callback`,
  });

  return c.json({ upload_id: uploadId, status: "queued" }, 202);
});

const callbackSchema = z.object({
  upload_id: z.string().uuid(),
  dataset_id: z.string().uuid(),
  status: z.enum(["completed", "failed"]),
  error: z.string().optional(),
});

/**
 * POST /api/upload/callback
 * Called by the Rust worker when processing is done.
 * Extend this to push WebSocket/SSE events to the frontend.
 */
upload.post("/callback", zValidator("json", callbackSchema), async (c) => {
  const body = c.req.valid("json");

  if (body.status === "completed") {
    console.log(`[upload] completed: upload_id=${body.upload_id} dataset_id=${body.dataset_id}`);
  } else {
    console.error(`[upload] failed: upload_id=${body.upload_id} error=${body.error}`);
  }

  // TODO: push real-time notification to frontend (WebSocket/SSE)
  return c.json({ ok: true });
});

export default upload;
