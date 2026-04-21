import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ChatRequestSchema } from "@Poneglyph/schemas/chat";
import { createAgentUIStreamResponse } from "ai";
import { logger } from "@/lib/logger";
import { createOrchestratorAgent } from "../../agents/orchestrator";

const log = logger.getChild("agent");

export const chatRouter = new Hono();

/**
 * POST /api/chat
 * Multi-agent research endpoint.
 * Requires a valid better-auth session (cookie-based).
 * Accepts { messages: UIMessage[] } and streams the agent response.
 *
 *
 * curl -X POST http://localhost:3000/api/chat \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "messages": [
 *       {
 *         "id": "msg-1",
 *         "role": "user",
 *         "parts": [
 *           {
 *             "type": "text",
 *             "text": "Tell me about....."
 *           }
 *         ]
 *       }
 *     ]
 *   }' \
 *   --no-buffer
 */

chatRouter.post("/", zValidator("json", ChatRequestSchema), async (c) => {
  // Auth disabled for now — will add in next PR
  // const session = await auth.api.getSession({ headers: c.req.raw.headers });
  // if (!session?.user) return c.json({ error: "Authentication required" }, 401);

  const { messages } = c.req.valid("json");
  const startTime = Date.now();

  log.info("Chat request received: {messageCount} message(s)", {
    messageCount: messages.length,
  });

  const agent = createOrchestratorAgent();

  // Two things to note here:
  // 1. It's "uiMessages", not "messages" — that's what the API expects
  // 2. The `as any` cast is because TypeScript gets strict with generic tool types
  //    on ToolLoopAgent — the runtime behavior is fine, just a type narrowing issue
  const response = createAgentUIStreamResponse({
    agent: agent as any,
    uiMessages: messages,
  });

  log.info("Chat stream initiated in {duration}ms", {
    duration: Date.now() - startTime,
  });

  return response;
});
