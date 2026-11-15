
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Languages,
  Shield,
  Video,
  type LucideIcon,
} from "lucide-react";

import { NAVIGATION_LINKS, APP_CONFIG } from "@/lib/constants";
import { SystemDiagnostics } from "./SystemDiagnostics";

const navigationIcons: Record<string, LucideIcon> = {
  "/text-to-sign": Languages,
  "/sign-to-text": Video,
  "/about": Info,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <aside
      className={`
        sticky top-0 z-40 flex h-screen shrink-0 flex-col
        border-r border-white/[0.07]
        bg-[#050a12]
        py-3
        backdrop-blur-2xl
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-14" : "w-52"}
      `}
    >
      {/* =====================================
          BRAND / LOGO
      ====================================== */}

      <div
        className={`
          relative mb-8 flex shrink-0 items-center
          ${collapsed ? "justify-center" : "px-3"}
        `}
      >
        <Link
          href="/"
          aria-label={APP_CONFIG.name}
          title={collapsed ? APP_CONFIG.name : undefined}
          className={`
            group flex min-w-0 items-center
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* Logo container */}

          <span
            className="
              relative flex h-10 w-10 shrink-0
              items-center justify-center
              overflow-hidden rounded-xl
              border border-white/[0.08]
              bg-gradient-to-br
              from-white/[0.055]
              to-white/[0.015]
              transition-all duration-300
              group-hover:border-white/[0.16]
              group-hover:bg-white/[0.04]
              group-hover:shadow-[0_0_14px_rgba(255,255,255,0.04)]
            "
          >
            <span
              className="
                pointer-events-none absolute inset-1
                rounded-full bg-cyan-400/[0.06]
                blur-md opacity-50
                transition-opacity duration-300
                group-hover:opacity-80
              "
            />

            <Image
              src="/WBSL%20Bridge%20logo.png"
              alt=""
              width={38}
              height={38}
              priority
              className="
                relative z-10 h-[34px] w-[34px]
                object-contain
                transition-transform duration-300
                group-hover:scale-105
              "
            />
          </span>

          {/* Expanded branding */}

          {!collapsed && (
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-[12px] font-bold tracking-wide text-white">
                {APP_CONFIG.name}
              </span>

              <span className="truncate text-[9px] font-medium uppercase tracking-[0.13em] text-slate-500">
                Sign Language Bridge
              </span>
            </span>
          )}
        </Link>
      </div>

      {/* =====================================
          MAIN NAVIGATION
      ====================================== */}

      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-2"
      >
        {NAVIGATION_LINKS.map((link) => {
          const Icon = navigationIcons[link.href];

          if (!Icon) return null;

          const isActive =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              aria-label={link.label}
              aria-current={isActive ? "page" : undefined}
              className={`
                group relative flex h-10
                items-center rounded-lg
                border transition-all duration-200

                ${collapsed ? "justify-center" : "gap-2.5 px-3"}

                ${
                  isActive
                    ? `
                      border-emerald-400/[0.12]
                      bg-gradient-to-r
                      from-emerald-400/[0.12]
                      to-cyan-400/[0.04]
                      text-emerald-300
                    `
                    : `
                      border-transparent
                      text-slate-400
                      hover:border-white/[0.05]
                      hover:bg-white/[0.04]
                      hover:text-slate-100
                    `
                }
              `}
            >
              {/* Active indicator */}

              {isActive && (
                <span
                  className="
                    absolute -left-[9px]
                    h-5 w-[3px]
                    rounded-r-full
                    bg-emerald-400
                    shadow-[0_0_10px_rgba(52,211,153,0.5)]
                  "
                />
              )}

              <Icon
                size={18}
                strokeWidth={1.8}
                className={`
                  shrink-0 transition-colors duration-200
                  ${
                    isActive
                      ? "text-emerald-300"
                      : "text-slate-400 group-hover:text-slate-200"
                  }
                `}
                aria-hidden="true"
              />

              {!collapsed && (
                <span
                  className={`
                    truncate text-[12px] font-medium
                    ${
                      isActive
                        ? "text-emerald-200"
                        : "text-slate-300 group-hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* =====================================
          BOTTOM SECTION
      ====================================== */}

      <div className="shrink-0 space-y-1.5 px-2">

        <div className="border-t border-white/[0.07] pt-2">

          {/* Admin Workspace */}

          <Link
            href="/admin"
            title={collapsed ? "Admin Workspace" : undefined}
            aria-label="Admin Workspace"
            className={`
              group flex h-10 items-center
              rounded-lg border border-transparent
              text-slate-400
              transition-all duration-200

              hover:border-white/[0.05]
              hover:bg-white/[0.04]
              hover:text-slate-200

              ${collapsed ? "justify-center" : "gap-2.5 px-3"}
            `}
          >
            <Shield
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {!collapsed && (
              <span className="truncate text-xs font-medium">
                Admin Workspace
              </span>
            )}
          </Link>
        </div>

        {/* System Diagnostics */}

        {!collapsed && (
          <div
            className="
              rounded-lg
              border border-white/[0.06]
              bg-white/[0.025]
              p-2
            "
          >
            <SystemDiagnostics compact />
          </div>
        )}

        {/* =====================================
            COLLAPSE CONTROL
        ====================================== */}

        <div className="border-t border-white/[0.07] pt-2">

          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-expanded={!collapsed}
            title={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className={`
              group flex h-9 w-full
              items-center rounded-lg
              text-slate-500
              transition-all duration-200

              hover:bg-white/[0.04]
              hover:text-slate-200

              ${collapsed ? "justify-center" : "justify-between px-3"}
            `}
          >
            {!collapsed && (
              <span className="text-xs font-medium">
                Collapse
              </span>
            )}

            {collapsed ? (
              <ChevronRight size={17} strokeWidth={1.8} />
            ) : (
              <ChevronLeft size={17} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
