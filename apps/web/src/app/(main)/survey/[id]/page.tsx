"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSurvey, saveResponse, generateId, type Survey } from "../_lib/survey-store";
import { Button, buttonVariants } from "@Poneglyph/ui/components/button";
import { cn } from "@Poneglyph/ui/lib/utils";
import { IconChevronLeft, IconSend, IconCircleCheck } from "@tabler/icons-react";

import { QuestionInput } from "../components/question-input";

export default function ParticipatePage() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSurvey(getSurvey(id));
  }, [id]);

  if (!survey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-center">
        <p className="font-heading text-2xl text-muted-foreground">Survey not found.</p>
        <Link
          href="/survey"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-full border-border bg-card px-6",
          )}
        >
          <IconChevronLeft className="mr-2 size-4" />
          Back to all surveys
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/20 text-primary">
          <IconCircleCheck className="size-10" />
        </div>
        <h2 className="font-heading text-4xl font-normal tracking-tight text-foreground">
          Response recorded
        </h2>
        <p className="max-w-md text-balance text-lg leading-relaxed text-muted-foreground">
          Thank you for participating in the{" "}
          <span className="font-medium text-foreground italic">{survey.title}</span> research
          initiative. Your contribution is invaluable.
        </p>
        <div className="mt-4 flex gap-4">
          <Link
            href="/survey"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8")}
          >
            View other surveys
          </Link>
          <Button
            className="rounded-full px-8"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          >
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  const setAnswer = (qId: string, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
    setErrors((e) => ({ ...e, [qId]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    for (const q of survey.questions) {
      if (!q.required) continue;
      const ans = answers[q.id];
      if (!ans || (typeof ans === "string" && !ans.trim()) || (Array.isArray(ans) && !ans.length)) {
        errs[q.id] = "This entry is required for the assessment.";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    saveResponse({
      id: generateId(),
      surveyId: survey.id,
      answers,
      submittedAt: Date.now(),
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:py-32">
        {/* Navigation / Meta */}
        <nav className="mb-12 flex items-center justify-between">
          <Link
            href="/survey"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <div className="flex size-8 items-center justify-center rounded-full border border-border bg-card transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
              <IconChevronLeft className="size-4" />
            </div>
            Back to Directory
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="flex size-1.5 rounded-full bg-primary"></span>
            Live Instrument
          </div>
        </nav>

        {/* Survey Header */}
        <header className="mb-16">
          <h1 className="font-heading text-5xl font-normal leading-tight tracking-tight text-foreground lg:text-6xl">
            {survey.title}
          </h1>
          {survey.description && (
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground/80">
              {survey.description}
            </p>
          )}
          <div className="mt-10 flex items-center gap-6 border-t border-border pt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-foreground">{survey.questions.length}</span>
              <span>Parameters</span>
            </div>
            <div className="size-1 rounded-full bg-border"></div>
            <div className="flex items-center gap-2">
              <span className="text-foreground">Required fields marked with</span>
              <span className="text-destructive font-bold">*</span>
            </div>
          </div>
        </header>

        {/* Survey Content */}
        <div className="space-y-16">
          <div className="space-y-12">
            {survey.questions.map((q, idx) => (
              <QuestionInput
                key={q.id}
                question={q}
                index={idx}
                value={answers[q.id]}
                error={errors[q.id]}
                onChange={(val) => setAnswer(q.id, val)}
              />
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border pt-12">
            <p className="max-w-xs text-xs leading-normal text-muted-foreground">
              By submitting this response, you confirm that all provided information is accurate and
              collected according to ethical research standards.
            </p>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="h-14 rounded-full px-10 text-base font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Submit Response
              <IconSend className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
