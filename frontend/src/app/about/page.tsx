"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Brain,
  MessageSquareText,
  Volume2,
  ShieldCheck,
  Database,
  HelpCircle,
  Users,
  BookOpen,
  Layers,
  Cpu,
  Camera,
  Hand,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  Globe,
  WifiOff,
  Lock,
  ArrowUpRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   SECTION WRAPPER — keeps every section visually consistent
   with the Home page's card language
   ───────────────────────────────────────────────────────────── */
function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`
        rounded-xl border border-white/[0.08]
        bg-white/[0.025] p-6 sm:p-8
        backdrop-blur-sm
        ${className}
      `}
    >
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER — emerald accent bar + label
   ───────────────────────────────────────────────────────────── */
function SectionHeader({
  icon: Icon,
  label,
  title,
  accent = "emerald",
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  title: string;
  accent?: "emerald" | "blue" | "sky" | "violet";
}) {
  const accentMap = {
    emerald: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    blue: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    sky: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    violet: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  };
  return (
    <div className="mb-6 flex items-start gap-4">
      <div
        className={`
          flex h-11 w-11 shrink-0 items-center justify-center
          rounded-lg border ${accentMap[accent]}
        `}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const pipelineStages = [
    {
      id: "camera",
      icon: Camera,
      label: "CAMERA",
      accent: "emerald" as const,
      desc: "30 FPS webcam capture. MediaPipe Holistic extracts hand, 8-point pose and face landmarks.",
    },
    {
      id: "recognition",
      icon: Hand,
      label: "RECOGNITION",
      accent: "blue" as const,
      desc: "98-dim shoulder-box feature vector → BiLSTM + Attention (64-frame temporal clips). Span-based auto-detection.",
    },
    {
      id: "emotion",
      icon: Sparkles,
      label: "EMOTION",
      accent: "violet" as const,
      desc: "ViT-ONNX 7-class classifier, glasses-robust, ~30–50 ms. Supplementary affective context for Bengali tone.",
    },
    {
      id: "nlg",
      icon: Brain,
      label: "BENGALI NLG",
      accent: "emerald" as const,
      desc: "NVIDIA Nemotron-3.5-Bolt-E4B-4GB (Gemma 4 E4B-it base + GRPO RL via NeMo Gym, offline) & Nemotron-3 Ultra 550B (online). 50-criteria anti-hallucination prompt.",
    },
    {
      id: "stt",
      icon: MessageSquareText,
      label: "STT & VAD",
      accent: "blue" as const,
      desc: "HIMA-ASR ONNX INT8 with native Bengali script + Silero Neural VAD segmentation. Optional ElevenLabs Scribe.",
    },
    {
      id: "tts",
      icon: Volume2,
      label: "TTS",
      accent: "sky" as const,
      desc: "edge-tts (online) → BanglaTTS (offline) automatic fallback. ElevenLabs premium option.",
    },
  ];

  const accentDot: Record<string, string> = {
    emerald: "bg-emerald-400",
    blue: "bg-blue-400",
    sky: "bg-sky-400",
    violet: "bg-violet-400",
  };

  const accentText: Record<string, string> = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    sky: "text-sky-400",
    violet: "text-violet-400",
  };

  const accentBorder: Record<string, string> = {
    emerald: "border-emerald-400/20",
    blue: "border-blue-400/20",
    sky: "border-sky-400/20",
    violet: "border-violet-400/20",
  };

  const techStack = [
    {
      category: "Vision",
      items: "MediaPipe Holistic 0.10.14 · OpenCV · ViT-ONNX",
    },
    {
      category: "ML",
      items: "PyTorch · ONNX Runtime · BiLSTM + Attention (98-dim, 64-frame)",
    },
    {
      category: "LLM",
      items: "Nemotron-3-Ultra-550B (OpenRouter online) · NVIDIA Nemotron-3.5-Bolt-E4B-4GB (Gemma 4 E4B-it base + GRPO RL via NeMo / KoboldCpp offline)",
    },
    {
      category: "STT",
      items: "HIMA-ASR ONNX INT8 (native Bengali/English) · Silero VAD v6 · ElevenLabs Scribe",
    },
    {
      category: "TTS",
      items: "edge-tts · BanglaTTS (silero) · ElevenLabs eleven_v3",
    },
    {
      category: "Frontend",
      items: "Next.js · TypeScript · Tailwind · shadcn/ui · Three.js",
    },
    {
      category: "Backend",
      items: "FastAPI · Python 3.11 · Single venv · .env AI_MODE",
    },
  ];

  const gaps = [
    {
      id: "G4",
      label: "WB Regional Sign Focus",
      status: "VERIFIED",
      detail:
        "Zero AI/ML projects exist for WBSL, ISL, or BdSL as used in West Bengal.",
    },
    {
      id: "G15",
      label: "WBSL ≠ ISL ≠ BdSL",
      status: "VERIFIED",
      detail:
        "Johnson & Johnson (2016) proved linguistic distinctness. Existing tech targets Bangladesh or Delhi.",
    },
    {
      id: "G6",
      label: "Sign → Bengali Translation",
      status: "OPEN",
      detail:
        "No system produces grammatically correct Bengali from signs for the WB region.",
    },
    {
      id: "G7",
      label: "Constrained LLM Integration",
      status: "OPEN",
      detail: "No sign language system uses LLM with anti-hallucination constraints.",
    },
    {
      id: "G10",
      label: "Bidirectional Communication",
      status: "OPEN",
      detail: "Google SL2T is forward-only. Reverse path not deployed anywhere.",
    },
    {
      id: "G13",
      label: "Low-Resource Transfer",
      status: "OPEN",
      detail: "Google uses 100,000+ hours. WB region has near-zero. What works without scale?",
    },
  ];

  const currentStatus = [
    {
      label: "MediaPipe Stream",
      desc: "Hand + 8-point pose + 19-point face at stable 30 FPS.",
    },
    {
      label: "Emotion Detection",
      desc: "ViT-ONNX 7-class classifier (glasses-robust).",
    },
    {
      label: "98-dim Feature Extraction",
      desc: "Shoulder-box coordinate system. 66 handshape + 12 palm + 4 wrist + …",
    },
    {
      label: "BiLSTM + Attention",
      desc: "sign_daily_lstm.onnx · Input (batch, 64, 98) · Span-based auto-detection.",
    },
    {
      label: "Bengali NLG & TTS",
      desc: "AI_MODE env variable · Dual-engine TTS.",
    },
    {
      label: "3D Avatar Simulation",
      desc: "Per-gloss avatar data · Three.js 3D rendering.",
    },
  ];

  const roadmap = [
    {
      num: 1,
      label: "Expanded Sign Vocabulary",
      desc: "Growing the training dataset with more WBSL-specific signs.",
      active: true,
    },
    {
      num: 2,
      label: "WB Region Data Creation",
      desc: "Dedicated data collector tool for the first continuous WBSL/ISL/BdSL dataset.",
      active: true,
    },
    {
      num: 3,
      label: "Community Contributions",
      desc: "Privacy-first landmark submission with human verification pipeline.",
      active: false,
    },
    {
      num: 4,
      label: "Field Survey",
      desc: "50+ field verification questions for real-world community data collection.",
      active: true,
    },
    {
      num: 5,
      label: "Unknown Sign Handling",
      desc: "Full implementation of the Honesty Layer to prevent AI hallucination.",
      active: false,
    },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* ─── BACKGROUND (matches Home) ─── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
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
            absolute inset-0 h-full w-full
            select-none object-cover opacity-[0.45]
          "
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#05090d]/75" />
        <div
          className="
            absolute inset-0
            [background:radial-gradient(ellipse_at_center,transparent_30%,rgba(3,7,10,0.75)_100%)]
          "
        />
        <div
          className="
            absolute inset-x-0 bottom-0 h-[22%]
            bg-gradient-to-t from-background/95 to-transparent
          "
        />
      </div>

      {/* ─── CONTENT ─── */}
      <PageContainer className="relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* ───────────────── HERO ───────────────── */}
          <header className="space-y-6">
            {/* Label badge */}
            <div className="inline-flex items-stretch overflow-hidden rounded-md border border-white/15 bg-black/30 text-[11px]">
              <span className="bg-emerald-400 px-3 py-1.5 font-mono font-bold tracking-wider text-[#05090d]">
                ABOUT
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 font-medium text-slate-300">
                <BookOpen size={12} />
                Academic Research · CSE · 7th Semester · 2026
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                {/* Project Title */}
                <h1 className="text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[3.5rem] md:text-[4rem] lg:text-[3.5rem] xl:text-[4.5rem]">
                  WBSL Bridge
                </h1>
                
                {/* Academic Title */}
                <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-300 sm:text-[17px]">
                  <span className="font-semibold text-white">WBSL Bridge:</span> Intent-Aware Bidirectional Sign Language Communication for the Deaf Community of West Bengal with Unknown Sign Handling and Community-Driven Growth
                </p>
              </div>

              {/* Tag cloud */}
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {[
                  { t: "WBSL · ISL · BdSL", c: "emerald" },
                  { t: "Bengali ↔ Sign", c: "blue" },
                  { t: "Unknown Sign Honesty", c: "violet" },
                  { t: "Privacy-First", c: "sky" },
                  { t: "CPU-Only", c: "emerald" },
                  { t: "Offline-Capable", c: "blue" },
                ].map((tag) => (
                  <span
                    key={tag.t}
                    className={`
                      inline-flex items-center gap-1.5
                      rounded-md border px-2.5 py-1
                      text-[11px] font-medium
                      ${accentBorder[tag.c]}
                      bg-white/[0.03] text-slate-200
                    `}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accentDot[tag.c]}`} />
                    {tag.t}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick nav */}
            <nav className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.08] pt-5 text-[12px] font-medium text-slate-400">
              {[
                ["Problem", "#problem"],
                ["Status", "#status"],
                ["Architecture", "#architecture"],
                ["Stack", "#stack"],
                ["Team", "#team"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/"
                className="ml-auto inline-flex items-center gap-1 text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Back to home <ArrowUpRight size={12} />
              </Link>
            </nav>
          </header>

          {/* ───────────────── THE PROBLEM ───────────────── */}
          <Section id="problem">
            <SectionHeader
              icon={AlertTriangle}
              label="Context"
              title="The Verified Technological Void"
              accent="violet"
            />

            <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
              The Deaf community in West Bengal uses WBSL, ISL and BdSL — often
              mixed. An exhaustive search confirmed the following:
            </p>

            {/* Asymmetric 2/3 + 1/3 grid — feels hand-built */}
            <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "Zero systems handling continuous signs for WB region",
                  "Zero tools supporting mixed WBSL/ISL/BdSL signing",
                  "Zero WBSL/ISL/BdSL → Bengali translators",
                  "Zero projects from WB universities",
                  "Only resource: 170 Wikisigns entries",
                  "Existing tech targets Bangladesh or Delhi only",
                ].map((item) => (
                  <div
                    key={item}
                    className="
                      flex items-start gap-2.5 rounded-lg
                      border border-white/[0.08] bg-white/[0.02]
                      px-3 py-2.5
                    "
                  >
                    <XCircle
                      size={14}
                      className="mt-0.5 shrink-0 text-rose-400/80"
                    />
                    <span className="text-[12.5px] leading-snug text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pull quote — editorial feel */}
              <aside
                className="
                  relative rounded-lg border-l-2 border-emerald-400/40
                  bg-emerald-400/[0.04] p-4
                "
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Key finding
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-200">
                  Every existing &ldquo;Bengali Sign Language&rdquo; project
                  originates from Bangladesh and targets Bangladesh BdSL — a
                  linguistically separate sign language — not the WBSL, ISL or BdSL
                  varieties actually used in West Bengal, India.
                </p>
              </aside>
            </div>
          </Section>

          {/* ───────────────── STATUS + ROADMAP (split) ───────────────── */}
          <div
            id="status"
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            {/* Current status */}
            <Section>
              <SectionHeader
                icon={CheckCircle2}
                label="Shipped"
                title="Current Implementation Status"
                accent="emerald"
              />
              <ul className="space-y-2">
                {currentStatus.map((item) => (
                  <li
                    key={item.label}
                    className="
                      group flex items-start gap-3
                      rounded-lg border border-white/[0.08]
                      bg-white/[0.02] px-3.5 py-3
                      transition-colors hover:border-emerald-400/30
                      hover:bg-white/[0.04]
                    "
                  >
                    <span
                      className="
                        mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
                        rounded-full bg-emerald-400/15 text-emerald-400
                      "
                    >
                      <CheckCircle2 size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-slate-100">
                        {item.label}
                      </div>
                      <div className="mt-0.5 text-[12px] leading-relaxed text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Roadmap */}
            <Section>
              <SectionHeader
                icon={ArrowRight}
                label="In progress"
                title="Roadmap"
                accent="sky"
              />
              <ol className="relative space-y-3 border-l border-white/[0.08] pl-5">
                {roadmap.map((item) => (
                  <li key={item.num} className="relative">
                    {/* Timeline dot */}
                    <span
                      className={`
                        absolute -left-[27px] top-1
                        flex h-4 w-4 items-center justify-center
                        rounded-full border-2 border-background
                        ${
                          item.active
                            ? "bg-sky-400"
                            : "bg-white/10"
                        }
                      `}
                    />
                    <div
                      className={`
                        rounded-lg border px-3.5 py-3
                        ${
                          item.active
                            ? "border-sky-400/20 bg-sky-400/[0.04]"
                            : "border-white/[0.08] bg-white/[0.02]"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          0{item.num}
                        </span>
                        <span className="text-[13px] font-semibold text-slate-100">
                          {item.label}
                        </span>
                        {item.active && (
                          <span className="ml-auto rounded border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-sky-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          </div>

          {/* ───────────────── RESEARCH GAPS ───────────────── */}
          <Section>
            <SectionHeader
              icon={HelpCircle}
              label="Research"
              title="Verified Research Gaps"
              accent="violet"
            />
            <p className="mb-5 max-w-3xl text-sm text-slate-300">
              18 gaps identified through exhaustive literature review. 14 remain
              completely open.
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="
                    group flex items-start gap-3
                    rounded-lg border border-white/[0.08]
                    bg-white/[0.02] p-3.5
                    transition-colors hover:border-violet-400/30
                    hover:bg-white/[0.04]
                  "
                >
                  <span
                    className="
                      shrink-0 rounded border border-violet-400/25
                      bg-violet-400/10 px-1.5 py-0.5
                      font-mono text-[10px] font-bold text-violet-300
                    "
                  >
                    {gap.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-semibold text-slate-100">
                        {gap.label}
                      </span>
                      <span
                        className={`
                          shrink-0 rounded px-1.5 py-0.5
                          text-[9px] font-mono font-bold uppercase tracking-wider
                          ${
                            gap.status === "VERIFIED"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-amber-400/10 text-amber-300"
                          }
                        `}
                      >
                        {gap.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                      {gap.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ───────────────── ARCHITECTURE ───────────────── */}
          <Section id="architecture">
            <SectionHeader
              icon={Layers}
              label="Pipeline"
              title="System Architecture"
              accent="blue"
            />

            {/* Pipeline — vertical flow with connecting line */}
            <div className="relative space-y-2">
              <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-emerald-400/30 via-blue-400/30 to-violet-400/30" />
              {pipelineStages.map((stage, i) => (
                <div
                  key={stage.id}
                  className="relative flex items-start gap-4 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                >
                  <div
                    className={`
                      relative z-10 flex h-11 w-11 shrink-0 items-center justify-center
                      rounded-lg border ${accentBorder[stage.accent]}
                      bg-background ${accentText[stage.accent]}
                    `}
                  >
                    <stage.icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-bold uppercase tracking-wider ${accentText[stage.accent]}`}
                      >
                        {stage.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        STAGE {i + 1}/{pipelineStages.length}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-300">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key innovations — 2x2 asymmetric */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "98-dim Shoulder Box Features",
                  desc: "Signer-independent coordinate system. Origin at shoulder midpoint, unit = shoulder width. Removes skin colour, background, lighting bias.",
                  accent: "emerald",
                },
                {
                  title: "Span-Based Auto-Detection",
                  desc: "Hands raised → recording starts. Hands lowered → 64-frame clip selected → inference. No button press needed.",
                  accent: "blue",
                },
                {
                  title: "Open-Set Honesty Layer",
                  desc: "OOD gate detects unknown signs before LLM reasoning. Output carries সম্ভবত (probably), never forced classification.",
                  accent: "violet",
                },
                {
                  title: "Privacy-First Design",
                  desc: "Landmarks only, never raw video. DPDP Act 2023 compliant. Community contributions planned as a future feature.",
                  accent: "sky",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`
                    rounded-lg border p-4
                    ${accentBorder[item.accent]}
                    bg-white/[0.02]
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${accentDot[item.accent]}`}
                    />
                    <span className="text-[13px] font-semibold text-slate-100">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* ───────────────── TECH STACK ───────────────── */}
          <Section id="stack">
            <SectionHeader
              icon={Cpu}
              label="Engineering"
              title="Technology Stack"
              accent="emerald"
            />

            <div className="overflow-hidden rounded-lg border border-white/[0.08]">
              {techStack.map((row, i) => (
                <div
                  key={row.category}
                  className={`
                    flex flex-col gap-1 px-4 py-3
                    sm:flex-row sm:items-center sm:gap-6
                    ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.04]"}
                    border-b border-white/[0.06] last:border-b-0
                  `}
                >
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 sm:w-28">
                    {row.category}
                  </span>
                  <span className="font-mono text-[12px] text-slate-300">
                    {row.items}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11.5px] font-mono text-slate-500">
              All modules run in a single Python 3.11 venv on CPU. No cloud
              dependency for core operation. AI_MODE in .env selects offline or
              online LLM.
            </p>
          </Section>

          {/* ───────────────── DATASET + UNKNOWN SIGNS (split) ───────────────── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Dataset */}
            <Section>
              <SectionHeader
                icon={Database}
                label="Data"
                title="Dataset Strategy"
                accent="blue"
              />
              <p className="text-[13px] leading-relaxed text-slate-300">
                Transfer-first approach. Ready-made datasets (BdSLW401, iSign,
                ISLTranslate) provide ~15,000 pre-labelled sequences covering
                460+ signs.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Model A", desc: "WBSL only (baseline)" },
                  { label: "Model B", desc: "ISL → WBSL fine-tune" },
                  { label: "Model C", desc: "ISL + WBSL + BdSL mixed" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="
                      rounded-lg border border-blue-400/20
                      bg-blue-400/[0.04] p-3 text-center
                    "
                  >
                    <div className="text-[11px] font-mono font-bold text-blue-300">
                      {m.label}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="
                  mt-4 rounded-lg border border-white/[0.08]
                  bg-white/[0.02] p-3
                "
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Data indexing
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">
                  Signer-disjoint splits enforced. Features id and model id are
                  append-only. Daily report and confusion matrix stored per model.
                </p>
              </div>
            </Section>

            {/* Unknown signs */}
            <Section>
              <SectionHeader
                icon={HelpCircle}
                label="Safety"
                title="Unknown Sign Handling"
                accent="violet"
              />
              <p className="text-[13px] leading-relaxed text-slate-300">
                When confidence margin is below threshold or top probability &lt;
                0.5, the system reports &ldquo;Not sure&rdquo; and returns ranked
                tentative candidates from the top-3 model outputs.
              </p>

              <div className="mt-4 space-y-2">
                {[
                  {
                    tier: "L1",
                    label: "Numerical",
                    desc: "finger_extension, velocity, repetition, duration",
                  },
                  {
                    tier: "L2",
                    label: "Symbolic",
                    desc: "RIGHT_HAND INDEX_EXTENDED TOWARD_MOUTH REPEATED_3X",
                  },
                  {
                    tier: "L3",
                    label: "Natural Language",
                    desc: "“The right hand moves toward the mouth, pauses, returns. Repeated three times.”",
                  },
                ].map((level) => (
                  <div
                    key={level.tier}
                    className="
                      flex items-start gap-3 rounded-lg
                      border border-violet-400/20 bg-violet-400/[0.04]
                      p-3
                    "
                  >
                    <span
                      className="
                        shrink-0 rounded border border-violet-400/30
                        bg-violet-400/10 px-1.5 py-0.5
                        font-mono text-[10px] font-bold text-violet-300
                      "
                    >
                      {level.tier}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-semibold text-slate-100">
                        {level.label}
                      </div>
                      <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-400">
                        {level.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="
                  mt-4 rounded-lg border-l-2 border-violet-400/40
                  bg-violet-400/[0.04] p-3
                "
              >
                <p className="text-[11.5px] font-mono leading-relaxed text-slate-300">
                  Output: &ldquo;সম্ভবত&rdquo; (probably) is injected
                  automatically. Every unknown sign carries STATUS: TENTATIVE —
                  HUMAN VERIFICATION REQUIRED.
                </p>
              </div>
            </Section>
          </div>

          {/* ───────────────── BIDIRECTIONAL + COMMUNITY (split) ───────────────── */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bidirectional */}
            <Section>
              <SectionHeader
                icon={MessageSquareText}
                label="Flow"
                title="Bidirectional Communication"
                accent="emerald"
              />

              <div className="space-y-3">
                <div
                  className="
                    rounded-lg border border-emerald-400/20
                    bg-emerald-400/[0.04] p-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-emerald-400" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                      Forward · Sign → Bengali
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
                    Camera → MediaPipe → 98-dim features → BiLSTM + Attention →
                    Emotion ViT → Constrained LLM → Bengali text → Dual-engine
                    TTS.
                  </p>
                </div>

                <div
                  className="
                    rounded-lg border border-blue-400/20
                    bg-blue-400/[0.04] p-4
                  "
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-blue-400" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-300">
                      Reverse · Bengali → Sign
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-300">
                    Bengali text/voice → LLM gloss generation → Sign sequence
                    mapping → Avatar landmark replay → Continuous 3D simulation.
                  </p>
                </div>
              </div>
            </Section>

            {/* Community data */}
            <Section>
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-sky-400/20 bg-sky-400/10 text-sky-400">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Future
                    </div>
                    <span className="rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
                      Planned
                    </span>
                  </div>
                  <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    Community Data Collection
                  </h2>
                </div>
              </div>

              <p className="text-[13px] leading-relaxed text-slate-300">
                Privacy-first submission. Only landmarks collected; original
                video discarded on-device before transmission. Compliant with
                India&rsquo;s DPDP Act 2023.
              </p>

              <div
                className="
                  mt-4 flex items-center gap-2 rounded-lg
                  border border-white/[0.08] bg-white/[0.02]
                  px-3 py-2.5
                "
              >
                <Lock size={13} className="text-sky-400" />
                <span className="font-mono text-[11px] text-slate-400">
                  AUTOMATE · ANALYSE · EXPLAIN · SIMULATE · EVIDENCE · HUMAN
                  DECIDES
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  {
                    icon: CheckCircle2,
                    label: "ACCEPT",
                    desc: "Trusted dataset",
                    c: "emerald",
                  },
                  {
                    icon: XCircle,
                    label: "REJECT",
                    desc: "Not used",
                    c: "rose",
                  },
                  {
                    icon: Clock3,
                    label: "REVIEW",
                    desc: "2-of-3 consensus",
                    c: "amber",
                  },
                ].map((d) => {
                  const colorMap: Record<string, string> = {
                    emerald: "text-emerald-400 border-emerald-400/20",
                    rose: "text-rose-400 border-rose-400/20",
                    amber: "text-amber-400 border-amber-400/20",
                  };
                  return (
                    <div
                      key={d.label}
                      className={`
                        rounded-lg border bg-white/[0.02]
                        p-3 text-center opacity-75
                        ${colorMap[d.c]}
                      `}
                    >
                      <d.icon size={15} className="mx-auto" />
                      <div className="mt-1.5 text-[10px] font-mono font-bold">
                        {d.label}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {d.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>

          {/* ───────────────── TEAM ───────────────── */}
          <Section id="team">
            <SectionHeader
              icon={Users}
              label="People"
              title="Project Research Team"
              accent="emerald"
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Sabir Ali Mondal",
                  roll: "34900123032",
                  role: "Project Lead & System Developer",
                  explanation: "Architected and built the complete system",
                },
                {
                  name: "Koushaki Singha",
                  roll: "34900124074",
                  role: "Dataset Building",
                  explanation: "Building the first WBSL dataset in West Bengal",
                },
                {
                  name: "Monirul Halder",
                  roll: "34900123021",
                  role: "Dataset Building",
                  explanation: "Building the first WBSL dataset in West Bengal",
                },
                {
                  name: "Firdos Shakih",
                  roll: "34900123011",
                  role: "Dataset Building",
                  explanation: "Building the first WBSL dataset in West Bengal",
                },
              ].map((m) => (
                <div
                  key={m.name}
                  className="
                    relative overflow-hidden rounded-xl
                    border border-white/[0.08]
                    bg-white/[0.02] p-5
                  "
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-slate-100">
                        {m.name}
                      </div>
                      <div className="mt-1.5">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {m.role}
                        </div>
                        <div className="mt-0.5 text-[11px] leading-snug text-slate-500">
                          {m.explanation}
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-slate-500">
                      {m.roll}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mentor strip */}
            <div
              className="
                mt-4 flex flex-col gap-2 rounded-lg
                border border-white/[0.08] bg-white/[0.02]
                p-4 sm:flex-row sm:items-center sm:justify-between
              "
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Mentor
                </span>
                <div className="text-[13px] font-semibold text-slate-100">
                  Prof. Prabir Kr. Naskar
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Department
                </span>
                <div className="text-[13px] text-slate-300">
                  CSE, Cooch Behar Government Engineering College
                </div>
              </div>
            </div>
          </Section>

          {/* ───────────────── CONNECTIVITY + FOOTER ───────────────── */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            {/* Connectivity */}
            <Section>
              <div className="mb-4 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Connectivity
              </div>
              <div className="space-y-2">
                <div
                  className="
                    flex items-center gap-3 rounded-lg
                    border border-emerald-400/20 bg-emerald-400/[0.04]
                    px-3 py-2.5
                  "
                >
                  <Globe size={14} className="text-emerald-400" />
                  <span className="font-mono text-[11.5px] text-slate-200">
                    Online · edge-tts + Nemotron 3 Ultra 550B (OpenRouter)
                  </span>
                </div>
                <div
                  className="
                    flex items-center gap-3 rounded-lg
                    border border-amber-400/20 bg-amber-400/[0.04]
                    px-3 py-2.5
                  "
                >
                  <WifiOff size={14} className="text-amber-400" />
                  <span className="font-mono text-[11.5px] text-slate-200">
                    Offline · BanglaTTS + Nemotron-3.5-Bolt-E4B-4GB (Gemma 4 Base + GRPO RL)
                  </span>
                </div>
                <div
                  className="
                    flex items-center gap-3 rounded-lg
                    border border-white/[0.08] bg-white/[0.02]
                    px-3 py-2.5
                  "
                >
                  <Cpu size={14} className="text-sky-400" />
                  <span className="font-mono text-[11.5px] text-slate-300">
                    AI_MODE in .env selects the engine
                  </span>
                </div>
              </div>
            </Section>

            {/* Footer note */}
            <Section>
              <div className="mb-3 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Scope
              </div>
              <p className="text-[13px] leading-relaxed text-slate-300">
                WBSL Bridge does not attempt to replicate the scale of Google
                DeepMind&rsquo;s SL2T (100,000+ hours, ASL → English, Pixel 11).
                It investigates whether the architectural principles demonstrated
                at high-resource scale can be adapted to a severely low-resource,
                linguistically distinct, regionally specific sign language
                ecosystem (WBSL, ISL, BdSL) with Bengali-language output,
                budget-device deployment and bidirectional communication — none
                of which currently exists.
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <Link
                  href="/"
                  className="
                    inline-flex items-center gap-1.5 text-[12px]
                    font-medium text-emerald-400
                    transition-colors hover:text-emerald-300
                  "
                >
                  <ArrowUpRight size={13} /> Back to home
                </Link>
                <span className="font-mono text-[10px] text-slate-500">
                  WBSL BRIDGE · 2026
                </span>
              </div>
            </Section>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}