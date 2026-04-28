import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
// streamSSE commented out - using static client-side messages
// import { streamSSE } from "hono/streaming";
import { db } from "@Poneglyph/db";
import { conversation, message } from "@Poneglyph/db/schema";
import {
  StartConversationSchema,
  SendMessageSchema,
  ConversationParamSchema,
} from "@Poneglyph/schemas/messages";
import { requireAuth } from "../../middleware/auth";
import { eq, and, asc, or, desc, isNull } from "drizzle-orm";

export const messagesRouter = new Hono();

/**
 * GET /api/messages/conversations
 * Fetch all conversations for current user with last message info
 */
messagesRouter.get("/conversations", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  // Fetch conversations
  const convs = await db.query.conversation.findMany({
    where: or(
      eq(conversation.participantOneId, authUser.id),
      eq(conversation.participantTwoId, authUser.id),
    ),
    orderBy: [desc(conversation.lastMessageAt)],
    with: {
      participantOne: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
      participantTwo: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // For each conversation, get last message and unread count
  const conversations = await Promise.all(
    convs.map(async (conv) => {
      // Get other participant
      const otherParticipant =
        conv.participantOneId === authUser.id ? conv.participantTwo : conv.participantOne;

      // Get last message
      const lastMsg = await db.query.message.findFirst({
        where: eq(message.conversationId, conv.id),
        orderBy: [desc(message.createdAt)],
        columns: {
          content: true,
          createdAt: true,
        },
      });

      // Count unread messages
      const unreadCount = await db
        .selectDistinct()
        .from(message)
        .where(
          and(
            eq(message.conversationId, conv.id),
            eq(message.senderId, otherParticipant?.id || ""),
            isNull(message.readAt),
          ),
        )
        .then((rows) => rows.length);

      return {
        id: conv.id,
        otherUser: otherParticipant,
        lastMessageContent: lastMsg?.content || null,
        lastMessageAt: (lastMsg?.createdAt || conv.lastMessageAt).toISOString(),
        unreadCount,
      };
    }),
  );

  return c.json({ conversations }, 200);
});

/**
 * POST /api/messages/conversations
 * Start or get existing conversation
 */
messagesRouter.post(
  "/conversations",
  requireAuth,
  zValidator("json", StartConversationSchema),
  async (c) => {
    const authUser = c.get("user")!;
    const { otherUserId } = c.req.valid("json");

    // Sort IDs
    const [one, two] = [authUser.id, otherUserId].sort();

    // Check if conversation exists
    let conv = await db.query.conversation.findFirst({
      where: and(eq(conversation.participantOneId, one), eq(conversation.participantTwoId, two)),
    });

    // Create if doesn't exist
    if (!conv) {
      await db.insert(conversation).values({
        participantOneId: one,
        participantTwoId: two,
        lastMessageAt: new Date(),
      });

      conv = await db.query.conversation.findFirst({
        where: and(eq(conversation.participantOneId, one), eq(conversation.participantTwoId, two)),
      });
    }

    return c.json({ conversationId: conv!.id }, 200);
  },
);

/**
 * GET /api/messages/conversations/:conversationId
 * Fetch messages in a conversation
 */
messagesRouter.get(
  "/conversations/:conversationId",
  requireAuth,
  zValidator("param", ConversationParamSchema),
  async (c) => {
    const authUser = c.get("user")!;
    const { conversationId } = c.req.valid("param");

    // Verify user is a participant
    const conv = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });

    if (!conv || (conv.participantOneId !== authUser.id && conv.participantTwoId !== authUser.id)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Fetch messages (last 50)
    const messages = await db.query.message.findMany({
      where: eq(message.conversationId, conversationId),
      orderBy: [asc(message.createdAt)],
      limit: 50,
    });

    // Actually mark only messages from the OTHER user as read
    const otherUserId =
      conv.participantOneId === authUser.id ? conv.participantTwoId : conv.participantOneId;

    if (otherUserId) {
      await db
        .update(message)
        .set({ readAt: new Date() })
        .where(
          and(
            eq(message.conversationId, conversationId),
            eq(message.senderId, otherUserId),
            isNull(message.readAt),
          ),
        );
    }

    return c.json(
      {
        messages: messages.map((msg) => ({
          id: msg.id,
          senderId: msg.senderId,
          content: msg.content,
          createdAt: msg.createdAt.toISOString(),
          readAt: msg.readAt?.toISOString() || null,
        })),
      },
      200,
    );
  },
);

/**
 * POST /api/messages/conversations/:conversationId/messages
 * Send a message
 */
messagesRouter.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  zValidator("param", ConversationParamSchema),
  zValidator("json", SendMessageSchema),
  async (c) => {
    const authUser = c.get("user")!;
    const { conversationId } = c.req.valid("param");
    const { content } = c.req.valid("json");

    // Verify user is a participant
    const conv = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });

    if (!conv || (conv.participantOneId !== authUser.id && conv.participantTwoId !== authUser.id)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Insert message
    const result = await db
      .insert(message)
      .values({
        conversationId,
        senderId: authUser.id,
        content,
      })
      .returning({
        id: message.id,
        createdAt: message.createdAt,
      });

    // Update conversation lastMessageAt
    await db
      .update(conversation)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversation.id, conversationId));

    return c.json(
      {
        message: {
          id: result[0]!.id,
          senderId: authUser.id,
          content,
          createdAt: result[0]!.createdAt.toISOString(),
        },
      },
      201,
    );
  },
);

