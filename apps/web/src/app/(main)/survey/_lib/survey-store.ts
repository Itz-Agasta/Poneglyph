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

export function getSurveys(): Survey[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SURVEYS_KEY) ?? "[]");
  } catch {
    return [];
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
  const all: SurveyResponse[] = JSON.parse(
    localStorage.getItem(RESPONSES_KEY) ?? "[]",
  );
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
