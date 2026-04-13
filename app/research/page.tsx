"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Bot, Loader2 } from "lucide-react";
import Link from "next/link";
import { ChatSidebar } from "@/components/chat-sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  charts?: ChartData[];
  sources?: { title: string; url: string }[];
}

interface ChartData {
  type: "bar" | "donut" | "area";
  title: string;
  data: { name: string; value: number; color?: string }[];
}

const mockResponses: Record<string, { answer: string; charts: ChartData[] }> = {
  "volunteer trends": {
    answer: "Based on available data, volunteer engagement has grown 34% year-over-year. South Asia leads with 42% of total volunteers, followed by Sub-Saharan Africa (28%) and Latin America (15%). The top skills requested are healthcare (23%), education (19%), and disaster response (16%).",
    charts: [
      {
        type: "bar",
        title: "Volunteers by Region",
        data: [
          { name: "South Asia", value: 42, color: "#22242A" },
          { name: "Sub-Saharan Africa", value: 28, color: "#bfff00" },
          { name: "Latin America", value: 15, color: "#25C5FA" },
          { name: "Southeast Asia", value: 9, color: "#B3BDBD" },
          { name: "Other", value: 6, color: "#E5E6E6" },
        ],
      },
      {
        type: "donut",
        title: "Skills Distribution",
        data: [
          { name: "Healthcare", value: 23, color: "#22242A" },
          { name: "Education", value: 19, color: "#bfff00" },
          { name: "Disaster Response", value: 16, color: "#25C5FA" },
          { name: "Community Dev", value: 14, color: "#37955B" },
          { name: "Other", value: 28, color: "#B3BDBD" },
        ],
      },
    ],
  },
  "ngo growth": {
    answer: "The humanitarian sector has seen significant growth. NGOs using Poneglyph increased by 156% in 2024. The average NGO onboarded 47 volunteers in their first month. Large networks showed 89% retention after 6 months.",
    charts: [
      {
        type: "area",
        title: "NGO Growth (2024)",
        data: [
          { name: "Jan", value: 12 },
          { name: "Feb", value: 18 },
          { name: "Mar", value: 25 },
          { name: "Apr", value: 31 },
          { name: "May", value: 38 },
          { name: "Jun", value: 45 },
          { name: "Jul", value: 52 },
          { name: "Aug", value: 58 },
          { name: "Sep", value: 65 },
          { name: "Oct", value: 72 },
          { name: "Nov", value: 78 },
          { name: "Dec", value: 85 },
        ],
      },
    ],
  },
  "impact": {
    answer: "Poneglyph volunteers contributed 2.4M hours in 2024. Top impact areas: disaster response (890k hours), healthcare programs (620k hours), and education initiatives (480k hours).",
    charts: [
      {
        type: "bar",
        title: "Impact by Program Type",
        data: [
          { name: "Disaster Response", value: 890, color: "#22242A" },
          { name: "Healthcare", value: 620, color: "#bfff00" },
          { name: "Education", value: 480, color: "#25C5FA" },
          { name: "Community", value: 340, color: "#37955B" },
          { name: "Other", value: 170, color: "#B3BDBD" },
        ],
      },
    ],
  },
};

const COLORS = ["#22242A", "#bfff00", "#25C5FA", "#37955B", "#B3BDBD", "#E5E6E6"];

function CustomBarChart({ data, title }: { data: ChartData["data"]; title: string }) {
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-grey-1 mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={60} 
            tick={{ fontSize: 9, fill: "#415762" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E6E6", borderRadius: "8px", fontSize: "11px" }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomDonutChart({ data, title }: { data: ChartData["data"]; title: string }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-xs font-medium text-grey-1 mb-2 self-start">{title}</p>
      <ResponsiveContainer width="100%" height={100}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E6E6", borderRadius: "8px", fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-1 justify-center">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1 text-[9px]">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }} />
            <span className="text-grey-1">{item.name}</span>
            <span className="font-medium text-black">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomAreaChart({ data, title }: { data: ChartData["data"]; title: string }) {
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-grey-1 mb-2">{title}</p>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bfff00" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#bfff00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#B3BDBD" }} dy={3} />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E6E6", borderRadius: "8px", fontSize: "11px" }} />
          <Area type="monotone" dataKey="value" stroke="#22242A" strokeWidth={1.5} fillOpacity={1} fill="url(#colorValue)" dot={{ fill: "#22242A", strokeWidth: 0, r: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    setTimeout(() => {
      let responseKey = "impact";
      const q = query.toLowerCase();
      if (q.includes("region") || q.includes("volunteer") || q.includes("skill")) {
        responseKey = "volunteer trends";
      } else if (q.includes("growth") || q.includes("ngo") || q.includes("increase")) {
        responseKey = "ngo growth";
      }

      const mock = mockResponses[responseKey] || mockResponses.impact;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mock.answer,
        charts: mock.charts,
        sources: [{ title: "Poneglyph 2024 Report", url: "#" }],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen">
        <ChatSidebar />
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="w-6 h-6 border-2 border-grey-3 border-t-black rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-14 px-6 flex items-center border-b border-grey-3 shrink-0">
          <h1 className="text-base font-medium text-black">
            Ask anything about <span style={{ color: "#bfff00" }}>volunteer data</span>
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-2xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot size={28} className="text-grey-1 mb-3" />
                <p className="text-sm font-medium text-black mb-1">How can I help you research?</p>
                <p className="text-xs text-grey-1 mb-4">Try asking about volunteer trends or impact metrics</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === "user" && (
                      <div className="flex justify-end">
                        <div className="max-w-[80%] px-3 py-2 bg-black text-white rounded-2xl rounded-br-sm">
                          <p className="text-xs">{message.content}</p>
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: "#bfff00" }}>
                            <Bot size={12} className="text-black" />
                          </div>
                          <p className="text-xs text-black leading-relaxed">{message.content}</p>
                        </div>

                        {message.charts && message.charts.length > 0 && (
                          <div className="grid grid-cols-1 gap-3 ml-8">
                            {message.charts.map((chart, i) => (
                              <div key={i} className="p-3 bg-grey-4 rounded-lg">
                                {chart.type === "bar" && <CustomBarChart data={chart.data} title={chart.title} />}
                                {chart.type === "donut" && <CustomDonutChart data={chart.data} title={chart.title} />}
                                {chart.type === "area" && <CustomAreaChart data={chart.data} title={chart.title} />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-1 ml-8">
                    <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-pulse" />
                    <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 bg-grey-2 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-grey-3 shrink-0">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-2 bg-white border border-grey-3 rounded-lg p-2 focus-within:border-grey-2 transition-colors shadow-sm">
                <Search size={16} className="text-grey-2 shrink-0 ml-1" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about volunteer trends..."
                  className="flex-1 text-sm bg-transparent outline-none text-black placeholder:text-grey-2"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="p-1.5 bg-black text-white rounded hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}