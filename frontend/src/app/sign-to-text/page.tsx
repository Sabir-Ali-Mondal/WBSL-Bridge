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
                MODEL{" "}
              </span>
              <span
                className={
                  coverage.with_landmark_sequences ===
                  coverage.total_classes
                    ? "text-accent-primary font-bold"
                    : "text-status-warning font-bold"
                }
              >
                {coverage.with_landmark_sequences}/
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
            uvicorn backend.main:app --reload --port 8200
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
                  ? streamUnavailable
                    ? "BATCH FALLBACK · POLLING"
                    : `${buffered}/${contract.frames * 6} BUFFER · LIVE`
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
            <EmotionPanel emotion={emotion} offline={!emotionAvailable} />
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

            {/* Opens the NMM Controller modal. It lives here rather than as an
                inline block because ten sliders plus five marker switches and
                their explanations occupied a third of the column permanently,
                pushing the actual recognition output off-screen. */}
            <NmmThresholdPanel
              values={thresholds}
              onChange={setThresholds}
              gates={markerGates}
              onGatesChange={setMarkerGates}
              variant="header"
            />
          </div>

          {/* RECOGNITION RESULT */}
          <div className="h-[150px] rounded-xl border border-border/80 bg-surface/60 p-3.5 flex flex-col min-h-0">
            {live && (
              <div className="mb-2 flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-background border border-border">
                <span className="text-[8px] font-mono uppercase text-text-muted">
                  {repeatBlocked
                    ? "WAIT FOR RELEASE"
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
              {/* The feature width is not a detail the user can ignore: a
                  258-dim run needs the signer's body in frame, because half its
                  input is the pose block. Naming it here is what makes a run of
                  "detected nothing" legible as "step back". */}
              {contract.feature_kind === "hands_pose" &&
                " · hands+pose (258)"}
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