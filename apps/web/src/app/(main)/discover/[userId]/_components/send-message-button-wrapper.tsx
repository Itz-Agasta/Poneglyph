"use client";

import { authClient } from "@/lib/auth-client";
import { SendMessageButton } from "./send-message-button";

interface SendMessageButtonWrapperProps {
  targetUserId: string;
  targetUserName?: string | null;
}

export function SendMessageButtonWrapper({
  targetUserId,
  targetUserName,
}: SendMessageButtonWrapperProps) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  if (!currentUserId || currentUserId === targetUserId) {
    return null;
  }

  return <SendMessageButton targetUserId={targetUserId} targetUserName={targetUserName} />;
}
