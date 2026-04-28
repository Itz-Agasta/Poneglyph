"use client";

import { useRouter } from "next/navigation";
import { IconMail } from "@tabler/icons-react";

interface SendMessageButtonProps {
  targetUserId: string;
  targetUserName?: string | null;
}

export function SendMessageButton({ targetUserId, targetUserName }: SendMessageButtonProps) {
  const router = useRouter();

  const handleStartConversation = () => {
    const mockConversationId = `conv-${targetUserId}`;
    let url = `/messages/${mockConversationId}`;
    if (targetUserName) {
      url += `?name=${encodeURIComponent(targetUserName)}`;
    }
    router.push(url);
  };

  return (
    <button onClick={handleStartConversation} className="profile-btn-primary">
      <IconMail width={15} height={15} />
      Message
    </button>
  );
}
