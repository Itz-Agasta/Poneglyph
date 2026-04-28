"use client";

import { type Question } from "../_lib/survey-store";
import { Textarea } from "@Poneglyph/ui/components/textarea";
import { cn } from "@Poneglyph/ui/lib/utils";

interface QuestionInputProps {
  question: Question;
  index: number;
  value: string | string[] | undefined;
  error?: string;
  onChange: (val: string | string[]) => void;
}

export function QuestionInput({ question, index, value, error, onChange }: QuestionInputProps) {
  return (
    <div
      className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-6 flex items-start gap-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card font-mono text-xs font-bold text-muted-foreground transition-colors group-focus-within:border-primary group-focus-within:bg-primary group-focus-within:text-primary-foreground">
          {(index + 1).toString().padStart(2, "0")}
        </span>
        <div className="pt-1">
          <label className="text-xl font-medium leading-snug text-foreground">
            {question.text}
            {question.required && (
              <span className="ml-1.5 text-destructive font-bold text-lg leading-none">*</span>
            )}
          </label>
        </div>
      </div>

      <div
        className={cn(
          "relative rounded-2xl border border-border bg-card p-6 transition-all duration-300",
          error
            ? "border-destructive/50 ring-2 ring-destructive/10"
            : "hover:border-primary/30 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
        )}
      >
        {question.type === "text" && (
          <Textarea
            placeholder="Detailed assessment response..."
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-32 border-0 bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
          />
        )}

        {question.type === "multiple_choice" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(question.options ?? []).map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:bg-muted/50",
                  value === opt && "border-primary bg-primary/5 ring-1 ring-primary",
                )}
              >
                <div
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border border-border transition-all",
                    value === opt && "border-primary bg-primary",
                  )}
                >
                  {value === opt && <div className="size-1.5 rounded-full bg-primary-foreground" />}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    value === opt ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {opt}
                </span>
              </button>
            ))}
          </div>
        )}

        {question.type === "rating" && (
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onChange(String(n))}
                className={cn(
                  "flex size-14 items-center justify-center rounded-xl border border-border bg-background text-lg font-bold transition-all hover:bg-muted/50",
                  value === String(n)
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                    : "text-muted-foreground",
                )}
              >
                {n}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-10 self-center px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Poor</span>
              <div className="h-px w-20 bg-border"></div>
              <span>Excellent</span>
            </div>
          </div>
        )}

        {question.type === "yes_no" && (
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={cn(
                  "flex-1 rounded-xl border border-border bg-background py-4 text-center text-lg font-bold transition-all hover:bg-muted/50",
                  value === opt
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="absolute -bottom-10 left-2 flex items-center gap-1.5 text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
            <div className="size-1 rounded-full bg-destructive" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
