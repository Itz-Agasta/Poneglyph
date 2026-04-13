import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Plus, MessageSquare } from "lucide-react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Research — Poneglyph",
  description: "AI-powered research assistant for volunteer and NGO data",
};

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

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-onest antialiased">
        <ResearchNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
