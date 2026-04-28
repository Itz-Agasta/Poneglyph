# Volunteer MVP — Implementation Plan

## Goal

Build three missing volunteer features on top of the existing codebase:

1. **Volunteer profile creation / editing** — users register themselves as volunteers
2. **Messaging with SSE** — real-time 1-to-1 chat between volunteers and organisations
3. **Nav + UX wiring** — add Discover/Messages to nav, Message button on profile pages

Surveys are out of scope for this MVP.

---

## Codebase orientation

| Thing                                       | Where                                                                   |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Hono server entry                           | `apps/server/src/index.ts`                                              |
| API router mount                            | `apps/server/src/routes/router.ts`                                      |
| Auth middleware                             | `apps/server/src/middleware/auth.ts` — use `requireAuth` on every route |
| DB client                                   | `@Poneglyph/db` — import `{ db }` from it                               |
| DB schema                                   | `packages/db/src/schema/`                                               |
| Zod schemas                                 | `packages/schemas/src/`                                                 |
| Next.js app                                 | `apps/web/src/app/`                                                     |
| App layout (has SimpleNavigation)           | `apps/web/src/app/(main)/layout.tsx`                                    |
| API client (server-side, cookie forwarding) | `apps/web/src/lib/api-client.ts`                                        |
| Auth client (client-side)                   | `apps/web/src/lib/auth-client.ts` — `authClient.useSession()`           |
| Shared types                                | `apps/web/src/lib/types.ts`                                             |

### CORS constraint

The server only allows `GET` and `POST`. **Never use PUT/PATCH/DELETE.** Use `POST` for all mutations (upserts, deletes, marking read).

### DB tables already in place

- `volunteer` — keyed by `userId`, fields: `description`, `city`, `pastWorks` (text[]), `bio`, `isOpenToWork`, `wantsToStartOrg`
- `volunteer_tags` — junction: `volunteerId` + `tagId`
- `tags` — `id` (uuid), `name`, `slug`
- `conversation` — `id`, `participantOneId`, `participantTwoId`, `lastMessageAt`
- `message` — `id`, `conversationId`, `senderId`, `content`, `readAt`, `createdAt`

### Conversation ordering rule (CRITICAL)

The `conversation` table has a DB CHECK constraint: `participant_one_id < participant_two_id`.  
Before any insert or lookup you **must** sort the two user IDs lexicographically:

```ts
const [one, two] = [currentUserId, otherUserId].sort();
// one goes into participantOneId, two into participantTwoId
```

Forgetting this will cause unique-constraint violations or missed lookups.

### SSE approach

Upstash Redis is REST-based (no persistent pub/sub connection). Use **polling SSE**:

- The SSE handler opens a streaming response.
- It polls the DB every 2 seconds for messages newer than the last one sent.
- It sends each batch as JSON SSE events.
- It sends a `: keepalive` comment every 15 seconds to prevent proxy timeouts.
- The client reconnects automatically (SSE spec behaviour).

---

## What already exists (do not rebuild)

- `GET /api/discover/volunteers` — paginated volunteer list with city + tag filters
- `GET /api/discover/volunteers/:targetUserId` — volunteer profile by user ID
- `/discover` page — volunteer grid with filters and pagination
- `/discover/[userId]` page — volunteer profile view (header, tags, past works, about)
- All auth pages (`/sign-in`, `/sign-up`)

---

## Part 1 — Volunteer Profile API

### File to create: `apps/server/src/routes/v1/volunteer.ts`

Mount in router as `/volunteer`.

#### Route: `GET /api/volunteer/me`

- `requireAuth`
- Query own volunteer profile: `db.query.volunteer.findFirst({ where: eq(volunteer.userId, user.id), with: { volunteerTags: { with: { tag: true } } } })`
- Return `{ volunteer: { ...fields, tags: [...] } }` or `{ volunteer: null }` if not registered yet
- `200` either way (null means not yet registered)

#### Route: `POST /api/volunteer/me`

- `requireAuth`
- Body schema (Zod, in `packages/schemas/src/volunteer.ts` — add to existing file):

