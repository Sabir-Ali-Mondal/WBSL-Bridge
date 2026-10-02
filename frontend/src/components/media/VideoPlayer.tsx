"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  AlertTriangle,
  Loader2,
  Film,
} from "lucide-react";
import axios from "axios";

interface VideoPlayerProps {
  /** Absolute URL of the video. Passing a new value reloads the element. */
  src: string;
  /** Shown until the first frame decodes, so the panel is never a black void. */
  poster?: string | null;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  /**
   * Whether the interactive chrome (control dock, loading badge, error panel)
   * is rendered. `false` turns the player into a pure output surface: the same
   * <video> element and the same frame-fallback engine still drive playback,
   * but nothing clickable is painted over the clip. Used by the Text → Sign
   * sequential viewer, where the sign must be readable without a scrubber and
   * a download button sitting on top of it.
   */
  chrome?: boolean;
  onEnded?: () => void;
  onLoadedMetadata?: (duration: number) => void;
}

/**
 * Two-engine video player.
 *
 * Engine 1 is a normal <video> element: whatever Chrome's own decoder accepts
 * (H.264, VP9, AV1, WebM) plays through it with hardware acceleration.
 *
 * Engine 2 is a paint loop. If engine 1 fires a MediaError the component asks
 * the backend for that clip as a JPEG frame sequence and paints it to a canvas.
 * That path never touches the video decoder at all, which is the whole point:
 * an MPEG-4 Part 2 / FMP4 file, or anything else Chrome refuses, still renders
 * rather than showing a dead box. It costs a round trip and runs at reduced
 * frame rate, so it is strictly a fallback -- but it means "unsupported format"
 * degrades to "plays slightly worse" instead of "cannot be shown at all".
 *
 * The error panel is a last resort for the case where even the frame endpoint
 * has nothing to give, and it offers a direct download so the file is never
 * simply unreachable.
 */
