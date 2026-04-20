import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UploadCallbackSchema, UploadRequestSchema } from "@Poneglyph/schemas/upload";
import { logger } from "@/lib/logger";
import { uploadFile, getPresignedUrl } from "../../lib/s3";
import { publishUploadMessage } from "../../lib/queue";

const log = logger.getChild("upload");

export const uploadRouter = new Hono();

/**
 * POST /api/upload
 * Accepts multipart/form-data with:
 *   - title        (required)
 *   - description  (required)
 *   - summary      (optional)
 *   - publisher    (optional)
 *   - tags         (optional, comma-separated)
 *   - files        (one or more attachments)
 *   - thumbnail    (optional, image file)
 *
 * Uploads files to R2 in parallel, enqueues processing job, returns upload_id.
 */
uploadRouter.post("/", zValidator("form", UploadRequestSchema), async (c) => {
  const session = c.get("user" as never) as { id: string } | undefined;
  const userId = session?.id ?? "anonymous";
  const { title, description, summary, publisher, tags, files, thumbnail } = c.req.valid("form");

  const uploadId = crypto.randomUUID();
  log.info("Upload received: {fileCount} file(s), upload_id={uploadId}", {
    fileCount: files.length,
    uploadId,
  });

  const attachmentPromises = files.map(async (file) => {
    const ext = file.name.split(".").pop() ?? "bin";
    const key = `uploads/${uploadId}/${crypto.randomUUID()}.${ext}`;
    const buffer = await file.arrayBuffer();

    await uploadFile(key, buffer, file.type || "application/octet-stream");
    const presignedUrl = await getPresignedUrl(key);

    return {
      s3_key: key,
      presigned_url: presignedUrl,
      mime_type: file.type || "application/octet-stream",
      file_type: file.type.split("/").pop() ?? "other",
    };
  });

  const thumbnailPromise = thumbnail
    ? (async () => {
        const thumbExt = thumbnail.name.split(".").pop() ?? "bin";
        const thumbKey = `uploads/${uploadId}/thumbnail.${thumbExt}`;
        const thumbBuffer = await thumbnail.arrayBuffer();
        await uploadFile(thumbKey, thumbBuffer, thumbnail.type || "image/*");
        return thumbKey;
      })()
    : Promise.resolve(undefined);

  // TODO: Replace with presigned URLs - client uploads directly to R2 (Zero Wait)
  // Issue: https://github.com/Itz-Agasta/Poneglyph/issues/8
  const [attachments, thumbnailS3Key] = await Promise.all([
    Promise.all(attachmentPromises),
    thumbnailPromise,
  ]);

  // Publish to RabbitMQ — worker handles everything from here
  await publishUploadMessage({
    upload_id: uploadId,
    user_id: userId,
    title,
    description,
    summary,
    publisher,
    tags,
    attachments,
    thumbnail_s3_key: thumbnailS3Key,
    callback_url: `${c.req.url.split("/api/")[0]}/api/upload/callback`,
  });

  log.info("Upload queued: upload_id={uploadId}", { uploadId });

  return c.json({ upload_id: uploadId, status: "queued" }, 202);
});

/**
 * POST /api/upload/callback
 * Called by the Rust worker when processing is done.
 * Extend this to push WebSocket/SSE events to the frontend.
 */
uploadRouter.post("/callback", zValidator("json", UploadCallbackSchema), async (c) => {
  const body = c.req.valid("json");

  if (body.status === "completed") {
    log.info("Upload completed: upload_id={uploadId}, dataset_id={datasetId}", {
      uploadId: body.upload_id,
      datasetId: body.dataset_id,
    });
  } else {
    log.warn("Upload failed: upload_id={uploadId}, error={error}", {
      uploadId: body.upload_id,
      error: body.error,
    });
  }
  // TODO: push real-time notification to frontend (WebSocket/SSE)
  return c.json({ ok: true });
});
