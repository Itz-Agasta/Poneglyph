"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconFileText,
  IconClipboardList,
  IconDatabase,
  IconSearch,
  IconFolder,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@Poneglyph/ui/lib/utils";

interface SidebarProps {
  userName: string;
  userPlan: string;
}

export function Sidebar({ userName, userPlan }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
    { label: "Reports", href: "/reports", icon: IconFileText },
    { label: "Surveys", href: "/surveys", icon: IconClipboardList },
    { label: "Datasets", href: "/datasets", icon: IconDatabase },
    { label: "Research", href: "/research", icon: IconSearch },
    { label: "Spaces", href: "/spaces", icon: IconFolder },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="brand">
        <div className="brand-mark">P</div>
        <div className="brand-name">Poneglyph</div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="nav-item"
              data-active={isActive ? "true" : "false"}
            >
              <item.icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="nav-label">Workspace</div>
      <Link
        href="/settings"
        className="nav-item"
        data-active={pathname === "/settings" ? "true" : "false"}
      >
        <IconSettings />
        Settings
      </Link>

      <div className="sidebar-footer">
        <div className="avatar">{userName.charAt(0)}</div>
        <div className="flex flex-col">
          <div className="user-name">{userName}</div>
          <div className="user-plan">{userPlan}</div>
        </div>
      </div>
    </aside>
  );
}
