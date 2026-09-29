"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Database,
  Cpu,
  Video,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
  { label: "Signs Catalog", href: "/admin/signs", icon: BookOpen },
  { label: "Dataset Explorer", href: "/admin/dataset", icon: Database },
  { label: "Models Registry", href: "/admin/models", icon: Cpu },
  { label: "Video Inspector", href: "/admin/videos", icon: Video },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
            WORKSPACE
          </div>
          <div className="text-sm font-semibold text-text-primary">
            Admin Console
          </div>
        </div>
        <Link
          href="/"
          className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors"
          title="Back to Public Portal"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-surface-elevated text-accent-primary font-semibold border-l-2 border-accent-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border text-[11px] font-mono text-text-muted">
        <div>ROLE: Lead Researcher</div>
        <div>ENV: Production Local</div>
      </div>
    </aside>
  );
}
