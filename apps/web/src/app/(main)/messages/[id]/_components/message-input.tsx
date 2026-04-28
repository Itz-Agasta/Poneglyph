"use client";

import { useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { IconSend } from "@tabler/icons-react";
import type { Message } from "@/lib/types";

interface MessageInputProps {
  onMessageSent: (message: Message) => void;
}

export function MessageInput({ onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = authClient.useSession();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;

    const senderId = session?.user?.id ?? "unknown";

    onMessageSent({
      id: `local-${Date.now()}`,
      senderId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      readAt: null,
    });

    setContent("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="msg-input-bar">
      <div className="msg-input-wrap">
        <textarea
          ref={inputRef}
          rows={1}
          placeholder="Write a message…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={4000}
          className="msg-input"
        />
      </div>
      <button
        type="submit"
        disabled={!content.trim()}
        className="msg-send-btn"
        aria-label="Send message"
      >
        <IconSend width={17} height={17} />
      </button>
    </form>
  );
}
