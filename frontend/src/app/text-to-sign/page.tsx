"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContinuousSignSimulation } from "@/components/simulation/ContinuousSignSimulation";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Cpu,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface TextToSignResult {
  input_text: string;
  gloss_sequence: string[];
  unsupported_concepts?: string[];
  unmapped_words?: string[];
  status?: "success" | "partial" | "unresolved" | "error";
  available_signs: number;
  engine?: string;
}

interface FailedSlice {
  seq: number;
  blob: Blob;
  lang: string;
}

type VoiceStatus = "idle" | "recording" | "finalizing" | "complete" | "warning";

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Encodes Float32 mono samples into a standard 16-bit PCM RIFF/WAVE Blob.
 * Faster-whisper / PyAV can decode standalone WAVs reliably without EBML container header errors.
 */
function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");

  // fmt sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * 1 * 2)
  view.setUint16(32, 2, true); // BlockAlign (1 * 2)
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  // 16-bit linear PCM with soft saturation clipping
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Downsamples audio buffer to target rate (default 16kHz for Whisper).
 */
function downsampleBuffer(
  buffer: Float32Array,
  inputRate: number,
  outputRate = 16000
): Float32Array {
  if (inputRate === outputRate || buffer.length === 0) return buffer;
  const ratio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function cleanWordForComparison(w: string): string {
  return w
    .replace(/[.,/#!$%^&*;:{}=\-_`~()।?!'"[\]{}|\\+@#]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Calculates Root Mean Square (RMS) audio energy to detect silence/voice activity.
 */
function calculateRMS(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

interface WordSpan {
  word: string;
  start: number;
  end: number;
}

function extractWordSpans(input: string): WordSpan[] {
  const spans: WordSpan[] = [];
  // Unicode-aware word matching (letters and numbers in any language)
  const regex = /[\p{L}\p{N}]+/gu;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    spans.push({
      word: m[0].toLowerCase(),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return spans;
}

/**
 * Highlights genuinely unsupported concepts in the original text.
 * Accurately handles:
 * - Multiword concepts (e.g. "quantum physics")
 * - Surrounding punctuation (e.g. "(apple),", Unicode quotes, Bengali dāṇḍi)
 * - Case insensitivity and Unicode scripts (Bengali, Roman, Devanagari)
 * - Repeated occurrences across the entire sentence
 * - Overlapping candidate spans (merged deterministically)
 * - Exact character preservation for textarea mirror alignment
 */
function renderHighlightedText(text: string, unsupportedConcepts: string[]) {
  if (!unsupportedConcepts || unsupportedConcepts.length === 0 || !text) {
    return text;
  }

  const textWordSpans = extractWordSpans(text);
  if (textWordSpans.length === 0) return text;

  const candidateSpans: Array<{ start: number; end: number }> = [];

  for (const concept of unsupportedConcepts) {
    if (!concept) continue;
    const conceptWords = extractWordSpans(concept).map((w) => w.word);
    if (conceptWords.length === 0) continue;

    const k = conceptWords.length;
    // Slide window across text words to find occurrences of the concept word sequence
    for (let i = 0; i <= textWordSpans.length - k; i++) {
      let matches = true;
      for (let m = 0; m < k; m++) {
        if (textWordSpans[i + m].word !== conceptWords[m]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        candidateSpans.push({
          start: textWordSpans[i].start,
          end: textWordSpans[i + k - 1].end,
        });
      }
    }
  }

  if (candidateSpans.length === 0) {
    return text;
  }

  // Sort spans by start asc, end desc
  candidateSpans.sort((a, b) => a.start - b.start || b.end - a.end);

  // Merge overlapping / adjacent spans
  const mergedSpans: Array<{ start: number; end: number }> = [];
  for (const span of candidateSpans) {
    if (mergedSpans.length === 0) {
      mergedSpans.push({ ...span });
    } else {
      const last = mergedSpans[mergedSpans.length - 1];
      if (span.start <= last.end) {
        last.end = Math.max(last.end, span.end);
      } else {
        mergedSpans.push({ ...span });
      }
    }
  }

  // Render character slices
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  mergedSpans.forEach((span, idx) => {
    if (span.start > cursor) {
      nodes.push(
        <span key={`text-${cursor}`}>
          {text.slice(cursor, span.start)}
        </span>
      );
    }
    nodes.push(
      <mark
        key={`mark-${span.start}-${idx}`}
        className="bg-status-error/30 text-transparent border-b-2 border-status-error border-dotted rounded-xs inline-block"
      >
        {text.slice(span.start, span.end)}
      </mark>
    );
    cursor = span.end;
  });

  if (cursor < text.length) {
    nodes.push(
      <span key={`text-${cursor}`}>
        {text.slice(cursor)}
      </span>
    );
  }

  return nodes;
}

/**
 * Resolves unsupported concepts for red highlight display.
 * Uses the active model's structured interpretation response.
 */
function getEffectiveUnmappedWords(
  text: string,
  result: TextToSignResult | null
): string[] {
  if (!result || result.input_text.trim() !== text.trim()) return [];
  return result.unsupported_concepts || result.unmapped_words || [];
}

/**
 * Appends new transcribed text to existing text, stripping overlapping words caused
 * by the ~0.5s audio overlap buffer.
 */
function appendDeduplicated(existingText: string, incomingText: string): string {
  const existingTrimmed = existingText.trim();
  const incomingTrimmed = incomingText.trim();
  if (!existingTrimmed) return incomingTrimmed;
  if (!incomingTrimmed) return existingTrimmed;

  const existingWords = existingTrimmed.split(/\s+/);
  const incomingWords = incomingTrimmed.split(/\s+/);

  const maxOverlap = Math.min(4, existingWords.length, incomingWords.length);
  let overlapFound = 0;

  for (let k = maxOverlap; k >= 1; k--) {
    const existingTail = existingWords.slice(-k).map(cleanWordForComparison);
    const incomingHead = incomingWords.slice(0, k).map(cleanWordForComparison);

    let allMatch = true;
    for (let i = 0; i < k; i++) {
      if (!existingTail[i] || !incomingHead[i] || existingTail[i] !== incomingHead[i]) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) {
      overlapFound = k;
      break;
    }
  }

  if (overlapFound > 0) {
    const remainingIncomingWords = incomingWords.slice(overlapFound);
    if (remainingIncomingWords.length === 0) {
      return existingTrimmed;
    }
    return `${existingTrimmed} ${remainingIncomingWords.join(" ")}`;
  }

  return `${existingTrimmed} ${incomingTrimmed}`;
}

function getRandomGlossSample(glosses: string[]): string[] {
  const shuffled = [...glosses];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  const sampleSize = Math.min(
    shuffled.length,
    shuffled.length >= 3 && Math.random() < 0.5 ? 3 : 2,
  );
  return shuffled.slice(0, sampleSize);
}

export default function TextToSignPage() {
  const [inputText, setInputText] = useState("");
  const [exampleSample, setExampleSample] = useState<string[]>([]);
  const [result, setResult] = useState<TextToSignResult | null>(null);
  const [, setActiveSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playingSeq, setPlayingSeq] = useState(false);
  const [seqNonce, setSeqNonce] = useState(0);
  const [viewResetToken, setViewResetToken] = useState(0);
  const [useLlm, setUseLlm] = useState(true);

  // Fetch active vocabulary for dynamic samples
  useEffect(() => {
    axios
      .get<{ glosses: string[] }>(`${API_BASE}/api/text-to-sign/vocabulary`)
      .then((res) => {
        const glosses = res.data?.glosses || [];
        if (glosses.length > 0) {
          setExampleSample(getRandomGlossSample(glosses));
        }
      })
      .catch(() => {});
  }, []);

  // STT language selection: "auto" | "bn" | "en"
  const [sttLanguage, setSttLanguage] = useState<"auto" | "bn" | "en">("auto");
  const sttLanguageRef = useRef<"auto" | "bn" | "en">("auto");
  useEffect(() => {
    sttLanguageRef.current = sttLanguage;
  }, [sttLanguage]);

  // Independent STT Engine: "local" (default) | "elevenlabs"
  const [sttEngine, setSttEngine] = useState<"local" | "elevenlabs">("local");
  const sttEngineRef = useRef<"local" | "elevenlabs">("local");
  useEffect(() => {
    sttEngineRef.current = sttEngine;
  }, [sttEngine]);

  // VAD Segmentation Mode: Silero VAD is the sole continuous segmentation mechanism
  const vadModeRef = useRef<"silero_vad">("silero_vad");

  // Configurable Silero VAD parameters
  const [silenceThreshold, setSilenceThreshold] = useState<number>(0.5);
  const silenceThresholdRef = useRef<number>(0.5);
  useEffect(() => {
    silenceThresholdRef.current = silenceThreshold;
  }, [silenceThreshold]);

  const [minSilenceMs, setMinSilenceMs] = useState<number>(500);
  const minSilenceMsRef = useRef<number>(500);
  useEffect(() => {
    minSilenceMsRef.current = minSilenceMs;
  }, [minSilenceMs]);

  const [speechPadMs, setSpeechPadMs] = useState<number>(400);
  const speechPadMsRef = useRef<number>(400);
  useEffect(() => {
    speechPadMsRef.current = speechPadMs;
  }, [speechPadMs]);

  const [maxSegmentS, setMaxSegmentS] = useState<number>(15.0);
  const maxSegmentSRef = useRef<number>(15.0);
  useEffect(() => {
    maxSegmentSRef.current = maxSegmentS;
  }, [maxSegmentS]);

  // UI state for premium confirmation modal & VAD settings panel
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showVadSettings, setShowVadSettings] = useState(false);

  // Keep inputText accessible to callbacks for boundary deduplication
  const inputTextRef = useRef("");
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Voice recording & Continuous Streaming STT state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const isRecording = voiceStatus === "recording";
  const [inFlightCount, setInFlightCount] = useState(0);
  const recordingDuration = 5;
  const [sliceProgress, setSliceProgress] = useState(0); // 0 to 100%
  const [sliceRemainingSec, setSliceRemainingSec] = useState(5);
  const [failedSlices, setFailedSlices] = useState<FailedSlice[]>([]);

  // State refs for safe async pipeline isolation
  const isRecordingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const sessionIdRef = useRef<string>("");
  const sliceSeqRef = useRef<number>(0);
  const nextCommitSeqRef = useRef<number>(0);
  const apiCallNonceRef = useRef<number>(0);
  const resultsMapRef = useRef<
    Map<number, { text: string; status: "ok" | "failed"; blob?: Blob }>
  >(new Map());
  const pendingInFlightRef = useRef<number>(0);
  const failedSlicesRef = useRef<FailedSlice[]>([]);
  const recordingDurationRef = useRef<number>(5);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const pcmBufferRef = useRef<Float32Array[]>([]);
  const capturedSampleRateRef = useRef<number>(44100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalizingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sliceElapsedMsRef = useRef<number>(0);
  const consecutiveSilentSlicesRef = useRef<number>(0);
  const stopVoiceRecordingRef = useRef<() => void>(() => {});

  useEffect(() => {
    recordingDurationRef.current = recordingDuration;
  }, [recordingDuration]);

  useEffect(() => {
    failedSlicesRef.current = failedSlices;
  }, [failedSlices]);

  const effectiveUnmappedWords = useMemo(() => {
    return getEffectiveUnmappedWords(inputText, result);
  }, [inputText, result]);

  // In-order commit processor: appends successful transcriptions in strict chronological sequence
  const commitInOrder = useCallback((sessionId: string) => {
    if (sessionIdRef.current !== sessionId) return;

    while (resultsMapRef.current.has(nextCommitSeqRef.current)) {
      const item = resultsMapRef.current.get(nextCommitSeqRef.current);
      nextCommitSeqRef.current += 1;

      if (item && item.status === "ok" && item.text) {
        setInputText((prev) => appendDeduplicated(prev, item.text));
      }
    }
  }, []);

  const checkFinalizationComplete = useCallback(
    (sessionId: string) => {
      if (sessionIdRef.current !== sessionId) return;

      if (isStoppingRef.current && pendingInFlightRef.current === 0) {
        isStoppingRef.current = false;
        const hasFailures = failedSlicesRef.current.length > 0;
        setVoiceStatus(hasFailures ? "warning" : "complete");

        if (finalizingTimeoutRef.current) clearTimeout(finalizingTimeoutRef.current);
        finalizingTimeoutRef.current = setTimeout(() => {
          if (sessionIdRef.current === sessionId) {
            setVoiceStatus("idle");
          }
        }, 2500);
      }
    },
    []
  );

  const sendSliceWithRetriesRef = useRef<
    ((blob: Blob, seq: number, sessionId: string, lang: string, retryCount?: number, isFinal?: boolean) => Promise<void>) | null
  >(null);

  // Send an individual audio slice with timeout, bounded retries, and strict sequence tracking
  const sendSliceWithRetries = useCallback(
    async (
      blob: Blob,
      seq: number,
      sessionId: string,
      lang: string,
      retryCount = 0,
      isFinal = false
    ): Promise<void> => {
      if (sessionIdRef.current !== sessionId) return;

      const formData = new FormData();
      formData.append("file", blob, `slice_${seq}.wav`);
      formData.append("language", lang);
      formData.append("engine", sttEngineRef.current);
      formData.append("vad_mode", vadModeRef.current);
      formData.append("silence_threshold", String(silenceThresholdRef.current));
      formData.append("min_silence_ms", String(minSilenceMsRef.current));
      formData.append("speech_pad_ms", String(speechPadMsRef.current));
      formData.append("max_segment_s", String(maxSegmentSRef.current));
      formData.append("is_final", String(isFinal));
      formData.append("previous_context", inputTextRef.current);

      try {
        const resp = await axios.post<{
          text: string;
          language?: string;
          language_probability?: number;
          engine?: string;
          status?: string;
        }>(`${API_BASE}/api/stt`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });

        if (sessionIdRef.current !== sessionId) return;

        const recognized = (resp.data.text || "").trim();
        resultsMapRef.current.set(seq, { text: recognized, status: "ok" });
        commitInOrder(sessionId);
      } catch (err: unknown) {
        if (sessionIdRef.current !== sessionId) return;

        const errorMsg = axios.isAxiosError(err)
          ? err.response?.data?.detail || err.message
          : "STT processing failed";

        // CRITICAL: When ElevenLabs fails, do NOT automatically fall back to another provider
        if (sttEngineRef.current === "elevenlabs") {
          toast.error(`ElevenLabs STT Error: ${errorMsg}`);
          resultsMapRef.current.set(seq, { text: "", status: "failed", blob });
          setFailedSlices((prev) => [...prev, { seq, blob, lang }]);
          commitInOrder(sessionId);
          return;
        }

        if (retryCount < 2) {
          // Bounded retry (attempt 1 or 2) after short delay
          await new Promise((resolve) => setTimeout(resolve, 600));
          if (sessionIdRef.current !== sessionId) return;
          return sendSliceWithRetriesRef.current?.(blob, seq, sessionId, lang, retryCount + 1, isFinal);
        } else {
          // All retries exhausted: mark as failed to unblock subsequent slice commits
          resultsMapRef.current.set(seq, { text: "", status: "failed", blob });
          setFailedSlices((prev) => [...prev, { seq, blob, lang }]);
          commitInOrder(sessionId);
        }
      } finally {
        pendingInFlightRef.current = Math.max(0, pendingInFlightRef.current - 1);
        setInFlightCount(pendingInFlightRef.current);
        checkFinalizationComplete(sessionId);
      }
    },
    [commitInOrder, checkFinalizationComplete]
  );

  useEffect(() => {
    sendSliceWithRetriesRef.current = sendSliceWithRetries;
  }, [sendSliceWithRetries]);

  // Extracts current PCM buffer into a standalone 16kHz WAV slice and dispatches it
  const extractAndDispatchSlice = useCallback(
    (isFinal = false) => {
      const chunks = pcmBufferRef.current;
      if (!chunks || chunks.length === 0) return;

      const totalSamples = chunks.reduce((acc, c) => acc + c.length, 0);
      const inputRate = capturedSampleRateRef.current || 44100;

      // Minimum duration guards:
      // ElevenLabs Scribe API strictly rejects audio shorter than 0.6s (400 audio_too_short).
      // Local faster-whisper requires at least 0.25s of audio to perform meaningful transcription.
      const minDurationSec = sttEngineRef.current === "elevenlabs" ? 0.65 : 0.25;
      const minInputSamples = Math.ceil(minDurationSec * inputRate);
      if (totalSamples < minInputSamples) {
        if (isFinal) {
          pcmBufferRef.current = [];
        }
        return;
      }

      const merged = new Float32Array(totalSamples);
      let offset = 0;
      for (const c of chunks) {
        merged.set(c, offset);
        offset += c.length;
      }

      // Continuous Silero VAD cuts on natural pauses; reset buffer cleanly for next slice
      pcmBufferRef.current = [];

      const downsampled = downsampleBuffer(merged, inputRate, 16000);

      // Verify downsampled samples directly (9600 samples = 0.6s at 16kHz)
      const minDownsampledSamples = sttEngineRef.current === "elevenlabs" ? 9600 : 4000;
      if (downsampled.length < minDownsampledSamples) {
        return;
      }

      // Energy check: in fixed chunk mode, skip dead silence to save CPU.
      // In Silero VAD mode, backend Silero neural VAD evaluates activity directly.
      const rms = calculateRMS(downsampled);
      if (rms < 0.003 && !isFinal) {
        consecutiveSilentSlicesRef.current += 1;
        // If microphone was left on with continuous silence for 4 splits (~20s), automatically stop
        if (consecutiveSilentSlicesRef.current >= 4 && isRecordingRef.current) {
          toast.info("Microphone stopped automatically due to inactivity.");
          stopVoiceRecordingRef.current?.();
        }
        return;
      }
      consecutiveSilentSlicesRef.current = 0;

      const wavBlob = encodeWAV(downsampled, 16000);

      if (wavBlob.size >= 400) {
        const seq = sliceSeqRef.current++;
        pendingInFlightRef.current += 1;
        setInFlightCount(pendingInFlightRef.current);
        sendSliceWithRetries(
          wavBlob,
          seq,
          sessionIdRef.current,
          sttLanguageRef.current,
          0,
          isFinal
        );
      }
    },
    [sendSliceWithRetries]
  );

  const stopVoiceRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop audio processor and release microphone stream
    try {
      if (processorNodeRef.current) {
        processorNodeRef.current.disconnect();
        processorNodeRef.current = null;
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (silentGainRef.current) {
        silentGainRef.current.disconnect();
        silentGainRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    } catch (err) {
      console.warn("AudioContext cleanup note:", err);
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    setSliceProgress(0);

    // Flush and submit final partial slice
    extractAndDispatchSlice(true);

    if (pendingInFlightRef.current > 0) {
      isStoppingRef.current = true;
      setVoiceStatus("finalizing");
    } else {
      isStoppingRef.current = false;
      const hasFailures = failedSlicesRef.current.length > 0;
      setVoiceStatus(hasFailures ? "warning" : "complete");

      if (finalizingTimeoutRef.current) clearTimeout(finalizingTimeoutRef.current);
      finalizingTimeoutRef.current = setTimeout(() => {
        setVoiceStatus("idle");
      }, 2000);
    }
  }, [extractAndDispatchSlice]);

  useEffect(() => {
    stopVoiceRecordingRef.current = stopVoiceRecording;
  }, [stopVoiceRecording]);

  const startVoiceRecording = useCallback(async () => {
    if (isRecordingRef.current || voiceStatus === "finalizing") return;

    if (finalizingTimeoutRef.current) {
      clearTimeout(finalizingTimeoutRef.current);
      finalizingTimeoutRef.current = null;
    }

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        toast.error("Microphone is not supported in this browser.");
        return;
      }

      // Initialize new session with unique ID
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionIdRef.current = sessionId;
      sliceSeqRef.current = 0;
      nextCommitSeqRef.current = 0;
      resultsMapRef.current.clear();
      pendingInFlightRef.current = 0;
      setInFlightCount(0);
      isStoppingRef.current = false;
      setFailedSlices([]);
      pcmBufferRef.current = [];
      sliceElapsedMsRef.current = 0;
      consecutiveSilentSlicesRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      audioContextRef.current = ctx;
      capturedSampleRateRef.current = ctx.sampleRate;

      const sourceNode = ctx.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      // 4096 buffer size delivers ~92ms callbacks at 44.1kHz without dropping samples
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!isRecordingRef.current) return;
        const channelData = e.inputBuffer.getChannelData(0);
        pcmBufferRef.current.push(new Float32Array(channelData));
      };
      processorNodeRef.current = processor;

      // Route through a zero-gain node so onaudioprocess continues without echo to speakers
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      silentGainRef.current = silentGain;

      sourceNode.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(ctx.destination);

      isRecordingRef.current = true;
      setVoiceStatus("recording");
      setSliceProgress(0);
      setSliceRemainingSec(recordingDurationRef.current);

      if (timerRef.current) clearInterval(timerRef.current);

      // Smooth 100ms interval ticker for visual progress animation and precise slice triggers
      timerRef.current = setInterval(() => {
        if (!isRecordingRef.current) return;

        sliceElapsedMsRef.current += 100;
        const totalDurationMs = recordingDurationRef.current * 1000;

        const progress = Math.min(100, (sliceElapsedMsRef.current / totalDurationMs) * 100);
        const remaining = Math.max(0, (totalDurationMs - sliceElapsedMsRef.current) / 1000);
        setSliceProgress(progress);
        setSliceRemainingSec(remaining);

        // When split threshold reached: extract slice, retain 0.5s overlap, dispatch STT, keep recording!
        if (sliceElapsedMsRef.current >= totalDurationMs) {
          extractAndDispatchSlice(false);
          sliceElapsedMsRef.current = 0;
          setSliceProgress(0);
          setSliceRemainingSec(recordingDurationRef.current);
        }
      }, 100);
    } catch (err: unknown) {
      isRecordingRef.current = false;
      setVoiceStatus("idle");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        toast.error("Microphone permission denied. Please allow microphone access.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        toast.error("No microphone found on your system.");
      } else {
        toast.error("Could not access microphone.");
      }
    }
  }, [voiceStatus, extractAndDispatchSlice]);

  const retryAllFailedSlices = useCallback(() => {
    if (failedSlices.length === 0 || voiceStatus === "finalizing") return;
    const slicesToRetry = [...failedSlices];
    setFailedSlices([]);
    const sessionId = sessionIdRef.current;

    slicesToRetry.forEach((item) => {
      pendingInFlightRef.current += 1;
      setInFlightCount(pendingInFlightRef.current);
      sendSliceWithRetries(item.blob, item.seq, sessionId, item.lang);
    });
  }, [failedSlices, voiceStatus, sendSliceWithRetries]);

  useEffect(() => {
    return () => {
      sessionIdRef.current = ""; // invalidate any pending session
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (finalizingTimeoutRef.current) {
        clearTimeout(finalizingTimeoutRef.current);
        finalizingTimeoutRef.current = null;
      }
      try {
        processorNodeRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        silentGainRef.current?.disconnect();
        audioContextRef.current?.close().catch(() => {});
      } catch {}
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<{ glosses: string[] }>(`${API_BASE}/api/text-to-sign/vocabulary`)
      .then(({ data }) => {
        if (!cancelled && data.glosses?.length) {
          setExampleSample(getRandomGlossSample(data.glosses));
        }
      })
      .catch(() => {
        // Fallback sample remains available
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSegmentChange = useCallback((index: number) => {
    setActiveSignIndex(index);
  }, []);

  const handleSequenceComplete = useCallback(() => {
    setPlayingSeq(false);
  }, []);

  const handleGenerateAndPlay = async () => {
    const text = inputText.trim();

    // If textarea is empty, guide the user to type or click the microphone
    if (!text) {
      toast.info("Please enter Bengali text to generate sign sequence");
      return;
    }

    // If already generated for the exact same text, replay sequence directly
    if (result && result.input_text === text) {
      setActiveSignIndex(0);
      setSeqNonce((n) => n + 1);
      setPlayingSeq(true);
      return;
    }

    const callNonce = ++apiCallNonceRef.current;
    setIsLoading(true);
    setPlayingSeq(false);

    if (useLlm) {
      try {
        const r = await axios.post<TextToSignResult>(
          `${API_BASE}/api/text-to-sign/llm`,
          { text }
        );
        if (callNonce !== apiCallNonceRef.current) return;
        setResult(r.data);
        if (r.data.gloss_sequence && r.data.gloss_sequence.length > 0) {
          setActiveSignIndex(0);
          setSeqNonce((n) => n + 1);
          setPlayingSeq(true);
        } else {
          toast.info("No matching signs found in active model");
        }
      } catch (err: unknown) {
        if (callNonce !== apiCallNonceRef.current) return;
        const detail = axios.isAxiosError(err)
          ? err.response?.data?.detail
          : "LLM unavailable";
        toast.error(`LLM error: ${detail}`);
      } finally {
        if (callNonce === apiCallNonceRef.current) {
          setIsLoading(false);
        }
      }
      return;
    }

    try {
      const res = await axios.post<TextToSignResult>(
        `${API_BASE}/api/text-to-sign`,
        { text }
      );
      if (callNonce !== apiCallNonceRef.current) return;
      setResult(res.data);
      if (res.data.gloss_sequence && res.data.gloss_sequence.length > 0) {
        setActiveSignIndex(0);
        setSeqNonce((n) => n + 1);
        setPlayingSeq(true);
      } else {
        toast.info("No matching signs found in active model");
      }
    } catch {
      if (callNonce !== apiCallNonceRef.current) return;
      toast.error("Backend not responding. Start FastAPI server first.");
    } finally {
      if (callNonce === apiCallNonceRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageContainer className="w-full max-w-[1600px] px-3 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4 lg:gap-6 items-stretch">
        {/* LEFT PANEL: INPUT & CONTROLS */}
        <section className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5 h-full">
          {/* Top row: Label + STT Engine Selector + VAD Mode + Language Switcher + Clear */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* STT Engine Selector */}
                <div
                  className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface/80 border border-border/80"
                  role="group"
                  aria-label="STT Engine"
                >
                  <button
                    type="button"
                    onClick={() => setSttEngine("local")}
                    aria-pressed={sttEngine === "local"}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                      sttEngine === "local"
                        ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40 shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="Local faster-whisper on CPU (Free, Offline, No cloud calls)"
                  >
                    <Cpu size={10} />
                    Local
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (sttEngine !== "elevenlabs") {
                        setShowPremiumModal(true);
                      }
                    }}
                    aria-pressed={sttEngine === "elevenlabs"}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                      sttEngine === "elevenlabs"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="ElevenLabs Scribe v1/v2 (Premium Cloud STT)"
                  >
                    <Sparkles size={10} />
                    ElevenLabs
                  </button>
                </div>

                {/* Silero VAD Indicator & Configuration (for local capture) */}
                {sttEngine === "local" && (
                  <div
                    className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface/80 border border-border/80"
                    role="group"
                    aria-label="VAD Configuration"
                  >
                    <button
                      type="button"
                      onClick={() => setShowVadSettings((v) => !v)}
                      aria-label="VAD Configuration"
                      className={`p-1 rounded text-text-muted hover:text-text-primary transition-colors ${
                        showVadSettings ? "bg-surface-elevated text-accent-secondary" : ""
                      }`}
                      title="Configure Silero VAD thresholds & padding"
                    >
                      <Sliders size={11} />
                    </button>
                  </div>
                )}
              </div>
              <br/>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div
                  className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface/80 border border-border/80 shrink-0"
                  role="group"
                  aria-label="Input Language"
                >
                  {([
                    { key: "auto", label: "AUTO" },
                    { key: "bn", label: "বাংলা" },
                    { key: "en", label: "ENGLISH" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSttLanguage(opt.key)}
                      aria-pressed={sttLanguage === opt.key}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                        sttLanguage === opt.key
                          ? "bg-accent-secondary text-white shadow-sm"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText("");
                      setResult(null);
                    }}
                    className="text-[10px] font-mono text-text-muted hover:text-text-primary transition-colors ml-1"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Premium ElevenLabs Mode Notice */}
            {sttEngine === "elevenlabs" && (
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  ElevenLabs Scribe active
                </span>
                <button
                  type="button"
                  onClick={() => setSttEngine("local")}
                  className="text-[9px] underline hover:text-white"
                >
                  Exit
                </button>
              </div>
            )}

            {/* Expandable VAD Settings Panel */}
            {showVadSettings && sttEngine === "local" && (
              <div className="p-3 rounded-xl bg-surface border border-border/80 flex flex-col gap-2.5 text-xs font-mono">
                <div className="flex items-center justify-between pb-1 border-b border-border/50">
                  <span className="font-bold text-[11px] text-text-primary flex items-center gap-1.5">
                    <Sliders size={12} className="text-accent-secondary" />
                    Silero VAD Parameters
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSilenceThreshold(0.5);
                      setMinSilenceMs(500);
                      setSpeechPadMs(400);
                      setMaxSegmentS(15.0);
                      toast.info("VAD parameters reset to defaults.");
                    }}
                    className="text-[9px] text-text-muted hover:text-text-primary underline"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-text-secondary">
                      <span>Silence Threshold:</span>
                      <span className="text-accent-secondary font-bold">{silenceThreshold}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={silenceThreshold}
                      onChange={(e) => setSilenceThreshold(parseFloat(e.target.value))}
                      className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-text-secondary">
                      <span>Min Silence (ms):</span>
                      <span className="text-accent-secondary font-bold">{minSilenceMs}ms</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={minSilenceMs}
                      onChange={(e) => setMinSilenceMs(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-text-secondary">
                      <span>Speech Padding (ms):</span>
                      <span className="text-accent-secondary font-bold">{speechPadMs}ms</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="800"
                      step="50"
                      value={speechPadMs}
                      onChange={(e) => setSpeechPadMs(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-text-secondary">
                      <span>Max Segment (s):</span>
                      <span className="text-accent-secondary font-bold">{maxSegmentS}s</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={maxSegmentS}
                      onChange={(e) => setMaxSegmentS(parseFloat(e.target.value))}
                      className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

{/* Premium Warning Modal */}
{showPremiumModal && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-surface border border-amber-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="font-mono font-bold text-sm text-text-primary">
            Switch to ElevenLabs STT?
          </h3>
          <span className="text-[10px] font-mono text-amber-400">
            Cloud-based multilingual transcription
          </span>
        </div>
      </div>

      <div className="text-xs text-text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border/60 flex flex-col gap-2">
        <p>• Audio will be sent to ElevenLabs cloud servers.</p>
        <p>• API usage charges and quotas apply.</p>
        <p className="font-semibold text-amber-300">
          • No automatic fallback: missing credentials or quota limits will cause transcription to fail.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => setShowPremiumModal(false)}
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setSttEngine("elevenlabs");
            setShowPremiumModal(false);
            toast.success("Switched to ElevenLabs Scribe STT mode.");
          }}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors shadow-md"
        >
          Enable ElevenLabs
        </button>
      </div>
    </div>
  </div>
)}

          {/* Multiline Textarea with inline unmapped word highlighting and locked height */}
          <div className="relative w-full flex-1 min-h-[340px] lg:min-h-[420px] rounded-xl bg-background/50 border border-border/80 focus-within:ring-1 focus-within:ring-accent-secondary/50 focus-within:border-accent-secondary/60 transition-all flex flex-col overflow-hidden">
            <div className="relative flex-1 w-full h-full min-h-[280px]">
              {/* Highlight backdrop overlay (mirrors textarea font, padding, word wrap) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 p-4 font-bengali text-base whitespace-pre-wrap break-words overflow-hidden select-none leading-relaxed text-transparent"
              >
                {renderHighlightedText(inputText, effectiveUnmappedWords)}
              </div>

              {/* Editable Textarea */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleGenerateAndPlay();
                  }
                }}
                placeholder="বাংলা বাক্য লিখুন"
                className="relative z-10 w-full h-full p-4 bg-transparent text-text-primary font-bengali text-base placeholder:text-text-muted/50 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Guide text placed at bottom of text-input area, above voice controls */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-text-muted select-none">
            <span className={effectiveUnmappedWords.length > 0 ? "text-status-error/90 flex items-center gap-1" : ""}>
              {effectiveUnmappedWords.length > 0 && <AlertTriangle size={12} className="text-status-error" />}
              Red text = no matching sign
            </span>
          </div>

          {/* Continuous Voice Splitter Control */}
          <div
            className={`w-full rounded-xl border p-2.5 sm:p-3 flex flex-col gap-2 transition-all ${
              isRecording
                ? "bg-status-error/15 border-status-error/40 text-status-error shadow-sm"
                : voiceStatus === "finalizing"
                ? "bg-accent-secondary/10 border-accent-secondary/30"
                : voiceStatus === "complete"
                ? "bg-status-success/10 border-status-success/30"
                : voiceStatus === "warning"
                ? "bg-status-warning/10 border-status-warning/30"
                : "bg-surface/50 border-border/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  disabled={voiceStatus === "finalizing"}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  title={
                    voiceStatus === "finalizing"
                      ? "Finalizing transcription..."
                      : isRecording
                      ? "Stop recording"
                      : "Record voice (continuous stream)"
                  }
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording
                      ? "bg-status-error text-white shadow-md animate-pulse"
                      : voiceStatus === "finalizing"
                      ? "bg-accent-secondary text-white shadow-sm"
                      : "bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30"
                  }`}
                >
                  {voiceStatus === "finalizing" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isRecording ? (
                    <Square size={13} fill="currentColor" />
                  ) : (
                    <Mic size={16} />
                  )}
                </button>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-mono font-bold tracking-wider leading-tight flex items-center gap-2 ${
                      isRecording
                        ? "text-status-error"
                        : voiceStatus === "finalizing"
                        ? "text-accent-secondary"
                        : voiceStatus === "complete"
                        ? "text-status-success"
                        : voiceStatus === "warning"
                        ? "text-status-warning"
                        : "text-text-primary"
                    }`}
                  >
                    {isRecording && "LISTENING"}
                    {voiceStatus === "finalizing" && (
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={12} className="animate-spin" />
                        FINALIZING TRANSCRIPTION
                      </span>
                    )}
                    {voiceStatus === "complete" && (
                      <span className="flex items-center gap-1 text-status-success">
                        <Check size={12} />
                        TRANSCRIPTION COMPLETE
                      </span>
                    )}
                    {voiceStatus === "warning" && (
                      <span className="flex items-center gap-1 text-status-warning">
                        <AlertTriangle size={12} />
                        PARTIAL SPEECH NOT DETECTED
                      </span>
                    )}
                    {voiceStatus === "idle" && "VOICE"}
                    {isRecording && inFlightCount > 0 && (
                      <span className="flex items-center gap-1 text-[9px] font-normal text-accent-secondary">
                        <Loader2 size={10} className="animate-spin" />
                        transcribing split...
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted leading-tight mt-0.5">
                    {isRecording
                      ? sttEngine === "elevenlabs"
                        ? `ElevenLabs Scribe (Cloud) • Next slice in ${sliceRemainingSec.toFixed(1)}s`
                        : `Silero VAD continuous capture • Segmenting every ${recordingDuration}s`
                      : voiceStatus === "finalizing"
                      ? "Transcribing remaining audio..."
                      : sttEngine === "elevenlabs"
                      ? "ElevenLabs Scribe (Premium Mode)"
                      : "Silero VAD active · Continuous silence segmentation"}
                  </span>
                </div>
              </div>

              {/* VAD Status Indicator */}
              <div className="flex items-center gap-1.5 shrink-0 bg-surface rounded-lg p-0.5 border border-border">
                <span className="font-mono text-[10px] text-accent-secondary px-2 py-1 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                  Silero VAD
                </span>
              </div>
            </div>

            {/* Timing Animation Progress Bar (Shows speaker when slice ends to finish long words) */}
            {isRecording && (
              <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-status-error transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${sliceProgress}%` }}
                />
              </div>
            )}

            {/* Recoverable Failed Slices Notice */}
            {failedSlices.length > 0 && voiceStatus !== "recording" && (
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/60 text-xs">
                <span className="flex items-center gap-1.5 text-status-warning font-mono text-[11px]">
                  <AlertTriangle size={12} />
                  {failedSlices.length} segment{failedSlices.length > 1 ? "s" : ""} unconfirmed
                </span>
                <button
                  type="button"
                  onClick={retryAllFailedSlices}
                  disabled={voiceStatus === "finalizing"}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-accent-secondary/15 hover:bg-accent-secondary/25 text-accent-secondary transition-colors"
                >
                  <RotateCcw size={10} />
                  Retry Failed
                </button>
              </div>
            )}
          </div>

          {/* Bottom row: LLM toggle + Main Play Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={useLlm}
                onClick={() => setUseLlm((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-border transition-colors duration-200 ease-in-out focus:outline-none ${
                  useLlm ? "bg-accent-secondary" : "bg-surface-elevated"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out my-auto ${
                    useLlm ? "translate-x-4 ml-0.5" : "translate-x-0.5 bg-text-muted"
                  }`}
                />
              </button>
              <span className="text-[11px] font-mono font-medium text-text-secondary select-none tracking-wider">
                LLM
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateAndPlay}
              disabled={isLoading}
              title={
                inputText.trim()
                  ? "Generate and play sign sequence"
                  : isRecording
                  ? "Stop recording"
                  : "Record speech"
              }
              className="w-11 h-11 rounded-xl bg-accent-secondary hover:brightness-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isRecording ? (
                <Square size={16} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </div>
        </section>

        {/* RIGHT PANEL: SIGN PLAYBACK */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm min-h-[500px] h-full justify-center">
          {result && result.gloss_sequence.length > 0 ? (
            <ContinuousSignSimulation
              glosses={result.gloss_sequence}
              playing={playingSeq}
              restartToken={seqNonce}
              viewResetToken={viewResetToken}
              onResetView={() => setViewResetToken((t) => t + 1)}
              onSegmentChange={handleSegmentChange}
              onComplete={handleSequenceComplete}
            />
          ) : (
            <div className="flex flex-col h-full space-y-2 justify-between">
              <div className="flex items-center justify-between gap-3 px-1 mb-1">
                <div className="inline-flex items-center px-2 py-0.5 rounded border border-border/80 bg-surface text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                  0 SIGNS
                </div>
              </div>

              <div className="aspect-[16/10] w-full rounded-xl border border-dashed border-border/70 bg-background/30 flex flex-col items-center justify-center text-center p-6 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
                  <ArrowRight size={20} />
                </div>

                <div className="text-xs font-mono text-text-secondary tracking-wide mb-4">
                  Enter a Bengali sentence to generate the sign sequence
                </div>

                {exampleSample.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(exampleSample.join(" "));
                    }}
                    className="px-4 py-2 rounded-lg border border-accent-secondary/50 bg-surface-elevated text-accent-secondary font-mono text-xs hover:border-accent-secondary hover:bg-accent-secondary/10 transition-all shadow-sm max-w-full truncate"
                  >
                    Try: {exampleSample.join(" ")}
                  </button>
                )}
              </div>

              <div className="h-6" aria-hidden="true" />
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}