```ts
export const VolunteerUpsertSchema = z.object({
  description: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  bio: z.string().max(2000).optional(),
  pastWorks: z.array(z.string().max(200)).max(20).optional(),
  isOpenToWork: z.boolean().optional(),
  wantsToStartOrg: z.boolean().optional(),
  // Tag slugs — will be looked up or created
  tags: z.array(z.string().max(100)).max(10).optional(),
});
```

- **Upsert logic** (run in a transaction):
  1. `db.insert(volunteer).values({ userId: user.id, ...fields }).onConflictDoUpdate({ target: volunteer.userId, set: { ...fields, updatedAt: new Date() } })`
  2. If `tags` provided:
     - For each slug: `INSERT INTO tags (id, name, slug) VALUES (...) ON CONFLICT (slug) DO NOTHING` then fetch id
     - Delete all existing `volunteerTags` rows for this volunteer: `db.delete(volunteerTags).where(eq(volunteerTags.volunteerId, user.id))`
     - Insert new rows: `db.insert(volunteerTags).values(newRows)`
  3. Fetch and return updated profile
- Return `{ volunteer: { ...fields, tags: [...] } }` with `200`

### Register in router

`apps/server/src/routes/router.ts` — add:

```ts
import { volunteerRouter } from "./v1/volunteer";
apiRouter.route("/volunteer", volunteerRouter);
```

---

## Part 2 — Messaging API

### File to create: `apps/server/src/routes/v1/messages.ts`

Mount in router as `/messages`.

### Zod schemas to add

Create `packages/schemas/src/messages.ts`:

```ts
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
```

### Route: `GET /api/messages/conversations`

- `requireAuth`
- Fetch all conversations where `participantOneId = user.id OR participantTwoId = user.id`
- For each conversation, include the other participant's user info (name, image) and last message content
- Order by `lastMessageAt DESC`
- Return `{ conversations: [{ id, otherUser: { id, name, image }, lastMessage, lastMessageAt, unreadCount }] }`

Query pattern (raw SQL or Drizzle join):

```sql
SELECT c.*,
  -- other participant
  CASE WHEN c.participant_one_id = $userId THEN c.participant_two_id ELSE c.participant_one_id END AS other_user_id,
  -- last message
  m.content AS last_message_content,
  m.created_at AS last_message_at,
  -- unread count
  (SELECT COUNT(*) FROM message WHERE conversation_id = c.id AND sender_id != $userId AND read_at IS NULL) AS unread_count
FROM conversation c
LEFT JOIN message m ON m.id = (SELECT id FROM message WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1)
WHERE c.participant_one_id = $userId OR c.participant_two_id = $userId
ORDER BY c.last_message_at DESC
```

Then join user names/images separately.

### Route: `POST /api/messages/conversations`

- `requireAuth`
- Body: `{ otherUserId: string }`
- **Sort IDs**: `const [one, two] = [user.id, otherUserId].sort()`
- Upsert conversation: `INSERT INTO conversation (id, participant_one_id, participant_two_id) VALUES (...) ON CONFLICT (participant_one_id, participant_two_id) DO NOTHING`
- Then fetch the conversation row
- Return `{ conversationId: string }`

### Route: `GET /api/messages/conversations/:conversationId`

- `requireAuth`
- Validate user is a participant (return `403` if not)
- Query messages: `db.query.message.findMany({ where: eq(message.conversationId, id), orderBy: [asc(message.createdAt)], limit: 50 })` (no pagination for MVP, just last 50)
- Mark unread messages as read: `UPDATE message SET read_at = NOW() WHERE conversation_id = :id AND sender_id != :userId AND read_at IS NULL`
- Return `{ messages: [{ id, senderId, content, createdAt, readAt }] }`

### Route: `POST /api/messages/conversations/:conversationId/messages`

