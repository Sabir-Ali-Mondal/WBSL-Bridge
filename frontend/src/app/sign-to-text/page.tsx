"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  NmmThresholdPanel,
  DEFAULT_ALL,
  DEFAULT_MARKER_GATES,
  COMMIT_STORAGE_KEY,
  type AllThresholds,
  type MarkerGates,
} from "@/components/sign/NmmThresholdPanel";
import { EmotionPanel } from "@/components/sign/EmotionPanel";
import { CameraFramingGuide } from "@/components/camera/CameraFramingGuide";
import { FramingWarningArea } from "@/components/camera/FramingWarningArea";
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
  ShieldAlert,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

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
    emotion?: EmotionResult | null;
    metrics?: NmmMetrics | null;
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

/**
 * [affirmation] and [emphasis] have no symbol in the LLM prompt's notation
 * guide, so they are never appended to the gloss string. They still travel in
 * the `nmm` metadata payload, where the model is told what they mean.
 *
 * Which markers can reach this point at all is decided server-side by the NMM
 * Controller's gates (backend/nmm.py MARKER_GATES), not here.
 */

interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  emotion?: EmotionResult | null;
  detail?: string;
  buffered?: number;
  top3?: { label: string; confidence: number }[];
  /** The window's non-manual markers, captured on the frame being recognised. */
  nmm?: Prediction["nmm"] & { emotion?: EmotionResult | null; metrics?: NmmMetrics | null };
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

  // Set once the streaming endpoint answers 404/405. From then on the tick uses
  // the batch path, which posts a whole window to /api/predict/stream -- the
  // only route a backend older than this page understands. Without this the page
  // would spend every tick failing against an endpoint that is not there.
  const [streamUnavailable, setStreamUnavailable] = useState(false);
  const streamFallbackRef = useRef(false);

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
  const [emotionAvailable, setEmotionAvailable] = useState(true);

  // The thresholds the panel last saved, read once on mount. Declared as an
  // initialiser rather than a useEffect that calls setThresholds: restoring
  // saved state in an effect body is a second render for data that was already
  // available synchronously, and the lint rule against setState-in-effect is
  // pointing at a real cost here, not a stylistic one.
  const savedThresholds = React.useMemo<Partial<AllThresholds> | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(COMMIT_STORAGE_KEY);

      return raw ? (JSON.parse(raw) as Partial<AllThresholds>) : null;
    } catch {
      return null;
    }
  }, []);

  const thresholdsRef = useRef<AllThresholds>(DEFAULT_ALL);

  const [thresholds, setThresholds] = useState<AllThresholds>({
    ...DEFAULT_ALL,
    ...(savedThresholds ?? {}),
  });
  // Marker on/off gates, mirrored from the NMM Controller panel. Held here
  // because the panel can be closed and the page still needs the current state
  // to know what the server was last told.
  const [markerGates, setMarkerGates] =
    useState<MarkerGates>(DEFAULT_MARKER_GATES);

  const [repeatBlocked, setRepeatBlocked] = useState(false);
  // How deep the SERVER's buffer is. The client does not track this itself: it
  // uploads one frame per tick and the server reports what it holds.
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    thresholdsRef.current = thresholds;
  }, [thresholds]);

  // The gates live on the server, so the page must not invent its own default.
  // Reading them back on mount is what stops the panel showing OFF while the
  // detector is still emitting [negation] from a previous session.
  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/nmm/config`)
      .then((res) => {
        if (cancelled) return;

        const serverGates = res.data?.marker_gates;

        if (serverGates && typeof serverGates === "object") {
          setMarkerGates((prev) => ({ ...prev, ...serverGates }));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const [nmmFlags, setNmmFlags] =
    useState<Prediction["nmm"] | null>(null);

  const [bengaliOutput, setBengaliOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<string>("1");
  const [ttsEngine, setTtsEngine] = useState<"free" | "elevenlabs">("free");
  const [showTtsPremiumModal, setShowTtsPremiumModal] = useState(false);
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
  const idleSinceRef = useRef<number | null>(null);

  const [activeClasses, setActiveClasses] = useState(35);

  const [contract, setContract] = useState<{
    kind: "static" | "temporal";
    frames: number;
    endpoint: string;
    // Which extractor the active graph needs: "two_hand" (126-dim) or
    // "hands_pose" (258-dim). Only used to tell the user why a 258-dim run
    // wants their full body in frame; recognition itself is unchanged.
    feature_width?: number | null;
    feature_kind?: "two_hand" | "hands_pose" | null;
  }>({
    kind: "static",
    frames: 1,
    endpoint: "/api/predict/frame",
  });

  const [coverage, setCoverage] = useState<{
    with_landmark_sequences: number;
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
        setEmotionAvailable(!!res.data.emotion_available);

        if (typeof res.data.vocabulary_classes === "number") {
          setActiveClasses(res.data.vocabulary_classes);
        }

        if (res.data.contract) {
          setContract(res.data.contract);
        }

        if (res.data.sequence_coverage) {
          setCoverage(res.data.sequence_coverage);
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
      idleSinceRef.current = null;

      if (!intervalRef.current) {
        // 100 ms = 10 uploads/s. The server throttles its own inference to every
        // 250 ms and only keeps the newest frame in the buffer, so a faster tick
        // costs bandwidth without buying resolution; anything slower than ~150 ms
        // starts dropping frames out of the 30 fps capture the window assumes.
        intervalRef.current = setInterval(
          // The tick choice is read on EVERY tick, not at setInterval creation:
          // the 404 fallback flag can only flip after the first failed request,
          // and a ternary evaluated here would freeze the wrong tick forever.
          () => {
            if (!isTemporal) return doCaptureAndPredict();
            return streamFallbackRef.current ? doAutoDetectTick() : doStreamTick();
          },
          isTemporal ? 100 : 1000
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
        let tok = `[${h.gloss.toLowerCase()}]`;

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
      setEmotion(res.data.emotion ?? res.data.nmm?.emotion ?? null);

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

  const appendGloss = (
    gloss: string,
    nmm?: DetectedSign
  ) => {
    // The markers are whatever the detector reported for the window this sign
    // came from. Nothing is merged in from the UI: the manual marker buttons
    // were removed, and inventing a marker the detector never saw is exactly
    // what made the old panel untrustworthy.
    const applied: DetectedSign = {
      gloss,
      question: !!nmm?.question,
      wh_question: !!nmm?.wh_question,
      negation: !!nmm?.negation,
      affirmation: !!nmm?.affirmation,
      emphasis: !!nmm?.emphasis,
    };

    setDetectedHistory((prev) => [...prev, applied]);
  };

  /**
   * Everything the recognition stage knows but the gloss string cannot show.
   * This is what makes the questions block an OPTION rather than a blind rule:
   * the LLM only marks a question when the detector actually reported one -- and
   * only for markers whose gate is open in the NMM Controller.
   */
  const nmm = {
    question: !!prediction?.nmm?.question,
    wh_question: !!prediction?.nmm?.wh_question,
    negation: !!prediction?.nmm?.negation,
    affirmation: !!prediction?.nmm?.affirmation,
    emphasis: !!prediction?.nmm?.emphasis,
  };

  const handleBackspace = () => {
    if (detectedHistory.length === 0) {
      return;
    }

    setDetectedHistory((prev) =>
      prev.slice(0, -1)
    );

    // The dropped sign's markers leave with it. Nothing is restored, because
    // markers are no longer something the UI holds on the user's behalf -- they
    // come from the detector on the frame that is being recognised, and a
    // marker that has passed is a marker that has passed.
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

    candidateRef.current = null;
    idleSinceRef.current = null;

    lastAppendRef.current = {
      label: "",
      at: 0,
    };

    frameBufferRef.current = [];

    // The recognition window lives on the server now, so clearing the sequence
    // has to clear it there too. A fresh session id is the cheapest correct
    // reset: the old buffer is abandoned rather than mutated, and the next tick
    // starts from an empty window instead of reading the sign the user just
    // deleted.
    sessionIdRef.current = newSessionId();

    setBuffered(0);
  };

  /**
   * Legacy batch tick: fills a 32-frame client buffer and posts it to
   * /api/predict/stream.
   *
   * Kept because it is the only path that works if the page is served against a
   * backend without /api/stream/frame, and because it is a useful reference for
   * what the server-side windowing replaced. All recognition policy now lives in
   * commitFromStream, so the two ticks cannot disagree about when a sign counts.
   */
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

      commitFromStream(res.data);
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

  /**
   * Everything that happens once the server has recognised a window.
   *
   * Shared by the single-frame streaming tick and the legacy batch tick, so the
   * commit policy exists in exactly one place: confidence and margin must clear
   * the panel's thresholds, the same label must repeat ``stable_windows`` times,
   * and a repeat inside the cooldown is reported rather than swallowed.
   *
   * The window's NMM / affect belongs to the SIGN being recognised, not to the
   * previous one, so it is read here -- from the payload that carried the
   * prediction -- and not from whatever the last frame happened to report.
   */
  const commitFromStream = (data: StreamResult) => {
    const label = data.label;
    const incomingEmotion = data.emotion ?? data.nmm?.emotion ?? null;
    if (incomingEmotion) setEmotion(incomingEmotion);

    const markIdle = () => {
      candidateRef.current = null;
      if (!lastAppendRef.current.label) return;

      const now = Date.now();
      idleSinceRef.current ??= now;
      if (
        now - idleSinceRef.current >=
        thresholdsRef.current.repeat_cooldown_ms
      ) {
        lastAppendRef.current = { label: "", at: 0 };
        idleSinceRef.current = null;
        setRepeatBlocked(false);
      }
    };

    if (!data.ready || !label) {
      setLive(null);
      const detail = data.detail?.toLowerCase() ?? "";
      if (detail === "idle" || detail.includes("no hands")) {
        markIdle();
      } else if (detail !== "throttled" && detail !== "filling") {
        candidateRef.current = null;
      }
      return;
    }

    const confidence = data.confidence ?? 0;
    const margin = data.margin ?? 0;
    const top3 = data.top3 ?? [];

    const nn = data.nmm ?? {
      question: false,
      wh_question: false,
      negation: false,
      affirmation: false,
      emphasis: false,
    };

    const emo = (incomingEmotion ?? null) as EmotionResult | null;

    setPrediction({
      detected: true,
      label,
      confidence,
      top5: top3.map((t) => ({ label: t.label, confidence: t.confidence })),
      hands_detected: 1,
      nmm: nn,
      emotion: emo,
      metrics: (data.nmm?.metrics ?? null) as NmmMetrics | null,
    });

    const T = thresholdsRef.current;
    const decisive = confidence >= T.min_confidence && margin >= T.min_margin;
    // The background class is an answer, not a sign: showing it in the live
    // readout is useful, committing it to the gloss sequence is not. Without
    // this guard an idle signer accumulates [NONE] chips every cooldown.
    const isBackground = label === "NONE" || label === "BACKGROUND";
    setLive(isBackground ? null : { label, confidence, margin });

    if (isBackground) {
      markIdle();
      return;
    }

    idleSinceRef.current = null;

    if (!decisive) {
      candidateRef.current = null;
      return;
    }

    const cand = candidateRef.current;
    const count = cand && cand.label === label ? cand.count + 1 : 1;

    candidateRef.current = { label, count };

    if (count < Math.max(1, Math.round(T.stable_windows))) return;

    const now = Date.now();
    const last = lastAppendRef.current;

    if (last.label === label) {
      setRepeatBlocked(true);
      candidateRef.current = null;
      return;
    }

    candidateRef.current = null;
    setRepeatBlocked(false);

    // "Clear" is the one thing that resets the server's window: the model would
    // otherwise keep reading the previous signer state after the user wiped the
    // sequence and started over.
    if (autoDetect) {
      lastAppendRef.current = { label, at: now };
      appendGloss(label, { gloss: label, ...nn });
    }
  };

  /**
   * One JPEG in, one buffered landmark out.
   *
   * This replaces the old tick that pushed a JPEG into a client-side ring buffer
   * and uploaded all 32 of them every time. The browser never holds the window
   * now: it sends the newest frame and the server appends it to that session's
   * history and runs the model on its own schedule. Upload cost per tick drops
   * by the window length, and latency stops depending on how fast the client can
   * serialise 32 blobs.
   */
  const doStreamTick = async () => {
    if (isProcessingRef.current || !isTemporal) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/jpeg", 0.7)
    );

    if (!blob) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const fd = new FormData();

      fd.append("file", blob, "f.jpg");

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

      if (!res.data.ready || !res.data.label) {
        setLive(null);
        if (res.data.emotion || res.data.nmm?.emotion) {
          commitFromStream(res.data);
        } else if (
          res.data.detail?.toLowerCase() === "idle" ||
          res.data.detail?.toLowerCase().includes("no hands")
        ) {
          commitFromStream(res.data);
        }
        return;
      }

      commitFromStream(res.data);
    } catch (err) {
      // A backend without /api/stream/frame 404s on every tick, which is not a
      // transient network blip -- falling back is the only way the page can work
      // against it. Any other failure keeps the single-frame path, because a
      // dropped frame is exactly what server-side buffering is designed to
      // absorb.
      const status = (err as { response?: { status?: number } })?.response?.status;

      if (status === 404 || status === 405) {
        streamFallbackRef.current = true;
        setStreamUnavailable(true);
        return;
      }
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
              {cameraActive
                ? isTemporal
                  ? streamUnavailable
                    ? "BATCH MODE"
                    : `${buffered}/${contract.frames * 6} BUFFER`
                  : "POLLING 1S"
                : "STANDBY"}
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
            handsDetected={prediction?.hands_detected ?? (live ? 1 : 0)}
            hasFace={Boolean(prediction?.nmm?.metrics || prediction?.detected)}
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
                className="px-2.5 py-1 rounded-lg bg-status-error/15 border border-status-error/40 text-status-error text-[10px] font-mono font-bold hover:bg-status-error/25 transition-colors"
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

            <div className="flex items-center gap-2">
              {isTemporal && (
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

              <NmmThresholdPanel
                values={thresholds}
                onChange={setThresholds}
                gates={markerGates}
                onGatesChange={setMarkerGates}
                variant="header"
              />
            </div>
          </div>

          {/* Recognition Result Card */}
          <div className="rounded-xl bg-background/50 p-3 flex flex-col gap-2.5 min-w-0">
            {live && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-[9px] font-mono">
                <span className="uppercase text-text-muted">
                  {repeatBlocked ? "WAIT FOR RELEASE" : "HOLDING"}
                </span>
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

          {/* Facial Expression & Non-Manual Markers (NMM) Badge Group */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2">
            <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted">
              Non-Manual Markers
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "wh_question", label: "WH-Question", active: nmm.wh_question },
                { key: "question", label: "Question", active: nmm.question },
                { key: "negation", label: "Negation", active: nmm.negation },
                { key: "affirmation", label: "Affirmation", active: nmm.affirmation },
                { key: "emphasis", label: "Emphasis", active: nmm.emphasis },
              ].map((m) => (
                <span
                  key={m.key}
                  className={`px-2 py-1 rounded-md border text-[9px] font-mono font-bold transition-all ${
                    m.active
                      ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary shadow-sm"
                      : "bg-surface-elevated border-border text-text-muted opacity-60"
                  }`}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline Specifications Info Box */}
          <div className="bg-background/50 rounded-xl p-2.5 flex flex-col gap-0.5 text-[9px] font-mono text-text-muted">
            <div className="flex justify-between">
              <span>Pipeline:</span>
              <span className="text-text-secondary font-medium">
                {isTemporal ? `${contract.frames}-frame temporal sequence` : "Static frame recognition"}
              </span>
            </div>
            {contract.feature_kind === "hands_pose" && (
              <div className="flex justify-between">
                <span>Features:</span>
                <span className="text-text-secondary font-medium">hands + body pose (258-dim)</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Affect Input:</span>
              <span className="text-accent-secondary font-medium">{emotion?.dominant ?? "—"}</span>
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
                        setBengaliOutput("");
                      }}
                      title="Click to remove signs from here"
                      className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-bold hover:brightness-110 transition-all ${
                        s.negation
                          ? "border-status-error/60 bg-status-error/10 text-status-error"
                          : idx === detectedHistory.length - 1 && anyQuestion
                          ? "border-status-pending/60 bg-status-pending/10 text-status-pending"
                          : "border-border bg-surface-elevated text-accent-primary"
                      }`}
                    >
                      {s.gloss}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Vocabulary Picker (for temporal testing) */}
            {isTemporal && (
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
            )}

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