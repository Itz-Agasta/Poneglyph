"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { authClient } from "@/lib/auth-client";
import { env } from "@Poneglyph/env/web";
import { ResearchSidebar, type ResearchSession } from "@/components/research/research-sidebar";
import { ResearchChatMessage } from "@/components/research/research-chat-message";
import { ResearchStatusLog } from "@/components/research/research-status-log";
import { ResearchInput } from "@/components/research/research-input";
import { IconSearch, IconSparkles } from "@tabler/icons-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  logs: string[];
  isStreaming: boolean;
}

interface Session extends ResearchSession {
  messages: ChatMessage[];
}

type UIChunk =
  | { type: "text-start"; id: string }
  | { type: "text-delta"; id: string; delta: string }
  | { type: "text-end"; id: string }
  | { type: "reasoning-delta"; id: string; delta: string }
  | { type: "tool-input-available"; toolCallId: string; toolName: string }
  | { type: "tool-output-available"; toolCallId: string }
  | { type: "error"; errorText: string }
  | { type: string };

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

async function* parseSSE(response: Response): AsyncGenerator<UIChunk> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        yield JSON.parse(data) as UIChunk;
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export default function ResearchPage() {
  const { data: session } = authClient.useSession();
  const sessionTokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    sessionTokenRef.current = (session as any)?.session?.token as string | undefined;
  }, [session]);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionsRef = useRef(sessions);

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const createNewSession = useCallback(() => {
    const id = genId();
    setSessions((prev) => [
      { id, title: "New Research", messages: [], createdAt: new Date() },
      ...prev,
    ]);
    setActiveSessionId(id);
  }, []);

  const updateAssistantMsg = useCallback(
    (sessionId: string, msgId: string, updater: (m: ChatMessage) => ChatMessage) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: s.messages.map((m) => (m.id === msgId ? updater(m) : m)) }
            : s,
        ),
      );
    },
    [],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      let sessionId = activeSessionId;

      // Capture previous messages before any state update
      const prevMessages = sessionsRef.current.find((s) => s.id === sessionId)?.messages ?? [];

      if (!sessionId) {
        sessionId = genId();
        setSessions((prev) => [
          { id: sessionId!, title: text.slice(0, 60), messages: [], createdAt: new Date() },
          ...prev,
        ]);
        setActiveSessionId(sessionId);
      }

      const userMsgId = genId();
      const assistantMsgId = genId();

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            title: s.messages.length === 0 ? text.slice(0, 60) : s.title,
            messages: [
              ...s.messages,
              { id: userMsgId, role: "user", text, logs: [], isStreaming: false },
              { id: assistantMsgId, role: "assistant", text: "", logs: [], isStreaming: true },
            ],
          };
        }),
      );

      setIsStreaming(true);
      scrollToBottom();

      const controller = new AbortController();
      abortRef.current = controller;

      const apiMessages = [
        ...prevMessages.map((m) => ({
          id: m.id,
          role: m.role,
          parts: [{ type: "text" as const, text: m.text }],
        })),
        { id: userMsgId, role: "user" as const, parts: [{ type: "text" as const, text }] },
      ];

      try {
        const token = sessionTokenRef.current;
        const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ messages: apiMessages }),
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          const isAuth = response.status === 401;
          throw new Error(
            isAuth ? "Not authenticated. Please sign in." : `Request failed (${response.status})`,
          );
        }

        // Track active tool calls to mark them done when output arrives
        const activeTools = new Map<string, string>();

        for await (const chunk of parseSSE(response)) {
          if (chunk.type === "text-delta") {
            updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
              ...m,
              text: m.text + (chunk as any).delta,
            }));
            scrollToBottom();
          } else if (chunk.type === "tool-input-available") {
            const c = chunk as { type: "tool-input-available"; toolCallId: string; toolName: string };
            const label = `Using ${c.toolName}…`;
            activeTools.set(c.toolCallId, label);
            updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
              ...m,
              logs: [...m.logs, label],
            }));
          } else if (chunk.type === "tool-output-available") {
            const c = chunk as { type: "tool-output-available"; toolCallId: string };
            const label = activeTools.get(c.toolCallId);
            if (label) {
              updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
                ...m,
                logs: m.logs.map((l) => (l === label ? label.replace("…", " ✓") : l)),
              }));
            }
          } else if (chunk.type === "error") {
            throw new Error((chunk as any).errorText ?? "Stream error");
          }
        }

        updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({ ...m, isStreaming: false }));
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "An error occurred. Please try again.";
        updateAssistantMsg(sessionId!, assistantMsgId, (m) => ({
          ...m,
          text: msg,
          isStreaming: false,
        }));
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
        scrollToBottom();
      }
    },
    [activeSessionId, updateAssistantMsg, scrollToBottom],
  );

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <ResearchSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={createNewSession}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-background to-card/30">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 pt-8 pb-36">
            {!activeSession ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-6">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full border border-dashed border-primary/40"
                    style={{
                      animation: "rotate 24s linear infinite",
                      width: "120px",
                      height: "120px",
                      left: "-12px",
                      top: "-12px",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border border-primary/30"
                    style={{
                      animation: "rotate 16s linear infinite reverse",
                      width: "96px",
                      height: "96px",
                      left: "0px",
                      top: "0px",
                    }}
                  />
                  <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <IconSparkles className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-serif font-light tracking-tight">
                    Research <em className="italic text-primary">Agent</em>
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                    Ask anything — the agent searches datasets, the web, and runs deep research.
                  </p>
                </div>

                <style>{`
                  @keyframes rotate {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              <>
                <div className="mb-8 border-b border-border pb-4">
                  <h1 className="text-2xl font-serif font-light tracking-tight text-foreground">
                    {activeSession.title}
                  </h1>
                </div>
                <div className="space-y-6">
                  {activeSession.messages.map((msg) =>
                    msg.role === "user" ? (
                      <ResearchChatMessage key={msg.id} content={msg.text} />
                    ) : (
                      <div key={msg.id} className="space-y-4">
                        {msg.logs.length > 0 && (
                          <ResearchStatusLog>
                            {msg.logs.map((log, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                                {log}
                              </div>
                            ))}
                          </ResearchStatusLog>
                        )}
                        {(msg.text || msg.isStreaming) && (
                          <div className="px-1 text-[15px] leading-relaxed text-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-li:my-0.5 prose-code:text-xs prose-pre:text-xs prose-a:text-primary hover:prose-a:underline">
                            {msg.text ? (
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text}
                              </ReactMarkdown>
                            ) : null}
                            {msg.isStreaming && (
                              <span className="inline-block w-0.5 h-[1.1em] bg-primary ml-0.5 animate-pulse rounded-full align-text-bottom" />
                            )}
                          </div>
                        )}
                        {msg.isStreaming && !msg.text && msg.logs.length === 0 && (
                          <ResearchStatusLog>
                            <div className="flex items-center gap-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                            </div>
                          </ResearchStatusLog>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <ResearchInput
          onSubmit={sendMessage}
          onStop={() => abortRef.current?.abort()}
          disabled={isStreaming}
          placeholder={activeSession ? "Add a follow up..." : "Ask anything to start researching..."}
        />
      </main>
    </div>
  );
}
