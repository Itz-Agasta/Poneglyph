"use client";

import "./dashboard.css";
import { Sidebar } from "./components/sidebar";
import { ReportCard, type Report } from "./components/report-card";
import { SurveyItem, type Survey } from "./components/survey-item";
import { DatasetItem, type Dataset } from "./components/dataset-item";
import { ActivityItem, type Activity } from "./components/activity-item";
import { 
  IconSearch, 
  IconBell, 
  IconPlus, 
  IconArrowRight, 
  IconChevronRight 
} from "@tabler/icons-react";
import Link from "next/link";

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Mapping the four Road Poneglyphs: a 2026 triangulation atlas",
    summary: "An updated cartographic synthesis of all four confirmed Road stones, with bearings, custodianship history, and the resulting intersection field.",
    category: "Geography",
    tags: ["Cartography", "Lore", "Field study"],
    author: "Nico Robin",
    authorInitial: "N",
    readTime: "12 min read",
    date: "Apr 24",
    trending: true,
  },
  {
    id: "2",
    title: "Sea-level oscillation across the Grand Line, Q1 2026",
    summary: "Three-month buoy network readings analyzed against historical baselines. Anomalies clustered around Calm Belt boundaries.",
    category: "Climate",
    tags: ["Climate", "Time series", "Quarterly"],
    author: "Dr. Vegapunk",
    authorInitial: "V",
    readTime: "8 min read",
    date: "Apr 22",
  },
  {
    id: "3",
    title: "Berry circulation: tracking 14 markets after Onigashima",
    summary: "Cross-market flow study on currency velocity, with case notes on Wano's reopening and post-conflict trade routes.",
    category: "Economy",
    tags: ["Economy", "Markets"],
    author: "Trafalgar D.",
    authorInitial: "T",
    readTime: "15 min read",
    date: "Apr 19",
  },
  {
    id: "4",
    title: "Mink tribe migration patterns, 1500 – present",
    summary: "Long-arc historical view of relocation cycles, with newly indexed Zou records.",
    category: "Demographics",
    tags: ["History", "Migration"],
    author: "Pedro",
    authorInitial: "P",
    readTime: "6 min read",
    date: "Apr 16",
  },
  {
    id: "5",
    title: "Devil fruit family tree: a structural review",
    summary: "Reclassifying 312 cataloged fruits using the new Vegapunk-Ohara joint taxonomy, with visualization keys.",
    category: "Taxonomy",
    tags: ["Taxonomy", "Methodology"],
    author: "Vegapunk Lilith",
    authorInitial: "V",
    readTime: "22 min read",
    date: "Apr 12",
  },
  {
    id: "6",
    title: "Reverse Mountain freight volume — 5-year retrospective",
    summary: "Shipping log analysis from 2021–2026, including the post-Reverie disruption window and recovery curve.",
    category: "Trade",
    tags: ["Trade", "Shipping"],
    author: "Franky",
    authorInitial: "F",
    readTime: "9 min read",
    date: "Apr 09",
  },
];

const MOCK_SURVEYS: Survey[] = [
  {
    id: "s1",
    title: "Sanitation in Coastal Communities, follow-up wave",
    responses: "2.4k",
    progress: 88,
    status: "closing",
    questions: 14,
    closes: "Closes in 3 days",
  },
  {
    id: "s2",
    title: "Devil fruit user demographics, wave 2",
    responses: "12k",
    progress: 42,
    status: "active",
    questions: 28,
    closes: "Closes Jun 12",
  },
  {
    id: "s3",
    title: "Smallholder Farmer Income assessment",
    responses: "5.1k",
    progress: 15,
    status: "active",
    questions: 32,
    closes: "Closes in 2 weeks",
  },
  {
    id: "s4",
    title: "Reverse Mountain shipping log — captains' panel",
    responses: "156 / 500",
    progress: 31,
    status: "paused",
    questions: 9,
    subText: "Paused for review",
  }
];

