"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { MessageThread } from "./_components/message-thread";
import { MessageInput } from "./_components/message-input";
import type { Message } from "@/lib/types";
import "../messages.css";

const STATIC_CONVERSATIONS_META = [
  {
    id: "conv-1",
    otherUser: { id: "user-2", name: "Jane Volunteer", image: null },
    lastMessageContent: "Thanks for reaching out!",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  },
];

const STATIC_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      senderId: "user-2",
      content: "Hi! I saw your volunteer profile and would love to connect.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      readAt: null,
    },
    {
      id: "msg-2",
      senderId: "user-1",
      content: "Thanks for reaching out! Happy to chat about potential collaboration.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      readAt: new Date().toISOString(),
    },
  ],
  "conv-user-2": [
    {
      id: "msg-3",
      senderId: "user-2",
      content: "Hi! I saw your volunteer profile and would love to connect.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      readAt: null,
    },
  ],
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: conversationId } = use(params);
  const searchParams = useSearchParams();
  const queryName = searchParams.get("name");

  const [messages, setMessages] = useState<Message[]>(STATIC_MESSAGES[conversationId] ?? []);

  const activeMeta = STATIC_CONVERSATIONS_META.find((c) => c.id === conversationId);
  const otherUser = activeMeta?.otherUser ?? {
    id: conversationId.replace("conv-", ""),
    name: queryName || "Unknown Volunteer",
    image: null,
  };

  const displayConversations = [...STATIC_CONVERSATIONS_META];
  if (!activeMeta && conversationId) {
    displayConversations.unshift({
      id: conversationId,
      otherUser,
      lastMessageContent: "Start a conversation...",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    });
  }

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="msg-shell">
      {/* Sidebar */}
      <div className="msg-sidebar msg-sidebar--hidden-mobile">
        <div className="msg-sidebar-header">
          <p className="msg-sidebar-title">Messages</p>
          <div className="msg-search-wrap">
            <IconSearch className="msg-search-icon" />
            <input type="text" placeholder="Search messages" className="msg-search-input" />
          </div>
        </div>

        <div className="msg-conv-list">
          {displayConversations.map((conv) => {
            const initials = getInitials(conv.otherUser.name);
            const isActive = conv.id === conversationId;
            const isUnread = conv.unreadCount > 0;

            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className={`msg-conv-item${isActive ? " msg-conv-item--active" : ""}`}
              >
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
                      {conv.lastMessageContent}
                    </span>
                    {isUnread && <span className="msg-unread-dot" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Thread pane */}
      <div className="msg-thread-pane">
        {/* Header */}
        <div className="msg-thread-header">
          <Link href="/messages" className="msg-thread-back">
            <IconArrowLeft width={18} height={18} />
          </Link>

          <div className="msg-thread-avatar">
            {otherUser.image ? (
              <img src={otherUser.image} alt={otherUser.name ?? ""} />
            ) : (
              getInitials(otherUser.name)
            )}
          </div>

          <div className="msg-thread-info">
            <p className="msg-thread-name">{otherUser.name}</p>
            <p className="msg-thread-status">Volunteer</p>
          </div>
        </div>

        <MessageThread messages={messages} />
        <MessageInput onMessageSent={handleMessageSent} />
      </div>
    </div>
  );
}
