"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Users, FileText, BarChart3, Brain, MapPin, Upload, Cpu, TrendingUp, Search, Loader2 } from "lucide-react";
import {
  BarChart, HBarChart, LineChart, DonutChart,
  SparkStat, Heatmap, ProgressRing, StackedBar,
  ChartCard, ScatterPlot, MiniStat, Sparkline,
} from "@/components/charts";
import { Highlight, HeroTag, SectionHeader, ActivityItem, DarkBanner } from "@/components/cards";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

// Synthetic data generators
const COLORS = ["#22242A", "#bfff00", "#25C5FA", "#37955B", "#B3BDBD", "#E5E6E6"];

function generateSyntheticData(query: string) {
  const q = query.toLowerCase();
  
  // Different data based on keywords
  if (q.includes("region") || q.includes("continent") || q.includes("country")) {
    return {
      title: "Distribution by Region",
      type: "bar" as const,
      data: [
        { name: "Asia Pacific", value: Math.floor(Math.random() * 30000) + 20000, color: "#22242A" },
        { name: "Africa", value: Math.floor(Math.random() * 30000) + 20000, color: "#bfff00" },
        { name: "Europe", value: Math.floor(Math.random() * 20000) + 15000, color: "#25C5FA" },
        { name: "Americas", value: Math.floor(Math.random() * 20000) + 15000, color: "#37955B" },
        { name: "Middle East", value: Math.floor(Math.random() * 15000) + 10000, color: "#B3BDBD" },
      ]
    };
  }
  
  if (q.includes("age") || q.includes("child") || q.includes("young")) {
    return {
      title: "Age Distribution",
      type: "donut" as const,
      data: [
        { name: "Under 18", value: Math.floor(Math.random() * 30) + 20, color: "#22242A" },
        { name: "18-25", value: Math.floor(Math.random() * 25) + 15, color: "#bfff00" },
        { name: "26-35", value: Math.floor(Math.random() * 25) + 15, color: "#25C5FA" },
        { name: "36-45", value: Math.floor(Math.random() * 20) + 10, color: "#37955B" },
        { name: "46+", value: Math.floor(Math.random() * 15) + 5, color: "#B3BDBD" },
      ]
    };
  }
  
  if (q.includes("gender") || q.includes("female") || q.includes("male") || q.includes("women")) {
    return {
      title: "Gender Distribution",
      type: "donut" as const,
      data: [
        { name: "Female", value: Math.floor(Math.random() * 20) + 60, color: "#22242A" },
        { name: "Male", value: Math.floor(Math.random() * 15) + 20, color: "#bfff00" },
        { name: "Other/Unknown", value: Math.floor(Math.random() * 10) + 5, color: "#B3BDBD" },
      ]
    };
  }
  
  if (q.includes("trend") || q.includes("year") || q.includes("growth") || q.includes("over time")) {
    const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
    return {
      title: "Trends Over Time",
      type: "area" as const,
      data: years.map((year, i) => ({
        name: year,
        value: Math.floor(Math.random() * 50000) + 20000,
        color: COLORS[i % COLORS.length]
      }))
    };
  }
  
  if (q.includes("type") || q.includes("exploitation") || q.includes("labor") || q.includes("sexual")) {
    return {
      title: "Types of Cases",
      type: "bar" as const,
      data: [
        { name: "Labor Exploitation", value: Math.floor(Math.random() * 30) + 25, color: "#22242A" },
        { name: "Sexual Exploitation", value: Math.floor(Math.random() * 30) + 25, color: "#bfff00" },
        { name: "Domestic Servitude", value: Math.floor(Math.random() * 20) + 15, color: "#25C5FA" },
        { name: "Forced Marriage", value: Math.floor(Math.random() * 15) + 10, color: "#37955B" },
        { name: "Other", value: Math.floor(Math.random() * 15) + 10, color: "#B3BDBD" },
      ]
    };
  }
  
  // Default: sector breakdown
  return {
    title: "Sector Breakdown",
    type: "bar" as const,
    data: [
      { name: "Healthcare", value: Math.floor(Math.random() * 20000) + 15000, color: "#22242A" },
      { name: "Education", value: Math.floor(Math.random() * 20000) + 15000, color: "#bfff00" },
      { name: "Emergency Relief", value: Math.floor(Math.random() * 15000) + 10000, color: "#25C5FA" },
      { name: "Child Welfare", value: Math.floor(Math.random() * 15000) + 10000, color: "#37955B" },
      { name: "Human Rights", value: Math.floor(Math.random() * 10000) + 5000, color: "#B3BDBD" },
    ]
  };
}

