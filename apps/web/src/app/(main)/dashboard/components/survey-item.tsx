"use client";

import { IconChevronRight } from "@tabler/icons-react";

export interface Survey {
  id: string;
  title: string;
  location?: string;
  responses: string;
  progress: number;
  status: "active" | "closing" | "paused";
  questions: number;
  closes?: string;
  subText?: string;
}

interface SurveyItemProps {
  survey: Survey;
}

export function SurveyItem({ survey }: SurveyItemProps) {
  return (
    <div className="survey">
      <div className="survey-status" data-state={survey.status}></div>
      <div className="survey-main">
        <div className="survey-title">{survey.title}</div>
        <div className="survey-meta">
          {survey.location && (
            <>
              <span>{survey.location}</span>
              <div className="sep"></div>
            </>
          )}
          <span>{survey.responses} responses</span>
          <div className="sep"></div>
          {survey.closes && (
            <>
              <span>{survey.closes}</span>
              <div className="sep"></div>
            </>
          )}
          {survey.subText && (
            <>
              <span>{survey.subText}</span>
              <div className="sep"></div>
            </>
          )}
          <span>{survey.questions} questions</span>
        </div>
        <div className="survey-progress">
          <span style={{ width: `${survey.progress}%` }}></span>
        </div>
      </div>
      <div className="survey-cta">
        <div className="pct">{survey.progress}%</div>
        <div className="chev-btn">
          <IconChevronRight />
        </div>
      </div>
    </div>
  );
}
