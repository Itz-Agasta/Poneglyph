import { env } from "@Poneglyph/env/web";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  fetchOptions: {
    credentials: "include",
  },
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: true,
    refetchWhenOffline: false,
  },
});

export type ErrorCodes = keyof typeof authClient.$ERROR_CODES;

export function getErrorMessage(code: string, customMessages?: Record<string, string>) {
  if (customMessages && code in customMessages) {
    return customMessages[code];
  }
  return authClient.$ERROR_CODES[code as ErrorCodes] || "An error occurred";
}