function SearchResults({ query }: { query: string }) {
  const firstResult = generateSyntheticData(query);
  // Generate different type for second chart
  const secondQuery = query.includes("trend") || query.includes("year") || query.includes("growth") 
    ? query + " type"  // different keyword for variety
    : query + " trend";
  const secondResult = { 
    ...generateSyntheticData(secondQuery), 
    type: firstResult.type === "bar" ? "area" as const : "bar" as const 
  };
  
  const [results] = useState([firstResult, secondResult]);
  
  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <div className="text-left mb-6">
        <h3 className="text-xl font-medium text-black">
          Results for &quot;<span className="text-primary">{query}</span>&quot;
        </h3>
        <p className="text-sm text-grey-1 mt-1">Based on aggregated data from 156,000+ records</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result, i) => (
          <div key={i} className="p-6 bg-grey-4 rounded-xl border border-grey-3">
            <p className="text-sm font-medium text-grey-1 mb-4">{result.title}</p>
            
            {/* Simple bar visualization */}
            {result.type === "bar" && (
              <div className="space-y-3">
                {result.data.map((item, j) => {
                  const values = result.data.map(d => typeof d.value === 'number' ? d.value : 0);
                  const maxValue = Math.max(...values);
                  const width = maxValue > 0 ? ((typeof item.value === 'number' ? item.value : 0) / maxValue) * 100 : 0;
                  return (
                    <div key={j} className="flex items-center gap-3">
                      <span className="text-xs text-grey-1 w-24 truncate">{item.name}</span>
                      <div className="flex-1 h-6 bg-grey-3 rounded overflow-hidden">
                        <div 
                          className="h-full rounded" 
                          style={{ width: `${width}%`, backgroundColor: item.color || COLORS[j % COLORS.length] }}
                        />
                      </div>
                      <span className="text-xs font-medium text-black w-16 text-right">
                        {typeof item.value === 'number' && item.value > 1000 
                          ? `${(item.value / 1000).toFixed(1)}k` 
                          : `${item.value}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Simple line/area visualization */}
            {result.type === "area" && (
              <div className="flex items-end justify-between h-40 gap-1">
                {result.data.map((item, j) => {
                  const values = result.data.map(d => typeof d.value === 'number' ? d.value : 0);
                  const maxValue = Math.max(...values);
                  const height = maxValue > 0 ? ((typeof item.value === 'number' ? item.value : 0) / maxValue) * 100 : 0;
                  return (
                    <div key={j} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-primary rounded-t min-h-[4px]"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                      <span className="text-[10px] text-grey-1 mt-2 truncate w-full text-center">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Simple donut visualization */}
            {result.type === "donut" && (
              <div className="flex items-center justify-center h-40">
                <div className="relative w-32 h-32 rounded-full border-8 flex items-center justify-center" style={{ 
                  borderColor: result.data[0]?.color || COLORS[0],
                  borderLeftColor: result.data[1]?.color || COLORS[1],
                  borderRightColor: result.data[2]?.color || COLORS[2],
                  borderBottomColor: result.data[3]?.color || COLORS[3],
                }}>
                  <div className="text-center">
                    <span className="text-lg font-medium text-black">{typeof result.data[0]?.value === 'number' ? result.data[0].value : 0}</span>
                    <span className="text-xs text-grey-1">%</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  {result.data.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || COLORS[j] }} />
                      <span className="text-grey-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-grey-2">
          Data is synthetic for demonstration purposes. Connect to API for real data.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION: Hero — Resource Allocation Dashboard
───────────────────────────────────────────────── */
function HeroDashboard() {
  const monthly = [
    { label: "Jan", values: [42, 28] },
    { label: "Feb", values: [55, 32] },
    { label: "Mar", values: [48, 38] },
    { label: "Apr", values: [70, 45] },
    { label: "May", values: [63, 52] },
    { label: "Jun", values: [81, 60] },
    { label: "Jul", values: [74, 55] },
    { label: "Aug", values: [90, 68] },
    { label: "Sep", values: [88, 72] },
    { label: "Oct", values: [102, 84] },
    { label: "Nov", values: [97, 79] },
    { label: "Dec", values: [118, 95] },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto border border-grey-3 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Dashboard top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-grey-3 bg-grey-4/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-[11px] font-medium text-grey-1 ml-2">Poneglyph — Resource Overview</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-grey-2 bg-primary/20 px-2 py-0.5 rounded-full">Live</span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 divide-x divide-grey-3 border-b border-grey-3">
        {[
          { label: "Volunteers Active", value: "2,847", delta: "+12%", up: true, spark: [40,55,48,70,63,81,74,90,88,102,97,118] },
          { label: "NGOs Served", value: "134", delta: "+8%", up: true, spark: [20,25,22,30,28,35,32,40,38,45,43,50] },
          { label: "Resources Allocated", value: "$1.2M", delta: "+24%", up: true, spark: [30,38,35,50,47,58,54,66,62,75,70,85] },
          { label: "AI Insights Generated", value: "8,490", delta: "+31%", up: true, spark: [100,140,120,180,160,210,190,240,230,280,260,310] },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1 p-4">
            <div className="flex items-end justify-between">
              <p className="text-xl font-semibold text-black leading-none">{s.value}</p>
              <Sparkline values={s.spark} color="primary" width={60} height={28} />
            </div>
            <p className={`text-[10px] font-medium ${s.up ? "text-success" : "text-error"}`}>
              {s.up ? "↑" : "↓"} {s.delta} this month
            </p>
            <p className="text-[10px] text-grey-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-black">Resource Allocation Over Time</p>
            <p className="text-[11px] text-grey-1">Resources distributed vs. volunteer hours logged</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Resources ($k)", color: "#22242A" },
              { label: "Volunteer Hours", color: "#E3FF8F" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-grey-1">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
        <BarChart
          data={monthly}
          colors={["black", "primary"]}
          height={160}
          unit="k"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION: Analytics Tabs UI (replaces Feature Tabs)
───────────────────────────────────────────────── */
function AnalyticsTabsUI() {
  const impactByRegion: import("@/components/charts").HBarDatum[] = [
    { label: "South Asia", value: 87, color: "black" },
    { label: "Sub-Saharan Africa", value: 74, color: "primary" },
    { label: "Latin America", value: 61, color: "blue" },
    { label: "Southeast Asia", value: 53, color: "success" },
    { label: "MENA", value: 42, color: "grey" },
  ];

  const volunteerTrend: import("@/components/charts").LineSeries[] = [
    {
      label: "New Volunteers",
      color: "primary",
      filled: true,
      values: [120, 145, 132, 168, 155, 192, 178, 215, 204, 248, 236, 280],
    },
    {
      label: "Active Volunteers",
      color: "black",
      filled: false,
      values: [100, 118, 108, 140, 128, 162, 150, 185, 174, 212, 200, 245],
    },
  ];

  const aiInsights: import("@/components/charts").DonutSegment[] = [
    { label: "Resource Gaps", value: 34, color: "black" },
    { label: "Volunteer Matches", value: 28, color: "primary" },
    { label: "Risk Alerts", value: 18, color: "error" },
    { label: "Impact Reports", value: 20, color: "success" },
  ];

  return (
    <div className="w-full border border-grey-3 rounded-2xl overflow-hidden bg-white">
      {/* 3 chart panels */}
      <div className="grid grid-cols-3 divide-x divide-grey-3 border-b border-grey-3">
        {/* Panel 1: Impact by region */}
        <div className="p-5">
          <HBarChart
            data={impactByRegion}
            title="Impact by Region"
            unit="%"
          />
        </div>
        {/* Panel 2: Volunteer trends */}
        <div className="p-5">
          <LineChart
            series={volunteerTrend}
            xLabels={["J","F","M","A","M","J","J","A","S","O","N","D"]}
            height={160}
            title="Volunteer Activity (YTD)"
            showLegend={true}
          />
        </div>
        {/* Panel 3: AI insights donut */}
        <div className="p-5 flex flex-col items-center justify-center">
          <DonutChart
            segments={aiInsights}
            size={140}
            centerLabel="8.5k"
            centerSub="insights"
            title="AI Insight Categories"
            showLegend={true}
          />
        </div>
      </div>

      {/* Bottom 3 labels */}
      <div className="grid grid-cols-3 divide-x divide-grey-3">
        {[
          { title: "Impact Mapping", badge: "AI", desc: "See resource gaps, coverage by region, and live allocation status across all active NGOs." },
          { title: "Volunteer Trends", desc: "Track volunteer growth, retention, and activity patterns over time." },
          { title: "AI Insight Engine", desc: "Sub-agents process volunteer uploads and generate structured, actionable statistics." },
        ].map((f) => (
          <div key={f.title} className="p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-black">{f.title}</p>
              {f.badge && (
                <span className="text-[9px] font-medium bg-primary text-black px-1.5 py-0.5 rounded-full">{f.badge}</span>
              )}
            </div>
            <p className="text-[11px] text-grey-1 leading-relaxed">{f.desc}</p>
            <button className="text-[11px] font-medium text-black flex items-center gap-1 mt-1">
              Learn more <ArrowRight size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION: Live Feed + Empowering Charts
───────────────────────────────────────────────── */
const feedItems = [
  { user: "Save The Children", action: "uploaded monthly field report", avatarColor: "bg-black" },
  { user: "AI Agent", action: "processed 847 data points from", target: "UNICEF upload", avatarColor: "bg-primary", textBlack: true },
  { user: "Volunteers SG", action: "submitted resource request", avatarColor: "bg-[#25C5FA]" },
  { user: "AI Agent", action: "matched 12 volunteers to", target: "Doctors Without Borders", avatarColor: "bg-primary", textBlack: true },
  { user: "Oxfam", action: "received allocation report", avatarColor: "bg-success" },
  { user: "Red Cross BD", action: "uploaded volunteer hours data", avatarColor: "bg-[#f4a261]" },
  { user: "AI Sub-agent", action: "flagged resource gap in", target: "Region 4", avatarColor: "bg-error" },
  { user: "CARE India", action: "approved resource transfer", avatarColor: "bg-black" },
];

function LiveFeedPanel() {
  return (
    <div className="bg-white border border-grey-3 rounded-2xl overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-grey-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-black">Live Activity Feed</span>
        </div>
        <span className="text-[10px] text-grey-2 bg-grey-4 px-2 py-0.5 rounded-full">Real-time</span>
      </div>
      <div className="flex flex-col divide-y divide-grey-3/50">
        {feedItems.map((a, i) => (
          <ActivityItem
            key={i}
            user={a.user}
            action={a.action}
            target={a.target}
            avatarColor={a.avatarColor}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION: Impact Heatmap + Roles (replaces accordion)
───────────────────────────────────────────────── */
function ImpactHeatmap() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const regions = ["Asia","Africa","LatAm","MENA","Europe","NAm"];
  // Simulated activity intensity 0–1
  const data = [
    [0.3,0.5,0.4,0.7,0.6,0.8,0.7,0.9,0.8,1.0,0.9,1.0],
    [0.2,0.4,0.6,0.5,0.7,0.6,0.8,0.7,0.9,0.8,1.0,0.9],
    [0.1,0.3,0.2,0.4,0.5,0.7,0.6,0.5,0.7,0.6,0.8,0.9],
    [0.4,0.3,0.5,0.4,0.6,0.5,0.7,0.6,0.5,0.7,0.6,0.8],
    [0.1,0.2,0.1,0.3,0.2,0.4,0.3,0.5,0.4,0.3,0.5,0.6],
    [0.2,0.1,0.3,0.2,0.1,0.3,0.2,0.4,0.3,0.2,0.4,0.5],
  ];

  return (
    <ChartCard title="Volunteer Activity Heatmap" subtitle="Engagement intensity by region × month">
      <Heatmap
        data={data}
        rowLabels={regions}
        colLabels={months}
        color="primary"
      />
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[9px] text-grey-2">Low</span>
        <div className="flex gap-px">
          {[0.15, 0.3, 0.5, 0.7, 0.85, 1].map((v) => (
            <div key={v} className="w-4 h-2.5 rounded-sm bg-primary" style={{ opacity: 0.2 + v * 0.8 }} />
          ))}
        </div>
        <span className="text-[9px] text-grey-2">High</span>
      </div>
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────────
   SECTION: "Make Actionable Decisions" → AI Analysis
───────────────────────────────────────────────── */
function AiAnalysisViz() {
  const scatter: import("@/components/charts").ScatterPoint[] = [
    { x: 20, y: 65, label: "Save Children", color: "primary", size: 8 },
    { x: 45, y: 80, label: "UNICEF", color: "black", size: 10 },
    { x: 70, y: 55, label: "Oxfam", color: "blue", size: 7 },
    { x: 30, y: 40, label: "Red Cross", color: "success", size: 9 },
    { x: 85, y: 70, label: "CARE", color: "primary", size: 6 },
    { x: 55, y: 90, label: "MSF", color: "error", size: 8 },
    { x: 15, y: 30, label: "WFP", color: "grey", size: 6 },
    { x: 90, y: 45, label: "IRC", color: "blue", size: 7 },
    { x: 60, y: 75, label: "HI", color: "success", size: 5 },
    { x: 40, y: 60, label: "NRC", color: "primary", size: 6 },
  ];

  const resourceSplit: import("@/components/charts").StackedSegment[] = [
    { label: "Medical", value: 38, color: "black" },
    { label: "Food Aid", value: 27, color: "primary" },
    { label: "Education", value: 18, color: "blue" },
    { label: "Shelter", value: 12, color: "success" },
    { label: "Other", value: 5, color: "grey" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
      <ChartCard title="NGO Impact vs. Resources" subtitle="Bubble = resource size">
        <ScatterPlot
          points={scatter}
          height={200}
          xLabel="Resources allocated →"
          yLabel="Impact score ↑"
        />
      </ChartCard>

      <div className="flex flex-col gap-4">
        <ChartCard title="Resource Category Split" subtitle="Current allocation breakdown">
          <StackedBar segments={resourceSplit} height={14} showLabels={true} />
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { label: "Efficiency", value: 82, color: "primary" as const },
              { label: "Coverage", value: 67, color: "blue" as const },
              { label: "Speed", value: 91, color: "success" as const },
            ].map((r) => (
              <ProgressRing key={r.label} value={r.value} color={r.color} label={r.label} size={72} />
            ))}
          </div>
        </ChartCard>

        <ChartCard title="AI Processing Queue" subtitle="Sub-agent task throughput">
          <LineChart
            series={[
              { label: "Tasks Queued", color: "grey", values: [40,55,48,60,52,70,65,80,72,88,80,95], filled: false },
              { label: "Tasks Completed", color: "success", filled: true, values: [38,53,46,58,50,68,63,78,70,86,78,93] },
            ]}
            xLabels={["J","F","M","A","M","J","J","A","S","O","N","D"]}
            height={120}
            showLegend={true}
          />
        </ChartCard>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION: Payroll → "Poneglyph by the Numbers"
───────────────────────────────────────────────── */
function ByTheNumbers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Volunteer matching */}
      <ChartCard title="Volunteer Matching Rate" subtitle="Skills-to-need AI alignment">
        <DonutChart
          segments={[
            { label: "Perfect Match", value: 62, color: "primary" },
            { label: "Good Match", value: 24, color: "black" },
            { label: "Partial", value: 10, color: "grey" },
            { label: "No Match", value: 4, color: "error" },
          ]}
          size={140}
          centerLabel="62%"
          centerSub="perfect"
          showLegend={true}
        />
      </ChartCard>

      {/* Card 2: Data pipeline */}
      <ChartCard title="Data Upload Pipeline" subtitle="Volume processed by AI agents">
        <BarChart
          data={[
            { label: "W1", values: [120, 95] },
            { label: "W2", values: [145, 118] },
            { label: "W3", values: [132, 108] },
            { label: "W4", values: [168, 140] },
            { label: "W5", values: [155, 128] },
            { label: "W6", values: [192, 162] },
            { label: "W7", values: [178, 150] },
            { label: "W8", values: [215, 185] },
          ]}
          colors={["black", "primary"]}
          height={140}
          showLegend={true}
          legendLabels={["Uploaded", "Processed"]}
        />
      </ChartCard>

      {/* Card 3: Regional coverage */}
      <ChartCard title="Regional Coverage" subtitle="% of target area served">
        <div className="flex flex-col gap-3 flex-1">
          <HBarChart
            data={[
              { label: "South Asia", value: 91, color: "primary" },
              { label: "Sub-Saharan Africa", value: 78, color: "black" },
              { label: "Latin America", value: 65, color: "blue" },
              { label: "Southeast Asia", value: 58, color: "success" },
              { label: "MENA", value: 44, color: "grey" },
              { label: "Europe", value: 32, color: "grey" },
            ]}
            unit="%"
            showValues={true}
          />
        </div>
      </ChartCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────────── */
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Clear results when search query is empty
  const showResults = hasSearched && searchQuery.trim().length > 0;
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSearching(false);
    }, 800);
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
  };
  
  return (
    <>
      <Navigation />
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
        <div className="container-max pt-24 pb-12 flex flex-col items-center gap-8 text-center relative z-10">
          <HeroTag label="New" text="AI agents now process volunteer uploads in real-time" />
          <h1 className="text-[clamp(44px,7vw,80px)] font-medium leading-[1.05em] tracking-[-0.03em] text-black">
            Smart resource
            <br />
            <Highlight>allocation</Highlight> for NGOs
          </h1>
          <p className="text-body-lg text-grey-1 max-w-md">
            Volunteers upload data. AI agents analyze it. NGOs get the insights they need to do more good.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl">
            <div className="flex items-center gap-2 bg-white border border-grey-3 rounded-xl p-2 shadow-sm focus-within:border-grey-2 transition-colors">
              <Search size={20} className="text-grey-2 shrink-0 ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for data (e.g., 'victims by region', 'age distribution')..."
                className="flex-1 text-base bg-transparent outline-none text-black placeholder:text-grey-2"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || isSearching}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? <Loader2 size={14} className="animate-spin" /> : "Search"}
              </button>
            </div>
          </form>
          
          {/* Search Results */}
          {showResults && !isSearching && (
            <div className="w-full">
              <SearchResults query={searchQuery} />
              <button
                onClick={handleClearSearch}
                className="mt-6 text-sm text-grey-1 hover:text-black underline"
              >
                Clear search
              </button>
            </div>
          )}
          
          {/* Original CTA buttons (hidden when showing results) */}
          {!showResults && (
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="px-5 py-2.5 border border-grey-3 text-black text-sm font-medium rounded-xl hover:bg-grey-4 transition-colors">
                I&apos;m a Volunteer
              </Link>
              <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">
                I represent an NGO <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
        {!showResults && (
          <div className="container-max pb-24 relative z-10">
            <HeroDashboard />
          </div>
        )}
      </section>

      {/* ══ LOGO TICKER ══ */}
      <section className="py-8 border-y border-grey-3 bg-white">
        <p className="text-center text-xs text-grey-1 mb-6">Trusted by 134 NGOs across 6 regions</p>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[
              "UNICEF","Save The Children","Oxfam","Red Cross","CARE","MSF","WFP","IRC",
              "UNICEF","Save The Children","Oxfam","Red Cross","CARE","MSF","WFP","IRC",
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-2 px-10 text-sm font-medium text-grey-1 whitespace-nowrap">
                <div className="w-4 h-4 border border-grey-3 rounded" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EVERYTHING IN ONE PLATFORM ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M8 20c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12S8 26.627 8 20z" stroke="#B3BDBD" strokeWidth="1.5"/>
              <path d="M14 20h12M20 14v12" stroke="#B3BDBD" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <h2 className="text-[clamp(32px,5vw,52px)] font-medium leading-tight tracking-tight text-black">
              All your NGO data,
              <br />
              all in <Highlight>one place</Highlight>
            </h2>
            <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">
              Request access <ArrowRight size={14} />
            </Link>
          </div>
          <AnalyticsTabsUI />
        </div>
      </section>

      {/* ══ LIVE FEED + EMPOWERING ══ */}
      <section className="py-24 bg-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Lime panel with live feed */}
          <div className="bg-primary rounded-2xl p-6">
            <LiveFeedPanel />
          </div>

          {/* Right: heading + 4 spark stats */}
          <div className="flex flex-col gap-8 lg:pt-4">
            <div className="flex flex-col gap-3">
              <p className="text-sub font-medium uppercase tracking-widest text-grey-1">real-time processing</p>
              <h2 className="text-[clamp(28px,4vw,42px)] font-medium leading-tight tracking-tight text-black">
                Empowering your data pipeline
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SparkStat value="2,847" label="Active volunteers" sparkValues={[40,55,48,70,63,81,74,90,88,102,97,118]} sparkColor="primary" delta="12% vs last month" deltaUp={true} />
              <SparkStat value="8,490" label="AI insights generated" sparkValues={[100,140,120,180,160,210,190,240,230,280,260,310]} sparkColor="black" delta="31% vs last month" deltaUp={true} />
              <SparkStat value="134" label="NGOs onboarded" sparkValues={[20,25,22,30,28,35,32,40,38,45,43,50]} sparkColor="blue" delta="8% vs last month" deltaUp={true} />
              <SparkStat value="98.2%" label="Data processing accuracy" sparkValues={[95,96,95,97,96,98,97,99,98,99,98,99]} sparkColor="success" delta="0.4pts improvement" deltaUp={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ HEATMAP + 4 ICONS ══ */}
      <section className="py-24 bg-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: eyebrow + heading + 4 icon cards */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-sub font-medium uppercase tracking-widest text-grey-1">insight at every level</p>
              <h2 className="text-[clamp(28px,4vw,42px)] font-medium leading-tight tracking-tight text-black">
                Turning data into<br />real-world impact
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Upload, title: "Volunteer data uploads", desc: "Volunteers submit field reports, hours logged, and resource usage from anywhere." },
                { icon: Cpu, title: "AI agent processing", desc: "Sub-agents classify, clean, and analyze uploaded data within minutes." },
                { icon: BarChart3, title: "Impact reports", desc: "NGOs receive structured statistics, gap analyses, and resource recommendations." },
                { icon: Brain, title: "Intelligent matching", desc: "AI matches volunteer skills to NGO needs across regions automatically." },
              ].map((f) => (
                <div key={f.title} className="flex flex-col gap-2">
                  <f.icon size={20} className="text-grey-1" />
                  <p className="text-sm font-medium text-black">{f.title}</p>
                  <p className="text-xs text-grey-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Heatmap */}
          <ImpactHeatmap />
        </div>
      </section>

      {/* ══ LESS PAPERWORK → LESS FRICTION ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col items-center gap-8 text-center">
          <h2 className="text-[clamp(32px,5vw,60px)] font-medium leading-tight tracking-tight text-black">
            Less friction,
            <br />
            more <Highlight>real impact</Highlight>
          </h2>
          <p className="text-body text-grey-1 max-w-md">
            We connect seamlessly with the data sources your volunteers and NGOs already use.
          </p>
          <Link href="/solutions" className="flex items-center gap-1.5 text-sm font-medium text-black border border-grey-3 rounded-full px-4 py-2 hover:bg-grey-4 transition-colors">
            See all integrations <ArrowRight size={14} />
          </Link>

          {/* Mini stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-grey-3 rounded-2xl overflow-hidden w-full mt-4">
            {[
              { label: "Avg. time-to-insight", value: "4 min", change: "3× faster than manual", up: true },
              { label: "Data accuracy", value: "98.2%", change: "+0.4pts this quarter", up: true },
              { label: "Volunteer retention", value: "87%", change: "+11% YoY", up: true },
              { label: "NGO NPS score", value: "72", change: "Industry avg: 41", up: true },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1 p-6 bg-white">
                <MiniStat label={s.label} value={s.value} change={s.change} up={s.up} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAKE ACTIONABLE DECISIONS ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 30 Q20 10 30 20" stroke="#22242A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <path d="M26 16l4 4-4 4" stroke="#22242A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <h2 className="text-[clamp(28px,4vw,52px)] font-medium leading-tight tracking-tight text-black">
              Make actionable
              <br />
              <Highlight>decisions</Highlight> with data
            </h2>
            <p className="text-body text-grey-1 max-w-md">
              Our AI agents turn raw volunteer uploads into structured insights — so NGOs can act, not just report.
            </p>
          </div>
          <AiAnalysisViz />
          <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">
            See a live demo <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ══ A PLAN FOR EVERYONE ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-[clamp(32px,5vw,56px)] font-medium leading-tight tracking-tight text-black">
              A plan for anyone.
              <br />
              Anytime.
            </h2>
            <p className="text-body text-grey-1">We help your mission grow.</p>
          </div>
          <div className="border border-grey-3 rounded-2xl overflow-hidden">
            {[
              { label: "Volunteers", desc: "Upload field data, log hours, and see how your contributions are allocated." },
              { label: "Small NGOs", desc: "Access AI-generated impact reports and resource allocation dashboards." },
              { label: "Large NGOs & Networks", desc: "Get custom analytics, multi-region views, and dedicated AI agent pipelines." },
            ].map((plan, i, arr) => (
              <div
                key={plan.label}
                className={`flex items-center justify-between px-8 py-6 hover:bg-grey-4/50 transition-colors ${i < arr.length - 1 ? "border-b border-grey-3" : ""}`}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium text-black">{plan.label}</p>
                  <p className="text-sm text-grey-1">{plan.desc}</p>
                </div>
                <Link href="/pricing">
                  <ArrowUpRight size={20} className="text-grey-1 hover:text-black transition-colors" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BY THE NUMBERS ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col gap-10">
          <h2 className="text-[clamp(28px,4vw,44px)] font-medium leading-tight tracking-tight text-black max-w-sm">
            Poneglyph by the numbers
          </h2>
          <ByTheNumbers />
        </div>
      </section>

      {/* ══ CTA BANNER (LIGHT) ══ */}
      <section className="py-24 bg-white">
        <div className="container-max flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">automate with poneglyph</p>
          </div>
          <h2 className="text-[clamp(40px,6vw,72px)] font-medium leading-tight tracking-tight text-black">
            Start for free today.
          </h2>
          <div className="flex items-center gap-6 text-sm text-grey-1">
            {["Free for volunteers","14-day NGO trial","No credit card needed"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="#22242A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </span>
            ))}
          </div>
          <Link href="/contact" className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors">
            Get early access <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
