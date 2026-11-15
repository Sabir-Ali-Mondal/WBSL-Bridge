
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Database,
  Cpu,
  Activity,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Models Registry", href: "/admin/models", icon: Cpu },
  { label: "Training Data", href: "/admin/training-data", icon: Database },
  { label: "Avatar Data Simulation", href: "/admin/videos", icon: Activity },
  { label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        relative flex h-[38vh] w-full shrink-0 flex-col
        overflow-hidden
        border-b border-[#263449]
        bg-[#080F1C]
        md:h-full md:w-60
        md:border-b-0 md:border-r
      "
    >
      {/* Header */}

      <div
        className="
          flex shrink-0 items-center
          border-b border-[#263449]
          px-4 py-4
        "
      >
        <div className="min-w-0">
          <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">
            Workspace
          </div>

          <div className="text-sm font-semibold tracking-tight text-[#F1F5F9]">
            Admin Console
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav
        aria-label="Admin navigation"
        className="
          min-h-0 flex-1 space-y-1
          overflow-y-auto overscroll-contain
          px-3 py-4
        "
      >
        <div className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#64748B]">
          Management
        </div>

        {links.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`
                group relative flex min-h-10
                items-center gap-3 rounded-lg
                border px-3 py-2
                text-xs font-medium
                transition-all duration-200

                ${
                  isActive
                    ? `
                      border-[#34D399]/20
                      bg-gradient-to-r
                      from-[#34D399]/[0.14]
                      to-[#22D3EE]/[0.05]
                      text-[#F1F5F9]
                    `
                    : `
                      border-transparent
                      text-[#94A3B8]
                      hover:border-[#263449]
                      hover:bg-[#111E30]
                      hover:text-[#F1F5F9]
                    `
                }
              `}
            >
              {isActive && (
                <span
                  className="
                    absolute -left-[13px]
                    h-5 w-[3px] rounded-r-full
                    bg-[#34D399]
                    shadow-[0_0_8px_rgba(52,211,153,0.4)]
                  "
                />
              )}

              <Icon
                size={17}
                strokeWidth={1.8}
                className={`
                  shrink-0 transition-colors duration-200
                  ${
                    isActive
                      ? "text-[#34D399]"
                      : "text-[#64748B] group-hover:text-[#94A3B8]"
                  }
                `}
                aria-hidden="true"
              />

              <span
                className={`
                  min-w-0 truncate
                  ${
                    isActive
                      ? "font-semibold text-[#F1F5F9]"
                      : "text-[#94A3B8] group-hover:text-[#F1F5F9]"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Back to Public Portal */}

      <div className="shrink-0 border-t border-[#263449] p-3">
        <Link
          href="/"
          className="
            group flex min-h-10 w-full
            items-center gap-3
            rounded-lg border border-transparent
            px-3 py-2
            text-xs font-medium text-[#94A3B8]
            transition-all duration-200
            hover:border-[#263449]
            hover:bg-[#111E30]
            hover:text-[#F1F5F9]
          "
          title="Back to Public Portal"
        >
          <ArrowLeft
            size={17}
            strokeWidth={1.8}
            className="
              shrink-0 text-[#64748B]
              transition-colors duration-200
              group-hover:text-[#94A3B8]
            "
          />

          <span>Back to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
}
