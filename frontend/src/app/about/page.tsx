import React from "react";
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
      focus: "WBSL/ISL/BdSL sign recording coordination, dataset annotation, landmark data quality review",
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

  // NMM GATE stage removed — only 5 stages remain
  const pipelineStages = [
    {
      id: "camera",
      icon: Camera,
      label: "CAMERA",
      color: "text-accent-primary",
      desc: "30 FPS webcam capture, MediaPipe Holistic extracts hand, pose (8-point) and face landmarks",
    },
    {
      id: "recognition",
      icon: Hand,
      label: "RECOGNITION",
      color: "text-status-approved",
      desc: "98-dim shoulder-box feature vector → BiLSTM + Attention (64-frame temporal clips). Span-based auto-detection: hands raised = sign starts, hands lowered = inference runs.",
    },
    {
      id: "emotion",
      icon: Sparkles,
      label: "EMOTION",
      color: "text-accent-secondary",
      desc: "ViT-ONNX 7-class classifier, robust to glasses, ~30–50ms. Supplementary affective context for Bengali output tone.",
    },
    {
      id: "nlg",
      icon: Brain,
      label: "BENGALI NLG",
      color: "text-accent-primary",
      desc: "NVIDIA Nemotron 3.5-B (offline) / OpenRouter (online). 50-criteria constrained prompt. OpenAI-compatible API. AI_MODE selects the engine.",
    },
    {
      id: "tts",
      icon: Volume2,
      label: "TTS",
      color: "text-accent-primary",
      desc: "edge-tts (online, ~604 ms/word) → BanglaTTS (offline, ~453 ms/word) automatic fallback. ElevenLabs premium option.",
    },
  ];

  const techStack = [
    { category: "Vision", items: "MediaPipe Holistic 0.10.14 · OpenCV · ViT-ONNX (trpakov/vit-face-expression)" },
    { category: "ML", items: "PyTorch · ONNX Runtime · BiLSTM + Attention (98-dim shoulder box, 64-frame clips) · Training zone: extract → train → avatar_extract → test_model" },
    { category: "LLM", items: "NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf (offline, KoboldCpp) · OpenRouter (online) · OpenAI-compatible API · AI_MODE selection" },
    { category: "TTS", items: "edge-tts (bn-BD-NabanitaNeural) · BanglaTTS (silero) · ElevenLabs eleven_v3 (premium) · mutagen" },
    { category: "Frontend", items: "Next.js · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts · Three.js (3D avatar simulation)" },
    { category: "Backend", items: "FastAPI · Python 3.11 · Single venv deployment · .env-driven AI_MODE configuration" },
  ];

  const gaps = [
    { id: "G4", label: "WB Regional Sign Focus", status: "OPEN — VERIFIED", detail: "Zero AI/ML projects exist for WBSL, ISL, or BdSL as used in West Bengal. Only resource: 170 Wikisigns entries" },
    { id: "G15", label: "WBSL ≠ ISL ≠ BdSL", status: "OPEN — VERIFIED", detail: "Johnson & Johnson (2016) proved linguistic distinctness. All tech targets Bangladesh or Delhi" },
    { id: "G6", label: "Sign → Bengali Translation", status: "OPEN", detail: "No system produces grammatically correct Bengali from signs for the WB region" },
    { id: "G7", label: "Constrained LLM Integration", status: "OPEN", detail: "No sign language system uses LLM with anti-hallucination constraints" },
    { id: "G10", label: "Bidirectional Communication", status: "OPEN", detail: "Google SL2T is forward-only. Reverse path not deployed anywhere" },
    { id: "G13", label: "Low-Resource Transfer", status: "OPEN", detail: "Google uses 100,000+ hours. WB region has near-zero. What works without scale?" },
  ];

  const currentStatus = [
    { label: "MediaPipe Stream", desc: "Hand + 8-point pose + 19-point face extracted at stable 30 FPS.", status: "DONE" },
    { label: "Emotion Detection", desc: "ViT-ONNX 7-class classifier (glasses-robust) live. NMM geometry markers removed.", status: "DONE" },
    { label: "98-dim Feature Extraction", desc: "Shoulder-box coordinate system. 66 handshape + 12 palm + 4 wrist + 4 elbow + 6 wrist-face + 3 head + 2 flags + 1 duration.", status: "DONE" },
    { label: "BiLSTM + Attention Model", desc: "Model 5 (sign_daily_lstm.onnx). Input: (batch, 64, 98). Span-based auto-detection with pre-roll and tail trimming.", status: "DONE" },
    { label: "Bengali NLG & TTS", desc: "AI_MODE env variable. Offline: Nemotron 3.5-B via KoboldCpp. Online: OpenRouter. Dual-engine TTS.", status: "DONE" },
    { label: "3D Avatar Simulation", desc: "Per-gloss avatar data (pose.npy, hands.npy, face.npy, t.npy) served from model bundle. Three.js 3D rendering.", status: "DONE" },
  ];

  const roadmap = [
    { num: 1, label: "Expanded Sign Vocabulary", desc: "Growing the training dataset with more WBSL-specific signs beyond the current ISL-based vocabulary.", active: true },
    { num: 2, label: "WB Region Data Creation", desc: "A dedicated data collector tool is being prepared to build the first continuous dataset for WBSL/ISL/BdSL.", active: true },
    { num: 3, label: "Community Contributions", desc: "Planned future feature. Privacy-first landmark submission with human verification pipeline. Currently disabled.", active: false },
    { num: 4, label: "Field Survey", desc: "50+ field verification questions prepared and structured for real-world community data collection.", active: true },
    { num: 5, label: "Unknown Sign Handling", desc: "Fully implementing the 'Honesty Layer' to detect unknown signs and prevent AI hallucination.", active: false },
  ];

  return (
    <PageContainer className="max-w-5xl py-16 space-y-20">
      {/* ─── HERO ── */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-primary">
          <BookOpen size={14} />
          <span>Academic Research Project · CSE · 7th Semester · 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          WBSL Bridge
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
          Intent-aware bidirectional sign language communication for the Deaf community of West Bengal. 
          Designed to support WBSL, ISL, BdSL, and mixed signing with unknown sign handling and community-driven growth.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {["WBSL/ISL/BdSL Support", "Bengali ↔ Sign", "Unknown Sign Honesty", "Privacy-First", "CPU-Only", "Offline-Capable"].map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-surface-elevated border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ── THE PROBLEM ─── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-status-error" />
          <h2 className="text-2xl font-bold text-text-primary">The Verified Technological Void</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          The Deaf community in West Bengal uses various sign varieties including West Bengal Sign Language (WBSL), 
          Indian Sign Language (ISL), and Bangladeshi Sign Language (BdSL), often mixing them. 
          Despite this, an exhaustive search confirmed:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            "ZERO systems handling continuous signs for WB region",
            "ZERO tools supporting mixed WBSL/ISL/BdSL signing",
            "ZERO WBSL/ISL/BdSL → Bengali translators",
            "ZERO projects from WB universities",
            "Only resource: 170 Wikisigns entries",
            "Existing tech targets Bangladesh or Delhi only",
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
            and targets Bangladesh BdSL — a linguistically separate sign language — not the WBSL, ISL, or BdSL 
            varieties actually used by the Deaf community in West Bengal, India.
          </p>
        </div>
      </section>

      {/* ── CURRENT STATUS & ROADMAP ─── */}
      <section className="space-y-8">
        {/* Current Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-accent-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Current Implementation Status</h2>
          </div>
          <div className="space-y-3">
            {currentStatus.map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-md border bg-surface border-border">
                <div className="flex items-center gap-3 sm:w-1/3">
                  <CheckCircle2 size={18} className="text-status-approved shrink-0" />
                  <span className="text-sm font-semibold text-text-primary">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-text-secondary sm:w-2/3">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ArrowRight size={20} className="text-accent-secondary" />
            <h2 className="text-2xl font-bold text-text-primary">Roadmap & Active Progress</h2>
          </div>
          <div className="space-y-3">
            {roadmap.map((item) => (
              <div key={item.num} className={`flex items-start gap-4 p-4 rounded-md border ${item.active ? "bg-status-unknown/5 border-status-unknown" : "bg-surface border-border"}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-bold ${item.active ? "bg-status-unknown text-white" : "bg-accent-primary text-white"}`}>
                  {item.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary">{item.label}</span>
                    {item.active && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-unknown text-white font-bold">
                        ACTIVE PROGRESS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
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

        {/* Pipeline Flow — now 5 stages (NMM removed) */}
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
                    <span className="text-[10px] font-mono text-text-muted">STAGE {i + 1}/{pipelineStages.length}</span>
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
            { title: "98-dim Shoulder Box Features", desc: "Signer-independent coordinate system. Origin at shoulder midpoint, unit = shoulder width. Removes skin color, background, lighting bias." },
            { title: "Span-Based Auto-Detection", desc: "Hands raised → recording starts automatically. Hands lowered → 64-frame clip selected → inference. No button press needed." },
            { title: "Open-Set Honesty Layer", desc: "OOD gate detects unknown signs BEFORE LLM reasoning. Output carries সম্ভবত (probably), never forced classification." },
            { title: "Privacy-First Design", desc: "Landmarks only, never raw video. Community contributions planned as future feature. DPDP Act 2023 compliant." },
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
          All modules run in a single Python 3.11 venv on CPU. No cloud dependency for core operation. AI_MODE in .env selects offline or online LLM.
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
          ~15,000 pre-labelled sequences covering 460+ signs. Training pipeline: extract.py → train.py → avatar_extract.py → test_model.py.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Model A", desc: "WBSL only (baseline)" },
            { label: "Model B", desc: "ISL pre-train → WBSL fine-tune" },
            { label: "Model C", desc: "ISL + WBSL + BdSL mixed training" },
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
            Signer-disjoint splits enforced. Features id and model id are append-only (new id per run).
            Daily report and confusion matrix stored per model. Avatar data co-located with model bundle.
          </p>
        </div>
      </section>

      {/* ─── UNKNOWN SIGN HANDLING ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle size={20} className="text-status-unknown" />
          <h2 className="text-2xl font-bold text-text-primary">Unknown Sign Handling</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          When the confidence margin is below threshold or top probability &lt; 0.5, the system reports &quot;Not sure&quot;
          instead of guessing. It generates ranked tentative candidates from the top-3 model outputs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tier: "LEVEL 1", label: "Numerical", desc: "finger_extension, velocity, repetition, duration, distance_to_mouth" },
            { tier: "LEVEL 2", label: "Symbolic", desc: "RIGHT_HAND INDEX_EXTENDED TOWARD_MOUTH REPEATED_3X" },
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

      {/* ─── COMMUNITY DATA (PLANNED FUTURE) ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Community Data Collection</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-pending/20 border border-status-pending/40 text-status-pending font-bold">
            PLANNED FUTURE FEATURE
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Privacy-first submission. Only landmarks will be collected; original video discarded on-device
          before transmission. Automated validation will produce evidence only. Human reviewers will make all
          final decisions. Compliant with India&rsquo;s Digital Personal Data Protection Act 2023.
        </p>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-md bg-surface border border-border opacity-60">
          <Lock size={14} className="text-accent-primary" />
          <span className="text-xs font-mono text-text-secondary">
            AUTOMATION → ANALYSE → EXPLAIN → SIMULATE → SHOW EVIDENCE → HUMAN DECIDES
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 opacity-60">
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
              Camera → MediaPipe → 98-dim shoulder-box features → BiLSTM + Attention (64 frames)
              → Emotion ViT → Constrained LLM (AI_MODE) → Natural Bengali text → Dual-engine TTS audio
            </p>
          </div>
          <div className="p-4 rounded-md bg-surface border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent-secondary" />
              <span className="text-xs font-mono font-bold text-text-primary">REVERSE: BENGALI → SIGN</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Bengali text/voice → LLM gloss generation → Sign sequence mapping →
              Avatar landmark replay → Continuous sequential 3D simulation
            </p>
          </div>
        </div>
      </section>

      {/* ── PROJECT TEAM ─── */}
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
            <span className="text-xs font-mono text-text-secondary">ONLINE: edge-tts + OpenRouter LLM</span>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff size={14} className="text-status-pending" />
            <span className="text-xs font-mono text-text-secondary">OFFLINE: BanglaTTS + Nemotron 3.5-B (KoboldCpp)</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-accent-primary" />
            <span className="text-xs font-mono text-text-secondary">AI_MODE in .env selects the engine</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER NOTE ─── */}
      <footer className="pt-8 border-t border-border">
        <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
          WBSL Bridge does not attempt to replicate the scale of Google DeepMind&rsquo;s SL2T (100,000+ hours,
          ASL → English, Pixel 11). It investigates whether the architectural principles demonstrated at
          high-resource scale can be adapted to a severely low-resource, linguistically distinct, regionally
          specific sign language ecosystem (WBSL, ISL, BdSL) with Bengali-language output, budget-device deployment, 
          and bidirectional communication — none of which currently exists.
        </p>
      </footer>
    </PageContainer>
  );
}