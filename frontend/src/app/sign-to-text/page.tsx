"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CameraFramingGuide } from "@/components/camera/CameraFramingGuide";
import { FramingWarningArea } from "@/components/camera/FramingWarningArea";
import {
  CameraOff,
  Volume2,
  Trash2,
  Loader2,
  Delete,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface Prediction {
  detected: boolean;
  label: string;
  confidence: number;
  top5: { label: string; confidence: number }[];
  emotion?: EmotionResult | null;
}

interface EmotionResultShape {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

type EmotionResult = EmotionResultShape;

function summarizeEmotionCounts(counts: Record<string, number>): EmotionResult | null {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (!total) return null;
  const scores = Object.fromEntries(
    Object.entries(counts).map(([name, count]) => [name, count / total]),
  );
  const [dominant, confidence] = Object.entries(counts)
    .sort((left, right) => right[1] - left[1])[0];
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
}

interface CatalogSign {
  label: string;
  bengali_meaning?: string;
}

// Added min-w-0 so CSS Grid children never expand horizontally past their track width
const cardCls =
  "flex min-w-0 flex-col gap-4 rounded-2xl bg-white/[0.035] p-5 sm:p-6";
const sectionTitleCls = "text-sm font-medium text-text-secondary select-none";
const insetCls = "rounded-xl bg-black/20";
const segCls = "flex rounded-lg bg-black/25 p-1";
const segBtnCls = "rounded-md px-3 py-1 text-xs font-semibold transition-colors";
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

function emotionScore(scores: Record<string, number> | undefined, name: string) {
  if (!scores) return 0;
  const key = Object.keys(scores).find((k) => k.toLowerCase() === name);
  return key ? scores[key] : 0;
}

export default function SignToTextPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);
  const historyScrollRef = useRef<HTMLDivElement | null>(null);

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
  const [recognitionMode, setRecognitionMode] = useState<"auto" | "manual">("auto");
  const recognitionModeRef = useRef(recognitionMode);
  const [manualRecording, setManualRecording] = useState(false);
  const manualRecordingRef = useRef(false);
  const [streamState, setStreamState] = useState("IDLE");
  const [recognitionNotice, setRecognitionNotice] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogSign[]>([]);
  const [pickSign, setPickSign] = useState("");
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [emotionAvailable, setEmotionAvailable] = useState(true);
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>({});
  const emotionCountsRef = useRef<Record<string, number>>({});
  const emotionCollectionActiveRef = useRef(false);
  const emotionSummary = summarizeEmotionCounts(emotionCounts);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.15);
  const confidenceThresholdRef = useRef(confidenceThreshold);

  const [buffered, setBuffered] = useState(0);

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

  // Keep recognized signs scrolled to the latest entry smoothly
  useEffect(() => {
    if (historyScrollRef.current) {
      historyScrollRef.current.scrollTo({
        left: historyScrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [detectedHistory.length]);

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

  const changeRecognitionMode = (mode: "auto" | "manual") => {
    if (manualRecordingRef.current) return;
    recognitionModeRef.current = mode;
    setRecognitionMode(mode);
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
    setLive(null);
    setRecognitionNotice(null);
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
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);

      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          () => void doStreamTick(performance.now() / 1000),
          100
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
    if (manualRecordingRef.current) {
      setRecognitionNotice("Stop the manual recording before turning off the camera.");
      return;
    }
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
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
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
    if (
      detectedHistory.length === 0 ||
      isGenerating
    ) {
      return;
    }

    setIsGenerating(true);
    setBengaliOutput("");

    let full = "";
    const translationEmotion = summarizeEmotionCounts(emotionCountsRef.current);
    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();

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
          body: JSON.stringify({ gloss, emotion: translationEmotion }),
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
      const res = await axios.post<{
        audio_url: string | null;
        engine: string;
        status: string;
        error?: string;
      }>(
        `${API_BASE}/api/tts/generate`,
        {
          text,
          voice: voiceId,
          engine: ttsEngine,
        }
      );

      if (res.data.status === "success" && res.data.audio_url) {
        const audio = new Audio(
          `${API_BASE}${res.data.audio_url}`
        );

        audio.onended = () =>
          setIsPlayingAudio(false);

        audio.onerror = () =>
          setIsPlayingAudio(false);

        await audio.play();
        return;
      } else if (ttsEngine === "elevenlabs") {
        toast.error(res.data.error || "ElevenLabs TTS failed to generate audio.");
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

  const appendGloss = (gloss: string) => {
    if (!emotionCollectionActiveRef.current) {
      resetEmotionCollection();
      emotionCollectionActiveRef.current = true;
    }
    setDetectedHistory((prev) => [...prev, { gloss }]);
  };

  const handleBackspace = () => {
    if (detectedHistory.length === 0) {
      return;
    }

    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();
    setDetectedHistory((prev) =>
      prev.slice(0, -1)
    );

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
    setRecognitionNotice(
      data.detail === "incomplete_span" ? "Hands not clear, try again." : null
    );
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
    });

    setLive(isSign ? { label, confidence, margin } : null);
    if (isSign && confidence >= confidenceThresholdRef.current && autoDetectRef.current) {
      appendGloss(label);
    }
  };

  const doStreamTick = async (captureTime: number) => {
    if (isProcessingRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const scale = Math.min(1, 640 / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create the camera frame.");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7)
      );
      if (!blob) throw new Error("Could not encode the camera frame.");

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
    <PageContainer className="w-full max-w-[1600px] px-3 sm:px-6 lg:px-8 py-4 lg:py-6">
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
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-status-error shadow-lg transition-colors hover:bg-surface-elevated"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-status-error" />
          Backend offline
        </button>
      )}

      {/* Grid columns locked with minmax(0, ...fr) so no content can expand or squeeze them */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">

        {/* COLUMN 1: CAMERA */}
        <section className={cardCls}>
          <div className="flex items-center justify-between">
            <span className={sectionTitleCls}>Camera</span>
            <span className="text-xs text-text-muted">
              {cameraActive ? "On" : "Standby"}
            </span>
          </div>

          <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
            <canvas ref={canvasRef} className="hidden" />

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full scale-x-[-1] object-cover ${
                cameraActive ? "" : "hidden"
              }`}
            />

            <CameraFramingGuide cameraActive={cameraActive} />

            {!cameraActive && cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface p-4">
                <div className="max-w-xs space-y-2 text-center">
                  <CameraOff size={22} className="mx-auto text-status-error" />
                  <p className="text-sm font-medium text-text-primary">
                    Camera unavailable
                  </p>
                  <p className="text-xs text-text-secondary">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="rounded-lg bg-accent-primary px-3.5 py-1.5 text-xs font-semibold text-black hover:brightness-110"
                  >
                    Allow camera access
                  </button>
                </div>
              </div>
            )}

            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 p-6 text-center">
                <button
                  onClick={startCamera}
                  disabled={!backendOnline}
                  className="rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Start camera
                </button>
                <p className="mt-3 text-xs text-text-muted">
                  Your hands and upper body are tracked while you sign.
                </p>
              </div>
            )}
          </div>

          <FramingWarningArea
            cameraActive={cameraActive}
            handsDetected={handsDetected}
            hasFace={Boolean(emotion)}
            detected={Boolean(prediction?.detected)}
            confidence={prediction?.confidence ?? 0}
          />

          {cameraActive && (
            <div className="flex items-center justify-between rounded-xl bg-black/20 px-3.5 py-2.5">
              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-accent-primary" />
                Camera on
              </span>

              <button
                onClick={stopCamera}
                disabled={manualRecording}
                title={
                  manualRecording
                    ? "Stop the recording before stopping the camera"
                    : undefined
                }
                className="rounded-md bg-status-error/10 px-2.5 py-1 text-xs font-semibold text-status-error transition-colors hover:bg-status-error/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Stop camera
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3.5 py-2.5">
            <span className="text-xs text-text-muted">Expression</span>

            {!emotionAvailable ? (
              <span className="text-xs text-text-muted">Unavailable</span>
            ) : cameraActive && emotion ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium capitalize text-text-primary">
                  {emotion.dominant}
                  <span className="ml-1.5 font-mono font-normal text-text-muted">
                    {Math.round(emotion.confidence * 100)}%
                  </span>
                </span>
                <div className="flex h-4 items-end gap-[3px]" aria-hidden="true">
                  {EMOTION_ORDER.map((name) => {
                    const score = emotionScore(emotion.scores, name);
                    const isTop = name === emotion.dominant.toLowerCase();
                    return (
                      <span
                        key={name}
                        title={`${name} ${Math.round(score * 100)}%`}
                        className={`w-[3px] rounded-sm ${
                          isTop ? "bg-accent-primary" : "bg-white/25"
                        }`}
                        style={{ height: `${Math.max(12, Math.round(score * 100))}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <span className="text-xs text-text-muted">
                {cameraActive ? "No face detected" : "Camera off"}
              </span>
            )}
          </div>
        </section>

        {/* COLUMN 2: RECOGNITION */}
        <section className={cardCls}>
          <div className="flex items-center justify-between">
            <span className={sectionTitleCls}>Recognition</span>
            <span className="text-xs capitalize text-text-muted">
              {cameraActive
                ? `${live ? "Sign detected" : streamState.toLowerCase()} · ${buffered} frames`
                : "Standby"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
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

            {recognitionMode === "auto" && (
              <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                <span>Auto-append</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoDetect}
                  aria-label="Auto-append"
                  onClick={() => setAutoDetect((v) => !v)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    autoDetect ? "bg-accent-primary" : "bg-white/15"
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
          </div>

          {recognitionMode === "manual" && (
            <div className={`flex items-center justify-between gap-3 p-3 ${insetCls}`}>
              <span className="text-xs text-text-muted">
                Record one full sign, then stop to recognize it.
              </span>
              <button
                type="button"
                onClick={toggleManualRecording}
                disabled={!cameraActive}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold disabled:opacity-40 ${
                  manualRecording
                    ? "bg-status-error/15 text-status-error"
                    : "bg-accent-primary text-black"
                }`}
              >
                {manualRecording ? "Stop and recognize" : "Start recording"}
              </button>
            </div>
          )}

          <div className={`px-3.5 py-3 ${insetCls}`}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <label htmlFor="confidence-threshold" className="text-text-secondary">
                Auto-append confidence
              </label>
              <span className="font-mono font-semibold text-accent-primary">
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
              onChange={(event) => setConfidenceThreshold(Number(event.target.value))}
              className="w-full accent-[var(--accent-primary)]"
            />
            <p className="mt-2 text-xs leading-snug text-text-muted">
              Signs below this are still shown, just not added automatically.
            </p>
          </div>

          <div className={`flex min-w-0 flex-1 flex-col gap-3 p-4 ${insetCls}`}>
            {recognitionNotice && (
              <div className="flex items-center gap-2 rounded-lg bg-status-error/10 px-3 py-2 text-xs text-status-error">
                <ShieldAlert size={13} className="shrink-0" />
                <span>{recognitionNotice}</span>
              </div>
            )}

            {prediction && prediction.detected ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-3xl font-semibold tracking-tight text-text-primary">
                    {prediction.label}
                  </span>
                  <span className="font-mono text-sm text-accent-primary">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-text-muted">Closest matches</div>
                  {prediction.top5.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
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
                            idx === 0 ? "text-accent-primary" : "text-text-muted"
                          }`}
                        >
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            idx === 0 ? "bg-accent-primary" : "bg-white/25"
                          }`}
                          style={{ width: `${Math.round(item.confidence * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <span className="text-sm font-medium text-text-secondary">
                  {cameraActive ? "Waiting for a sign" : "Camera is off"}
                </span>
                <span className="mt-1 text-xs text-text-muted">
                  Sign inside the guide frame.
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-text-muted">
            Reads a {contract.frames}-frame window of your movement.
          </p>
        </section>

        {/* COLUMN 3: TRANSLATION */}
        <section className={cardCls}>
          <div className="flex items-center justify-between">
            <span className={sectionTitleCls}>Translation</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleBackspace}
                disabled={detectedHistory.length === 0}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-white/[0.07] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                title="Remove last detected sign"
              >
                <Delete size={12} />
                Back
              </button>
              <button
                onClick={handleClear}
                disabled={detectedHistory.length === 0 && !bengaliOutput}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-white/[0.07] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                title="Clear all recognized signs and output"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          </div>

          {/* Recognized signs container */}
          <div className={`flex min-w-0 flex-col gap-3 p-4 ${insetCls}`}>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Recognized signs</span>
              <span className="font-mono text-text-secondary">
                {detectedHistory.length}
              </span>
            </div>

            {/* Horizontal single-row scroll area */}
            <div
              ref={historyScrollRef}
              className="w-full min-w-0 overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
            >
              {detectedHistory.length === 0 ? (
                <span className="text-xs text-text-muted">Nothing yet.</span>
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
                      className="shrink-0 whitespace-nowrap rounded-md bg-white/[0.08] px-2.5 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-white/[0.14]"
                    >
                      {s.gloss}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={pickSign}
                onChange={(e) => setPickSign(e.target.value)}
                className="min-w-0 flex-1 rounded-lg bg-white/[0.06] px-3 py-2 text-sm text-text-primary [color-scheme:dark] focus:bg-white/[0.09] focus:outline-none"
              >
                {catalog.map((c) => (
                  <option key={c.label} value={c.label} className="bg-[#10161c] text-slate-100">
                    {c.label} {c.bengali_meaning ? `— ${c.bengali_meaning}` : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddPick}
                disabled={!pickSign}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-white/[0.16] disabled:opacity-40"
              >
                <Plus size={13} />
                Add
              </button>
            </div>

            <div className="min-w-0 space-y-0.5 text-xs text-text-muted">
              <div className="truncate">
                Gloss: <span className="font-mono text-text-secondary">{glossPreview}</span>
              </div>
              {emotionSummary && (
                <div>
                  Tone sent along:{" "}
                  <span className="capitalize text-text-secondary">
                    {emotionSummary.dominant}
                  </span>{" "}
                  · {Math.round(emotionSummary.confidence * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Bengali sentence */}
          <div className={`flex flex-col gap-2.5 p-4 ${insetCls}`}>
            <div className="text-xs text-text-muted">Bengali sentence</div>
            <div className="flex min-h-[96px] items-center justify-center text-center">
              {bengaliOutput ? (
                <p className="font-bengali text-2xl font-semibold leading-relaxed text-text-primary">
                  {bengaliOutput}
                </p>
              ) : (
                <span className="text-sm text-text-muted">
                  The sentence shows up here once you generate it.
                </span>
              )}
            </div>
          </div>

          {/* Voice */}
          <div className={`flex flex-col gap-3.5 p-4 ${insetCls}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="shrink-0 text-xs text-text-muted">Voice engine</span>
              <div className={segCls}>
                <button
                  type="button"
                  onClick={() => {
                    setTtsEngine("free");
                    setVoiceId("1");
                  }}
                  className={`${segBtnCls} ${
                    ttsEngine === "free" ? segActiveCls : segIdleCls
                  }`}
                >
                  Edge TTS (free)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ttsEngine !== "elevenlabs") {
                      setShowTtsPremiumModal(true);
                    }
                  }}
                  className={`${segBtnCls} ${
                    ttsEngine === "elevenlabs"
                      ? "bg-amber-400/20 text-amber-300"
                      : segIdleCls
                  }`}
                >
                  ElevenLabs (premium)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                  className={`h-10 rounded-lg text-xs font-medium transition-colors ${
                    voiceId === v.id
                      ? ttsEngine === "free"
                        ? "bg-accent-primary/15 text-accent-primary"
                        : "bg-amber-400/20 text-amber-300"
                      : "bg-white/[0.05] text-text-secondary hover:bg-white/[0.09] hover:text-text-primary"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {ttsEngine === "elevenlabs" && (
              <p className="text-xs text-amber-300/80">
                Emotion tags are kept in the speech: [excited], [sad], [whispers], [happy]
              </p>
            )}

            {showTtsPremiumModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-surface p-6 shadow-2xl">
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
                      Speech uses the ElevenLabs eleven_v3 model through your backend ELEVENLABS_API_KEY.
                    </p>
                    <p>Cloud API credits are used for every character generated.</p>
                    <p className="font-medium text-amber-300">
                      There is no automatic fallback. If the key is invalid or the quota runs out, you get an error instead of switching back to free mode.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTtsPremiumModal(false)}
                      className="rounded-lg px-3.5 py-2 text-xs text-text-secondary transition-colors hover:bg-white/[0.07] hover:text-text-primary"
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
                      className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-amber-300"
                    >
                      Use ElevenLabs
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleStreamAndSpeak}
              disabled={detectedHistory.length === 0 || isGenerating}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-secondary text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Generating...
                </>
              ) : isPlayingAudio ? (
                <>
                  <Volume2 size={15} className="animate-pulse" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 size={15} />
                  Speak in Bengali
                </>
              )}
            </button>
          </div>
        </section>

      </div>
    </PageContainer>
  );
}