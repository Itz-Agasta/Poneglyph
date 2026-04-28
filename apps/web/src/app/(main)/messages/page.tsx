import Link from "next/link";
import { format } from "date-fns";
import { IconSearch, IconMessageCircle } from "@tabler/icons-react";
import "./messages.css";

const STATIC_CONVERSATIONS = [
  {
    id: "conv-1",
    otherUser: { id: "user-2", name: "Jane Volunteer", image: null },
    lastMessageContent: "Thanks for reaching out! Happy to chat about potential collaboration.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  },
];

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function MessagesInboxPage() {
  const conversations = STATIC_CONVERSATIONS;

  return (
    <div className="msg-shell">
      {/* Sidebar */}
      <div className="msg-sidebar">
        <div className="msg-sidebar-header">
          <p className="msg-sidebar-title">Messages</p>
          <div className="msg-search-wrap">
            <IconSearch className="msg-search-icon" />
            <input type="text" placeholder="Search messages" className="msg-search-input" />
          </div>
        </div>

        <div className="msg-conv-list">
          {conversations.map((conv) => {
            const initials = getInitials(conv.otherUser.name);
            const isUnread = conv.unreadCount > 0;

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`} className="msg-conv-item">
                <div className="msg-conv-avatar-wrap">
                  <div className="msg-conv-avatar">
                    {conv.otherUser.image ? (
                      <img src={conv.otherUser.image} alt={conv.otherUser.name ?? ""} />
                    ) : (
                      initials
                    )}
                  </div>
                </div>

                <div className="msg-conv-body">
                  <div className="msg-conv-row">
                    <span className={`msg-conv-name${isUnread ? " msg-conv-name--unread" : ""}`}>
                      {conv.otherUser.name ?? "Unknown"}
                    </span>
                    <span className="msg-conv-time">
                      {format(new Date(conv.lastMessageAt), "MMM d")}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={`msg-conv-snippet${isUnread ? " msg-conv-snippet--unread" : ""}`}
                    >
                      {conv.lastMessageContent ?? "(no messages yet)"}
                    </span>
                    {isUnread && <span className="msg-unread-dot" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* No conversation selected */}
      <div className="msg-no-conv">
        <div className="msg-no-conv-icon">
          <IconMessageCircle width={28} height={28} />
        </div>
        <p className="msg-no-conv-title">Your messages</p>
        <p className="msg-no-conv-sub">
          Select a conversation to read messages, or{" "}
          <Link href="/discover" className="msg-no-conv-link">
            discover volunteers
          </Link>{" "}
          to start one.
        </p>
      </div>
    </div>
  );
}
