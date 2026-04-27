import { IconGitBranch, IconPlus } from "@tabler/icons-react";
import { Button } from "@Poneglyph/ui/components/button";

export interface ResearchSession {
  id: string;
  title: string;
  createdAt: Date;
}

interface ResearchSidebarProps {
  sessions: ResearchSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

function isThisWeek(date: Date) {
  return date.getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000;
}

function isThisMonth(date: Date) {
  return date.getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000;
}

export function ResearchSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
}: ResearchSidebarProps) {
  const thisWeek = sessions.filter((s) => isThisWeek(s.createdAt));
  const thisMonth = sessions.filter((s) => !isThisWeek(s.createdAt) && isThisMonth(s.createdAt));
  const earlier = sessions.filter((s) => !isThisMonth(s.createdAt));

  const renderSession = (session: ResearchSession) => {
    const isActive = session.id === activeSessionId;
    return (
      <Button
        key={session.id}
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 px-3 h-10 group rounded-sm ${isActive ? "shadow-sm border-border" : ""}`}
        onClick={() => onSelectSession(session.id)}
      >
        <IconGitBranch
          data-icon="inline-start"
          className={`w-4 h-4 shrink-0 ${isActive ? "" : "text-muted-foreground/70 group-hover:text-muted-foreground"}`}
        />
        <span className="truncate">{session.title}</span>
      </Button>
    );
  };

  const renderGroup = (label: string, items: ResearchSession[], mt: string) =>
    items.length > 0 ? (
      <div key={label}>
        <div className={`${mt} mb-2 px-2`}>
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
            {label}
          </h3>
        </div>
        <div className="space-y-0.5">{items.map(renderSession)}</div>
      </div>
    ) : null;

  return (
    <aside className="w-[280px] border-r border-border flex flex-col shrink-0">
      <div className="h-14 px-5 flex items-center justify-between border-b border-border mb-2">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Poneglyph</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onNewSession}
          title="New research session"
          className="text-muted-foreground hover:text-foreground"
        >
          <IconPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {sessions.length === 0 ? (
          <div className="mt-8 px-2 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              No sessions yet. Ask a question to start.
            </p>
          </div>
        ) : (
          <>
            {renderGroup("This Week", thisWeek, "mt-4")}
            {renderGroup("This Month", thisMonth, "mt-8")}
            {renderGroup("Earlier", earlier, "mt-8")}
          </>
        )}
      </div>
    </aside>
  );
}
