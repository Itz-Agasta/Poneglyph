"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSurveys, type Survey as StoreSurvey } from "./_lib/survey-store";
import { IconPlus, IconClipboardList } from "@tabler/icons-react";
import { SurveyItem, type Survey as UISurvey } from "../dashboard/components/survey-item";
import "../dashboard/dashboard.css";

export default function SurveyListPage() {
  const [surveys, setSurveys] = useState<StoreSurvey[]>([]);

  useEffect(() => {
    setSurveys(getSurveys().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  // Map store surveys to UI surveys
  const uiSurveys: UISurvey[] = surveys.map((s) => ({
    id: s.id,
    title: s.title,
    responses: s.responseCount.toLocaleString(),
    progress: Math.min(Math.floor((s.responseCount / 100) * 100), 100), // Mock progress based on 100 target
    status: s.responseCount > 50 ? "closing" : "active",
    questions: s.questions.length,
    subText: s.description ? s.description.substring(0, 40) + "..." : undefined,
  }));
  return (
    <main className="dashboard-main">
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
        <Link href="/survey/create" className="btn">
          <IconPlus className="size-4" />
          New Survey
        </Link>
      </div>

      {uiSurveys.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center bg-card">
          <IconClipboardList className="mb-4 size-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">No surveys yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first survey to start collecting responses.
          </p>
          <Link href="/survey/create" className="btn mt-6">
            <IconPlus className="size-4" />
            Create survey
          </Link>
        </div>
      ) : (
        <div className="survey-list">
          {uiSurveys.map((survey) => (
            <SurveyItem key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </main>
  );
}
