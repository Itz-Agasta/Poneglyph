"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveSurvey, generateId, type Question, type QuestionType } from "../_lib/survey-store";
import { Button, buttonVariants } from "@Poneglyph/ui/components/button";
import { Input } from "@Poneglyph/ui/components/input";
import { Textarea } from "@Poneglyph/ui/components/textarea";
import { cn } from "@Poneglyph/ui/lib/utils";
import {
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconChevronLeft,
  IconCheck,
} from "@tabler/icons-react";

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "text", label: "Text answer" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "rating", label: "Rating (1–5)" },
  { value: "yes_no", label: "Yes / No" },
];

function newQuestion(): Question {
  return {
    id: generateId(),
    type: "text",
    text: "",
    required: false,
    options: ["", ""],
  };
}

export default function CreateSurveyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([newQuestion()]);
  const [submitted, setSubmitted] = useState(false);

  const addQuestion = () => setQuestions((qs) => [...qs, newQuestion()]);

  const removeQuestion = (id: string) =>
    setQuestions((qs) => qs.filter((q) => q.id !== id));

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const updateOption = (qId: string, idx: number, val: string) =>
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qId) return q;
        const options = [...(q.options ?? [])];
        options[idx] = val;
        return { ...q, options };
      }),
    );

  const addOption = (qId: string) =>
    setQuestions((qs) =>
      qs.map((q) => (q.id === qId ? { ...q, options: [...(q.options ?? []), ""] } : q)),
    );

  const removeOption = (qId: string, idx: number) =>
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qId) return q;
        const options = (q.options ?? []).filter((_, i) => i !== idx);
        return { ...q, options };
      }),
    );

  const canSubmit =
    title.trim().length > 0 &&
    questions.length > 0 &&
    questions.every(
      (q) =>
        q.text.trim().length > 0 &&
        (q.type !== "multiple_choice" ||
          (q.options ?? []).filter((o) => o.trim()).length >= 2),
    );

  const handleSubmit = () => {
    if (!canSubmit) return;
    const id = generateId();
    saveSurvey({
      id,
      title: title.trim(),
      description: description.trim(),
      questions: questions.map((q) => ({
        ...q,
        options:
          q.type === "multiple_choice"
            ? (q.options ?? []).filter((o) => o.trim())
            : undefined,
      })),
      createdAt: Date.now(),
      responseCount: 0,
    });
    setSubmitted(true);
    router.push(`/survey/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-14">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/survey"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
          >
            <IconChevronLeft className="size-4" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Volunteer Tools
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create survey
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Survey details */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-xs">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Survey details</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Community Health Assessment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="Brief description of this survey's purpose..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <QuestionEditor
                key={q.id}
                question={q}
                index={idx}
                onUpdate={(patch) => updateQuestion(q.id, patch)}
                onRemove={() => removeQuestion(q.id)}
                onUpdateOption={(i, val) => updateOption(q.id, i, val)}
                onAddOption={() => addOption(q.id)}
                onRemoveOption={(i) => removeOption(q.id, i)}
                canRemove={questions.length > 1}
              />
            ))}
          </div>

          <Button variant="outline" onClick={addQuestion} className="w-full">
            <IconPlus className="size-4" />
            Add question
          </Button>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Link href="/survey" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button onClick={handleSubmit} disabled={!canSubmit || submitted}>
              <IconCheck className="size-4" />
              {submitted ? "Creating..." : "Create survey"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  canRemove,
}: {
  question: Question;
  index: number;
  onUpdate: (patch: Partial<Question>) => void;
  onRemove: () => void;
  onUpdateOption: (i: number, val: string) => void;
  onAddOption: () => void;
  onRemoveOption: (i: number) => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-xs">
      <div className="mb-3 flex items-center gap-2">
        <IconGripVertical className="size-4 shrink-0 text-muted-foreground/40" />
        <span className="text-xs font-semibold text-muted-foreground">
          Question {index + 1}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="size-3 accent-primary"
            />
            Required
          </label>
          {canRemove && (
            <button
              onClick={onRemove}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <IconTrash className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Question text..."
            value={question.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="flex-1"
          />
          <select
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
            className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {question.type === "multiple_choice" && (
          <div className="ml-2 space-y-2">
            {(question.options ?? []).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="size-3 shrink-0 rounded-full border border-muted-foreground/40" />
                <Input
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => onUpdateOption(i, e.target.value)}
                  className="flex-1"
                />
                {(question.options ?? []).length > 2 && (
                  <button
                    onClick={() => onRemoveOption(i)}
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <IconTrash className="size-3.5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={onAddOption}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
            >
              <IconPlus className="size-3" />
              Add option
            </button>
          </div>
        )}

        {question.type === "rating" && (
          <div className="ml-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex size-8 items-center justify-center rounded-md border border-border text-sm text-muted-foreground"
              >
                {n}
              </div>
            ))}
          </div>
        )}

        {question.type === "yes_no" && (
          <div className="ml-2 flex gap-3">
            {["Yes", "No"].map((opt) => (
              <div
                key={opt}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground"
              >
                <div className="size-3 rounded-full border border-muted-foreground/40" />
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