- `requireAuth`
- Validate user is a participant (return `403` if not)
- Body: `{ content: string }`
- Insert: `db.insert(message).values({ conversationId, senderId: user.id, content })`
- Update conversation `lastMessageAt`: `db.update(conversation).set({ lastMessageAt: new Date() }).where(eq(conversation.id, conversationId))`
- Return `{ message: { id, senderId, content, createdAt } }` with `201`

### Route: `GET /api/messages/conversations/:conversationId/stream` (SSE)

This is the real-time stream. Use `streamSSE` from `hono/streaming`.

```ts
import { streamSSE } from "hono/streaming";

messagesRouter.get(
  "/conversations/:conversationId/stream",
  requireAuth,
  zValidator("param", ConversationParamSchema),
  async (c) => {
    const user = c.get("user")!;
    const { conversationId } = c.req.valid("param");

    // Verify participant
    const conv = await db.query.conversation.findFirst({
      where: eq(conversation.id, conversationId),
    });
    if (!conv || (conv.participantOneId !== user.id && conv.participantTwoId !== user.id)) {
      return c.json({ error: "Forbidden" }, 403);
    }

    // SSE stream
    return streamSSE(c, async (stream) => {
      // Track the latest message we've sent so we only push new ones
      let lastSeenAt = new Date();

      let keepAliveCount = 0;

      while (true) {
        // Poll for new messages
        const newMessages = await db.query.message.findMany({
          where: and(eq(message.conversationId, conversationId), gt(message.createdAt, lastSeenAt)),
          orderBy: [asc(message.createdAt)],
        });

        for (const msg of newMessages) {
          await stream.writeSSE({
            data: JSON.stringify({
              id: msg.id,
              senderId: msg.senderId,
              content: msg.content,
              createdAt: msg.createdAt,
            }),
            event: "message",
          });
          lastSeenAt = msg.createdAt;
        }

        // Keepalive every ~15 iterations (15 * 1000ms = 15s)
        keepAliveCount++;
        if (keepAliveCount % 15 === 0) {
          await stream.writeSSE({ data: "", event: "keepalive" });
        }

        await stream.sleep(3000); // poll every 3 seconds — balances UX vs DB cost
      }
    });
  },
);
```

### Route: `POST /api/messages/conversations/:conversationId/read`

- `requireAuth`
- Validate participant
- `UPDATE message SET read_at = NOW() WHERE conversation_id = :id AND sender_id != :userId AND read_at IS NULL`
- Return `{ ok: true }`

### Register in router

`apps/server/src/routes/router.ts` — add:

```ts
import { messagesRouter } from "./v1/messages";
apiRouter.route("/messages", messagesRouter);
```

Also add `PATCH` and `DELETE` to CORS if needed — but since we use only GET and POST, no CORS changes needed.

---

## Part 3 — Frontend Pages

### 3a. Types to add — `apps/web/src/lib/types.ts`

```ts
export type ConversationSummary = {
  id: string;
  otherUser: { id: string; name: string | null; image: string | null };
  lastMessageContent: string | null;
  lastMessageAt: string;
  unreadCount: number;
};

export type Message = {
  id: string;
  senderId: string | null;
  content: string;
  createdAt: string;
  readAt: string | null;
};

export type VolunteerOwn = {
  description: string | null;
  city: string | null;
  bio: string | null;
  pastWorks: string[];
  isOpenToWork: boolean;
  wantsToStartOrg: boolean | null;
  tags: Tag[];
};
```

### 3b. Profile page — `apps/web/src/app/(main)/dashboard/profile/page.tsx`

Server component that:

1. Fetches `GET /api/volunteer/me` (with cookies via `apiClientWithCookies`)
2. Passes the result as `initialData` to a client component `<VolunteerProfileForm>`

### 3c. Profile form — `apps/web/src/app/(main)/dashboard/profile/_components/volunteer-profile-form.tsx`

Client component (`"use client"`):

- Fields: `description` (textarea), `city` (text input), `bio` (textarea), `pastWorks` (add/remove list of text inputs), `isOpenToWork` (checkbox/toggle), `wantsToStartOrg` (checkbox/toggle), `tags` (comma-separated input, store as array of slugs)
- On submit: `POST /api/volunteer/me` with JSON body
- Show success toast on save
- Show error message on failure

