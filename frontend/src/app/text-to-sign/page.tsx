"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContinuousSignSimulation } from "@/components/simulation/ContinuousSignSimulation";
import {
  ArrowRight,
  Loader2,
  Play,
  Sparkles,
  Mic,
  MicOff,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface TextToSignResult {
  input_text: string;
  gloss_sequence: string[];
  available_signs: number;
  unmapped_words: string[];
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
  const [loadingExampleGlosses, setLoadingExampleGlosses] = useState(true);
  const [exampleGlossesError, setExampleGlossesError] = useState(false);
  const [result, setResult] = useState<TextToSignResult | null>(null);
  const [activeSignIndex, setActiveSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playingSeq, setPlayingSeq] = useState(false);
  /*
   * Increments on every Play/Restart click. "Restart Sequence" must work while
   * the sequence is already playing, but that click would otherwise not change
   * any state — and a React effect that re-runs on identical state does not
   * exist. The nonce is a real state change the playback effect can key on,
   * and it is baked into the simulation key so the landmark playhead resets.
   */
  const [seqNonce, setSeqNonce] = useState(0);
  const [viewResetToken, setViewResetToken] = useState(0);
  // Off by default: the dictionary mapper is deterministic and always available,
  // while the LLM planner needs a configured provider and may drop words. The
  // user opts into that trade, and a failure falls back rather than erroring.
  const [useLlm, setUseLlm] = useState(false);

  // STT language selection. "auto" lets Whisper detect; an explicit choice is
  // sent to the engine verbatim so a Bengali pick never comes back as English
  // because detection guessed wrong.
  const [sttLanguage, setSttLanguage] = useState<"auto" | "bn" | "en">("auto");

  // Voice recording & STT state
  const [isRecording, setIsRecording] = useState(false);
  const [sttLoading, setSttLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startVoiceRecording = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        toast.error("Microphone is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "",
      ].find((t) => !t || MediaRecorder.isTypeSupported(t));

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const streamTracks = streamRef.current?.getTracks();
        streamTracks?.forEach((track) => track.stop());
        streamRef.current = null;

        if (audioChunksRef.current.length === 0) {
          toast.error("No audio recorded.");
          setIsRecording(false);
          return;
        }

        const blobType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });

        if (audioBlob.size < 200) {
          toast.error("Audio recording was too short.");
          setIsRecording(false);
          return;
        }

        const ext = blobType.includes("ogg")
          ? "ogg"
          : blobType.includes("mp4")
          ? "mp4"
          : "webm";
        const formData = new FormData();
        formData.append("file", audioBlob, `voice.${ext}`);
        formData.append("language", sttLanguage);

        setSttLoading(true);
        try {
          const resp = await axios.post<{
            text: string;
            language?: string;
            language_probability?: number;
          }>(`${API_BASE}/api/stt`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000,
          });

          const recognized = (resp.data.text || "").trim();
          if (recognized) {
            setInputText(recognized);
            toast.success("Speech transcribed successfully");
          } else {
            toast.info("No speech detected. Please try again.");
          }
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 400) {
              toast.error("Empty audio recording received.");
            } else if (err.code === "ECONNABORTED") {
              toast.error("Transcription timed out. Please try a shorter sentence.");
            } else {
              toast.error("Backend STT service unavailable. Please check the server.");
            }
          } else {
            toast.error("Failed to transcribe audio.");
          }
        } finally {
          setSttLoading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
    } catch (err: unknown) {
      setIsRecording(false);
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        toast.error("Microphone permission denied. Please allow microphone access.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        toast.error("No microphone found on your system.");
      } else {
        toast.error("Could not access microphone.");
      }
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<{ glosses: string[] }>(`${API_BASE}/api/text-to-sign/vocabulary`)
      .then(({ data }) => {
        if (!cancelled) {
          setExampleSample(getRandomGlossSample(data.glosses));
        }
      })
      .catch(() => {
        if (!cancelled) setExampleGlossesError(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingExampleGlosses(false);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    setIsLoading(true);
    setPlayingSeq(false);

    if (useLlm) {
      try {
        const r = await axios.post<TextToSignResult>(
          `${API_BASE}/api/text-to-sign/llm`,
          { text: inputText }
        );

        setResult(r.data);
        setActiveSignIndex(0);
        setIsLoading(false);
        toast.success("LLM gloss sequence generated");
        return;
      } catch {
        // 503 means the provider is unconfigured or unreachable. That is a
        // routing decision, not an error the user can act on, so it degrades to
        // the dictionary silently-ish (an info toast) and carries on.
        toast.info("LLM unavailable — falling back to dictionary mapping");
      }
    }

    try {
      const res = await axios.post<TextToSignResult>(
        `${API_BASE}/api/text-to-sign`,
        {
          text: inputText,
        }
      );

      setResult(res.data);
      setActiveSignIndex(0);

      toast.success("Sign sequence generated");
    } catch {
      toast.error("Backend not responding. Start FastAPI server first.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasSigns = Boolean(result?.gloss_sequence.length);

  return (
    <PageContainer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
      {/* HEADER */}
      <header className="border-b border-border/70 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
              Reverse Synthesis Pipeline
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Bengali Text{" "}
              <span className="text-accent-secondary">→</span>{" "}
              Sign Playback
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              Convert text into the active model&apos;s vocabulary and replay its
              bundled landmark sequences.
            </p>
          </div>

          {result && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-[9px] font-mono text-text-muted">
                  GLOSSES
                </span>

                <span className="text-sm font-bold font-mono text-text-primary tabular-nums">
                  {result.gloss_sequence.length}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-[9px] font-mono text-text-muted">
                  MATCHED
                </span>

                <span className="text-sm font-bold font-mono text-accent-primary tabular-nums">
                  {result.gloss_sequence.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* INPUT */}
      <section className="mt-5 rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2.5 gap-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary shrink-0">
            Bengali Input
          </span>

          {/*
           * Speech language for the mic button. This is a user decision, not
           * a detection result: Whisper's auto-detect confuses Bengali and
           * English often enough that the manual override is what makes the
           * voice path trustworthy, and "auto" remains the default so the
           * default behaviour does not silently change for anyone relying on
           * detection.
           */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-lg bg-background border border-border shrink-0"
            role="group"
            aria-label="Speech language"
          >
            {([
              { key: "auto", label: "Auto" },
              { key: "bn", label: "বাংলা" },
              { key: "en", label: "English" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSttLanguage(opt.key)}
                aria-pressed={sttLanguage === opt.key}
                className={`px-2.5 h-7 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide transition-colors ${
                  sttLanguage === opt.key
                    ? "bg-accent-secondary/20 text-accent-secondary"
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
              onClick={() => setInputText("")}
              className="text-[10px] font-mono text-text-muted hover:text-text-primary transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <form
          onSubmit={handleGenerate}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="বাংলা বাক্য লিখুন"
            className="min-w-0 flex-1 h-12 px-4 rounded-lg bg-background border border-border text-text-primary font-bengali text-base placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-secondary/30 focus:border-accent-secondary transition-all"
          />

          <button
            type="button"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={sttLoading}
            title={
              isRecording
                ? "Click to stop recording and transcribe"
                : sttLoading
                ? "Transcribing speech..."
                : "Record speech (Bengali or English)"
            }
            className={`h-12 px-4 rounded-lg border flex items-center gap-2 shrink-0 transition-colors disabled:opacity-40 ${
              isRecording
                ? "bg-status-error/15 border-status-error text-status-error animate-pulse"
                : sttLoading
                ? "bg-accent-secondary/15 border-accent-secondary text-accent-secondary"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {sttLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRecording ? (
              <MicOff size={16} />
            ) : (
              <Mic size={16} />
            )}
            <span className="text-[10px] font-mono">
              {sttLoading ? "TRANSCRIBING..." : isRecording ? "LISTENING..." : "VOICE"}
            </span>
          </button>

          <label className="h-12 px-3 flex items-center gap-2 rounded-lg border border-border bg-surface text-[10px] font-mono text-text-secondary shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={useLlm}
              onChange={(e) => setUseLlm(e.target.checked)}
              className="accent-[var(--accent-secondary)]"
            />
            LLM GLOSS BREAKING
          </label>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="h-12 px-6 rounded-lg bg-accent-secondary text-white font-semibold text-[11px] font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </form>
      </section>

      {/* RESULT */}
      {result && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.55fr)] gap-4 items-start">
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-3">
            {/* GLOSS SEQUENCE */}
            <section className="rounded-xl border border-border bg-surface/60 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary">
                  Sign Gloss Sequence
                </span>

                <span className="text-[9px] font-mono text-text-muted">
                  VOCAB{" "}
                  <span className="text-text-secondary">
                    {result.available_signs}
                  </span>
                </span>
              </div>

              <div className="rounded-lg border border-border/80 bg-background/50 p-2.5 min-h-[60px]">
                {result.gloss_sequence.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                  {result.gloss_sequence.map((gloss, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        className={`px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold transition-all ${
                          activeSignIndex === idx
                            ? "bg-accent-secondary text-white border-accent-secondary"
                            : "bg-accent-primary/10 border-accent-primary/40 text-accent-primary"
                        }`}
                      >
                        {gloss}
                      </span>

                      {idx < result.gloss_sequence.length - 1 && (
                        <ArrowRight
                          size={12}
                          className="text-text-muted/50 shrink-0"
                        />
                      )}
                    </React.Fragment>
                  ))}
                  </div>
                ) : (
                  <p className="text-xs font-mono text-text-muted">
                    No words in this input map to the active model vocabulary.
                  </p>
                )}
              </div>

              {result.unmapped_words.length > 0 && (
                <p className="mt-3 text-[10px] font-mono text-status-unknown">
                  Not in this model&apos;s vocabulary: {result.unmapped_words.join(", ")}
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[9px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  Active-model sign
                </span>
              </div>

              {hasSigns && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSignIndex(0);
                    setSeqNonce((n) => n + 1);
                    setPlayingSeq(true);
                  }}
                  className="w-full mt-3 h-9 rounded-lg bg-accent-primary text-black font-mono text-[10px] uppercase font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <Play size={13} />
                  {playingSeq ? "Restart Sequence" : "Play Full Sequence"}
                </button>
              )}
            </section>

            {/* CURRENT INPUT */}
            <section className="rounded-xl border border-border bg-surface/60 p-3 sm:p-4">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary mb-2">
                Input
              </div>

              <div className="rounded-lg border border-border bg-background px-3 py-2.5 font-bengali text-sm text-text-primary break-words">
                {result.input_text}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <section className="min-w-0 rounded-xl border border-border bg-surface/60 p-3 sm:p-4">
            <ContinuousSignSimulation
              glosses={result.gloss_sequence}
              playing={playingSeq}
              restartToken={seqNonce}
              viewResetToken={viewResetToken}
              onResetView={() => setViewResetToken((token) => token + 1)}
              onSegmentChange={handleSegmentChange}
              onComplete={handleSequenceComplete}
            />
          </section>
        </div>
      )}

      {/* EMPTY STATE */}
      {!result && !isLoading && (
        <section className="mt-5 rounded-xl border border-dashed border-border bg-surface/30 p-10 sm:p-14 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
            <ArrowRight size={22} className="text-text-muted" />
          </div>

          <div className="mt-4 text-xs font-mono text-text-secondary">
            Enter a Bengali sentence to generate the sign sequence
          </div>

          {loadingExampleGlosses ? (
            <p className="mt-4 text-xs font-mono text-text-muted">
              Loading active-model examples...
            </p>
          ) : exampleGlossesError ? (
            <p className="mt-4 text-xs font-mono text-status-unknown">
              Could not load active-model examples.
            </p>
          ) : exampleSample.length >= 2 ? (
            <button
              type="button"
              onClick={() => setInputText(exampleSample.join(" "))}
              className="mt-4 text-xs font-mono px-4 py-2 rounded-lg bg-surface-elevated border border-border text-text-muted hover:text-accent-secondary hover:border-accent-secondary/50 transition-colors"
            >
              Try: {exampleSample.join(" ")}
            </button>
          ) : null}
        </section>
      )}
    </PageContainer>
  );
}