export function VideoPlayer({
  src,
  poster = null,
  className = "",
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  chrome = true,
  onEnded,
  onLoadedMetadata,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackRequested = useRef(false);

  const [status, setStatus] = useState<"loading" | "ready" | "fallback" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLooping, setIsLooping] = useState(loop);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => setIsLooping(loop), [loop]);

  /*
   * The `autoPlay` attribute only matters to the browser at load time. The
   * Text → Sign sequential viewer flips this prop *after* the element has
   * loaded (Play Full Sequence / per-sign advance), so playback is driven
   * here instead: a transition into autoplay starts the clip — from the top
   * when the prop was off before, which is what "Restart Sequence" needs —
   * and a transition out of it stops the clip, so the frozen last frame the
   * sequence ends on stays visible instead of looping away.
   */
  const wasAutoPlay = useRef(autoPlay);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || status !== "ready") return;
    if (autoPlay) {
      if (!wasAutoPlay.current) v.currentTime = 0;
      v.play().catch(() => {});
    } else if (wasAutoPlay.current) {
      v.pause();
    }
    wasAutoPlay.current = autoPlay;
  }, [autoPlay, status, src]);

  // The frame engine has no element to drive: when a sequence asks for autoplay
  // it starts, and idle/manual control is left to togglePlay.
  useEffect(() => {
    if (status === "fallback" && autoPlay) setIsPlaying(true);
  }, [autoPlay, status]);

  // A new source is a new load. Reset every verdict, or a stale error from the
  // previous sign keeps covering a video that plays perfectly well.
  useEffect(() => {
    setStatus("loading");
    setErrorMessage("");
    setCurrentTime(0);
    setDuration(0);
    setFrames([]);
    setFrameIndex(0);
    fallbackRequested.current = false;
    if (frameTimer.current) clearInterval(frameTimer.current);
  }, [src]);

  /**
   * Ask the backend to decode the clip server-side and hand back JPEG frames.
   * This is the only path that works for codecs Chrome cannot decode, and it is
   * also a useful escape hatch when the container is fine but the file is
   * truncated.
   */
  const loadFrameFallback = useCallback(async () => {
    if (fallbackRequested.current) return;
    fallbackRequested.current = true;
    setStatus("loading");
    try {
      const filename = src.split("/").pop()?.split("#")[0]?.split("?")[0];
      if (!filename) throw new Error("no filename");
      const res = await axios.get(
        `http://localhost:8200/api/media/${filename}/frames`,
        { timeout: 25000 }
      );
      const list: string[] = res.data?.frames ?? [];
      if (!list.length) throw new Error("no frames");
      setFrames(list);
      // 14 fps is smooth enough to read a sign without flooding the compositor.
      const fps = Math.max(res.data?.fps || 14, 6);
      setDuration(list.length / fps);
      setStatus("fallback");
      setIsPlaying(true);
    } catch {
      setStatus("error");
      setErrorMessage(
        "This clip could not be decoded in the browser, and the server-side frame fallback returned nothing either. The file may be corrupt or truncated."
      );
    }
  }, [src]);

  const togglePlay = useCallback(() => {
    if (status === "fallback") {
      setIsPlaying((p) => !p);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [status]);

  // Drive the canvas paint loop while the fallback engine is playing.
  useEffect(() => {
    if (status !== "fallback" || !isPlaying || frames.length === 0) {
      if (frameTimer.current) clearInterval(frameTimer.current);
      return;
    }
    frameTimer.current = setInterval(() => {
      setFrameIndex((i) => {
        const next = i + 1;
        if (next >= frames.length) {
          if (isLooping) return 0;
          setIsPlaying(false);
          onEnded?.();
          return i;
        }
        return next;
      });
    }, 71);
    return () => {
      if (frameTimer.current) clearInterval(frameTimer.current);
    };
  }, [status, isPlaying, frames, isLooping, onEnded]);

  // Paint the current frame onto the canvas.
  useEffect(() => {
    if (status !== "fallback" || !frames[frameIndex] || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
    };
    img.src = frames[frameIndex];
    if (duration > 0) setCurrentTime((frameIndex / frames.length) * duration);
  }, [status, frameIndex, frames, duration]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (status === "fallback") {
      const idx = duration > 0 ? Math.round((t / duration) * frames.length) : 0;
      setFrameIndex(Math.min(frames.length - 1, Math.max(0, idx)));
    } else if (videoRef.current) {
      videoRef.current.currentTime = t;
    }
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  const describeError = (code: number | undefined): string => {
    switch (code) {
      case 2:
        return "The connection dropped mid-stream. A large clip needs the server to answer byte-range requests — check the backend is up on port 8200.";
      case 3:
        return "The browser cannot decode this file's codec.";
      case 4:
        return "The browser reports this file as unplayable. It is usually a malformed or unsupported encoding rather than a missing file.";
      default:
        return "The video could not be loaded from the server.";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden bg-black flex items-center justify-center ${className}`}
    >
      {/* ── Engine 1: native decoder ── */}
      {status !== "fallback" && status !== "error" && (
        <video
          key={`${src}#native`}
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          autoPlay={autoPlay}
          loop={isLooping}
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            setDuration(Number.isFinite(d) ? d : 0);
            setStatus("ready");
            onLoadedMetadata?.(d);
            if (autoPlay) e.currentTarget.play().catch(() => {});
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onError={() => loadFrameFallback()}
          onClick={chrome ? togglePlay : undefined}
          className={`w-full h-full object-contain ${
            chrome ? "cursor-pointer" : ""
          }`}
        />
      )}

      {/* ── Engine 2: server-side frame painting ── */}
      {status === "fallback" && (
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={chrome ? togglePlay : undefined}
        >
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-contain ${
              chrome ? "cursor-pointer" : ""
            }`}
          />

          {chrome && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-[10px] font-mono font-bold text-accent-primary backdrop-blur-md">
              <Film size={11} />
              <span>FRAME ENGINE</span>
            </div>
          )}
        </div>
      )}

      {/* ── Loading ── */}
      {status === "loading" && chrome && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm pointer-events-none">
          <Loader2 size={26} className="animate-spin text-accent-primary" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">
            Loading media…
          </span>
        </div>
      )}

      {/* ── Unrecoverable ── */}
      {status === "error" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-6 text-center bg-zinc-950">
          <div className="w-11 h-11 rounded-full bg-status-error/15 border border-status-error/30 flex items-center justify-center text-status-error">
            <AlertTriangle size={22} />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">Video unavailable</h4>
          <p className="text-xs text-text-muted max-w-sm leading-relaxed">{errorMessage}</p>
          <div className="flex gap-2 pt-1">
            <a
              href={src}
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary text-black text-xs font-mono font-bold hover:bg-accent-primary/90 transition-colors"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
            <button
              onClick={() => {
                fallbackRequested.current = false;
                loadFrameFallback();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-primary hover:border-accent-secondary transition-colors"
            >
              <RotateCcw size={13} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Control dock ── */}
      {controls && chrome && status !== "error" && (
        <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={Math.min(currentTime, duration || 1)}
            onChange={handleSeek}
            aria-label="Seek"
            className="w-full h-1 appearance-none rounded-lg bg-white/20 cursor-pointer accent-[var(--accent-primary)] hover:h-1.5 transition-all"
          />
          <div className="flex items-center justify-between text-white/90">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              {status === "ready" && (
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              )}
              <span className="font-mono text-[11px] text-white/70 tabular-nums">
                {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsLooping((l) => !l)}
                aria-label="Toggle loop"
                className={`px-2 py-1 rounded text-[10px] font-mono font-semibold tracking-wider transition-colors ${
                  isLooping
                    ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40"
                    : "text-white/60 hover:text-white border border-transparent"
                }`}
              >
                LOOP
              </button>
              <a
                href={src}
                download
                aria-label="Download video"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Download size={14} />
              </a>
              <button
                onClick={handleFullscreen}
                aria-label="Toggle fullscreen"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}