const MOCK_DATASETS: Dataset[] = [
  {
    id: "d1",
    name: "grand-line-bearings.csv",
    size: "1.2 MB",
    updatedAt: "2h ago",
    extension: "csv",
    bars: [30, 55, 45, 80, 60, 90, 70],
    cols: "12",
    rows: "2,184",
  },
  {
    id: "d2",
    name: "poneglyph-rubbings.parquet",
    size: "48 MB",
    updatedAt: "yesterday",
    extension: "parquet",
    bars: [60, 40, 75, 30, 85, 55, 65],
    records: "312",
  },
  {
    id: "d3",
    name: "grand-line-bathymetry.geojson",
    size: "22 MB",
    updatedAt: "3d ago",
    extension: "geo",
    bars: [40, 60, 50, 75, 90, 65, 80],
    layers: "14",
  },
  {
    id: "d4",
    name: "devil-fruit-taxonomy.json",
    size: "0.6 MB",
    updatedAt: "5d ago",
    extension: "json",
    bars: [30, 35, 50, 60, 55, 70, 75],
    records: "312",
  },
  {
    id: "d5",
    name: "marine-postings-2026.csv",
    size: "0.9 MB",
    updatedAt: "1w ago",
    extension: "csv",
    bars: [55, 60, 40, 70, 35, 65, 50],
    cols: "8",
    rows: "4,210",
  }
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "a1",
    user: "Vegapunk Lilith",
    action: "published",
    target: "Devil fruit family tree",
    time: "2 hours ago",
    initial: "V",
  },
  {
    id: "a2",
    user: "Trafalgar D.",
    action: "commented on",
    target: "Berry circulation",
    time: "5 hours ago",
    initial: "T",
  },
  {
    id: "a3",
    user: "You",
    action: "uploaded",
    target: "poneglyph-rubbings.parquet",
    time: "yesterday",
    initial: "N",
  },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Sidebar userName="Nico Robin" userPlan="Archaeologist" />

      <main className="dashboard-main">
        {/* Top Section */}
        <header className="top">
          <div>
            <h1 className="hello">Good afternoon, <em>Robin</em></h1>
            <p className="lede">3 reports published this week, 4 surveys collecting responses, 12 datasets indexed.</p>
          </div>

          <div className="top-actions">
            <div className="search">
              <IconSearch />
              <input type="text" placeholder="Search reports, datasets..." />
            </div>
            <button className="icon-btn" aria-label="Notifications">
              <IconBell />
              <div className="dot"></div>
            </button>
            <Link href="/create" className="btn">
              <IconPlus />
              Create New
            </Link>
          </div>
        </header>

        {/* Featured Reports Grid Section */}
        <section>
          <div className="sec-head">
            <div>
              <h2>Trending reports <span className="sub">curated this week</span></h2>
            </div>
            <div className="right">
              <Link href="/reports" className="btn btn-ghost">
                View all reports <IconArrowRight className="ml-1" />
              </Link>
            </div>
          </div>

          <div className="reports">
            {MOCK_REPORTS.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* Lower Grid Section: Surveys + (Datasets & Activity) */}
        <div className="grid-2 mt-12">
          {/* Ongoing Surveys */}
          <section>
            <div className="sec-head">
              <div>
                <h2>Ongoing surveys <span className="sub">4 collecting</span></h2>
              </div>
              <div className="right">
                <Link href="/surveys" className="btn btn-ghost">
                  All surveys <IconArrowRight className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="survey-list">
              {MOCK_SURVEYS.map(survey => (
                <SurveyItem key={survey.id} survey={survey} />
              ))}
            </div>
          </section>

          {/* Datasets & Activity */}
          <section>
            <div className="sec-head">
              <div>
                <h2>Datasets <span className="sub">recently updated</span></h2>
              </div>
              <div className="right">
                <Link href="/datasets" className="btn btn-ghost">
                  All datasets <IconArrowRight className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="dataset-list">
              {MOCK_DATASETS.map(dataset => (
                <DatasetItem key={dataset.id} dataset={dataset} />
              ))}
            </div>

            <div className="activity mt-4">
              <h3>Recent activity</h3>
              <div className="flex flex-col">
                {MOCK_ACTIVITIES.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