Use `fetch` directly or the auth client. Cookie forwarding not needed here (client-side, cookies are automatic in browser).

Example fetch in client component:

```ts
const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/volunteer/me`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

### 3d. Messages inbox — `apps/web/src/app/(main)/messages/page.tsx`

Server component:

1. Fetch `GET /api/messages/conversations` with cookies
2. Render list of conversations
3. Each row: avatar + name of other participant, last message snippet, unread badge, timestamp
4. Click → navigate to `/messages/[id]`
5. Empty state if no conversations

### 3e. Conversation view — `apps/web/src/app/(main)/messages/[id]/page.tsx`

Server component for initial load:

1. Fetch `GET /api/messages/conversations/:id` (initial messages + marks as read)
2. Pass messages + conversationId + current user ID to client component `<MessageThread>`

### 3f. Message thread — `apps/web/src/app/(main)/messages/[id]/_components/message-thread.tsx`

Client component (`"use client"`) — the SSE consumer:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";

interface Props {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
}

export function MessageThread({ conversationId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // SSE subscription
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/messages/conversations/${conversationId}/stream`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.addEventListener("message", (e) => {
      const msg: Message = JSON.parse(e.data);
      setMessages((prev) => {
        // Avoid duplicate if already in list
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => eventSource.close();
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
              msg.senderId === currentUserId
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

### 3g. Message input — `apps/web/src/app/(main)/messages/[id]/_components/message-input.tsx`

Client component:

- Text input + Send button
- On submit: `POST /api/messages/conversations/:id/messages` with `{ content }`
- Clear input on success
- The SSE stream on the same page (and the other participant's page) will pick up the new message automatically

### 3h. "Message" button on volunteer profile page

Edit `apps/web/src/app/(main)/discover/[userId]/page.tsx`:

- The page already has `requireAuth` — if user is authenticated, show a "Send Message" button below the profile header
- Button click: `POST /api/messages/conversations` with `{ otherUserId: userId }`, then redirect to `/messages/[returned conversationId]`
- Make this a client component button or a small `"use client"` wrapper component

### 3i. Navigation updates

Edit `apps/web/src/components/simple-navigation.tsx`:

- Add `{ label: "Discover", href: "/discover" }` to `navLinks`
- Add a Messages icon-link in the auth section that shows unread badge (optional for MVP — can start with just a plain link)

Also update `apps/web/src/components/account.tsx`:

- The dropdown "User Profile" item already links to `/dashboard/profile` — that page will now exist

---

## Implementation order (suggested)

1. Add Zod schemas (`packages/schemas/src/volunteer.ts` addition + `packages/schemas/src/messages.ts`)
2. Build `apps/server/src/routes/v1/volunteer.ts` + register in router
3. Build `apps/server/src/routes/v1/messages.ts` (all routes including SSE) + register in router
4. Add types to `apps/web/src/lib/types.ts`
5. Build `/dashboard/profile` (server page + form client component)
6. Build `/messages` inbox (server page)
7. Build `/messages/[id]` (server page + MessageThread client component + MessageInput client component)
8. Add "Message" button to `/discover/[userId]` page
9. Update `simple-navigation.tsx` to add Discover + Messages links

---

## Key gotchas

- **Always sort participant IDs** before conversation insert/lookup or you'll get constraint errors
- **SSE requires GET** — EventSource only does GET; don't try to POST to the stream endpoint
- **`withCredentials: true`** on EventSource is required for the auth cookie to be sent cross-origin
- **`streamSSE` loop must handle errors** — wrap the while loop in try/catch; if the client disconnects, `stream.sleep()` or `stream.writeSSE()` will throw
- **CORS already allows GET** — SSE endpoint works without changes
- **Tags upsert**: always delete all volunteerTags for the user first, then re-insert — simpler than diffing
- **`pastWorks` is `text[]`** in DB — Drizzle handles array serialisation; pass a plain JS string array
- **No PATCH in CORS** — use POST for read receipts and all mutations
