"use client";

import React from "react";
import Link from "next/link";
import { Video, Volume2, Users, HelpCircle } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LogoShowcase } from "@/components/home/LogoShowcase";

/* ─────────────────────────────────────────────────────────────
   FLOAT3D — same floating / tilt / glare language as the About page
   ───────────────────────────────────────────────────────────── */
function Float3D({
  children,
  className = "",
  tilt = 7,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
}) {
  const tiltRef = React.useRef<HTMLDivElement>(null);
  const uid = React.useId();

  // deterministic stagger so every card floats out of phase (SSR-safe)
  const delay = React.useMemo(() => {
    let h = 0;
    for (const ch of uid) h = (h + ch.charCodeAt(0)) % 7;
    return `${-h * 0.9}s`;
  }, [uid]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * tilt).toFixed(2)}deg) rotateY(${(px * tilt).toFixed(2)}deg) translateZ(14px)`;
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    el.style.setProperty("--glare", "1");
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--glare", "0");
  };

  return (
    <div
      className={`home-float-scene min-w-0 ${className}`}
      style={{ animationDelay: delay }}
    >
      <div
        ref={tiltRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="home-float-card relative rounded-lg"
      >
        <div className="home-float-glare pointer-events-none absolute inset-0 z-10 rounded-lg" />
        {children}
      </div>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  color: "green" | "blue" | "sky" | "violet";
  status: "active" | "upcoming";
  href?: string;
};

const featureStyles = {
  green: {
    icon: "bg-emerald-400/10 text-emerald-400",
    border: "border-emerald-400/20 hover:border-emerald-400/40",
    dot: "bg-emerald-400",
  },
  blue: {
    icon: "bg-blue-400/10 text-blue-400",
    border: "border-blue-400/20 hover:border-blue-400/40",
    dot: "bg-blue-400",
  },
  sky: {
    icon: "bg-sky-400/10 text-sky-400",
    border: "border-white/[0.08] hover:border-white/20",
    dot: "bg-sky-400",
  },
  violet: {
    icon: "bg-violet-400/10 text-violet-400",
    border: "border-white/[0.08] hover:border-white/20",
    dot: "bg-violet-400",
  },
};

function FeatureCard({ icon, title, color, status, href }: FeatureCardProps) {
  const style = featureStyles[color];
  const isActive = status === "active";

  const base = `
    group flex min-h-[56px] min-w-0
    items-center gap-3
    rounded-lg border px-3 py-2.5
    backdrop-blur-sm
    transition-colors duration-200
    ${style.border}
    ${isActive ? "bg-white/[0.045]" : "bg-white/[0.02]"}
  `;

  const inner = (
    <>
      {/* Icon */}
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center
          justify-center rounded-md
          ${style.icon}
        `}
      >
        {icon}
      </div>

      {/* Title */}
      <span
        className={`
          min-w-0 flex-1 truncate text-[13px] font-semibold
          ${isActive ? "text-slate-100" : "text-slate-400"}
        `}
      >
        {title}
      </span>

      {/* Status */}
      {isActive ? (
        <span className="shrink-0 text-[12px] font-medium text-slate-400 transition-colors group-hover:text-white">
          Try it
        </span>
      ) : (
        <span
          className="
            shrink-0 rounded border border-white/10
            px-1.5 py-0.5 text-[10px]
            font-medium text-slate-400
          "
        >
          Coming soon
        </span>
      )}
    </>
  );

  if (isActive && href) {
    return (
      <Float3D>
        <Link
          href={href}
          className={`${base} hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40`}
        >
          {inner}
        </Link>
      </Float3D>
    );
  }

  return (
    <Float3D>
      <div className={base}>{inner}</div>
    </Float3D>
  );
}

