"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  NmmThresholdPanel,
  DEFAULT_ALL,
  COMMIT_STORAGE_KEY,
  type AllThresholds,
} from "@/components/sign/NmmThresholdPanel";
import { EmotionPanel } from "@/components/sign/EmotionPanel";
import {
  Camera,
  CameraOff,
  Volume2,
  Trash2,
  Loader2,
  Delete,
  Plus,
  Activity,
  Sparkles,
  HelpCircle,
  XCircle,
  CheckCircle2,
  Megaphone,
  Timer,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000";

/** How long an auto-detected non-manual marker stays armed (ms). */
const NMM_ARM_MS = 2500;

interface Prediction {
  detected: boolean;
  label: string;
  confidence: number;
  top5: { label: string; confidence: number }[];
  hands_detected: number;
  nmm: {
    question: boolean;
    wh_question: boolean;
    negation: boolean;
    affirmation: boolean;
    emphasis: boolean;
  };
  emotion?: EmotionResult | null;
  metrics?: NmmMetrics | null;
}

interface EmotionResultShape {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

type EmotionResult = EmotionResultShape;

interface NmmMetrics {
  brow_ratio: number;
  mouth_ratio: number;
  shake_var: number;
  nod_var: number;
}

interface DetectedSign {
  gloss: string;
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
}

/** Manual marker overrides the user can arm from the UI. */
type MarkerKey =
  | "question"
  | "wh_question"
  | "negation"
  | "affirmation"
  | "emphasis";

/**
 * [affirmation] and [emphasis] have no symbol in the LLM prompt's notation
 * guide, so they are never appended to the gloss string. They still travel in
 * the `nmm` metadata payload, where the model is told what they mean.
 */
const MARKER_SYMBOL: Record<MarkerKey, string | null> = {
  question: "?",
  wh_question: "wh",
  negation: "negation",
  affirmation: null,
  emphasis: null,
};

interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  detail?: string;
  top3?: { label: string; confidence: number }[];
}

interface CatalogSign {
  label: string;
  bengali_meaning?: string;
}

export default function SignToTextPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [detectedHistory, setDetectedHistory] = useState<DetectedSign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const [live, setLive] = useState<{
    label: string;
    confidence: number;
    margin: number;
  } | null>(null);

  const [autoDetect, setAutoDetect] = useState(true);
  const [catalog, setCatalog] = useState<CatalogSign[]>([]);
  const [pickSign, setPickSign] = useState("");
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [thresholds, setThresholds] =
    useState<AllThresholds>(DEFAULT_ALL);

  const thresholdsRef = useRef<AllThresholds>(DEFAULT_ALL);

  // Manual / auto-detected non-manual markers armed for the NEXT sign.
  const [armed, setArmed] = useState<Record<MarkerKey, boolean>>({
    question: false,
    wh_question: false,
    negation: false,
    affirmation: false,
    emphasis: false,
  });
  // Markers detected in the latest window that would be LOST if not applied now.
  const [pendingNmm, setPendingNmm] =
    useState<Prediction["nmm"] | null>(null);
  const [repeatBlocked, setRepeatBlocked] = useState(false);

  const armTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const armedRef = useRef(armed);

  useEffect(() => {
    armedRef.current = armed;
  }, [armed]);

  useEffect(() => {
    thresholdsRef.current = thresholds;
  }, [thresholds]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COMMIT_STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      setThresholds((prev) => ({ ...prev, ...saved }));
    } catch {
      // Defaults remain active.
    }
  }, []);

  const [nmmFlags, setNmmFlags] =
    useState<Prediction["nmm"] | null>(null);

  const [bengaliOutput, setBengaliOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<"1" | "2">("1");
  const [unifiedActive, setUnifiedActive] = useState(false);

  const frameBufferRef = useRef<Blob[]>([]);
  const candidateRef = useRef<{
    label: string;
    count: number;
  } | null>(null);

  const lastAppendRef = useRef<{
    label: string;
    at: number;
  }>({
    label: "",
    at: 0,
  });

  const [activeClasses, setActiveClasses] = useState(35);

  const [contract, setContract] = useState<{
    kind: "static" | "temporal";
    frames: number;
    endpoint: string;
  }>({
    kind: "static",
    frames: 1,
    endpoint: "/api/predict/frame",
  });

  const [coverage, setCoverage] = useState<{
    with_media: number;
    total_classes: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/system/health`)
      .then((res) => {
        if (cancelled) return;

        setBackendOnline(true);
        setUnifiedActive(!!res.data.unified);

        if (typeof res.data.active_classes === "number") {
          setActiveClasses(res.data.active_classes);
        }

        if (res.data.contract) {
          setContract(res.data.contract);
        }

        if (res.data.reference_coverage) {
          setCoverage(res.data.reference_coverage);
        }
      })
      .catch(() => {
        if (!cancelled) setBackendOnline(false);
      });

    axios
      .get(`${API_BASE}/api/coverage`)
      .then((res) => {
        if (cancelled) return;

        const items: CatalogSign[] = res.data.items ?? [];

        setCatalog(items);

        if (items.length) {
          setPickSign(items[0].label);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const isTemporal = contract.kind === "temporal";

  const startCamera = async () => {
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: 640,
          height: 480,
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);

      frameBufferRef.current = [];
      candidateRef.current = null;

      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          isTemporal ? doAutoDetectTick : doCaptureAndPredict,
          isTemporal ? 350 : 1000
        );
      }
    } catch {
      setCameraError(
        "Camera unavailable. Check browser permissions and try again."
      );

      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const buildGlossString = (history: DetectedSign[]) => {
    if (history.length === 0) return "";

    // [?] belongs to the last sign of a question, BUT a question is only a
    // question if something is actually being asked about: a WH-word, or a
    // negated / affirmed clause. A bare head shake must not become "...?)".
    const last = history[history.length - 1];
    const questionAnchored = history.some(
      (h) => h.wh_question || h.negation || h.affirmation || h.emphasis
    );
    const asksQuestion =
      questionAnchored && (last.question || last.wh_question);

    return history
      .map((h, i) => {
        let tok = h.gloss;

        if (h.negation) {
          tok += "[negation]";
        }

        if (asksQuestion && i === history.length - 1) {
          tok += "[?]";
        }

        return tok;
      })
      .join(" + ");
  };

  const doCaptureAndPredict = async () => {
    if (isProcessingRef.current) return;
    if (isTemporal) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7)
      );

      if (!blob) return;

      const formData = new FormData();

      formData.append("file", blob, "frame.jpg");

      const res = await axios.post<Prediction>(
        `${API_BASE}/api/predict/frame`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPrediction(res.data);
      setNmmFlags(res.data.nmm);

      if (
        res.data.detected &&
        res.data.confidence > 0.5
      ) {
        const f = res.data.nmm;

        setDetectedHistory((prev) => {
          const last = prev[prev.length - 1];

          if (last && last.gloss === res.data.label) {
            const merged: DetectedSign = {
              ...last,
              question: last.question || f.question,
              wh_question:
                last.wh_question || f.wh_question,
              negation: last.negation || f.negation,
              affirmation:
                last.affirmation || f.affirmation,
              emphasis:
                last.emphasis || f.emphasis,
            };

            return [
              ...prev.slice(0, -1),
              merged,
            ];
          }

          return [
            ...prev,
            {
              gloss: res.data.label,
              question: f.question,
              wh_question: f.wh_question,
              negation: f.negation,
              affirmation: f.affirmation,
              emphasis: f.emphasis,
            },
          ];
        });
      }
    } catch {
      // Keep camera running.
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const handleStreamAndSpeak = async () => {
    if (
      detectedHistory.length === 0 ||
      isGenerating
    ) {
      return;
    }

    setIsGenerating(true);
    setBengaliOutput("");

    let full = "";

    try {
      const gloss = buildGlossString(
        detectedHistory
      );

      const response = await fetch(
        `${API_BASE}/api/nlg/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // NMM + affect travel alongside the gloss so the LLM is not left
          // guessing at the question / negation / emotion context.
          body: JSON.stringify({
            gloss,
            nmm,
            emotion,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("stream unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const data = line
            .slice(6)
            .trim();

          if (data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);

            if (
              parsed.type === "delta" &&
              parsed.text
            ) {
              full += parsed.text;
              setBengaliOutput(full);
            } else if (
              parsed.type === "done" &&
              parsed.bengali_text
            ) {
              full = parsed.bengali_text;
              setBengaliOutput(full);
            } else if (
              parsed.type === "error"
            ) {
              toast.error(
                parsed.error || "LLM error"
              );
            }
          } catch {
            // Ignore malformed SSE chunk.
          }
        }
      }
    } catch {
      toast.error(
        "Streaming failed — check LLM configuration in .env"
      );
    } finally {
      setIsGenerating(false);
    }

    const text = full.trim();

    if (!text) return;

    setIsPlayingAudio(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/tts/generate`,
        {
          text,
          voice: voiceId,
        }
      );

      if (res.data.audio_url) {
        const audio = new Audio(
          `${API_BASE}${res.data.audio_url}`
        );

        audio.onended = () =>
          setIsPlayingAudio(false);

        audio.onerror = () =>
          setIsPlayingAudio(false);

        await audio.play();

        return;
      }
    } catch {
      // Fall through to browser speech.
    }

    if ("speechSynthesis" in window) {
      const u =
        new SpeechSynthesisUtterance(text);

      u.lang = "bn-IN";

      u.onend = () =>
        setIsPlayingAudio(false);

      u.onerror = () =>
        setIsPlayingAudio(false);

      window.speechSynthesis.speak(u);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const clearArmed = () => {
    Object.values(armTimersRef.current).forEach((t) => clearTimeout(t));
    armTimersRef.current = {};

    const off: Record<MarkerKey, boolean> = {
      question: false,
      wh_question: false,
      negation: false,
      affirmation: false,
      emphasis: false,
    };

    setArmed(off);
    armedRef.current = off;
    setPendingNmm(null);
  };

  const toggleMarker = (key: MarkerKey) => {
    const next = { ...armedRef.current, [key]: !armedRef.current[key] };

    // WH and polar questions are mutually exclusive: a single brow position
    // cannot encode both, and allowing both produces "...?" plus a WH frame.
    if (key === "question" && next.question) next.wh_question = false;
    if (key === "wh_question" && next.wh_question) next.question = false;

    if (armTimersRef.current[key]) {
      clearTimeout(armTimersRef.current[key]);
      delete armTimersRef.current[key];
    }

    if (next[key]) {
      // Auto-expire: a marker armed but never consumed would silently attach
      // itself to an unrelated sign minutes later.
      armTimersRef.current[key] = setTimeout(() => {
        setArmed((prev) => ({ ...prev, [key]: false }));
      }, NMM_ARM_MS);
    }

    setArmed(next);
    armedRef.current = next;
  };

  const appendGloss = (
    gloss: string,
    nmm?: DetectedSign
  ) => {
    // Merge the manually / recently armed markers with whatever the model saw,
    // so a marker the user turned on is never dropped by auto-detection.
    const a = armedRef.current;

    const applied: DetectedSign = {
      gloss,
      question: !!nmm?.question || a.question,
      wh_question: !!nmm?.wh_question || a.wh_question,
      negation: !!nmm?.negation || a.negation,
      affirmation: !!nmm?.affirmation || a.affirmation,
      emphasis: !!nmm?.emphasis || a.emphasis,
    };

    setDetectedHistory((prev) => [...prev, applied]);

    // A question only marks the END of the clause, so it is consumed (and
    // re-armed automatically if the detector still sees the brow raise).
    const keep = Object.fromEntries(
      (Object.keys(MARKER_SYMBOL) as MarkerKey[]).map((k) => [
        k,
        k === "question" || k === "wh_question"
          ? pendingNmm?.[k] === true
          : a[k],
      ])
    ) as Record<MarkerKey, boolean>;

    setArmed(keep);
    armedRef.current = keep;
    setPendingNmm(null);
  };

  /**
   * Everything the recognition stage knows but the gloss string cannot show.
   * This is what makes the questions block an OPTION rather than a blind rule:
   * the LLM only marks a question when a marker was really detected or armed.
   */
  const nmm = {
    question: armed.question || !!pendingNmm?.question,
    wh_question: armed.wh_question || !!pendingNmm?.wh_question,
    negation: armed.negation || !!pendingNmm?.negation,
    affirmation: armed.affirmation || !!pendingNmm?.affirmation,
    emphasis: armed.emphasis || !!pendingNmm?.emphasis,
  };

  const markerRows: {
    key: MarkerKey;
    label: string;
    hint: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "wh_question",
      label: "WH-Q",
      hint: "What / why / how question (brow furrow)",
      icon: <HelpCircle size={12} />,
    },
    {
      key: "question",
      label: "YES/NO Q",
      hint: "Polar question (eyebrow raise)",
      icon: <HelpCircle size={12} />,
    },
    {
      key: "negation",
      label: "NEGATION",
      hint: "Negate the next sign (head shake)",
      icon: <XCircle size={12} />,
    },
    {
      key: "affirmation",
      label: "AFFIRM",
      hint: "Confirm the next sign (head nod)",
      icon: <CheckCircle2 size={12} />,
    },
    {
      key: "emphasis",
      label: "EMPHASIS",
      hint: "Stress the next sign (mouth open)",
      icon: <Megaphone size={12} />,
    },
  ];

  const handleBackspace = () => {
    if (detectedHistory.length === 0) {
      return;
    }

    const dropped = detectedHistory[detectedHistory.length - 1];

    setDetectedHistory((prev) =>
      prev.slice(0, -1)
    );

    // Push the dropped sign's markers back into the armed set -- otherwise a
    // question / negation that was attached to it is gone from the text but
    // still sitting in the LLM's metadata, and the next generation is wrong.
    const restored: Record<MarkerKey, boolean> = {
      question: !!(pendingNmm?.question || dropped.question),
      wh_question: !!(pendingNmm?.wh_question || dropped.wh_question),
      negation: !!(pendingNmm?.negation || dropped.negation),
      affirmation: !!(pendingNmm?.affirmation || dropped.affirmation),
      emphasis: !!(pendingNmm?.emphasis || dropped.emphasis),
    };

    setArmed(restored);
    armedRef.current = restored;
    setPendingNmm(null);

    setBengaliOutput("");
  };

  const handleAddPick = () => {
    if (!pickSign) return;

    appendGloss(pickSign);
    setBengaliOutput("");
  };

  const handleClear = () => {
    setDetectedHistory([]);
    setPrediction(null);
    setNmmFlags(null);
    setBengaliOutput("");
    setLive(null);
    setRepeatBlocked(false);

    clearArmed();

    candidateRef.current = null;

    lastAppendRef.current = {
      label: "",
      at: 0,
    };

    frameBufferRef.current = [];
  };

  const doAutoDetectTick = async () => {
    if (
      isProcessingRef.current ||
      !isTemporal
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      !video.videoWidth
    ) {
      return;
    }

    const nFrames =
      contract.frames || 32;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const blob =
      await new Promise<Blob | null>(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.7
          )
      );

    if (!blob) return;

    const buf =
      frameBufferRef.current;

    buf.push(blob);

    while (buf.length > nFrames) {
      buf.shift();
    }

    if (buf.length < nFrames) {
      setPrediction(null);
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const fd = new FormData();

      buf.forEach((frame, i) => {
        fd.append(
          "files",
          frame,
          `f${i}.jpg`
        );
      });

      const res =
        await axios.post<StreamResult>(
          `${API_BASE}/api/predict/stream`,
          fd,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
            timeout: 15000,
          }
        );

      if (
        !res.data.ready ||
        !res.data.label
      ) {
        setLive(null);
        candidateRef.current = null;
        setPrediction(null);
        return;
      }

      const {
        label,
        confidence = 0,
        margin = 0,
        top3 = [],
      } = res.data;

      const nmmPayload = (
        res.data as unknown as {
          nmm?: Record<string, unknown>;
        }
      ).nmm;

      const emo =
        (nmmPayload?.emotion ??
          null) as EmotionResult | null;

      if (emo) {
        setEmotion(emo);
      }

      setPrediction({
        detected: true,
        label,
        confidence,
        top5: top3.map((t) => ({
          label: t.label,
          confidence: t.confidence,
        })),
        hands_detected: 1,
        nmm:
          (nmmPayload as Prediction["nmm"]) ??
          {
            question: false,
            wh_question: false,
            negation: false,
            affirmation: false,
            emphasis: false,
          },
        emotion: emo,
        metrics:
          (nmmPayload?.metrics ??
            null) as NmmMetrics | null,
      });

      const T =
        thresholdsRef.current;

      // The window's NMM / affect belongs to the SIGN being recognised, not to
      // the previous one. Capture it BEFORE the confidence gates below: a
      // rejected window is exactly when a head shake would otherwise be lost
      // (the detector only looks at the latest frame).
      const nn =
        (nmmPayload as Prediction["nmm"]) ?? {
          question: false,
          wh_question: false,
          negation: false,
          affirmation: false,
          emphasis: false,
        };

      const hasNmm = !!(
        nn.question ||
        nn.wh_question ||
        nn.negation ||
        nn.affirmation ||
        nn.emphasis
      );

      if (hasNmm && !nn.affirmation) {
        setPendingNmm((prev) => ({
          question: !!(prev?.question || nn.question),
          wh_question: !!(prev?.wh_question || nn.wh_question),
          negation: !!(prev?.negation || nn.negation),
          affirmation: !!(prev?.affirmation || nn.affirmation),
          emphasis: !!(prev?.emphasis || nn.emphasis),
        }));
      }

      const decisive =
        confidence >= T.min_confidence &&
        margin >= T.min_margin;

      if (!decisive) {
        setLive({
          label,
          confidence,
          margin,
        });

        candidateRef.current = null;

        return;
      }

      setLive({
        label,
        confidence,
        margin,
      });

      const cand =
        candidateRef.current;

      const count =
        cand &&
        cand.label === label
          ? cand.count + 1
          : 1;

      candidateRef.current = {
        label,
        count,
      };

      if (
        count <
        Math.max(
          1,
          Math.round(
            T.stable_windows
          )
        )
      ) {
        return;
      }

      const now = Date.now();
      const last =
        lastAppendRef.current;

      if (
        last.label === label &&
        now - last.at <
          T.repeat_cooldown_ms
      ) {
        // Swallowing this silently makes the UI look dead while the model is
        // actually recognising the sign again. Surface it instead.
        setRepeatBlocked(true);
        setTimeout(() => setRepeatBlocked(false), 1200);
        return;
      }

      lastAppendRef.current = {
        label,
        at: now,
      };

      candidateRef.current = null;

      if (autoDetect) {
        appendGloss(label, {
          gloss: label,
          question: !!nn.question,
          wh_question: !!nn.wh_question,
          negation: !!nn.negation,
          affirmation: !!nn.affirmation,
          emphasis: !!nn.emphasis,
        });
      }
    } catch (err) {
      // Keep camera and buffer alive.
      console.warn(
        "recognition tick failed:",
        err
      );
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const anyQuestion = detectedHistory.some(
    (h) => h.question || h.wh_question
  );

  const glossPreview = detectedHistory.length
    ? buildGlossString(detectedHistory)
    : "—";

  return (
    <PageContainer className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-4 lg:py-5 overflow-x-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline
                  ? "bg-accent-primary animate-pulse"
                  : "bg-status-error"
              }`}
            />

            <span
              className={
                backendOnline
                  ? "text-accent-primary"
                  : "text-status-error"
              }
            >
              {backendOnline
                ? "ONLINE"
                : "OFFLINE"}
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary truncate">
            Sign{" "}
            <span className="text-accent-primary">
              →
            </span>{" "}
            Bengali
          </h1>

          {isTemporal && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded border border-accent-primary/40 bg-accent-primary/10 text-[9px] font-mono text-accent-primary uppercase">
              <Activity size={10} />
              Temporal
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 rounded bg-surface border border-border text-[9px] font-mono">
            <span className="text-text-muted">
              MODEL{" "}
            </span>
            <span className="text-text-primary font-bold">
              {unifiedActive
                ? "LSTM"
                : "MLP"}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded bg-surface border border-border text-[9px] font-mono">
            <span className="text-text-muted">
              CLS{" "}
            </span>
            <span className="text-accent-primary font-bold">
              {activeClasses}
            </span>
          </div>

          {coverage && (
            <div className="px-2.5 py-1 rounded bg-surface border border-border text-[9px] font-mono">
              <span className="text-text-muted">
                MEDIA{" "}
              </span>
              <span
                className={
                  coverage.with_media ===
                  coverage.total_classes
                    ? "text-accent-primary font-bold"
                    : "text-status-warning font-bold"
                }
              >
                {coverage.with_media}/
                {coverage.total_classes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* OFFLINE */}
      {!backendOnline && (
        <div className="mt-3 p-2.5 rounded-lg bg-status-error/10 border border-status-error/30 text-[10px] font-mono text-status-error">
          Backend is not running. Start:
          {" "}
          <code className="bg-surface px-1 rounded">
            uvicorn backend.main:app --reload --port 8000
          </code>
        </div>
      )}

      {/* MAIN DESKTOP WORKSPACE */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.02fr_0.78fr_1.18fr] gap-4 lg:items-stretch min-w-0">
        {/* LEFT: CAMERA + AFFECT */}
        <div className="min-w-0 flex flex-col gap-3 lg:h-[650px]">
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-secondary flex items-center gap-2 shrink-0">
            <Camera size={12} className="text-accent-primary" />
            Camera
          </div>

          {/* CAMERA */}
          <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-[285px] bg-black rounded-xl overflow-hidden border border-border/80 shadow-lg flex items-center justify-center shrink-0">
            <canvas
              ref={canvasRef}
              className="hidden"
            />

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive
                  ? ""
                  : "hidden"
              }`}
            />

            {!cameraActive &&
              cameraError && (
                <div className="absolute inset-0 bg-surface flex items-center justify-center p-4">
                  <div className="text-center space-y-2 max-w-xs">
                    <CameraOff
                      size={24}
                      className="mx-auto text-status-error"
                    />

                    <p className="text-[11px] font-semibold text-text-primary">
                      Camera unavailable
                    </p>

                    <p className="text-[10px] text-text-secondary">
                      {cameraError}
                    </p>

                    <button
                      onClick={
                        startCamera
                      }
                      className="px-3 py-1.5 rounded bg-accent-primary text-black text-[10px] font-mono font-semibold"
                    >
                      Request Permissions
                    </button>
                  </div>
                </div>
              )}

            {!cameraActive &&
              !cameraError && (
                <div className="absolute inset-0 bg-surface flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera
                      size={28}
                      className="mx-auto text-text-muted"
                    />

                    <button
                      onClick={
                        startCamera
                      }
                      disabled={
                        !backendOnline
                      }
                      className="px-5 py-2 rounded bg-accent-primary text-black font-mono text-[10px] uppercase font-bold hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              )}

            {isProcessing &&
              cameraActive && (
                <div className="absolute top-2 right-2 bg-surface/90 border border-border px-2 py-1 rounded text-[9px] font-mono text-status-pending">
                  PROCESSING...
                </div>
              )}
          </div>

          {/* CAMERA STATUS */}
          <div className="h-9 flex items-center justify-between px-3 rounded-lg bg-surface/60 border border-border/80 shrink-0">
            <span className="flex items-center gap-2 text-[9px] font-mono text-text-secondary">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  cameraActive
                    ? "bg-accent-primary animate-pulse"
                    : "bg-text-muted"
                }`}
              />

              {cameraActive
                ? isTemporal
                  ? `${contract.frames}-FRAME WINDOW`
                  : "POLLING 1S"
                : "CAMERA OFF"}
            </span>

            {cameraActive && (
              <button
                onClick={stopCamera}
                className="px-2 py-1 rounded bg-status-error/10 border border-status-error/30 text-status-error text-[9px] font-mono"
              >
                STOP
              </button>
            )}
          </div>

          {/* AFFECT */}
          <div className="min-h-0 flex-1 rounded-xl border border-border/80 bg-surface/60 overflow-hidden">
            <EmotionPanel emotion={emotion} />
          </div>
        </div>

          {/* MIDDLE: RECOGNITION */}
        <div className="min-w-0 flex flex-col gap-3 lg:h-[650px]">
          <div className="flex items-center justify-between gap-2 shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-secondary flex items-center gap-2">
              <Sparkles
                size={12}
                className="text-accent-primary"
              />
              Recognition
            </div>

            {/* Opens the threshold modal. It lives here rather than as an inline
                block because ten sliders plus their explanations occupied a
                third of the column permanently, pushing the actual recognition
                output off-screen. */}
            <NmmThresholdPanel
              values={thresholds}
              onChange={setThresholds}
              variant="header"
            />
          </div>

          {/* RECOGNITION RESULT */}
          <div className="h-[150px] rounded-xl border border-border/80 bg-surface/60 p-3.5 flex flex-col min-h-0">
            {live && (
              <div className="mb-2 flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-background border border-border">
                <span className="text-[8px] font-mono uppercase text-text-muted">
                  {repeatBlocked
                    ? "COOLDOWN"
                    : "HOLDING"}
                </span>

                <span className="text-[9px] font-mono text-accent-secondary truncate">
                  {live.label} ·{" "}
                  {Math.round(
                    live.confidence * 100
                  )}
                  %
                </span>
              </div>
            )}

            {prediction ? (
              prediction.detected ? (
                <div className="space-y-2 min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold font-mono text-accent-primary truncate">
                      {prediction.label}
                    </span>

                    <span className="text-xs font-mono text-text-secondary shrink-0">
                      {Math.round(
                        prediction.confidence *
                          100
                      )}
                      %
                    </span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border">
                    {prediction.top5
                      .slice(0, 5)
                      .map(
                        (
                          item,
                          idx
                        ) => (
                          <div
                            key={idx}
                            className="flex justify-between text-[9px] font-mono"
                          >
                            <span
                              className={
                                idx === 0
                                  ? "text-text-primary font-semibold"
                                  : "text-text-muted"
                              }
                            >
                              {
                                item.label
                              }
                            </span>

                            <span
                              className={
                                idx === 0
                                  ? "text-accent-primary"
                                  : "text-text-muted"
                              }
                            >
                              {Math.round(
                                item.confidence *
                                  100
                              )}
                              %
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-text-muted">
                    NO HAND DETECTED
                  </span>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[9px] font-mono text-text-muted">
                  WAITING
                </span>
              </div>
            )}
          </div>

          {/* NMM — DETECTOR STATE + MANUAL MARKER OPTIONS */}
          <div className="rounded-xl border border-border/80 bg-surface/60 p-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase text-text-muted">
                NMM · Sent to LLM
              </span>

              <span className="text-[8px] font-mono text-text-muted">
                DETECTED
              </span>
            </div>

            {/* Read-only detector readout: what the face is doing right now. */}
            <div className="grid grid-cols-5 gap-1 mb-2">
              {([
                ["Q", nmmFlags?.question],
                ["WH", nmmFlags?.wh_question],
                ["NEG", nmmFlags?.negation],
                ["AFM", nmmFlags?.affirmation],
                ["EMP", nmmFlags?.emphasis],
              ] as [string, boolean | undefined][]).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className={`h-5 flex items-center justify-center rounded border text-[7px] font-mono ${
                      value
                        ? "bg-accent-primary/15 border-accent-primary/50 text-accent-primary"
                        : "border-border text-text-muted"
                    }`}
                  >
                    {label}
                  </div>
                )
              )}
            </div>

            {/* The actual controls. These are what make negation / question
                feedable to the LLM instead of being guessed at. */}
            <div className="grid grid-cols-2 gap-1.5">
              {markerRows.map((row) => {
                const on = armed[row.key];

                return (
                  <button
                    key={row.key}
                    onClick={() =>
                      toggleMarker(row.key)
                    }
                    title={row.hint}
                    className={`h-7 flex items-center justify-center gap-1 rounded border text-[8px] font-mono transition-colors ${
                      on
                        ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary font-bold"
                        : "border-border text-text-secondary hover:border-accent-secondary/50"
                    }`}
                  >
                    {row.icon}
                    {row.label}
                  </button>
                );
              })}

              <div className="h-7 flex items-center justify-center rounded border border-dashed border-border text-[7px] font-mono text-text-muted">
                {Object.values(armed).some(
                  Boolean
                )
                  ? "ARMED → next sign"
                  : "tap to arm"}
              </div>
            </div>

            {pendingNmm && (
              <div className="mt-2 flex items-center gap-1.5 text-[8px] font-mono text-status-pending">
                <Timer size={9} />
                Detector saw:{" "}
                {(
                  [
                    "question",
                    "wh_question",
                    "negation",
                    "emphasis",
                  ] as MarkerKey[]
                )
                  .filter((k) => pendingNmm[k])
                  .join(", ")}
              </div>
            )}
          </div>

          {/* AUTO DETECT */}
          {isTemporal && (
            <label className="h-10 flex items-center justify-between px-3 rounded-lg bg-surface/60 border border-border cursor-pointer shrink-0">
              <span className="text-[9px] font-mono text-text-secondary">
                Auto-append
              </span>

              <input
                type="checkbox"
                checked={autoDetect}
                onChange={(e) =>
                  setAutoDetect(
                    e.target.checked
                  )
                }
                className="w-3.5 h-3.5 accent-[var(--accent-primary)]"
              />
            </label>
          )}

          {/* NMM → LLM CONTEXT SPACER */}
          <div className="flex-1 min-h-0 rounded-xl border border-border/50 bg-surface/20 p-3 hidden lg:flex flex-col justify-end gap-1">
            <div className="text-[8px] font-mono text-text-muted">
              {isTemporal
                ? `${contract.frames}-frame temporal recognition`
                : "Static frame recognition"}
            </div>

            <div className="text-[8px] font-mono text-text-muted">
              markers→LLM:{" "}
              <span className="text-accent-secondary">
                {nmm.question ||
                nmm.wh_question ||
                nmm.negation ||
                nmm.affirmation ||
                nmm.emphasis
                  ? (
                      [
                        nmm.wh_question && "WH",
                        nmm.question && "Q",
                        nmm.negation && "NEG",
                        nmm.affirmation && "AFM",
                        nmm.emphasis && "EMP",
                      ]
                        .filter(Boolean)
                        .join("+")
                    )
                  : "none"}
              </span>
            </div>

            <div className="text-[8px] font-mono text-text-muted">
              affect→LLM:{" "}
              <span className="text-accent-secondary">
                {emotion?.dominant ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: TRANSLATION */}
        <div className="min-w-0 flex flex-col gap-3 lg:h-[650px]">
          <div className="flex items-center justify-between shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-secondary">
              Translation Workspace
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={
                  handleBackspace
                }
                disabled={
                  detectedHistory.length ===
                  0
                }
                className="px-2 py-1 rounded bg-surface border border-border text-[8px] font-mono text-text-muted disabled:opacity-30"
              >
                <Delete
                  size={10}
                  className="inline mr-1"
                />
                Back
              </button>

              <button
                onClick={
                  handleClear
                }
                className="px-2 py-1 rounded bg-surface border border-border text-[8px] font-mono text-text-muted"
              >
                <Trash2
                  size={10}
                  className="inline mr-1"
                />
                Clear
              </button>
            </div>
          </div>

          {/* SEQUENCE */}
          <div className="h-[170px] rounded-xl border border-border/80 bg-surface/60 p-3 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase text-text-muted">
                Detected Sequence
              </span>

              <span className="text-[8px] font-mono text-text-muted">
                {detectedHistory.length}{" "}
                SIGNS
              </span>
            </div>

            <div className="h-[52px] rounded-lg bg-background border border-border p-2 overflow-y-auto">
              {detectedHistory.length ===
              0 ? (
                <span className="text-[9px] font-mono text-text-muted">
                  Awaiting input...
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {detectedHistory.map(
                    (s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDetectedHistory(
                            (prev) =>
                              prev.slice(
                                0,
                                idx
                              )
                          );

                          setBengaliOutput(
                            ""
                          );
                        }}
                        className={`px-2 py-1 rounded border font-mono text-[9px] font-bold ${
                          s.negation
                            ? "border-status-error/60 text-status-error"
                            : idx ===
                                detectedHistory.length -
                                  1 &&
                              anyQuestion
                            ? "border-status-pending/60 text-status-pending"
                            : "border-border text-accent-primary"
                        }`}
                      >
                        [{s.gloss}]
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {isTemporal && (
              <div className="flex gap-2 mt-2">
                <select
                  value={pickSign}
                  onChange={(e) =>
                    setPickSign(
                      e.target.value
                    )
                  }
                  className="min-w-0 flex-1 px-2 py-1.5 rounded-lg bg-background border border-border text-[9px] font-mono text-text-primary focus:outline-none"
                >
                  {catalog.map((c) => (
                    <option
                      key={c.label}
                      value={c.label}
                    >
                      {c.label}
                      {c.bengali_meaning
                        ? ` — ${c.bengali_meaning}`
                        : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={
                    handleAddPick
                  }
                  disabled={!pickSign}
                  className="px-3 rounded-lg bg-accent-primary/15 border border-accent-primary/40 text-[9px] font-mono text-accent-primary disabled:opacity-40"
                >
                  <Plus
                    size={11}
                    className="inline mr-1"
                  />
                  Add
                </button>
              </div>
            )}

            <div className="mt-auto text-[8px] font-mono text-text-muted truncate">
              NLG:{" "}
              <span className="text-text-secondary">
                {glossPreview}
              </span>
            </div>
          </div>

          {/* BENGALI OUTPUT */}
          <div className="flex-1 min-h-[250px] rounded-xl border border-border/80 bg-surface/60 p-3 flex flex-col">
            <div className="text-[9px] font-mono uppercase text-text-muted mb-2">
              Bengali Output
            </div>

            <div className="flex-1 min-h-0 rounded-lg bg-background border border-border p-4 flex items-center">
              {bengaliOutput ? (
                <p className="font-bengali text-xl sm:text-2xl text-text-primary leading-relaxed">
                  {bengaliOutput}
                </p>
              ) : (
                <span className="text-[9px] font-mono text-text-muted">
                  Bengali translation will appear here
                </span>
              )}
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={
              handleStreamAndSpeak
            }
            disabled={
              detectedHistory.length ===
                0 ||
              isGenerating
            }
            className="h-10 shrink-0 rounded-lg bg-accent-secondary text-white font-mono text-[9px] uppercase font-bold hover:bg-accent-secondary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2
                  size={12}
                  className="animate-spin"
                />
                Streaming Bengali...
              </>
            ) : isPlayingAudio ? (
              <>
                <Volume2 size={12} />
                Speaking...
              </>
            ) : (
              <>
                <Volume2 size={12} />
                Stream Bengali in Voice
              </>
            )}
          </button>

          {/* VOICE */}
          <div className="h-10 flex items-center gap-2 shrink-0">
            <span className="text-[8px] font-mono uppercase text-text-muted shrink-0">
              Voice
            </span>

            <button
              onClick={() =>
                setVoiceId("1")
              }
              className={`flex-1 h-8 rounded border text-[8px] font-mono ${
                voiceId === "1"
                  ? "bg-accent-primary/15 border-accent-primary text-accent-primary font-bold"
                  : "border-border text-text-secondary"
              }`}
            >
              Female · Nabanita
            </button>

            <button
              onClick={() =>
                setVoiceId("2")
              }
              className={`flex-1 h-8 rounded border text-[8px] font-mono ${
                voiceId === "2"
                  ? "bg-accent-secondary/15 border-accent-secondary text-accent-secondary font-bold"
                  : "border-border text-text-secondary"
              }`}
            >
              Male · Pradeep
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}