"use client";

import Link from "next/link";
import { IconTrendingUp } from "@tabler/icons-react";

export type ReportCategory =
  | "Geography"
  | "Climate"
  | "Economy"
  | "Demographics"
  | "Taxonomy"
  | "Trade";

export interface Report {
  id: string;
  title: string;
  summary: string;
  category: ReportCategory;
  tags: string[];
  author: string;
  authorInitial: string;
  readTime: string;
  date: string;
  trending?: boolean;
}

interface ReportCardProps {
  report: Report;
}

function ReportCover({ category }: { category: ReportCategory }) {
  const getCoverStyles = () => {
    switch (category) {
      case "Geography":
        return {
          background: "linear-gradient(140deg, oklch(0.85 0.18 130), oklch(0.55 0.16 150))",
          content: (
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
              <g stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none">
                <circle cx="200" cy="110" r="80" />
                <circle cx="200" cy="110" r="50" />
                <circle cx="200" cy="110" r="20" />
                <path d="M120 110 L280 110 M200 30 L200 190" strokeDasharray="4 6" />
                <path d="M150 60 L250 160 M250 60 L150 160" />
              </g>
              <g fill="rgba(255,255,255,0.9)">
                <circle cx="200" cy="110" r="3" />
                <circle cx="240" cy="80" r="2" />
                <circle cx="160" cy="140" r="2" />
              </g>
            </svg>
          ),
        };
      case "Climate":
        return {
          background: "linear-gradient(140deg, oklch(0.4 0.05 260), oklch(0.18 0.04 240))",
          content: (
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
              <g stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none">
                <path d="M0 180 C 80 140, 160 200, 240 160 S 400 140, 400 160" />
                <path d="M0 150 C 80 110, 160 170, 240 130 S 400 110, 400 130" opacity="0.7" />
                <path d="M0 120 C 80 80, 160 140, 240 100 S 400 80, 400 100" opacity="0.4" />
              </g>
              <g fill="oklch(0.85 0.22 130)">
                <circle cx="80" cy="155" r="3" />
                <circle cx="200" cy="145" r="3" />
                <circle cx="320" cy="135" r="3" />
              </g>
            </svg>
          ),
        };
      case "Economy":
        return {
          background: "linear-gradient(140deg, oklch(0.92 0.1 80), oklch(0.7 0.16 50))",
          content: (
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
              <g fill="rgba(255,255,255,0.55)">
                <rect x="40" y="120" width="30" height="60" rx="4" />
                <rect x="80" y="90" width="30" height="90" rx="4" />
                <rect x="120" y="60" width="30" height="120" rx="4" />
                <rect x="160" y="100" width="30" height="80" rx="4" />
                <rect x="200" y="40" width="30" height="140" rx="4" />
                <rect x="240" y="80" width="30" height="100" rx="4" />
                <rect x="280" y="50" width="30" height="130" rx="4" />
                <rect x="320" y="100" width="30" height="80" rx="4" />
              </g>
              <g stroke="oklch(0.3 0.1 50)" strokeWidth="2" fill="none">
                <path d="M55 145 L95 125 L135 100 L175 130 L215 80 L255 110 L295 90 L335 130" />
              </g>
            </svg>
          ),
        };
      case "Demographics":
        return {
          background: "linear-gradient(140deg, oklch(0.78 0.18 25), oklch(0.45 0.16 15))",
          content: (
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
              <g stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none">
                <path d="M40 110 Q 100 60 160 110 T 280 110 T 400 110" strokeWidth="2" />
                <path d="M40 130 Q 100 80 160 130 T 280 130 T 400 130" opacity="0.7" />
              </g>
              <g fill="rgba(255,255,255,0.85)">
                <path d="M180 90 L210 90 L195 60 Z" />
                <circle cx="195" cy="100" r="4" />
              </g>
            </svg>
          ),
        };
      case "Taxonomy":
        return {
          background: "linear-gradient(140deg, oklch(0.72 0.18 295), oklch(0.32 0.14 280))",
          content: (
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
              <g stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none">
                <path d="M0 110 L400 110 M200 0 L200 220" strokeDasharray="2 5" />
              </g>
              <g fill="rgba(255,255,255,0.85)">
                <circle cx="100" cy="80" r="6" />
                <circle cx="160" cy="120" r="10" />
                <circle cx="220" cy="70" r="4" />
                <circle cx="280" cy="140" r="14" />
                <circle cx="340" cy="90" r="8" />
              </g>
            </svg>
          ),
        };
      case "Trade":
        return {
          background: "linear-gradient(140deg, oklch(0.85 0.16 200), oklch(0.4 0.14 220))",
          content: (
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
              <g stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none">
                <path d="M50 180 L100 130 L150 150 L200 90 L250 110 L300 60 L350 80" />
              </g>
              <g fill="rgba(255,255,255,0.85)">
                <circle cx="100" cy="130" r="4" />
                <circle cx="200" cy="90" r="4" />
                <circle cx="300" cy="60" r="4" />
              </g>
            </svg>
          ),
        };
      default:
        return { background: "var(--muted)", content: null };
    }
  };

  const { background, content } = getCoverStyles();

  return (
    <div className="report-cover" style={{ background }}>
      {content}
      <div className="grain"></div>
    </div>
  );
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link href={`/dashboard/${report.id}`} className="report">
      <ReportCover category={report.category} />
      <div className="cover-label">{report.category}</div>
      {report.trending && (
        <div className="cover-trend">
          <IconTrendingUp />
          #1 trending
        </div>
      )}
      <div className="report-body">
        <div className="report-title">{report.title}</div>
        <p className="report-summary">{report.summary}</p>
        <div className="tags">
          {report.tags.map((tag, i) => (
            <span key={tag} className={`tag ${i === 0 ? "primary" : ""}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="report-meta">
          <div className="author">
            <span className="av">{report.authorInitial}</span>
            {report.author} · {report.readTime}
          </div>
          <span>{report.date}</span>
        </div>
      </div>
    </Link>
  );
}
