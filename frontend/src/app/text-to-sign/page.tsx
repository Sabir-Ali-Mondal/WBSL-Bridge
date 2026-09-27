"use client";
import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ArrowRight, VideoOff, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000";

interface MediaItem {
  gloss: string;
  type: "video" | "image" | null;
  url: string | null;
}
interface TextToSignResult {
  input_text: string;
  gloss_sequence: string[];
  available_signs: number;
  media: MediaItem[];
}

export default function TextToSignPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TextToSignResult | null>(null);
  const [activeSignIndex, setActiveSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playingSeq, setPlayingSeq] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeMedia = result?.media?.[activeSignIndex] ?? null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsLoading(true);
    setPlayingSeq(false);
    try {
      const res = await axios.post<TextToSignResult>(`${API_BASE}/api/text-to-sign`, {
        text: inputText,
      });
      setResult(res.data);
      setActiveSignIndex(0);
      toast.success("Sign sequence generated");
    } catch {
      toast.error("Backend not responding. Start FastAPI server first.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sequential playback: video ends → next sign; image/no-media → timed advance
  const handleVideoEnded = () => {
    if (!playingSeq || !result) return;
    if (activeSignIndex < result.gloss_sequence.length - 1) setActiveSignIndex((i) => i + 1);
    else setPlayingSeq(false);
  };

  useEffect(() => {
    if (!playingSeq || !result) return;
    if (activeMedia?.type === "video") {
      videoRef.current?.play().catch(() => {});
      return;
    }
    const t = setTimeout(() => {
      if (activeSignIndex < result.gloss_sequence.length - 1) setActiveSignIndex((i) => i + 1);
      else setPlayingSeq(false);
    }, activeMedia?.type === "image" ? 1500 : 800);
    return () => clearTimeout(t);
  }, [playingSeq, activeSignIndex, activeMedia, result]);

  const hasAnyMedia = result?.media?.some((m) => m.url) ?? false;

  return (
    <PageContainer className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-border">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-secondary uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
          <span>REVERSE SYNTHESIS PIPELINE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Bengali Text → Sign Reference Playback
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Glosses with uploaded reference media play as one continuous sign presentation.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
          BENGALI INPUT SENTENCE
        </div>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="বাংলা বাক্য লিখুন (যেমন: আমি জল পান করি)"
            className="flex-1 p-3 bg-background border border-border rounded text-text-primary font-bengali text-lg focus:outline-none focus:border-accent-secondary"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-3 rounded bg-accent-secondary text-white font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-secondary/90 transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Generate Sign Sequence</span>
            )}
          </button>
        </form>
      </div>

      {result && (
        <>
          <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                SIGN GLOSS SEQUENCE
              </div>
              <div className="text-xs font-mono text-text-muted">
                Available signs in model: {result.available_signs}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {result.gloss_sequence.map((gloss, idx) => (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => { setActiveSignIndex(idx); setPlayingSeq(false); }}
                    className={`px-3 py-1.5 rounded border font-mono text-xs font-bold cursor-pointer transition-colors ${
                      activeSignIndex === idx
                        ? "bg-accent-secondary text-white border-accent-secondary"
                        : gloss.startsWith("[")
                        ? "bg-status-unknown/10 border-status-unknown/30 text-status-unknown"
                        : result.media[idx]?.url
                        ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary"
                        : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {gloss}
                  </button>
                  {idx < result.gloss_sequence.length - 1 && (
                    <ArrowRight size={14} className="text-text-muted" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-4 text-[10px] font-mono text-text-muted pt-2 border-t border-border">
              <span>
                <span className="text-accent-primary">■</span> Reference media available
              </span>
              <span>
                <span className="text-status-unknown">■</span> Unknown word (no sign mapped yet)
              </span>
            </div>
            {hasAnyMedia && (
              <button
                onClick={() => { setActiveSignIndex(0); setPlayingSeq(true); }}
                className="flex items-center space-x-2 px-4 py-2 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors"
              >
                <Play size={13} />
                <span>Play Full Sequence</span>
              </button>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                SIGN REFERENCE — {result.gloss_sequence[activeSignIndex]}
              </div>
              {playingSeq && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary font-bold">
                  SEQUENCE PLAYING {activeSignIndex + 1}/{result.gloss_sequence.length}
                </span>
              )}
            </div>

            {activeMedia?.type === "video" && activeMedia.url ? (
              <video
                key={activeMedia.url}
                ref={videoRef}
                src={`${API_BASE}${activeMedia.url}`}
                controls
                autoPlay={playingSeq}
                loop={!playingSeq}
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full aspect-video bg-background border border-border rounded-lg object-contain"
              />
            ) : activeMedia?.type === "image" && activeMedia.url ? (
              <img
                key={activeMedia.url}
                src={`${API_BASE}${activeMedia.url}`}
                alt={activeMedia.gloss}
                className="w-full aspect-video bg-background border border-border rounded-lg object-contain"
              />
            ) : (
              <div className="aspect-video w-full bg-background border border-border rounded-lg flex flex-col items-center justify-center space-y-3">
                <VideoOff size={40} className="text-text-muted" />
                <div className="text-sm font-mono text-text-secondary">No reference media for this sign yet</div>
                <div className="text-xs text-text-muted max-w-sm text-center">
                  Upload a video or image from Admin → Signs Catalog. It will appear here automatically.
                </div>
              </div>
            )}

            {result.gloss_sequence.length > 1 && (
              <div className="pt-2">
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden flex">
                  {result.gloss_sequence.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => { setActiveSignIndex(i); setPlayingSeq(false); }}
                      className={`flex-1 h-full cursor-pointer border-r border-background transition-all ${
                        activeSignIndex === i
                          ? "bg-accent-secondary"
                          : "bg-border hover:bg-border/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!result && !isLoading && (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-3">
          <ArrowRight size={32} className="mx-auto text-text-muted" />
          <div className="text-sm font-mono text-text-secondary">
            Enter a Bengali sentence above to generate the sign gloss sequence
          </div>
          <div className="text-xs text-text-muted">
            Example: &quot;আমি জল পান করি&quot;
          </div>
        </div>
      )}
    </PageContainer>
  );
}
