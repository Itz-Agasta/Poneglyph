"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getSurvey,
  saveResponse,
  generateId,
  type Survey,
  type Question,
} from "../_lib/survey-store";
import { Button, buttonVariants } from "@Poneglyph/ui/components/button";
import { Textarea } from "@Poneglyph/ui/components/textarea";
import { cn } from "@Poneglyph/ui/lib/utils";
import { IconChevronLeft, IconSend, IconCircleCheck } from "@tabler/icons-react";

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">Survey not found.</p>
        <Link href="/survey" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <IconChevronLeft className="size-4" />
          All surveys
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <IconCircleCheck className="size-14 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Response submitted!</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Thanks for completing <span className="font-medium text-foreground">{survey.title}</span>.
          Your response has been recorded.
        </p>
        <div className="mt-2 flex gap-3">
          <Link href="/survey" className={buttonVariants({ variant: "outline", size: "sm" })}>
            All surveys
          </Link>
          <Button
            size="sm"
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
        errs[q.id] = "This question is required.";
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-14">
        {/* Header */}
        <div className="mb-2 flex items-center gap-3">
          <Link
            href="/survey"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <IconChevronLeft className="size-4" />
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Survey
          </p>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{survey.title}</h1>
          {survey.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {survey.description}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {survey.questions.length} question{survey.questions.length !== 1 ? "s" : ""}
            {survey.questions.some((q) => q.required) && (
              <>
                {" · "}
                <span className="text-destructive">*</span> required
              </>
            )}
          </p>
        </div>

        <div className="space-y-5">
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

          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit}>
              <IconSend className="size-4" />
              Submit response
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  index,
  value,
  error,
  onChange,
}: {
  question: Question;
  index: number;
  value: string | string[] | undefined;
  error?: string;
  onChange: (val: string | string[]) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-xs">
      <p className="mb-3 text-sm font-medium text-foreground">
        {index + 1}. {question.text}
        {question.required && <span className="ml-1 text-destructive">*</span>}
      </p>

      {question.type === "text" && (
        <Textarea
          placeholder="Your answer..."
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-20 resize-none"
        />
      )}

      {question.type === "multiple_choice" && (
        <div className="space-y-2">
          {(question.options ?? []).map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name={question.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="size-4 accent-primary"
              />
              <span className="text-foreground">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "rating" && (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(String(n))}
              className={`flex size-10 items-center justify-center rounded-md border text-sm font-medium transition ${
                value === String(n)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-ring hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {question.type === "yes_no" && (
        <div className="flex gap-3">
          {["Yes", "No"].map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`rounded-md border px-5 py-2 text-sm font-medium transition ${
                value === opt
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-ring hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
