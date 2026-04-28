import { z } from "zod";

export const StartConversationSchema = z.object({
  otherUserId: z.string().trim().min(1),
});

export const SendMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
});

export const ConversationParamSchema = z.object({
  conversationId: z.string().uuid(),
});
