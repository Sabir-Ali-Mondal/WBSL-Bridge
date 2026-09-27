"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Shield,
  Activity,
} from "lucide-react";
import { NAVIGATION_LINKS, APP_CONFIG } from "@/lib/constants";
import { SystemDiagnostics } from "./SystemDiagnostics";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[68px] flex items-center">

          {/* ================= BRAND ================= */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-md bg-surface border border-emerald-500/40 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-400">
              <Image
                src="/WBSL%20Bridge%20logo.png"
                alt="WBSL Bridge logo"
                width={32}
                height={32}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            <span className="text-[15px] font-bold tracking-tight text-text-primary whitespace-nowrap">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center ml-10 gap-1">

            {NAVIGATION_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative
                    px-3.5
                    py-2
                    rounded-md
                    text-[13px]
                    font-medium
                    whitespace-nowrap
                    transition-all
                    ${
                      isActive
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  {link.label}

                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="hidden md:flex items-center gap-3 ml-auto">

            {/* Admin */}
            <Link
              href="/admin"
              title="Admin Workspace"
              aria-label="Admin Workspace"
              className="
                w-8 h-8
                rounded-md
                border border-border
                flex items-center justify-center
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface-elevated
                hover:border-border
                transition-all
              "
            >
              <Shield size={15} />
            </Link>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden ml-auto flex items-center gap-1">

            <Link
              href="/admin"
              aria-label="Admin"
              className="
                w-9 h-9
                rounded-md
                flex items-center justify-center
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface
              "
            >
              <Shield size={17} />
            </Link>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="
                w-9 h-9
                rounded-md
                flex items-center justify-center
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface
              "
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">

            {NAVIGATION_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={`
                    flex items-center justify-between
                    px-3 py-3
                    rounded-md
                    text-sm
                    ${
                      isActive
                        ? "bg-surface-elevated text-text-primary"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }
                  `}
                >
                  <span>{link.label}</span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}

            <div className="border-t border-border my-3" />

            <Link
              href="/admin"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="
                flex items-center gap-3
                px-3 py-3
                rounded-md
                text-sm
                text-text-secondary
                hover:bg-surface
                hover:text-text-primary
              "
            >
              <Shield size={16} />
              Admin Workspace
            </Link>

            {/* Detailed diagnostics belongs here */}
            <div className="pt-3 border-t border-border mt-3">
              <SystemDiagnostics />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}