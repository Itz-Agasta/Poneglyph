"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSurveys, type Survey } from "./_lib/survey-store";
import { buttonVariants } from "@Poneglyph/ui/components/button";
import { Button } from "@Poneglyph/ui/components/button";
import { cn } from "@Poneglyph/ui/lib/utils";
import { IconPlus, IconClipboardList, IconUsers, IconArrowRight } from "@tabler/icons-react";

export default function SurveyListPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    setSurveys(getSurveys().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Volunteer Tools
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Surveys</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create and share surveys to collect field data.
            </p>
          </div>
          <Link href="/survey/create" className={buttonVariants()}>
            <IconPlus className="size-4" />
            New Survey
          </Link>
        </div>

        {surveys.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
            <IconClipboardList className="mb-4 size-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No surveys yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first survey to start collecting responses.
            </p>
            <Link
              href="/survey/create"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-6")}
            >
              <IconPlus className="size-4" />
              Create survey
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SurveyCard({ survey }: { survey: Survey }) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border bg-background p-5 shadow-xs transition hover:border-ring/50 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">{survey.title}</h2>
          {survey.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{survey.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <IconClipboardList className="size-3.5" />
          {survey.questions.length} question{survey.questions.length !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <IconUsers className="size-3.5" />
          {survey.responseCount} response{survey.responseCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <Link
          href={`/survey/${survey.id}`}
          className={cn(buttonVariants({ size: "sm" }), "flex-1")}
        >
          <IconArrowRight className="size-3.5" />
          Take survey
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/survey/${survey.id}`);
          }}
        >
          Copy link
        </Button>
      </div>
    </div>
  );
}
