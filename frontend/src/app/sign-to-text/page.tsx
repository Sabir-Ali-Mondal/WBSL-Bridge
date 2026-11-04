"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmotionPanel } from "@/components/sign/EmotionPanel";
import { CameraFramingGuide } from "@/components/camera/CameraFramingGuide";
import { FramingWarningArea } from "@/components/camera/FramingWarningArea";
import {
  CameraOff,
  Volume2,
  Trash2,
  Loader2,
  Delete,
  Plus,
  Sparkles,
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

export default function SignToTextPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  // One id per page visit. The server keys its landmark ring buffer on this, so
  // the recognition window survives React re-renders and only the client can
  // decide when it should be abandoned (which is what "Clear" does).
  //
  // Seeded in an effect rather than in the initialiser: reading the clock or the
  // crypto device during render is not idempotent, and a ref initialiser runs on
  // every render attempt (including the ones React discards), so it must not do
  // anything observable. Nothing is sent to the server before the camera starts,
  // so the id is always in place before it is first used.
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
  const [isProcessing, setIsProcessing] = useState(false);
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

  // How deep the SERVER's buffer is. The client does not track this itself: it
  // uploads one frame per tick and the server reports what it holds.
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
    if (manualRecordingRef.current || isProcessingRef.current) return;
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
      // Free mode: fall through to browser SpeechSynthesis
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

    // The recognition window lives on the server now, so clearing the sequence
    // has to clear it there too. A fresh session id is the cheapest correct
    // reset: the old buffer is abandoned rather than mutated, and the next tick
    // starts from an empty window instead of reading the sign the user just
    // deleted.
    sessionIdRef.current = newSessionId();

    setBuffered(0);
    setStreamState("IDLE");
  };

  /** Apply one completed span returned by the server's state machine. */
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

  /**
   * One JPEG in, one buffered landmark out.
   *
   * The browser sends the newest frame; the server tracks the sign span and
   * selects the model input when that span completes.
   */
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
          // A frame the server did not answer in 5 s is a frame the signer has
          // already moved past. Dropping it keeps the tick rate honest instead of
          // queueing requests behind a stalled one.
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
      {/* OFFLINE NOTIFICATION */}
      {!backendOnline && (
        <div className="mb-4 p-2.5 rounded-xl bg-status-error/10 border border-status-error/30 text-xs font-mono text-status-error flex items-center justify-between">
          <span>Backend is not running. Start: <code className="bg-surface px-1.5 py-0.5 rounded border border-border">uvicorn backend.main:app --reload --port 8200</code></span>
        </div>
      )}

      {/* MAIN WORKSPACE 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_1.1fr] gap-4 lg:gap-6 items-start">

        {/* COLUMN 1: CAMERA & FRAMING */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted select-none font-semibold">
              Camera Feed
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              {cameraActive ? `${buffered} BUFFERED` : "STANDBY"}
            </span>
          </div>

          {/* Camera Viewport Container */}
          <div className="relative w-full aspect-[16/10] bg-black rounded-xl overflow-hidden border border-border shadow-lg flex items-center justify-center">
            <canvas ref={canvasRef} className="hidden" />

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive ? "" : "hidden"
              }`}
            />

            {/* SVG Camera Framing Guide (first 5 seconds of camera activation) */}
            <CameraFramingGuide cameraActive={cameraActive} />

            {/* Camera Offline / Permissions state */}
            {!cameraActive && cameraError && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center p-4">
                <div className="text-center space-y-2 max-w-xs">
                  <CameraOff size={24} className="mx-auto text-status-error" />
                  <p className="text-xs font-semibold text-text-primary">Camera unavailable</p>
                  <p className="text-[10px] text-text-secondary">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-lg bg-accent-primary text-black text-[10px] font-mono font-bold hover:brightness-110"
                  >
                    Request Permissions
                  </button>
                </div>
              </div>
            )}

            {/* Camera Inactive placeholder */}
            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 bg-surface/90 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={startCamera}
                  disabled={!backendOnline}
                  className="px-5 py-2 rounded-xl bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start Camera
                </button>
                <p className="text-[10px] font-mono text-text-muted mt-2">
                  Upper body and hand pose will be tracked in real time
                </p>
              </div>
            )}

            {isProcessing && cameraActive && (
              <div className="absolute top-2.5 right-2.5 bg-surface/90 border border-border px-2 py-0.5 rounded text-[9px] font-mono text-status-pending backdrop-blur shadow-sm">
                PROCESSING...
              </div>
            )}
          </div>

          {/* Framing Warning Guidance Area */}
          <FramingWarningArea
            cameraActive={cameraActive}
            handsDetected={handsDetected}
            hasFace={Boolean(emotion)}
            detected={Boolean(prediction?.detected)}
            confidence={prediction?.confidence ?? 0}
          />

          {/* Camera Controls Bar */}
          {cameraActive && (
            <div className="h-9 flex items-center justify-between px-3.5 rounded-xl bg-surface/80">
              <span className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                Live Tracking Active
              </span>

              <button
                onClick={stopCamera}
                disabled={manualRecording}
                title={manualRecording ? "Stop the recording before stopping the camera" : undefined}
                className="px-2.5 py-1 rounded-lg bg-status-error/15 border border-status-error/40 text-status-error text-[10px] font-mono font-bold hover:bg-status-error/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                STOP CAMERA
              </button>
            </div>
          )}

          {/* Emotion / Affect Panel */}
          <EmotionPanel emotion={emotion} offline={!emotionAvailable} compact />
        </section>

        {/* COLUMN 2: LIVE RECOGNITION */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted select-none font-semibold">
              Live Recognition
            </span>
            <span className="text-[9px] font-mono text-text-muted">
              {streamState} · {buffered} FRAMES
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl bg-background/50 p-2">
            <div className="flex items-center gap-1">
              {(["auto", "manual"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => changeRecognitionMode(mode)}
                  disabled={isProcessing || manualRecording}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase transition-colors disabled:opacity-40 ${
                    recognitionMode === mode
                      ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            {recognitionMode === "auto" && (
              <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary text-[9px] font-mono">
                <span>Auto-append</span>
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={(e) => setAutoDetect(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[var(--accent-primary)] rounded cursor-pointer"
                />
              </label>
            )}
          </div>

          {recognitionMode === "manual" && (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-background/50 p-2.5">
              <span className="text-[9px] font-mono text-text-muted">
                Record one complete sign, then stop to recognize it.
              </span>
              <button
                type="button"
                onClick={toggleManualRecording}
                disabled={!cameraActive || isProcessing}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold disabled:opacity-40 ${
                  manualRecording
                    ? "bg-status-error/20 text-status-error border border-status-error/40"
                    : "bg-accent-primary text-black"
                }`}
              >
                {manualRecording ? "STOP & RECOGNIZE" : "START RECORDING"}
              </button>
            </div>
          )}

          <div className="rounded-xl bg-background/50 px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-2 text-[9px] font-mono">
              <label htmlFor="confidence-threshold" className="text-text-secondary">
                Auto-append confidence
              </label>
              <span className="text-accent-primary">{Math.round(confidenceThreshold * 100)}%</span>
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
            <p className="text-[8px] font-mono text-text-muted">
              Best-match labels remain visible at every confidence; this only controls auto-append.
            </p>
          </div>

          {/* Recognition Result Card */}
          <div className="rounded-xl bg-background/50 p-3 flex flex-col gap-2.5 min-w-0">
            {recognitionNotice && (
              <div className="flex items-center gap-2 rounded-lg border border-status-error/30 bg-status-error/10 px-2.5 py-2 text-[10px] font-mono text-status-error">
                <ShieldAlert size={13} className="shrink-0" />
                <span>{recognitionNotice}</span>
              </div>
            )}
            {live && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-[9px] font-mono">
                <span className="text-accent-secondary font-bold truncate">
                  {live.label} · {Math.round(live.confidence * 100)}%
                </span>
              </div>
            )}

            {prediction && prediction.detected ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-2.5">
                  <span className="text-xl font-bold font-mono text-accent-primary truncate">
                    {prediction.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-text-primary px-2 py-0.5 rounded bg-surface-elevated border border-border">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>

                {/* Top-5 Predictions Probability Bars */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[9px] font-mono uppercase text-text-muted tracking-wider">
                    Confidence Distribution
                  </div>
                  {prediction.top5.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className={idx === 0 ? "text-text-primary font-bold" : "text-text-secondary"}>
                          {item.label}
                        </span>
                        <span className={idx === 0 ? "text-accent-primary font-bold" : "text-text-muted"}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            idx === 0 ? "bg-accent-primary" : "bg-text-muted/40"
                          }`}
                          style={{ width: `${Math.round(item.confidence * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center text-center">
                <Sparkles size={16} className="text-text-muted mb-1.5" />
                <span className="text-xs font-mono text-text-secondary font-medium">
                  {cameraActive ? "Awaiting Hand Gestures" : "Camera Standby"}
                </span>
                <span className="text-[10px] font-mono text-text-muted mt-1">
                  Perform a WBSL sign within the guide frame
                </span>
              </div>
            )}
          </div>

          {/* Pipeline Specifications Info Box */}
          <div className="bg-background/50 rounded-xl p-2.5 flex flex-col gap-0.5 text-[9px] font-mono text-text-muted">
            <div className="flex justify-between">
              <span>Pipeline:</span>
              <span className="text-text-secondary font-medium">
                {contract.frames}-frame temporal sequence
              </span>
            </div>
            <div className="flex justify-between">
              <span>Features:</span>
              <span className="text-text-secondary font-medium">{contract.feature_width ?? 98}-dim shoulder-box</span>
            </div>
            <div className="flex justify-between">
              <span>Collected affect:</span>
              <span className="text-accent-secondary font-medium">
                {emotionSummary
                  ? `${emotionSummary.dominant} · ${Math.round(emotionSummary.confidence * 100)}%`
                  : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* COLUMN 3: TRANSLATION & SPEECH */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted select-none font-semibold">
              Translation Workspace
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleBackspace}
                disabled={detectedHistory.length === 0}
                className="px-2 py-0.5 rounded-md bg-surface/80 hover:bg-surface-elevated border border-border/80 text-[9px] font-mono text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                title="Remove last detected sign"
              >
                <Delete size={10} />
                Back
              </button>

              <button
                onClick={handleClear}
                disabled={detectedHistory.length === 0 && !bengaliOutput}
                className="px-2 py-0.5 rounded-md bg-surface/80 hover:bg-surface-elevated border border-border/80 text-[9px] font-mono text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                title="Clear all recognized signs and output"
              >
                <Trash2 size={10} />
                Clear
              </button>
            </div>
          </div>

          {/* Detected Sequence Card */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase text-text-muted">
              <span>Gloss Sequence</span>
              <span className="text-[8px] text-text-secondary font-bold">
                {detectedHistory.length} SIGNS
              </span>
            </div>

            <div className="min-h-[46px] max-h-[72px] rounded-lg bg-surface/60 p-2 overflow-y-auto">
              {detectedHistory.length === 0 ? (
                <span className="text-[10px] font-mono text-text-muted flex items-center h-full">
                  No signs recognized yet...
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
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
                      className="px-2 py-0.5 rounded-md border border-border bg-surface-elevated font-mono text-[9px] font-bold text-accent-primary hover:brightness-110 transition-all"
                    >
                      {s.gloss}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick vocabulary picker */}
            <div className="flex gap-2">
                <select
                  value={pickSign}
                  onChange={(e) => setPickSign(e.target.value)}
                  className="min-w-0 flex-1 px-2.5 py-1.5 rounded-lg bg-surface/80 border border-border/80 text-[10px] font-mono text-text-primary focus:outline-none"
                >
                  {catalog.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label} {c.bengali_meaning ? `— ${c.bengali_meaning}` : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddPick}
                  disabled={!pickSign}
                  className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 border border-border/80 text-[10px] font-mono font-semibold text-text-primary disabled:opacity-40 flex items-center gap-1"
                >
                  <Plus size={11} />
                  Add
                </button>
            </div>

            <div className="text-[8px] font-mono text-text-muted truncate pt-0.5">
              NLG: <span className="text-text-secondary font-medium">{glossPreview}</span>
            </div>
          </div>

          {/* Bengali Sentence Output Card */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2">
            <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted">
              Bengali Translation
            </div>

            <div className="rounded-lg bg-surface/60 p-3 flex items-center justify-center text-center min-h-[64px]">
              {bengaliOutput ? (
                <p className="font-bengali text-xl sm:text-2xl text-text-primary leading-relaxed font-semibold">
                  {bengaliOutput}
                </p>
              ) : (
                <span className="text-xs font-mono text-text-muted">
                  Bengali natural language translation will generate here
                </span>
              )}
            </div>
          </div>

          {/* Voice Output & Stream Button Card directly below Bengali translation */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2.5">
            {/* TTS Engine Switcher */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/50">
              <span className="text-[9px] font-mono uppercase text-text-muted shrink-0">
                TTS Engine:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTtsEngine("free");
                    setVoiceId("1");
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors ${
                    ttsEngine === "free"
                      ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40 shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Free (Edge TTS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ttsEngine !== "elevenlabs") {
                      setShowTtsPremiumModal(true);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                    ttsEngine === "elevenlabs"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <Sparkles size={10} />
                  ElevenLabs (Premium)
                </button>
              </div>
            </div>

            {/* Voice Model Selector Tabs */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase text-text-muted shrink-0">
                Voice:
              </span>
              <div className="flex-1 grid grid-cols-2 gap-1.5">
                {ttsEngine === "free" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setVoiceId("1")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "1"
                          ? "bg-accent-primary/15 border-accent-primary text-accent-primary shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Female · Nabanita
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceId("2")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "2"
                          ? "bg-accent-secondary/15 border-accent-secondary text-accent-secondary shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Male · Pradeep
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setVoiceId("eleven_1")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "eleven_1"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Female · Sarah
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceId("eleven_2")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "eleven_2"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Male · George
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ElevenLabs Tag Notice */}
            {ttsEngine === "elevenlabs" && (
              <div className="text-[9px] font-mono text-amber-300/80 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400 shrink-0" />
                <span>Emotion tags preserved: [excited], [sad], [whispers], [happy]</span>
              </div>
            )}

            {/* TTS Premium Confirmation Modal */}
            {showTtsPremiumModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-surface border border-amber-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-sm text-text-primary">
                        Switch to ElevenLabs Premium TTS?
                      </h3>
                      <span className="text-[10px] font-mono text-amber-400">
                        Expressive multilingual speech with emotion tag support
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border/60 flex flex-col gap-2">
                    <p>
                      • Voice synthesis will use ElevenLabs eleven_v3 model via your backend ELEVENLABS_API_KEY.
                    </p>
                    <p>
                      • Cloud API credits will be consumed per character generated.
                    </p>
                    <p className="font-semibold text-amber-300">
                      • No Automatic Fallback: If your API key is invalid or quota runs out, speech synthesis will report an error instead of automatically falling back to Free mode.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTtsPremiumModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    >
                      Cancel (Stay Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTtsEngine("elevenlabs");
                        setVoiceId("eleven_1");
                        setShowTtsPremiumModal(false);
                        toast.success("Switched to ElevenLabs Premium TTS mode.");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors shadow-md"
                    >
                      Enable ElevenLabs
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stream Bengali Action Button */}
            <button
              onClick={handleStreamAndSpeak}
              disabled={detectedHistory.length === 0 || isGenerating}
              className="w-full h-11 rounded-xl bg-accent-secondary hover:brightness-110 active:scale-[0.99] text-white font-mono text-xs uppercase font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating Bengali Speech...
                </>
              ) : isPlayingAudio ? (
                <>
                  <Volume2 size={14} className="animate-pulse" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  Stream Bengali in Voice
                </>
              )}
            </button>
          </div>
        </section>

      </div>
    </PageContainer>
  );
}