export type QuestionType = "text" | "multiple_choice" | "rating" | "yes_no";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // for multiple_choice
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: number;
  responseCount: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, string | string[]>;
  submittedAt: number;
}

const SURVEYS_KEY = "poneglyph_surveys";
const RESPONSES_KEY = "poneglyph_survey_responses";

const DEFAULT_SURVEYS: Survey[] = [
  {
    id: "surv_fake_1",
    title: "Post-Disaster Community Needs Assessment",
    description:
      "Survey to assess immediate needs (water, shelter, medical) in communities affected by the recent floods.",
    createdAt: Date.now() - 86400000 * 2,
    responseCount: 15,
    questions: [
      { id: "q1", type: "text", text: "What is your primary location?", required: true },
      {
        id: "q2",
        type: "multiple_choice",
        text: "What is your most urgent need?",
        options: ["Clean Water", "Food", "Medical Supplies", "Shelter"],
        required: true,
      },
      { id: "q3", type: "yes_no", text: "Do you have access to electricity?", required: true },
    ],
  },
  {
    id: "surv_fake_2",
    title: "Rural Education Access Survey",
    description: "Evaluating barriers to education access in rural districts.",
    createdAt: Date.now() - 86400000 * 5,
    responseCount: 42,
    questions: [
      { id: "q1", type: "text", text: "Name of the village/district", required: true },
      {
        id: "q2",
        type: "yes_no",
        text: "Is there a functional school within 5km?",
        required: true,
      },
      {
        id: "q3",
        type: "multiple_choice",
        text: "Primary reason for dropouts",
        options: ["Distance", "Cost", "Need to work", "Other"],
        required: false,
      },
      {
        id: "q4",
        type: "rating",
        text: "Rate the condition of the nearest school facilities (1-5)",
        required: false,
      },
    ],
  },
  {
    id: "surv_fake_3",
    title: "Healthcare Facility Audit",
    description: "Routine audit of public health facilities and their inventory levels.",
    createdAt: Date.now() - 86400000 * 10,
    responseCount: 8,
    questions: [
      { id: "q1", type: "text", text: "Facility Name", required: true },
      {
        id: "q2",
        type: "multiple_choice",
        text: "Current stock of basic antibiotics",
        options: ["Adequate", "Low", "Out of stock"],
        required: true,
      },
      {
        id: "q3",
        type: "yes_no",
        text: "Is the cold chain equipment functioning?",
        required: true,
      },
    ],
  },
];

export function getSurveys(): Survey[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SURVEYS_KEY);
    if (!data) {
      localStorage.setItem(SURVEYS_KEY, JSON.stringify(DEFAULT_SURVEYS));
      return DEFAULT_SURVEYS;
    }
    const parsed = JSON.parse(data);
    if (parsed.length === 0) {
      localStorage.setItem(SURVEYS_KEY, JSON.stringify(DEFAULT_SURVEYS));
      return DEFAULT_SURVEYS;
    }
    return parsed;
  } catch {
    return DEFAULT_SURVEYS;
  }
}

export function getSurvey(id: string): Survey | null {
  return getSurveys().find((s) => s.id === id) ?? null;
}

export function saveSurvey(survey: Survey): void {
  const surveys = getSurveys();
  const idx = surveys.findIndex((s) => s.id === survey.id);
  if (idx >= 0) surveys[idx] = survey;
  else surveys.push(survey);
  localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
}

export function getResponses(surveyId: string): SurveyResponse[] {
  if (typeof window === "undefined") return [];
  try {
    const all: SurveyResponse[] = JSON.parse(localStorage.getItem(RESPONSES_KEY) ?? "[]");
    return all.filter((r) => r.surveyId === surveyId);
  } catch {
    return [];
  }
}

export function saveResponse(response: SurveyResponse): void {
  const all: SurveyResponse[] = JSON.parse(localStorage.getItem(RESPONSES_KEY) ?? "[]");
  all.push(response);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(all));

  // bump responseCount on survey
  const survey = getSurvey(response.surveyId);
  if (survey) {
    survey.responseCount += 1;
    saveSurvey(survey);
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
