"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { format, isToday, isYesterday } from "date-fns";
import { IconMessageCircle } from "@tabler/icons-react";
import type { Message } from "@/lib/types";

interface MessageThreadProps {
  messages: Message[];
}

function dayLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export function MessageThread({ messages }: MessageThreadProps) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id ?? "";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="msg-list">
        <div className="msg-thread-empty">
          <div className="msg-thread-empty-icon">
            <IconMessageCircle width={24} height={24} />
          </div>
          <p className="msg-thread-empty-title">No messages yet</p>
          <p className="msg-thread-empty-sub">Send a message to start the conversation.</p>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  // Group messages by day
  const groups: { label: string; messages: Message[] }[] = [];
  for (const msg of messages) {
    const d = new Date(msg.createdAt);
    const label = dayLabel(d);
    const last = groups[groups.length - 1];
    if (last?.label === label) {
      last.messages.push(msg);
    } else {
      groups.push({ label, messages: [msg] });
    }
  }

  return (
    <div className="msg-list">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="msg-day-sep">
            <span className="msg-day-label">{group.label}</span>
          </div>

          {group.messages.map((msg) => {
            const isSelf = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`msg-row${isSelf ? " msg-row--self" : ""}`}>
                {!isSelf && (
                  <div className="msg-row-avatar">{msg.senderId?.[0]?.toUpperCase() ?? "?"}</div>
                )}
                <div className="msg-bubble-group">
                  <div className={`msg-bubble${isSelf ? " msg-bubble--out" : " msg-bubble--in"}`}>
                    {msg.content}
                  </div>
                  <span className="msg-bubble-time">
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
