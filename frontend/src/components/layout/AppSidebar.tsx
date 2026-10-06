"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
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
  "/contribute": Heart,
  "/about": Info,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <aside
      className={`sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border bg-background/95 py-4 backdrop-blur-xl transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <Link
        href="/"
        aria-label={APP_CONFIG.name}
        title={collapsed ? APP_CONFIG.name : undefined}
        className={`mb-5 flex h-11 items-center ${
          collapsed ? "justify-center" : "gap-3 px-4"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-accent-primary/30 bg-surface">
          <Image
            src="/WBSL%20Bridge%20logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-full w-full object-contain"
          />
        </span>
        {!collapsed && (
          <span className="truncate text-xs font-bold tracking-wide text-text-primary">
            {APP_CONFIG.name}
          </span>
        )}
      </Link>

      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2"
      >
        {NAVIGATION_LINKS.map((link) => {
          const Icon = navigationIcons[link.href];
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              aria-label={link.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex h-11 items-center rounded-lg transition-colors ${
                collapsed ? "justify-center" : "gap-3 px-3"
              } ${
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {!collapsed && (
                <span className="truncate text-sm font-medium">
                  {link.label}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 h-6 w-0.5 rounded-r bg-accent-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-2 px-2">
        <div className="border-t border-border pt-3">
          <Link
            href="/admin"
            title={collapsed ? "Admin Workspace" : undefined}
            aria-label="Admin Workspace"
            className={`flex h-11 items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary ${
              collapsed ? "justify-center" : "gap-3 px-3"
            }`}
          >
            <Shield size={18} aria-hidden="true" />
            {!collapsed && (
              <span className="truncate text-sm font-medium">
                Admin Workspace
              </span>
            )}
          </Link>
        </div>

        {!collapsed && (
          <div className="border-t border-border pt-3">
            <SystemDiagnostics compact />
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-11 w-full items-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary ${
            collapsed ? "justify-center" : "justify-between px-3"
          }`}
        >
          {!collapsed && <span className="text-xs">Collapse menu</span>}
          {collapsed ? (
            <ChevronRight size={18} aria-hidden="true" />
          ) : (
            <ChevronLeft size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
}