import { z } from "zod";

// ------------------------------------------------------------------ //
// Chat / Research Agent schemas
// Used by both the Hono server (request body / response shaping)
// and the Next.js frontend (form validation + response parsing).
// ------------------------------------------------------------------ //

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "agent"]),
  content: z.string(),
  /** ISO-8601 datetime string — timestamps are serialised to strings over the wire */
  timestamp: z.string().datetime(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// ------------------------------------------------------------------ //

export const ChatRequestSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(10_000),
  /**
   * Optional list of dataset UUIDs the agent should restrict its
   * context to.  Capped at 10 to keep prompt sizes manageable.
   */
  datasetIds: z.array(z.string().uuid()).max(10).optional(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ------------------------------------------------------------------ //

export const ChatResponseSchema = z.object({
  messageId: z.string(),
  content: z.string(),
  /**
   * UUIDs of datasets the agent explicitly referenced while
   * generating its answer.  May be absent when the answer was
   * produced without retrieving specific documents.
   */
  sourceCitations: z.array(z.string().uuid()).optional(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
