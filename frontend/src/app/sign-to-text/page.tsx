"use client";
import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PipelineStatus } from "@/components/pipeline/PipelineStatus";
import { Camera, CameraOff, Volume2, Copy, Check, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000";

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
}

interface DetectedSign {
  gloss: string;
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
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
  const [copied, setCopied] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [nmmFlags, setNmmFlags] = useState<Prediction["nmm"] | null>(null);
  const [bengaliOutput, setBengaliOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<"1" | "2">("1");

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_BASE}/api/system/health`)
      .then(() => { if (!cancelled) setBackendOnline(true); })
      .catch(() => { if (!cancelled) setBackendOnline(false); });
    return () => { cancelled = true; };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      if (!intervalRef.current) {
        intervalRef.current = setInterval(doCaptureAndPredict, 1000);
      }
    } catch {
      setCameraError(
        "Camera Unavailable. WBSL Bridge could not access your camera. Check browser permissions and try again."
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

  // ─── NMM → gloss marker composition (matches constrained NLG FORMAT) ───
  const buildGlossString = (history: DetectedSign[]) => {
    if (history.length === 0) return "";
    const anyQuestion = history.some((h) => h.question || h.wh_question);
    return history
      .map((h, i) => {
        let tok = h.gloss;
        if (h.negation) tok += "[negation]";
        if (anyQuestion && i === history.length - 1) tok += "[?]";
        return tok;
      })
      .join(" + ");
  };

  const doCaptureAndPredict = async () => {
    if (isProcessingRef.current) return;
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPrediction(res.data);
      setNmmFlags(res.data.nmm);

      if (res.data.detected && res.data.confidence > 0.5) {
        const f = res.data.nmm;
        setDetectedHistory((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.gloss === res.data.label) {
            // same sign still held — merge any NMM that appeared during the hold
            const merged: DetectedSign = {
              ...last,
              question: last.question || f.question,
              wh_question: last.wh_question || f.wh_question,
              negation: last.negation || f.negation,
              affirmation: last.affirmation || f.affirmation,
              emphasis: last.emphasis || f.emphasis,
            };
            return [...prev.slice(0, -1), merged];
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
      // Backend not responding, keep camera running
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  // ─── ONE button: stream Bengali tokens, then speak ───
  const handleStreamAndSpeak = async () => {
    if (detectedHistory.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setBengaliOutput("");
    let full = "";
    try {
      const gloss = buildGlossString(detectedHistory);
      const response = await fetch(`${API_BASE}/api/nlg/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gloss }),
      });
      if (!response.ok || !response.body) throw new Error("stream unavailable");
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
          } catch {}
        }
      }
    } catch {
      toast.error("Streaming failed — check LLM configuration in .env");
    } finally {
      setIsGenerating(false);
    }

    const text = full.trim();
    if (!text) return;

    // automatic voice playback
    setIsPlayingAudio(true);
    try {
      const res = await axios.post(`${API_BASE}/api/tts/generate`, { text, voice: voiceId });
      if (res.data.audio_url) {
        const audio = new Audio(`${API_BASE}${res.data.audio_url}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
        return;
      }
    } catch { /* fall through */ }
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "bn-IN";
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = () => {
    if (detectedHistory.length === 0) return;
    navigator.clipboard.writeText(detectedHistory.map((s) => s.gloss).join(" "));
    setCopied(true);
    toast.success("Sign sequence copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setDetectedHistory([]);
    setPrediction(null);
    setNmmFlags(null);
    setBengaliOutput("");
  };

  const anyQuestion = detectedHistory.some((h) => h.question || h.wh_question);

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-primary uppercase tracking-wider">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? "bg-accent-primary" : "bg-status-error"}`} />
            <span>{backendOnline ? "BACKEND CONNECTED" : "BACKEND OFFLINE"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Sign → Bengali Live Translation
          </h1>
        </div>

        <div className="text-xs font-mono text-text-secondary">
          MODEL: <strong className="text-text-primary">sign_mlp.onnx</strong> |
          CLASSES: <strong className="text-text-primary">35</strong>
        </div>
      </div>

      {!backendOnline && (
        <div className="p-4 rounded-lg bg-status-error/10 border border-status-error/30 text-xs font-mono text-status-error">
          Backend is not running. Start it with:{" "}
          <code className="bg-surface px-1.5 py-0.5 rounded">
            uvicorn backend.main:app --reload --port 8000
          </code>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-video w-full bg-surface border border-border rounded-lg overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="hidden" />

            {/* Video stays mounted permanently — only hidden via CSS.
                Conditional rendering would unmount/remount it on every
                re-render (prediction updates, health poll, etc.), which is
                what made the camera feed flicker on and off. */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? "" : "hidden"}`}
            />

            {!cameraActive && cameraError && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center">
                <div className="text-center p-6 space-y-3 max-w-sm">
                  <div className="w-12 h-12 mx-auto rounded-full bg-status-error/10 flex items-center justify-center text-status-error">
                    <CameraOff size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">Camera Unavailable</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded bg-accent-primary text-black text-xs font-mono font-semibold"
                  >
                    Request Permissions
                  </button>
                </div>
              </div>
            )}

            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Camera size={32} className="mx-auto text-text-muted" />
                  <p className="text-xs font-mono text-text-secondary">Camera is off</p>
                  <button
                    onClick={startCamera}
                    disabled={!backendOnline}
                    className="px-5 py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Camera
                  </button>
                </div>
              </div>
            )}

            {isProcessing && cameraActive && (
              <div className="absolute top-3 right-3 bg-surface/90 border border-border px-2 py-1 rounded text-[10px] font-mono text-status-pending">
                PROCESSING...
              </div>
            )}
          </div>

          {cameraActive && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
              <span className="text-xs font-mono text-text-secondary">
                Detecting every 1 second
              </span>
              <button
                onClick={stopCamera}
                className="px-3 py-1.5 rounded bg-status-error/20 border border-status-error text-status-error text-xs font-mono"
              >
                Stop Camera
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-surface border border-border rounded-lg p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              RECOGNITION RESULT
            </span>
          </div>

          <div className="p-4 rounded-lg bg-surface-elevated/70 border border-border">
            {prediction ? (
              prediction.detected ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-mono text-accent-primary">
                      {prediction.label}
                    </span>
                    <span className="text-sm font-mono text-text-secondary">
                      {Math.round(prediction.confidence * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-border">
                    {prediction.top5.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-mono">
                        <span className={idx === 0 ? "text-text-primary font-semibold" : "text-text-muted"}>
                          {item.label}
                        </span>
                        <span className={idx === 0 ? "text-accent-primary" : "text-text-muted"}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-xs font-mono text-text-muted">NO HAND DETECTED</span>
                </div>
              )
            ) : (
              <div className="text-center py-4">
                <span className="text-xs font-mono text-text-muted">
                  Start camera to begin recognition
                </span>
              </div>
            )}
          </div>

          {nmmFlags && (
            <div className="p-3 bg-surface-elevated rounded border border-border space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-text-muted">
                Non-Manual Markers (NMM)
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.question ? "bg-accent-primary/20 border-accent-primary text-accent-primary" : "border-border text-text-muted"}`}>
                  QUESTION: {nmmFlags.question ? "ON" : "OFF"}
                </span>
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.wh_question ? "bg-accent-primary/20 border-accent-primary text-accent-primary" : "border-border text-text-muted"}`}>
                  WH-QUES: {nmmFlags.wh_question ? "ON" : "OFF"}
                </span>
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.negation ? "bg-status-error/20 border-status-error text-status-error" : "border-border text-text-muted"}`}>
                  NEGATION: {nmmFlags.negation ? "ON" : "OFF"}
                </span>
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.emphasis ? "bg-status-pending/20 border-status-pending text-status-pending" : "border-border text-text-muted"}`}>
                  EMPHASIS: {nmmFlags.emphasis ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-border space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              DETECTED SEQUENCE
            </div>
            <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded bg-background border border-border">
              {detectedHistory.length === 0 ? (
                <span className="text-xs font-mono text-text-muted">Awaiting input...</span>
              ) : (
                detectedHistory.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded bg-surface border font-mono text-xs font-bold ${
                      s.negation
                        ? "border-status-error/60 text-status-error"
                        : idx === detectedHistory.length - 1 && anyQuestion
                        ? "border-status-pending/60 text-status-pending"
                        : "border-border text-accent-primary"
                    }`}
                  >
                    [{s.gloss}]
                  </span>
                ))
              )}
            </div>
            <div className="text-[11px] font-mono text-text-muted">
              NLG INPUT:{" "}
              <span className="text-text-secondary">
                {detectedHistory.length ? buildGlossString(detectedHistory) : "—"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-text-muted">
              red chip = [negation] held · amber last chip = [?] question · markers follow FORMAT: WORD[negation][?]
            </div>
          </div>

          <button
            onClick={handleStreamAndSpeak}
            disabled={detectedHistory.length === 0 || isGenerating}
            className="w-full py-3 rounded bg-accent-secondary text-white font-mono text-xs uppercase font-bold hover:bg-accent-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Streaming Bengali...</span>
              </>
            ) : isPlayingAudio ? (
              <>
                <Volume2 size={14} />
                <span>Speaking...</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>Stream Bengali in Voice</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-text-muted">TTS Voice:</span>
            <button
              onClick={() => setVoiceId("1")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "1"
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Female (Nabanita)
            </button>
            <button
              onClick={() => setVoiceId("2")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "2"
                  ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Male (Pradeep)
            </button>
          </div>

          {bengaliOutput && (
            <div className="p-4 rounded-lg bg-background border border-border">
              <div className="text-xs font-mono uppercase text-text-muted mb-2">BENGALI OUTPUT</div>
              <p className="font-bengali text-xl text-text-primary">{bengaliOutput}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={detectedHistory.length === 0}
              className="flex items-center space-x-1 px-3 py-2 rounded bg-surface-elevated hover:bg-surface border border-border text-xs font-mono text-text-primary disabled:opacity-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-accent-primary" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center space-x-1 px-3 py-2 rounded bg-surface-elevated hover:bg-surface border border-border text-xs font-mono text-text-secondary hover:text-status-error transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      <PipelineStatus
        stages={{
          camera: cameraActive ? "active" : "idle",
          landmarks: cameraActive && backendOnline ? "active" : "idle",
          recognition: cameraActive && backendOnline ? "active" : "idle",
          nlg: bengaliOutput ? "active" : "idle",
          tts: isPlayingAudio ? "active" : "idle",
        }}
        fps={cameraActive ? 1 : 0}
      />
    </PageContainer>
  );
}
