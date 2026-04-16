import amqplib from "amqplib";
import { env } from "@Poneglyph/env/server";

export interface AttachmentInfo {
  s3_key: string;
  presigned_url: string;
  mime_type: string;
  file_type: string;
}

export interface UploadMessage {
  upload_id: string;
  user_id: string;
  title: string;
  description: string;
  summary?: string;
  publisher?: string;
  tags: string[];
  attachments: AttachmentInfo[];
  callback_url: string;
}

/**
 * Publish an upload message to the RabbitMQ queue.
 * Opens a connection, publishes, then closes — keeps server stateless.
 */
export async function publishUploadMessage(msg: UploadMessage): Promise<void> {
  const conn = await amqplib.connect(env.RABBITMQ_URL);
  try {
    const channel = await conn.createChannel();
    // Durable queue — survives broker restarts
    await channel.assertQueue(env.RABBITMQ_QUEUE, { durable: true });
    channel.sendToQueue(
      env.RABBITMQ_QUEUE,
      Buffer.from(JSON.stringify(msg)),
      { persistent: true, contentType: "application/json" },
    );
    await channel.close();
  } finally {
    await conn.close();
  }
}