/**
 * GET /api/messages/conversations/:conversationId/stream (SSE)
 * Real-time message stream with polling
 * COMMENTED OUT: Now using static client-side messages
 */
/*
messagesRouter.get(
  "/conversations/:conversationId/stream",
  requireAuth,
  zValidator("param", ConversationParamSchema),
  async (c) => {
    const authUser = c.get("user")!;
    const { conversationId } = c.req.valid("param");

    // Verify participant
    const conv = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });

    if (!conv || (conv.participantOneId !== authUser.id && conv.participantTwoId !== authUser.id)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    return streamSSE(c, async (stream) => {
      let lastSeenAt = new Date();
      let keepAliveCount = 0;

      while (true) {
        try {
          // Poll for new messages
          const newMessages = await db.query.message.findMany({
            where: and(
              eq(message.conversationId, conversationId),
              gt(message.createdAt, lastSeenAt),
            ),
            orderBy: [asc(message.createdAt)],
          });

          for (const msg of newMessages) {
            await stream.writeSSE({
              data: JSON.stringify({
                id: msg.id,
                senderId: msg.senderId,
                content: msg.content,
                createdAt: msg.createdAt.toISOString(),
              }),
              event: "message",
            });
            lastSeenAt = msg.createdAt;
          }

          // Keepalive every 15 iterations (15 * 2s = 30s)
          keepAliveCount++;
          if (keepAliveCount % 15 === 0) {
            await stream.writeSSE({ data: "", event: "keepalive" });
          }

          await stream.sleep(2000); // Poll every 2 seconds
        } catch {
          // Client disconnected or stream errored
          break;
        }
      }
    });
  },
);
*/

/**
 * POST /api/messages/conversations/:conversationId/read
 * Mark conversation messages as read
 * COMMENTED OUT: Now using static client-side messages
 */
/*
messagesRouter.post(
  "/conversations/:conversationId/read",
  requireAuth,
  zValidator("param", ConversationParamSchema),
  async (c) => {
    const authUser = c.get("user")!;
    const { conversationId } = c.req.valid("param");

    // Verify participant
    const conv = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });

    if (!conv || (conv.participantOneId !== authUser.id && conv.participantTwoId !== authUser.id)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // Get other user ID
    const otherUserId =
      conv.participantOneId === authUser.id ? conv.participantTwoId : conv.participantOneId;

    if (otherUserId) {
      await db
        .update(message)
        .set({ readAt: new Date() })
        .where(
          and(
            eq(message.conversationId, conversationId),
            eq(message.senderId, otherUserId),
            isNull(message.readAt),
          ),
        );
    }

    return c.json({ ok: true }, 200);
  },
);
*/
