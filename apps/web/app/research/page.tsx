"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Send, Loader2 } from "lucide-react";
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

function ResearchNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-grey-3">
      <div className="px-6">
        <div className="flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-onest font-semibold text-black text-base"
          >
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white" />
                <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white" />
                <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white" />
              </svg>
            </div>
            Poneglyph
          </Link>
        </div>
      </div>
    </header>
  );
}

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

const COLORS = ["#22242A", "#bfff00", "#25C5FA", "#37955B", "#B3BDBD", "#E5E6E6"];

function CustomBarChart({ data, title }: { data: ChartData["data"]; title: string }) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-grey-1 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={90} 
            tick={{ fontSize: 12, fill: "#415762" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E6E6", borderRadius: "8px", fontSize: "12px" }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22} activeBar={false}>
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
      <p className="text-sm font-medium text-grey-1 mb-3 self-start">{title}</p>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={65}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E6E6", borderRadius: "8px", fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }} />
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
      <p className="text-sm font-medium text-grey-1 mb-3">{title}</p>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bfff00" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#bfff00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#B3BDBD" }} dy={5} />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E6E6", borderRadius: "8px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="value" stroke="#22242A" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" dot={{ fill: "#22242A", strokeWidth: 0, r: 4 }} isAnimationActive={false} />
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

    try {
      const response = await fetch(`http://localhost:3001/api/query?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        charts: data.charts,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't fetch the data. Please make sure the API server is running.",
        charts: [],
        sources: [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <>
        <ResearchNav />
        <div className="flex h-[calc(100vh-56px)]">
          <ChatSidebar />
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="w-6 h-6 border-2 border-grey-3 border-t-black rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <ResearchNav />
      <div className="flex h-[calc(100vh-56px)]">
        <ChatSidebar />
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="max-w-2xl mx-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="text-[clamp(36px,6vw,56px)] font-medium leading-tight tracking-tight text-black mb-6">
                    Ask anything about <span style={{ color: "#bfff00" }}>human trafficking data</span>
                  </h2>
                  <p className="text-base text-grey-1 mb-10 max-w-lg">
                    Query our database of 156,000+ victim records, 189 countries, and CTDC global data on trafficking patterns.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center max-w-xl">
                    {["Victims by region", "Exploitation types", "Children trafficked", "Top countries of origin"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="px-5 py-3 text-sm text-black bg-grey-4 border border-grey-3 rounded-full hover:border-grey-2 hover:bg-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.role === "user" && (
                        <div className="flex justify-end">
                          <div className="max-w-[80%] px-4 py-3 bg-black text-white rounded-2xl rounded-br-sm">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      )}

                      {message.role === "assistant" && (
                        <div className="flex flex-col gap-4">
                          <p className="text-base text-black leading-relaxed">{message.content}</p>

                          {message.charts && message.charts.length > 0 && (
                            <div className="grid grid-cols-1 gap-4">
                              {message.charts.map((chart, i) => (
                                <div key={i} className="p-5 bg-grey-4 rounded-lg">
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

          <div className="px-6 py-4 border-t border-grey-3 shrink-0">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-3 bg-white border border-grey-3 rounded-lg p-3 focus-within:border-grey-2 transition-colors shadow-sm">
                  <Search size={18} className="text-grey-2 shrink-0 ml-1" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about trafficking data..."
                    className="flex-1 text-base bg-transparent outline-none text-black placeholder:text-grey-2"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="p-2 bg-black text-white rounded hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}