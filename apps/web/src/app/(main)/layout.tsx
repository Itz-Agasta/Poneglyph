"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@Poneglyph/ui/lib/utils";
import "./layout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isResearch = pathname.startsWith("/research");

  return (
    <div className={cn("dashboard-container", isResearch && "no-sidebar")}>
      {!isResearch && <Sidebar />}
      <main
        className={cn(
          "dashboard-main min-h-screen overflow-y-auto",
          isResearch && "research-layout",
        )}
      >
        {children}
      </main>
    </div>
  );
}
