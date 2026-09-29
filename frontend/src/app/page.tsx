"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Video,
  FileText,
  Sparkles,
  Volume2,
  Users,
  HelpCircle,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <main className="relative h-[calc(100dvh-68px)] min-h-[560px] w-full overflow-hidden bg-background">
      {/* =====================================================
          BACKGROUND
         ===================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className="
            bg-video-premium-blur
            absolute
            inset-0
            h-full
            w-full
            select-none
            object-cover
            opacity-[0.75]
          "
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Legibility */}
        <div className="absolute inset-0 bg-background/35" />

        {/* Brand wash */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-emerald-500/[0.04]
            via-background/20
            to-background/60
          "
        />

        {/* Vignette */}
        <div
          className="
            absolute
            inset-0
            [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,11,0.72)_100%)]
          "
        />

        {/* Grain */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            mix-blend-overlay
            [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]
          "
        />

        {/* Main glow */}
        <div
          className="
            absolute
            left-1/2
            top-[-10%]
            h-[45vh]
            w-[70vw]
            -translate-x-1/2
            rounded-full
            bg-emerald-400/[0.07]
            blur-[120px]
          "
        />

        {/* Left glow */}
        <div
          className="
            absolute
            left-[-15%]
            top-[45%]
            h-[35vh]
            w-[35vw]
            rounded-full
            bg-accent-secondary/[0.06]
            blur-[120px]
          "
        />

        {/* Right glow */}
        <div
          className="
            absolute
            right-[-15%]
            top-[45%]
            h-[35vh]
            w-[35vw]
            rounded-full
            bg-emerald-500/[0.06]
            blur-[120px]
          "
        />

        {/* Grid */}
        <div
          className="
            canvas-grid-bg
            absolute
            inset-0
            opacity-[0.09]
            [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]
          "
        />

        {/* Bottom fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[25%]
            bg-gradient-to-t
            from-background
            via-background/70
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
         ===================================================== */}
      <PageContainer className="relative z-10 h-full w-full">
        <div
          className="
            flex
            h-full
            w-full
            flex-col
            justify-center
            py-5
            sm:py-6
            lg:py-8
          "
        >
          {/* =================================================
              DESKTOP / RESPONSIVE HERO
             ================================================= */}
          <div
            className="
              grid
              w-full
              items-center
              gap-6
              lg:grid-cols-[1fr_1fr]
              lg:gap-10
              xl:grid-cols-[1.05fr_0.95fr]
              xl:gap-12
            "
          >
            {/* =================================================
                LEFT — LOGO
               ================================================= */}
            <div
              className="
                relative
                flex
                h-[30vh]
                min-h-[190px]
                w-full
                items-center
                justify-center
                lg:h-[62vh]
                lg:min-h-[430px]
              "
            >
              {/* Logo glow */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[75%]
                  w-[75%]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-emerald-400/[0.035]
                  blur-[80px]
                "
              />

              <Image
                src="/WBSL%20Bridge%20logo.png"
                alt="WBSL Bridge"
                width={1300}
                height={700}
                priority
                className="
                  relative
                  z-10
                  block
                  h-full
                  w-auto
                  max-w-[92%]
                  object-contain
                  object-center
                  drop-shadow-[0_15px_55px_rgba(0,0,0,0.58)]
                "
                sizes="(min-width: 1024px) 48vw, 95vw"
              />
            </div>

            {/* =================================================
                RIGHT — CONTENT
               ================================================= */}
            <div
              className="
                flex
                w-full
                flex-col
                items-center
                text-center
                lg:items-start
                lg:text-left
              "
            >
              {/* Status */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-emerald-500/25
                  bg-surface/80
                  px-3
                  py-1
                  shadow-[0_0_25px_rgba(34,197,94,0.08)]
                  backdrop-blur-xl
                "
              >
                <Sparkles
                  size={12}
                  className="text-accent-primary"
                />

                <span
                  className="
                    font-mono
                    text-[9px]
                    font-semibold
                    text-accent-primary
                    sm:text-[10px]
                  "
                >
                  WBSL BRIDGE
                </span>

                <span className="text-[10px] text-text-muted">
                  /
                </span>

                <span className="text-[9px] text-text-secondary sm:text-[10px]">
                  Neural Sign Translation
                </span>
              </div>

              {/* Heading */}
              <div className="mt-4 sm:mt-5">
                <h1
                  className="
                    max-w-2xl
                    text-[2rem]
                    font-extrabold
                    leading-[1.06]
                    tracking-[-0.04em]
                    text-text-primary
                    sm:text-[2.4rem]
                    md:text-[2.8rem]
                    lg:text-[3rem]
                    xl:text-[3.35rem]
                  "
                >
                  A Sign Language
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-emerald-400
                      via-teal-300
                      to-indigo-400
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Bridge for Every Signer
                  </span>

                  <br />

                  <span className="text-text-primary">
                    in West Bengal
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-text-secondary
                  sm:text-[15px]
                "
              >
                Real-time sign language communication with Bengali
                translation, reverse sign synthesis, and community-driven
                vocabulary growth.
              </p>

              {/* =================================================
                  FEATURE ROW
                 ================================================= */}
              <div
                className="
                  mt-5
                  flex
                  w-full
                  max-w-[660px]
                  gap-2
                  overflow-visible
                "
              >
                <Feature
                  icon={<Video size={12} />}
                  text="Sign → Bengali"
                  color="primary"
                />

                <Feature
                  icon={<Volume2 size={12} />}
                  text="Bengali → Sign"
                  color="secondary"
                />

                <Feature
                  icon={<Users size={12} />}
                  text="Community Growth"
                  color="sky"
                />

                <Feature
                  icon={<HelpCircle size={12} />}
                  text="Unknown Signs"
                  color="unknown"
                />
              </div>

              {/* =================================================
                  ACTION BUTTONS
                 ================================================= */}
              <div
                className="
                  mt-6
                  flex
                  w-full
                  max-w-[660px]
                  flex-col
                  gap-2.5
                  sm:flex-row
                "
              >
                <Link
                  href="/sign-to-text"
                  className="
                    group
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-accent-primary
                    px-5
                    py-3
                    text-xs
                    font-semibold
                    text-black
                    shadow-[0_0_22px_rgba(34,197,94,0.22)]
                    transition-all
                    hover:bg-emerald-400
                    hover:shadow-[0_0_32px_rgba(34,197,94,0.4)]
                    active:scale-[0.98]
                    sm:text-sm
                  "
                >
                  <Video size={14} />

                  <span>
                    Launch Live Sign Monitor
                  </span>

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </Link>

                <Link
                  href="/text-to-sign"
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    bg-surface/70
                    px-5
                    py-3
                    text-xs
                    font-medium
                    text-text-primary
                    backdrop-blur-xl
                    transition-all
                    hover:border-text-secondary/40
                    hover:bg-surface-elevated
                    active:scale-[0.98]
                    sm:text-sm
                  "
                >
                  <FileText
                    size={14}
                    className="text-text-secondary"
                  />

                  <span>
                    Bengali → Sign Synthesis
                  </span>
                </Link>
              </div>

              {/* System status */}
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.16em]
                  text-text-muted
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-accent-primary
                    shadow-[0_0_8px_rgba(34,197,94,0.6)]
                  "
                />

                <span>
                  ISL or BdSL or WBSL or HomeSL? We support all!
                </span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

/* ============================================================
   FEATURE COMPONENT
   ============================================================ */

function Feature({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: "primary" | "secondary" | "sky" | "unknown";
}) {
  const styles = {
    primary: {
      icon: "bg-accent-primary/10 text-accent-primary",
      hover: "hover:border-accent-primary/40",
    },
    secondary: {
      icon: "bg-accent-secondary/10 text-accent-secondary",
      hover: "hover:border-accent-secondary/40",
    },
    sky: {
      icon: "bg-sky-500/10 text-sky-400",
      hover: "hover:border-sky-500/40",
    },
    unknown: {
      icon: "bg-status-unknown/10 text-status-unknown",
      hover: "hover:border-status-unknown/40",
    },
  };

  return (
    <div
      className={`
        flex
        min-w-[145px]
        flex-1
        items-center
        justify-center
        gap-1.5
        rounded-md
        border
        border-border
        bg-surface/70
        px-2.5
        py-2
        backdrop-blur-xl
        transition-colors
        ${styles[color].hover}
      `}
    >
      <div
        className={`
          shrink-0
          rounded
          p-1
          ${styles[color].icon}
        `}
      >
        {icon}
      </div>

      <span
        className="
          whitespace-nowrap
          text-[10px]
          font-medium
          text-text-primary
        "
      >
        {text}
      </span>
    </div>
  );
}