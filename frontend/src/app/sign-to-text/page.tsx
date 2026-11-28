"use client";

import React, { useState, useEffect, useRef } from "react";
import { CameraFramingGuide } from "@/components/camera/CameraFramingGuide";
import { FramingWarningArea } from "@/components/camera/FramingWarningArea";
import { HolisticSkeletonOverlay } from "@/components/camera/HolisticSkeletonOverlay";
import {
  Camera,
  CameraOff,
  Volume2,
  Trash2,
  Loader2,
  Delete,
  Plus,
  ShieldAlert,
  Sparkles,
  Activity,
  SlidersHorizontal,
  ScanFace,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";
const WS_BASE = "ws://localhost:8200";
const CAPTURE_INTERVAL_MS = 33; // 30 FPS target
const JPEG_QUALITY = 0.92;
const MAX_PENDING_FRAMES = 2;

interface Prediction {
  detected: boolean;
  label: string;
  confidence: number;
  top5: { label: string; confidence: number }[];
  emotion?: EmotionResult | null;
  flag?: string;
  low?: boolean;
  note?: string;
  dtw_active?: boolean;
  tta_stability?: number;
}

interface EmotionResultShape {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

type EmotionResult = EmotionResultShape;

function summarizeEmotionCounts(
  counts: Record<string, number>
): EmotionResult | null {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (!total) return null;
  const scores = Object.fromEntries(
    Object.entries(counts).map(([name, count]) => [name, count / total])
  );
  const [dominant, confidence] = Object.entries(counts).sort(
    (left, right) => right[1] - left[1]
  )[0];
  return { dominant, confidence: confidence / total, scores };
}

interface DetectedSign {
  gloss: string;
}

interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  emotion?: EmotionResult | null;
  detail?: string;
  buffered?: number;
  state?: string;
  hands_detected?: number;
  top3?: { label: string; confidence: number }[];
  flag?: string;
  low?: boolean;
  note?: string;
  dtw_active?: boolean;
  tta_stability?: number;
  seq?: number;
  process_fps?: number;
  dropped_frames?: number;
}

interface CatalogSign {
  label: string;
  bengali_meaning?: string;
}

const floatPanelCls =
  "rounded-2xl bg-[#0C0D10]/85 backdrop-blur-xl shadow-2xl";
const insetCls = "rounded-xl bg-black/35";
const softPillBtn =
  "inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
const softPrimaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary/15 px-4 py-1.5 text-xs font-semibold text-accent-primary transition-colors hover:bg-accent-primary/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
const softDangerBtn =
  "inline-flex items-center gap-1.5 rounded-lg bg-status-error/10 px-3 py-1.5 text-xs font-semibold text-status-error transition-colors hover:bg-status-error/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
const segCls = "flex rounded-lg bg-black/40 p-1";
const segBtnCls = "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors";
const segActiveCls = "bg-white/10 text-text-primary";
const segIdleCls = "text-text-muted hover:text-text-secondary";

const EMOTION_ORDER = [
  "happy",
  "sad",
  "angry",
  "fear",
  "surprise",
  "disgust",
  "neutral",
];

function emotionScore(
  scores: Record<string, number> | undefined,
  name: string
) {
  if (!scores) return 0;
  const key = Object.keys(scores).find((k) => k.toLowerCase() === name);
  return key ? scores[key] : 0;
}

export default function SignToTextPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const wsReconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsReconnectAttemptRef = useRef(0);
  const cameraActiveRef = useRef(false);
  const pendingFramesRef = useRef(0);
  const frameSeqRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const lastCaptureAtRef = useRef(0);
  const captureEmaDtRef = useRef(1 / 30);
  const isProcessingRef = useRef(false);
  const historyScrollRef = useRef<HTMLDivElement | null>(null);
  const bengaliScrollRef = useRef<HTMLDivElement | null>(null);

  const sessionIdRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : "pending-session"
  );

  const newSessionId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  useEffect(() => {
    sessionIdRef.current = newSessionId();
  }, []);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showThreshold, setShowThreshold] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [detectedHistory, setDetectedHistory] = useState<DetectedSign[]>([]);
  const [, setIsProcessing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [handsDetected, setHandsDetected] = useState(0);

  const [live, setLive] = useState<{
    label: string;
    confidence: number;
    margin: number;
  } | null>(null);

  const [autoDetect, setAutoDetect] = useState(true);
  const autoDetectRef = useRef(autoDetect);
  const [recognitionMode, setRecognitionMode] = useState<"auto" | "manual">(
    "auto"
  );
  const recognitionModeRef = useRef(recognitionMode);
  const [manualRecording, setManualRecording] = useState(false);
  const manualRecordingRef = useRef(false);
  const [streamState, setStreamState] = useState("IDLE");
  const [recognitionNotice, setRecognitionNotice] = useState<string | null>(
    null
  );
  const [catalog, setCatalog] = useState<CatalogSign[]>([]);
  const [pickSign, setPickSign] = useState("");
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [emotionAvailable, setEmotionAvailable] = useState(true);
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>(
    {}
  );
  const emotionCountsRef = useRef<Record<string, number>>({});
  const emotionCollectionActiveRef = useRef(false);
  const emotionSummary = summarizeEmotionCounts(emotionCounts);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.15);
  const confidenceThresholdRef = useRef(confidenceThreshold);

  const [buffered, setBuffered] = useState(0);
  const [captureFps, setCaptureFps] = useState(0);
  const [processFps, setProcessFps] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  const [bengaliOutput, setBengaliOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<string>("1");
  const [ttsEngine, setTtsEngine] = useState<"free" | "elevenlabs">("free");
  const [showTtsPremiumModal, setShowTtsPremiumModal] = useState(false);
  const [contract, setContract] = useState<{
    frames: number;
    feature_width?: number | null;
  }>({
    frames: 64,
    feature_width: 98,
  });

  useEffect(() => {
    autoDetectRef.current = autoDetect;
  }, [autoDetect]);
  useEffect(() => {
    confidenceThresholdRef.current = confidenceThreshold;
  }, [confidenceThreshold]);
  useEffect(() => {
    recognitionModeRef.current = recognitionMode;
  }, [recognitionMode]);

  useEffect(() => {
    if (historyScrollRef.current) {
      historyScrollRef.current.scrollTo({
        left: historyScrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [detectedHistory.length]);

  useEffect(() => {
    if (bengaliScrollRef.current && bengaliOutput) {
      bengaliScrollRef.current.scrollTo({
        left: bengaliScrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [bengaliOutput]);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/system/health`)
      .then((res) => {
        if (cancelled) return;
        setBackendOnline(true);
        setEmotionAvailable(!!res.data.emotion_available);
        if (res.data.contract) {
          setContract(res.data.contract);
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

  const closeStreamSocket = () => {
    if (wsReconnectTimerRef.current) {
      clearTimeout(wsReconnectTimerRef.current);
      wsReconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }
    pendingFramesRef.current = 0;
    setWsConnected(false);
  };

  const connectStreamSocket = () => {
    if (!cameraActiveRef.current) return;
    closeStreamSocket();
    try {
      const ws = new WebSocket(
        `${WS_BASE}/api/stream/ws?session_id=${encodeURIComponent(
          sessionIdRef.current
        )}`
      );
      ws.binaryType = "arraybuffer";
      ws.onopen = () => {
        wsReconnectAttemptRef.current = 0;
        pendingFramesRef.current = 0;
        setWsConnected(true);
      };
      ws.onmessage = (event) => {
        if (pendingFramesRef.current > 0) {
          pendingFramesRef.current -= 1;
        }
        try {
          const data: StreamResult = JSON.parse(String(event.data));
          setBuffered(data.buffered ?? 0);
          setHandsDetected(data.hands_detected ?? 0);
          if (typeof data.process_fps === "number") {
            setProcessFps(data.process_fps);
          }
          commitFromStream(data);
        } catch {
          // Ignore malformed message
        }
      };
      ws.onerror = () => {
        // onclose handles reconnect
      };
      ws.onclose = () => {
        wsRef.current = null;
        pendingFramesRef.current = 0;
        setWsConnected(false);
        if (cameraActiveRef.current) {
          const attempt = wsReconnectAttemptRef.current;
          wsReconnectAttemptRef.current = Math.min(attempt + 1, 5);
          const delay = Math.min(3000, 400 * Math.pow(1.6, attempt));
          wsReconnectTimerRef.current = setTimeout(() => {
            connectStreamSocket();
          }, delay);
        }
      };
      wsRef.current = ws;
    } catch {
      setWsConnected(false);
    }
  };

  const changeRecognitionMode = (mode: "auto" | "manual") => {
    if (manualRecordingRef.current) return;
    recognitionModeRef.current = mode;
    setRecognitionMode(mode);
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
    setLive(null);
    setRecognitionNotice(null);
    if (cameraActiveRef.current) {
      connectStreamSocket();
    }
  };

  const toggleManualRecording = () => {
    if (!cameraActive) return;
    const next = !manualRecordingRef.current;
    manualRecordingRef.current = next;
    setManualRecording(next);
    if (next) {
      setPrediction(null);
      setLive(null);
      setBuffered(0);
    }
    setRecognitionNotice(null);
  };

  const startCamera = async () => {
    setCameraError(null);

    try {
      sessionIdRef.current = newSessionId();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      cameraActiveRef.current = true;
      lastVideoTimeRef.current = -1;
      lastCaptureAtRef.current = 0;
      frameSeqRef.current = 0;
      setCameraActive(true);
      connectStreamSocket();

      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          () => void doStreamTick(performance.now() / 1000),
          CAPTURE_INTERVAL_MS
        );
      }
    } catch {
      cameraActiveRef.current = false;
      setCameraError(
        "Camera unavailable. Check browser permissions and try again."
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (manualRecordingRef.current) {
      setRecognitionNotice(
        "Stop the manual recording before turning off the camera."
      );
      return;
    }
    cameraActiveRef.current = false;
    closeStreamSocket();
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
    setCaptureFps(0);
    setProcessFps(0);
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
  };

  useEffect(() => {
    return () => {
      cameraActiveRef.current = false;
      closeStreamSocket();
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
    return history.map((sign) => `[${sign.gloss.toLowerCase()}]`).join(" + ");
  };

  const resetEmotionCollection = () => {
    emotionCountsRef.current = {};
    setEmotionCounts({});
  };

  const recordEmotionSample = (sample: EmotionResult | null | undefined) => {
    if (!sample?.dominant) return;
    const next = {
      ...emotionCountsRef.current,
      [sample.dominant]: (emotionCountsRef.current[sample.dominant] ?? 0) + 1,
    };
    emotionCountsRef.current = next;
    setEmotionCounts(next);
  };

  const handleStreamAndSpeak = async () => {
    if (detectedHistory.length === 0 || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setBengaliOutput("");

    let full = "";
    const translationEmotion = summarizeEmotionCounts(emotionCountsRef.current);
    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();

    try {
      const gloss = buildGlossString(detectedHistory);

      const response = await fetch(`${API_BASE}/api/nlg/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gloss, emotion: translationEmotion }),
      });

      if (!response.ok || !response.body) {
        throw new Error("stream unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "delta" && parsed.text) {
              full += parsed.text;
              setBengaliOutput(full);
            } else if (parsed.type === "done" && parsed.bengali_text) {
              full = parsed.bengali_text;
              setBengaliOutput(full);
            } else if (parsed.type === "error") {
              toast.error(parsed.error || "LLM error");
            }
          } catch {
            // Ignore malformed SSE chunk.
          }
        }
      }
    } catch {
      toast.error("Streaming failed — check LLM configuration in .env");
    } finally {
      setIsGenerating(false);
    }

    const text = full.trim();
    if (!text) return;

    setIsPlayingAudio(true);

    try {
      const res = await axios.post<{
        audio_url: string | null;
        engine: string;
        status: string;
        error?: string;
      }>(`${API_BASE}/api/tts/generate`, {
        text,
        voice: voiceId,
        engine: ttsEngine,
      });

      if (res.data.status === "success" && res.data.audio_url) {
        const audio = new Audio(`${API_BASE}${res.data.audio_url}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
        return;
      } else if (ttsEngine === "elevenlabs") {
        toast.error(
          res.data.error || "ElevenLabs TTS failed to generate audio."
        );
        setIsPlayingAudio(false);
        return;
      }
    } catch (err: unknown) {
      if (ttsEngine === "elevenlabs") {
        const errorMsg = axios.isAxiosError(err)
          ? err.response?.data?.detail || err.message
          : "ElevenLabs TTS request failed";
        toast.error(`ElevenLabs TTS Error: ${errorMsg}`);
        setIsPlayingAudio(false);
        return;
      }
    }

    if (ttsEngine === "free" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "bn-IN";
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const appendGloss = (gloss: string) => {
    if (!emotionCollectionActiveRef.current) {
      resetEmotionCollection();
      emotionCollectionActiveRef.current = true;
    }
    setDetectedHistory((prev) => [...prev, { gloss }]);
  };

  const handleBackspace = () => {
    if (detectedHistory.length === 0) return;
    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();
    setDetectedHistory((prev) => prev.slice(0, -1));
    setBengaliOutput("");
  };

  const handleAddPick = () => {
    if (!pickSign) return;
    appendGloss(pickSign);
    setBengaliOutput("");
  };

  const handleClear = () => {
    setDetectedHistory([]);
    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();
    setPrediction(null);
    setBengaliOutput("");
    setLive(null);
    setRecognitionNotice(null);
    manualRecordingRef.current = false;
    setManualRecording(false);
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
  };

  const commitFromStream = (data: StreamResult) => {
    setStreamState(data.state ?? "IDLE");
    if (data.detail === "incomplete_span") {
      setRecognitionNotice("Hands not clear, try again.");
    } else if (data.detail === "span_too_short") {
      setRecognitionNotice("Sign too brief — hold slightly longer.");
    } else {
      setRecognitionNotice(null);
    }

    setEmotion(data.emotion ?? null);
    if (data.state === "SIGN" && !emotionCollectionActiveRef.current) {
      resetEmotionCollection();
      emotionCollectionActiveRef.current = true;
    }
    if (emotionCollectionActiveRef.current) {
      recordEmotionSample(data.emotion);
    }

    if (!data.ready || !data.label) {
      setLive(null);
      return;
    }

    const label = data.label;
    const confidence = data.confidence ?? 0;
    const margin = data.margin ?? 0;
    const top3 = data.top3 ?? [];
    const isSign = !["NOT_SURE", "NONE", "BACKGROUND"].includes(label);

    setPrediction({
      detected: isSign,
      label,
      confidence,
      top5: top3.map((t) => ({ label: t.label, confidence: t.confidence })),
      emotion: data.emotion ?? null,
      flag: data.flag,
      low: data.low,
      note: data.note,
      dtw_active: data.dtw_active,
      tta_stability: data.tta_stability,
    });

    setLive(isSign ? { label, confidence, margin } : null);
    if (
      isSign &&
      confidence >= confidenceThresholdRef.current &&
      autoDetectRef.current
    ) {
      appendGloss(label);
    }
  };

  const doStreamTick = async (captureTime: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth || video.readyState < 2) return;
    if (video.currentTime === lastVideoTimeRef.current) return;

    const ws = wsRef.current;
    const useWs = ws !== null && ws.readyState === WebSocket.OPEN;

    if (useWs) {
      if (
        pendingFramesRef.current >= MAX_PENDING_FRAMES ||
        ws.bufferedAmount > 256 * 1024
      ) {
        return; // Drop stale frame instead of building backlog
      }
    } else if (isProcessingRef.current) {
      return;
    }

    lastVideoTimeRef.current = video.currentTime;
    const nowPerf = performance.now();
    if (lastCaptureAtRef.current > 0) {
      const dtSec = (nowPerf - lastCaptureAtRef.current) / 1000;
      if (dtSec > 0 && dtSec < 1) {
        captureEmaDtRef.current = 0.85 * captureEmaDtRef.current + 0.15 * dtSec;
        setCaptureFps(Math.round(1 / Math.max(captureEmaDtRef.current, 1e-4)));
      }
    }
    lastCaptureAtRef.current = nowPerf;

    const scale = Math.min(1, 480 / video.videoWidth);
    const targetW = Math.round(video.videoWidth * scale);
    const targetH = Math.round(video.videoHeight * scale);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, targetW, targetH);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) return;

    if (useWs && ws.readyState === WebSocket.OPEN) {
      const seq = (frameSeqRef.current = (frameSeqRef.current + 1) >>> 0);
      const flags =
        (recognitionModeRef.current === "manual" ? 1 : 0) |
        (manualRecordingRef.current ? 2 : 0);
      const jpegBuf = await blob.arrayBuffer();
      const packet = new ArrayBuffer(16 + jpegBuf.byteLength);
      const view = new DataView(packet);
      view.setUint32(0, seq, true);
      view.setUint8(4, flags);
      view.setFloat64(8, captureTime, true);
      new Uint8Array(packet, 16).set(new Uint8Array(jpegBuf));

      pendingFramesRef.current += 1;
      try {
        ws.send(packet);
      } catch {
        if (pendingFramesRef.current > 0) pendingFramesRef.current -= 1;
      }
      return;
    }

    // Fallback to HTTP POST if WebSocket is unavailable
    isProcessingRef.current = true;
    setIsProcessing(true);
    try {
      const fd = new FormData();
      fd.append("file", blob, "f.jpg");
      fd.append("mode", recognitionModeRef.current);
      fd.append("recording", String(manualRecordingRef.current));
      fd.append("capture_time", String(captureTime));

      const res = await axios.post<StreamResult>(
        `${API_BASE}/api/stream/frame?session_id=${sessionIdRef.current}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 5000,
        }
      );

      setBuffered(res.data.buffered ?? 0);
      setHandsDetected(res.data.hands_detected ?? 0);
      commitFromStream(res.data);
    } catch (err) {
      console.warn("Recognition stream request failed:", err);
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : err instanceof Error
        ? err.message
        : "Recognition request failed.";
      setRecognitionNotice(`Recognition unavailable: ${detail}`);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const glossPreview = detectedHistory.length
    ? buildGlossString(detectedHistory)
    : "—";

  return (
    <div className="relative h-[100dvh] w-full p-2 sm:p-3">
      {!backendOnline && (
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard
              ?.writeText("uvicorn backend.main:app --reload --port 8200")
              .then(() => toast.success("Start command copied"))
              .catch(() => {});
          }}
          title="Backend is not running. Click to copy: uvicorn backend.main:app --reload --port 8200"
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-status-error/30 bg-surface/90 px-4 py-2 text-xs font-medium text-status-error shadow-lg backdrop-blur-xl transition-colors hover:bg-status-error/20"
        >
          <span className="h-2 w-2 rounded-full bg-status-error" />
          Backend offline
        </button>
      )}

      {/* IMMERSIVE WIDE-ANGLE CAMERA STAGE (FULL HEIGHT, EQUAL PADDING) */}
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white/[0.035]">
        {/* Hidden capture canvas for backend streaming */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live wide-angle video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full scale-x-[-1] object-cover ${
            cameraActive ? "" : "hidden"
          }`}
        />

        {/* MediaPipe Holistic Skeleton Overlay */}
        <HolisticSkeletonOverlay
          videoRef={videoRef}
          cameraActive={cameraActive}
          visible={showSkeleton}
        />

        {/* Initial framing guide (fades out after 5s) */}
        <CameraFramingGuide cameraActive={cameraActive} />

        {/* Subtle edge vignette only when camera is active */}
        {cameraActive && (
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(8,11,18,0.5)_100%)]"
            aria-hidden="true"
          />
        )}

        {/* CAMERA STANDBY / ERROR OVERLAY */}
        {!cameraActive && cameraError && (
          <div className="relative z-20 flex flex-1 items-center justify-center p-6">
            <div className="max-w-sm space-y-3 rounded-2xl bg-black/25 p-6 text-center backdrop-blur-xl">
              <CameraOff size={26} className="mx-auto text-status-error" />
              <p className="text-sm font-semibold text-text-primary">
                Camera unavailable
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                {cameraError}
              </p>
              <button onClick={startCamera} className={softPrimaryBtn}>
                <Camera size={14} />
                Allow camera access
              </button>
            </div>
          </div>
        )}

        {!cameraActive && !cameraError && (
          <div className="relative z-20 flex flex-1 flex-col items-center justify-center p-6 text-center">
            <button
              onClick={startCamera}
              disabled={!backendOnline}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-secondary px-5 py-2.5 text-xs font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Camera size={14} />
              Start camera
            </button>
          </div>
        )}

        {/* TOP-LEFT FLOATING CONTROLS & FRAMING BAR */}
        <div className="pointer-events-none relative z-30 flex flex-col items-start gap-2.5 p-3 lg:absolute lg:left-3 lg:top-3 lg:max-w-[calc(100%-21rem)] lg:p-0">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-2xl bg-[#0C0D10]/85 px-3 py-1.5 backdrop-blur-xl shadow-2xl">
            <span
              className={`ml-1 h-2 w-2 rounded-full ${
                cameraActive
                  ? "bg-accent-primary shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                  : "bg-white/25"
              }`}
              title={cameraActive ? "Camera live" : "Camera standby"}
            />

            {cameraActive ? (
              <button
                onClick={stopCamera}
                disabled={manualRecording}
                title={
                  manualRecording
                    ? "Stop the recording before stopping the camera"
                    : undefined
                }
                className={softDangerBtn}
              >
                <CameraOff size={13} />
                Stop
              </button>
            ) : (
              <button
                onClick={startCamera}
                disabled={!backendOnline}
                className={softPrimaryBtn}
              >
                <Camera size={13} />
                Start
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowSkeleton((v) => !v)}
              className={`${softPillBtn} ${
                showSkeleton
                  ? "border-accent-primary/30 bg-accent-primary/15 text-accent-primary"
                  : ""
              }`}
              title="Toggle MediaPipe Holistic skeleton overlay"
            >
              <Activity size={13} />
              Skeleton {showSkeleton ? "On" : "Off"}
            </button>

            {emotionAvailable && (
              <div className="flex items-center gap-2 rounded-lg bg-black/35 px-2.5 py-1">
                <ScanFace size={13} className="text-text-muted" />
                {cameraActive && emotion ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium capitalize text-text-primary">
                      {emotion.dominant}
                      <span className="ml-1 font-mono text-[11px] text-text-muted">
                        {Math.round(emotion.confidence * 100)}%
                      </span>
                    </span>
                    <div
                      className="flex h-3 items-end gap-[2px]"
                      aria-hidden="true"
                    >
                      {EMOTION_ORDER.map((name) => {
                        const score = emotionScore(emotion.scores, name);
                        const isTop = name === emotion.dominant.toLowerCase();
                        return (
                          <span
                            key={name}
                            title={`${name} ${Math.round(score * 100)}%`}
                            className={`w-[2.5px] rounded-sm ${
                              isTop ? "bg-emerald-400" : "bg-white/25"
                            }`}
                            style={{
                              height: `${Math.max(15, Math.round(score * 100))}%`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </div>
            )}
          </div>

          {cameraActive && (
            <div className="pointer-events-auto">
              <FramingWarningArea
                cameraActive={cameraActive}
                handsDetected={handsDetected}
                hasFace={Boolean(emotion)}
                detected={Boolean(prediction?.detected)}
                confidence={prediction?.confidence ?? 0}
              />
            </div>
          )}
        </div>

        {/* BOTTOM-LEFT FLOATING RECOGNITION HUD */}
        <div
          className={`relative z-30 mx-3 mb-3 flex flex-col gap-3 p-3.5 lg:absolute lg:bottom-4 lg:left-4 lg:mx-0 lg:mb-0 lg:w-[350px] ${floatPanelCls}`}
        >
          {/* Mode + Auto-append + Threshold toggle */}
          <div className="flex items-center justify-between gap-2">
            <div className={segCls}>
              {(["auto", "manual"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => changeRecognitionMode(mode)}
                  disabled={manualRecording}
                  className={`${segBtnCls} capitalize ${
                    recognitionMode === mode ? segActiveCls : segIdleCls
                  } disabled:opacity-40`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {recognitionMode === "auto" && (
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <span className="text-[11px]">Auto</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoDetect}
                    aria-label="Auto-append"
                    onClick={() => setAutoDetect((v) => !v)}
                    className={`relative h-5 w-9 rounded-full transition-colors ${
                      autoDetect ? "bg-emerald-500/80" : "bg-white/15"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                        autoDetect ? "translate-x-4" : ""
                      }`}
                    />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowThreshold((v) => !v)}
                className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.06] px-2.5 py-1 text-[11px] text-text-secondary transition hover:bg-white/[0.12]"
                title="Confidence threshold"
              >
                <SlidersHorizontal size={11} />
                {Math.round(confidenceThreshold * 100)}%
                {showThreshold ? (
                  <ChevronDown size={11} />
                ) : (
                  <ChevronUp size={11} />
                )}
              </button>
            </div>
          </div>

          {showThreshold && (
            <div className={`px-3 py-2.5 ${insetCls}`}>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <label
                  htmlFor="confidence-threshold"
                  className="text-text-secondary"
                >
                  Auto-append threshold ({contract.frames}f window)
                </label>
                <span className="font-mono font-semibold text-emerald-300">
                  {Math.round(confidenceThreshold * 100)}%
                </span>
              </div>
              <input
                id="confidence-threshold"
                type="range"
                min={0}
                max={0.8}
                step={0.05}
                value={confidenceThreshold}
                onChange={(event) =>
                  setConfidenceThreshold(Number(event.target.value))
                }
                className="w-full accent-emerald-400"
              />
            </div>
          )}

          {recognitionMode === "manual" && (
            <div
              className={`flex items-center justify-between gap-3 p-2.5 ${insetCls}`}
            >
              <span className="text-[11px] text-text-muted">
                Record one sign, then stop.
              </span>
              <button
                type="button"
                onClick={toggleManualRecording}
                disabled={!cameraActive}
                className={manualRecording ? softDangerBtn : softPrimaryBtn}
              >
                {manualRecording ? "Stop & recognize" : "Start recording"}
              </button>
            </div>
          )}

          {recognitionNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">
              <ShieldAlert size={13} className="shrink-0" />
              <span>{recognitionNotice}</span>
            </div>
          )}

          {/* Prediction readout */}
          <div className={`flex flex-col gap-2.5 p-3.5 ${insetCls}`}>
            {prediction && prediction.detected ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-2xl font-semibold tracking-tight text-text-primary">
                      {prediction.label}
                    </span>
                    {prediction.flag && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          prediction.low
                            ? "bg-amber-400/15 text-amber-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {prediction.flag}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-sm font-semibold text-emerald-300">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>

                <div className="space-y-1.5">
                  {prediction.top5.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span
                          className={
                            idx === 0
                              ? "font-medium text-text-primary"
                              : "text-text-secondary"
                          }
                        >
                          {item.label}
                        </span>
                        <span
                          className={`font-mono ${
                            idx === 0 ? "text-emerald-300" : "text-text-muted"
                          }`}
                        >
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            idx === 0 ? "bg-emerald-400" : "bg-white/25"
                          }`}
                          style={{
                            width: `${Math.round(item.confidence * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-3 text-center">
                <p className="text-xs font-medium text-text-secondary">
                  {cameraActive
                    ? "Raise hands above rest line to sign"
                    : "Camera is off"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT-SIDE FLOATING TRANSLATION & SPEECH PANEL */}
        <aside className="relative z-30 mx-3 mb-3 flex flex-col justify-between gap-5 bg-transparent p-1 lg:absolute lg:bottom-3 lg:right-3 lg:top-3 lg:mx-0 lg:mb-0 lg:h-[calc(100%-1.5rem)] lg:w-[295px] lg:overflow-y-auto">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={handleBackspace}
                disabled={detectedHistory.length === 0}
                className="inline-flex items-center gap-1 rounded-lg bg-[#0C0D10]/85 px-2.5 py-1.5 text-[11px] text-text-secondary backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-text-primary disabled:opacity-35"
                title="Remove last detected sign"
              >
                <Delete size={11} />
                Back
              </button>
              <button
                onClick={handleClear}
                disabled={detectedHistory.length === 0 && !bengaliOutput}
                className="inline-flex items-center gap-1 rounded-lg bg-[#0C0D10]/85 px-2.5 py-1.5 text-[11px] text-text-secondary backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-text-primary disabled:opacity-35"
                title="Clear all recognized signs and output"
              >
                <Trash2 size={11} />
                Clear
              </button>
            </div>

            {/* Recognized signs (anchored TOP) */}
            <div className={`flex flex-col gap-2.5 p-3.5 ${floatPanelCls}`}>
            <div
              ref={historyScrollRef}
              className="w-full min-w-0 overflow-x-auto overflow-y-hidden py-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
            >
              {detectedHistory.length === 0 ? (
                <span className="text-[11px] text-text-muted">
                  Signs appear here as you sign.
                </span>
              ) : (
                <div className="flex w-max items-center gap-1.5">
                  {detectedHistory.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDetectedHistory((prev) => prev.slice(0, idx));
                        emotionCollectionActiveRef.current = false;
                        resetEmotionCollection();
                        setBengaliOutput("");
                      }}
                      title="Click to remove signs from here"
                      className="shrink-0 whitespace-nowrap rounded-lg bg-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-text-primary transition-colors hover:bg-white/[0.15]"
                    >
                      {s.gloss}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-1.5">
              <select
                value={pickSign}
                onChange={(e) => setPickSign(e.target.value)}
                className="min-w-0 flex-1 rounded-lg bg-black/35 px-3 py-1.5 text-[11px] text-text-primary [color-scheme:dark] focus:bg-black/50 focus:outline-none"
              >
                {catalog.map((c) => (
                  <option
                    key={c.label}
                    value={c.label}
                    className="bg-[#0C0D10] text-slate-100"
                  >
                    {c.label}{" "}
                    {c.bengali_meaning ? `— ${c.bengali_meaning}` : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddPick}
                disabled={!pickSign}
                className="inline-flex items-center gap-1 rounded-lg bg-white/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-text-primary transition-colors hover:bg-white/[0.14] disabled:opacity-40"
              >
                <Plus size={11} />
                Add
              </button>
            </div>

            {(detectedHistory.length > 0 || emotionSummary) && (
              <div className="min-w-0 space-y-0.5 text-[10px] text-text-muted">
                {detectedHistory.length > 0 && (
                  <div className="truncate font-mono text-text-secondary">
                    {glossPreview}
                  </div>
                )}
                {emotionSummary && (
                  <div>
                    Tone:{" "}
                    <span className="capitalize text-text-secondary">
                      {emotionSummary.dominant}
                    </span>{" "}
                    · {Math.round(emotionSummary.confidence * 100)}%
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          {/* Bengali sentence (VERTICAL CENTER) */}
          <div className={`flex flex-col p-3.5 ${floatPanelCls}`}>
            <div
              ref={bengaliScrollRef}
              className="w-full min-w-0 overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
            >
              {bengaliOutput ? (
                <p className="w-max whitespace-nowrap font-bengali text-lg font-semibold leading-relaxed text-text-primary">
                  {bengaliOutput}
                </p>
              ) : (
                <span className="text-[11px] text-text-muted">
                  Translated Bengali sentence appears here.
                </span>
              )}
            </div>
          </div>

          {/* Voice & Speak */}
          <div className={`flex flex-col gap-2.5 p-3.5 ${floatPanelCls}`}>
            <div className="flex items-center justify-end">
              <div className={`${segCls} w-full`}>
                <button
                  type="button"
                  onClick={() => {
                    setTtsEngine("free");
                    setVoiceId("1");
                  }}
                  className={`flex-1 ${segBtnCls} ${
                    ttsEngine === "free" ? segActiveCls : segIdleCls
                  }`}
                >
                  Edge TTS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ttsEngine !== "elevenlabs") {
                      setShowTtsPremiumModal(true);
                    }
                  }}
                  className={`flex-1 ${segBtnCls} ${
                    ttsEngine === "elevenlabs"
                      ? "bg-amber-400/20 text-amber-300"
                      : segIdleCls
                  }`}
                >
                  ElevenLabs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {(ttsEngine === "free"
                ? [
                    { id: "1", label: "Female · Nabanita" },
                    { id: "2", label: "Male · Pradeep" },
                  ]
                : [
                    { id: "eleven_1", label: "Female · Sarah" },
                    { id: "eleven_2", label: "Male · George" },
                  ]
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVoiceId(v.id)}
                  className={`h-8 rounded-lg text-[11px] font-medium transition-colors ${
                    voiceId === v.id
                      ? ttsEngine === "free"
                        ? "bg-accent-primary/15 text-accent-primary"
                        : "bg-amber-400/20 text-amber-300"
                      : "bg-white/[0.06] text-text-secondary hover:bg-white/10 hover:text-text-primary"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {ttsEngine === "elevenlabs" && (
              <p className="text-[10px] text-amber-300/80">
                Emotion tags preserved: [excited], [sad], [whispers], [happy]
              </p>
            )}

            <button
              onClick={handleStreamAndSpeak}
              disabled={detectedHistory.length === 0 || isGenerating}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-accent-secondary text-xs font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Generating...
                </>
              ) : isPlayingAudio ? (
                <>
                  <Volume2 size={13} className="animate-pulse" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 size={13} />
                  Speak in Bengali
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {showTtsPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/[0.08] bg-surface p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  Switch to ElevenLabs premium voice?
                </h3>
                <span className="text-xs text-text-muted">
                  Expressive multilingual speech with emotion tags
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl bg-black/25 p-4 text-xs leading-relaxed text-text-secondary">
              <p>
                Speech uses the ElevenLabs eleven_v3 model through your backend
                ELEVENLABS_API_KEY.
              </p>
              <p>Cloud API credits are used for every character generated.</p>
              <p className="font-medium text-amber-300">
                There is no automatic fallback. If the key is invalid or the
                quota runs out, you get an error instead of switching back to
                free mode.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowTtsPremiumModal(false)}
                className={softPillBtn}
              >
                Stay on free
              </button>
              <button
                type="button"
                onClick={() => {
                  setTtsEngine("elevenlabs");
                  setVoiceId("eleven_1");
                  setShowTtsPremiumModal(false);
                  toast.success("Switched to ElevenLabs premium voice.");
                }}
                className="rounded-full border border-amber-400/35 bg-amber-400/20 px-4 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-400/30"
              >
                Use ElevenLabs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