export default function HomePage() {
  return (
    <main
      className="
        relative min-h-[calc(100dvh-68px)]
        w-full overflow-hidden bg-background
        lg:h-[calc(100dvh-68px)]
      "
    >
      {/* ─── 3D FLOATING EFFECT STYLES (same as About) ─── */}
      <style>{`
        .home-float-scene {
          perspective: 1000px;
          animation: home-fs-float 7s ease-in-out infinite;
          will-change: transform;
        }
        .home-float-card {
          transform-style: preserve-3d;
          transition: transform 0.25s ease-out, box-shadow 0.35s ease;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 8px 20px -8px rgba(0,0,0,0.55),
            0 22px 44px -18px rgba(0,0,0,0.6),
            0 0 34px -18px rgba(52,211,153,0.25);
        }
        .home-float-card:hover {
          box-shadow:
            0 1px 0 rgba(255,255,255,0.1) inset,
            0 14px 28px -10px rgba(0,0,0,0.6),
            0 38px 70px -22px rgba(0,0,0,0.7),
            0 0 50px -15px rgba(52,211,153,0.35);
        }
        .home-float-glare {
          opacity: var(--glare, 0);
          transition: opacity 0.3s ease;
          background: radial-gradient(
            300px circle at var(--gx, 50%) var(--gy, 50%),
            rgba(255,255,255,0.08),
            transparent 60%
          );
        }
        @keyframes home-fs-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-float-scene { animation: none; }
          .home-float-card, .home-float-card * { transition: none !important; }
        }
      `}</style>

      {/* Background */}
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
            absolute inset-0 h-full w-full
            select-none object-cover
            opacity-[0.6]
          "
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#05090d]/55" />

        {/* Vignette */}
        <div
          className="
            absolute inset-0
            [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(3,7,10,0.65)_100%)]
          "
        />

        {/* Bottom fade */}
        <div
          className="
            absolute inset-x-0 bottom-0 h-[18%]
            bg-gradient-to-t
            from-background/90 to-transparent
          "
        />
      </div>

      {/* Content */}
      <PageContainer className="relative z-10 h-full w-full">
        <div
          className="
            flex min-h-[calc(100dvh-68px)]
            w-full flex-col justify-center
            py-10 sm:py-12
            lg:min-h-0 lg:h-full
            lg:py-8
          "
        >
          <div
            className="
              grid w-full min-w-0 items-center
              gap-8
              lg:grid-cols-[1.05fr_0.95fr]
              lg:gap-10
              xl:grid-cols-[1.08fr_0.92fr]
              xl:gap-14
            "
          >
            {/* Left: logo */}
            <div
              className="
                flex w-full min-w-0
                items-center justify-center
                lg:min-h-[480px]
              "
            >
              <LogoShowcase />
            </div>

            {/* Right: content */}
            <div
              className="
                flex w-full min-w-0 flex-col
                items-center text-center
                lg:items-start lg:text-left
              "
            >
              {/* Label */}
              <div
                className="
                  inline-flex items-stretch overflow-hidden
                  rounded-md border border-white/15
                  bg-black/30 text-[11px]
                "
              >
                <span
                  className="
                    bg-emerald-400 px-3 py-1.5
                    font-mono font-bold tracking-wider
                    text-[#05090d]
                  "
                >
                  WBSL BRIDGE
                </span>
                <span className="px-3 py-1.5 font-medium text-slate-300">
                  Neural Sign Translation
                </span>
              </div>

              {/* Heading */}
              <div className="mt-6 sm:mt-7">
                <h1
                  className="
                    text-[2rem]
                    font-extrabold
                    leading-[1.12]
                    tracking-[-0.03em]
                    text-white
                    sm:text-[2.6rem]
                    md:text-[3rem]
                    lg:text-[2.5rem]
                    xl:text-[3rem]
                  "
                >
                  <span className="block whitespace-nowrap">
                    A Sign Language
                  </span>
                  <span className="block whitespace-nowrap text-emerald-400">
                    Bridge for Every Signer
                  </span>
                  <span className="block whitespace-nowrap">
                    in West Bengal
                  </span>
                </h1>

                <p
                  className="
                    mx-auto mt-5 max-w-[500px]
                    text-sm leading-relaxed
                    text-slate-300
                    sm:text-[15px]
                    lg:mx-0
                  "
                >
                  Intent-aware, two-way sign language communication for the
                  Deaf community of West Bengal.
                </p>
              </div>

              {/* Features */}
              <div
                className="
                  mt-7 grid w-full
                  max-w-[610px]
                  grid-cols-1 gap-2.5
                  sm:grid-cols-2
                "
              >
                <FeatureCard
                  icon={<Video size={17} />}
                  title="Sign → Bengali"
                  color="green"
                  status="active"
                  href="/sign-to-text"
                />
                <FeatureCard
                  icon={<Volume2 size={17} />}
                  title="Bengali → Sign"
                  color="blue"
                  status="active"
                  href="/text-to-sign"
                />
                <FeatureCard
                  icon={<Users size={17} />}
                  title="Community Growth"
                  color="sky"
                  status="upcoming"
                />
                <FeatureCard
                  icon={<HelpCircle size={17} />}
                  title="Unknown Signs"
                  color="violet"
                  status="upcoming"
                />
              </div>

              {/* Supported languages */}
              <Float3D className="mt-5 w-full max-w-[610px]">
                <div
                  className="
                    flex w-full
                    flex-col gap-1
                    rounded-lg
                    border border-white/[0.08]
                    bg-white/[0.03]
                    px-3.5 py-3
                    backdrop-blur-sm
                    sm:flex-row sm:items-center sm:gap-3
                  "
                >
                  <span className="text-[11px] font-medium text-slate-400">
                    Supports
                  </span>
                  <span className="text-xs font-semibold text-slate-100">
                    WBSL · ISL · BdSL · HomeSL · Mixed signing
                  </span>
                </div>
              </Float3D>

              {/* About link */}
              <Link
                href="/about"
                className="
                  mt-4 text-[13px] font-medium
                  text-slate-300 underline decoration-white/25
                  underline-offset-4 transition-colors
                  hover:text-white hover:decoration-white/60
                "
              >
                More about the project
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}