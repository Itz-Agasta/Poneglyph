"use client";

import { useRouter } from "next/navigation";
import { Button } from "@Poneglyph/ui/components/button";
import { IconMail } from "@tabler/icons-react";

interface SendMessageButtonProps {
  targetUserId: string;
}

export function SendMessageButton({ targetUserId }: SendMessageButtonProps) {
  const router = useRouter();

  const handleStartConversation = () => {
    // Navigate to a static conversation view
    const mockConversationId = `conv-${targetUserId}`;
    router.push(`/messages/${mockConversationId}`);
  };

  return (
    <Button onClick={handleStartConversation} className="gap-2">
      <IconMail className="w-4 h-4" />
      Send Message
    </Button>
  );
}
