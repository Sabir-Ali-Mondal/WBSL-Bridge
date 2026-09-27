import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Eye,
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
  ScanFace,
  Hand,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  Lock,
  Globe,
  WifiOff,
} from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Sabir Ali Mondal",
      roll: "34900123032",
      role: "Project Lead & System Developer",
      focus: "End-to-end system architecture, ML pipeline, LLM integration, web platform, deployment",
    },
    {
      name: "Koushaki Singha",
      roll: "34900124074",
      role: "Sign Language Data & Quality Lead",
      focus: "WBSL sign recording coordination, dataset annotation, NMM tagging, landmark data quality review",
    },
    {
      name: "Monirul Halder",
      roll: "34900123021",
      role: "Bengali Output & Testing Lead",
      focus: "Bengali translation quality review, TTS output validation, semantic testing, project documentation",
    },
    {
      name: "Firdos Shakih",
      roll: "34900123011",
      role: "Model Training & Evaluation Lead",
      focus: "Training experiment execution, accuracy evaluation, augmentation testing, model comparison",
    },
  ];

  const pipelineStages = [
    {
      id: "camera",
      icon: Camera,
      label: "CAMERA",
      color: "text-accent-primary",
      desc: "30 FPS webcam capture, MediaPipe Holistic extracts 540 landmarks (42 hand + 468 face + 33 pose)",
    },
    {
      id: "recognition",
      icon: Hand,
      label: "RECOGNITION",
      color: "text-accent-primary",
      desc: "126-dim two-hand vector, right-wrist normalized, MLP/LSTM → ONNX, sub-5ms inference",
    },
    {
      id: "nmm",
      icon: ScanFace,
      label: "NMM GATE",
      color: "text-accent-secondary",
      desc: "5 geometry-based markers: eyebrow raise/furrow, head shake/nod, mouth open. Deterministic, < 5ms",
    },
    {
      id: "emotion",
      icon: Sparkles,
      label: "EMOTION",
      color: "text-accent-secondary",
      desc: "ViT-ONNX 7-class classifier, robust to glasses, ~30–50ms. Supplementary affective context",
    },
    {
      id: "nlg",
      icon: Brain,
      label: "BENGALI NLG",
      color: "text-status-pending",
      desc: "gemma-4-E4B, 50-criteria constrained prompt, preserves question/negation/WHETHER/IF-THEN scope",
    },
    {
      id: "tts",
      icon: Volume2,
      label: "TTS",
      color: "text-status-pending",
      desc: "edge-tts (online, ~604 ms/word) → BanglaTTS (offline, ~453 ms/word) automatic fallback",
    },
  ];

  const techStack = [
    { category: "Vision", items: "MediaPipe Holistic 0.10.14 · OpenCV · ViT-ONNX (trpakov/vit-face-expression)" },
    { category: "ML", items: "PyTorch · ONNX Runtime · MLP (static) · LSTM (temporal) · 126-dim landmarks" },
    { category: "LLM", items: "gemma-4-E4B-it-Q4_K_M (deployment) · gemma-4-12b-it-Q4_0 (reference) · KoboldCpp" },
    { category: "TTS", items: "edge-tts (bn-BD-NabanitaNeural) · BanglaTTS (silero) · mutagen" },
    { category: "Frontend", items: "Next.js 14 · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts" },
    { category: "Backend", items: "FastAPI · WebSocket · Python 3.11 · Single venv deployment" },
  ];

  const gaps = [
    { id: "G4", label: "WBSL Regional Focus", status: "OPEN — VERIFIED", detail: "Zero AI/ML/DL projects exist for WBSL. Only resource: 170 Wikisigns entries" },
    { id: "G15", label: "WBSL ≠ ISL ≠ BdSL", status: "OPEN — VERIFIED", detail: "Johnson & Johnson (2016) proved linguistic distinctness. All tech targets Bangladesh" },
    { id: "G6", label: "WBSL → Bengali Translation", status: "OPEN", detail: "No system produces grammatically correct Bengali from signs" },
    { id: "G7", label: "Constrained LLM Integration", status: "OPEN", detail: "No sign language system uses LLM with anti-hallucination constraints" },
    { id: "G10", label: "Bidirectional Communication", status: "OPEN", detail: "Google SL2T is forward-only. Reverse path not deployed anywhere" },
    { id: "G13", label: "Low-Resource Transfer", status: "OPEN", detail: "Google uses 100,000+ hours. WBSL has near-zero. What works without scale?" },
  ];

  return (
    <PageContainer className="max-w-5xl py-16 space-y-20">
      {/* ─── HERO ─── */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-primary">
          <BookOpen size={14} />
          <span>Academic Research Project · CSE · 7th Semester · 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          WBSL Bridge
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
          Intent-aware bidirectional sign language communication for the Deaf community of West Bengal
          with unknown sign handling and community-driven growth.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {["WBSL → Bengali", "Bengali → WBSL", "Unknown Sign Honesty", "Privacy-First", "CPU-Only", "Offline-Capable"].map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-surface-elevated border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ─── THE PROBLEM ─── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-status-error" />
          <h2 className="text-2xl font-bold text-text-primary">The Verified Technological Void</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          West Bengal Sign Language (WBSL) has been linguistically proven distinct from both Delhi ISL
          and Bangladesh BdSL (Johnson &amp; Johnson, 2016, <em>Sign Language Studies</em>, 16(4)).
          Despite this, an exhaustive search confirmed:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            "ZERO AI/ML/DL projects for WBSL",
            "ZERO WBSL video datasets",
            "ZERO WBSL recognition systems",
            "ZERO WBSL → Bengali translators",
            "ZERO projects from WB universities",
            "Only resource: 170 Wikisigns entries",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 p-3 rounded-md bg-surface border border-border">
              <XCircle size={14} className="text-status-error mt-0.5 shrink-0" />
              <span className="text-xs text-text-secondary">{item}</span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border-l-2 border-l-accent-primary">
          <p className="text-xs font-mono text-text-secondary">
            Every existing &ldquo;Bengali Sign Language&rdquo; technology project originates from Bangladesh
            and targets Bangladesh BdSL — a linguistically separate sign language — not the WBSL used by
            the Deaf community in West Bengal, India.
          </p>
        </div>
      </section>

      {/* ─── RESEARCH GAPS ─── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Verified Research Gaps</h2>
        <p className="text-sm text-text-secondary">
          18 gaps identified through exhaustive literature review. 14 remain completely open. Key gaps:
        </p>
        <div className="space-y-2">
          {gaps.map((gap) => (
            <div key={gap.id} className="flex items-start gap-4 p-3 rounded-md bg-surface border border-border">
              <span className="font-mono text-xs text-status-unknown font-bold shrink-0 w-8">{gap.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text-primary">{gap.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-unknown/10 text-status-unknown">
                    {gap.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">{gap.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SYSTEM ARCHITECTURE ─── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-accent-secondary" />
          <h2 className="text-2xl font-bold text-text-primary">System Architecture</h2>
        </div>

        {/* Pipeline Flow */}
        <div className="space-y-1">
          {pipelineStages.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className="flex items-start gap-4 p-4 rounded-md bg-surface border border-border">
                <div className={`mt-0.5 ${stage.color}`}>
                  <stage.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">STAGE {i + 1}/6</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{stage.desc}</p>
                </div>
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-border" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Key Innovations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {[
            { title: "Landmark-Based Signer Independence", desc: "126-dim normalized vector removes skin color, background, lighting bias. 99.9% val accuracy." },
            { title: "Open-Set Honesty Layer", desc: "OOD gate detects unknown signs BEFORE LLM reasoning. Output carries সম্ভবত (probably), never forced classification." },
            { title: "Fast/Slow Path Separation", desc: "Real-time recognition in fast path (<50ms). Heavy LLM reasoning runs asynchronously off critical path." },
            { title: "Privacy-First Verification", desc: "Landmarks only, never raw video. Human reviewers decide. DPDP Act 2023 compliant." },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-md bg-surface border border-border space-y-1">
              <div className="text-sm font-semibold text-text-primary">{item.title}</div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECHNOLOGY STACK ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Cpu size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Technology Stack</h2>
        </div>
        <div className="rounded-md border border-border overflow-hidden">
          {techStack.map((row, i) => (
            <div key={row.category} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 ${i % 2 === 0 ? "bg-surface" : "bg-surface-elevated"}`}>
              <span className="text-xs font-mono font-bold text-accent-primary uppercase tracking-wider w-24 shrink-0">
                {row.category}
              </span>
              <span className="text-xs text-text-secondary font-mono">{row.items}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted font-mono">
          All modules run in a single Python 3.11 venv on CPU. No cloud dependency for core operation.
        </p>
      </section>

      {/* ─── DATASET STRATEGY ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Database size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Dataset Strategy</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Transfer-first approach. Ready-made datasets (BdSLW401, iSign, ISLTranslate) provide
          ~15,000 pre-labelled sequences covering 460+ signs. Community collection via web platform
          targets 10–15 recordings per WBSL-specific sign from 3–5 signers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Model A", desc: "WBSL only (baseline)" },
            { label: "Model B", desc: "ISL pre-train → WBSL fine-tune" },
            { label: "Model C", desc: "ISL + WBSL mixed training" },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-md bg-surface border border-border text-center">
              <div className="text-xs font-mono font-bold text-accent-primary">{m.label}</div>
              <div className="text-xs text-text-secondary mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border border-border">
          <div className="text-xs font-mono text-text-muted mb-2">DATA INDEXING</div>
          <p className="text-xs text-text-secondary">
            Signer-disjoint splits enforced. Manifest-based indexing by provenance, signer, and verification status.
            Only human-accepted community data enters training. Embedding index rebuilt per dataset version.
          </p>
        </div>
      </section>

      {/* ─── UNKNOWN SIGN HANDLING ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle size={20} className="text-status-unknown" />
          <h2 className="text-2xl font-bold text-text-primary">Unknown Sign Handling</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          When the OOD gate detects a sign outside trained vocabulary, the system does not guess confidently.
          It generates a three-tier movement representation and produces ranked tentative candidates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tier: "LEVEL 1", label: "Numerical", desc: "finger_extension, velocity, repetition, duration, distance_to_mouth" },
            { tier: "LEVEL 2", label: "Symbolic", desc: "RIGHT_HAND INDEX_EXTENDED TOWARD_MOUTH REPEATED_3X NO_NMM" },
            { tier: "LEVEL 3", label: "Natural Language", desc: "\"The right hand moves toward the mouth, pauses, and returns. Repeated three times.\"" },
          ].map((level) => (
            <div key={level.tier} className="p-3 rounded-md bg-surface border border-border space-y-1">
              <div className="text-[10px] font-mono text-status-unknown">{level.tier}</div>
              <div className="text-xs font-semibold text-text-primary">{level.label}</div>
              <p className="text-[11px] text-text-muted leading-relaxed">{level.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border-l-2 border-l-status-unknown">
          <p className="text-xs font-mono text-text-secondary">
            Output: &ldquo;সম্ভবত&rdquo; (probably) is injected automatically into Bengali output.
            Every unknown sign carries STATUS: TENTATIVE — HUMAN VERIFICATION REQUIRED.
            The system never says &ldquo;predicted meaning.&rdquo;
          </p>
        </div>
      </section>

      {/* ─── COMMUNITY VERIFICATION ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Community Data Verification</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Privacy-first submission. Only landmarks are collected; original video is discarded on-device
          before transmission. Automated validation produces evidence only. Human reviewers make all
          final decisions. Compliant with India&rsquo;s Digital Personal Data Protection Act 2023.
        </p>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-md bg-surface border border-border">
          <Lock size={14} className="text-accent-primary" />
          <span className="text-xs font-mono text-text-secondary">
            AUTOMATION → ANALYSE → EXPLAIN → SIMULATE → SHOW EVIDENCE → HUMAN DECIDES
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: "ACCEPT", desc: "Enters trusted dataset", color: "text-status-approved" },
            { icon: XCircle, label: "REJECT", desc: "Not used for training", color: "text-status-error" },
            { icon: Clock3, label: "NEEDS REVIEW", desc: "2-of-3 consensus", color: "text-status-unknown" },
          ].map((d) => (
            <div key={d.label} className="p-3 rounded-md bg-surface border border-border text-center space-y-1">
              <d.icon size={16} className={`${d.color} mx-auto`} />
              <div className={`text-xs font-mono font-bold ${d.color}`}>{d.label}</div>
              <div className="text-[10px] text-text-muted">{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BIDIRECTIONAL SYSTEM ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquareText size={20} className="text-accent-secondary" />
          <h2 className="text-2xl font-bold text-text-primary">Bidirectional Communication</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-md bg-surface border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent-primary" />
              <span className="text-xs font-mono font-bold text-text-primary">FORWARD: SIGN → BENGALI</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Camera → MediaPipe → 126-dim landmarks → MLP/LSTM → OOD Gate → NMM + Emotion packet
              → Constrained LLM → Natural Bengali text → Dual-engine TTS audio
            </p>
          </div>
          <div className="p-4 rounded-md bg-surface border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent-secondary" />
              <span className="text-xs font-mono font-bold text-text-primary">REVERSE: BENGALI → SIGN</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Bengali text/voice → LLM gloss generation → Sign sequence mapping →
              Admin-approved reference videos → Continuous sequential playback
            </p>
          </div>
        </div>
      </section>

      {/* ─── PROJECT TEAM ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Project Research Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member) => (
            <div key={member.name} className="p-4 rounded-md bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">{member.name}</span>
                <span className="text-[10px] font-mono text-text-muted">{member.roll}</span>
              </div>
              <div className="text-xs font-mono text-accent-primary">{member.role}</div>
              <p className="text-[11px] text-text-muted">{member.focus}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-text-muted">Mentor: </span>
              <span className="text-sm font-semibold text-text-primary">Prof. Prabir Kr. Naskar</span>
            </div>
            <div>
              <span className="text-xs text-text-muted">Department: </span>
              <span className="text-sm text-text-secondary">CSE, Cooch Behar Government Engineering College</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONNECTIVITY NOTE ─── */}
      <section className="p-4 rounded-md bg-surface border border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-status-approved" />
            <span className="text-xs font-mono text-text-secondary">ONLINE: edge-tts + full features</span>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff size={14} className="text-status-pending" />
            <span className="text-xs font-mono text-text-secondary">OFFLINE: BanglaTTS + local LLM (KoboldCpp)</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-accent-primary" />
            <span className="text-xs font-mono text-text-secondary">LLM: LOCAL (gemma-4-E4B)</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER NOTE ─── */}
      <footer className="pt-8 border-t border-border">
        <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
          WBSL Bridge does not attempt to replicate the scale of Google DeepMind&rsquo;s SL2T (100,000+ hours,
          ASL → English, Pixel 11). It investigates whether the architectural principles demonstrated at
          high-resource scale can be adapted to a severely low-resource, linguistically distinct, regionally
          specific sign language with Bengali-language output, budget-device deployment, and bidirectional
          communication — none of which currently exists.
        </p>
      </footer>
    </PageContainer>
  );
}