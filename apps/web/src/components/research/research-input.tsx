"use client";

import { useState } from "react";
import { IconInfinity, IconChevronDown, IconArrowUp, IconSquare } from "@tabler/icons-react";
import { Input } from "@Poneglyph/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Poneglyph/ui/components/dropdown-menu";
import { Button } from "@Poneglyph/ui/components/button";

interface ResearchInputProps {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ResearchInput({ onSubmit, onStop, disabled, placeholder = "Add a follow up..." }: ResearchInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-transparent px-4 pt-4 pb-3 h-auto text-sm text-foreground placeholder:text-muted-foreground outline-none border-none focus-visible:ring-0 focus-visible:border-none ring-0 shadow-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/70 border border-border/80 text-xs font-medium text-muted-foreground transition-colors tracking-tight h-auto inline-flex items-center shrink-0 justify-center">
                  <IconInfinity className="w-3.5 h-3.5 opacity-70" />
                  Agent
                  <IconChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem>Agent Mode</DropdownMenuItem>
                  <DropdownMenuItem>Direct Mode</DropdownMenuItem>
                  <DropdownMenuItem>Vision Mode</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted text-xs font-medium text-muted-foreground transition-colors tracking-tight h-auto inline-flex items-center shrink-0 justify-center">
                  Gemini 2.5 Flash
                  <IconChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>Gemini 2.5 Flash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {disabled ? (
              <Button
                size="icon-sm"
                variant="secondary"
                onClick={onStop}
                className="bg-muted flex items-center justify-center text-muted-foreground border border-border/50 hover:bg-muted/70"
              >
                <IconSquare className="w-3.5 h-3.5 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon-sm"
                variant="secondary"
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="bg-muted flex items-center justify-center text-muted-foreground border border-border/50 hover:bg-muted/70 disabled:opacity-40"
              >
                <IconArrowUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
