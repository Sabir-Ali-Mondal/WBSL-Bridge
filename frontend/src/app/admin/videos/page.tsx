"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { VideoPlayer } from "@/components/media/VideoPlayer";
const API_BASE = "http://localhost:8200";

interface CoverageItem {
  label: string;
  media_type: "video" | "image" | null;
  media_url: string | null;
}

/**
 * Reference video review.
 *
 * Reads /api/coverage, which is the only endpoint that knows which classes
 * actually have reference media attached -- the model's class list and the
 * media library are different sets, and this page exists to show the gap.
 */
export default function AdminVideosPage() {
  const { data } = useQuery({
    queryKey: ["coverage"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/coverage`)).data,
  });

  const videos: CoverageItem[] = (data?.items ?? []).filter(
    (i: CoverageItem) => i.media_type === "video"
  );

  const [active, setActive] = React.useState<string | null>(null);
  const current = videos.find((v) => v.label === active) ?? videos[0];

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="text-xs font-mono uppercase text-text-muted">VIDEO INSPECTOR</div>
      <h1 className="text-2xl font-bold text-text-primary">Reference Video Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="bg-surface border border-border rounded-lg overflow-y-auto max-h-[560px]">
          {videos.map((v) => (
            <button
              key={v.label}
              onClick={() => setActive(v.label)}
              className={`w-full text-left px-3 py-2 text-xs font-mono border-b border-border ${
                current?.label === v.label
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-surface-elevated"
              }`}
            >
              {v.label}
            </button>
          ))}

          {videos.length === 0 && (
            <div className="p-4 text-xs font-mono text-text-muted">
              No reference videos registered.
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          {current?.media_url ? (
            <>
              <VideoPlayer
                src={`${API_BASE}${current.media_url}`}
                muted
                loop
                className="aspect-video w-full rounded border border-border"
              />
              <div className="mt-3 text-[10px] font-mono text-text-muted">
                {current.label}
              </div>
            </>
          ) : (
            <div className="aspect-video flex items-center justify-center text-xs font-mono text-text-muted">
              Select a video
            </div>
          )}
        </div>
      </div>
    </div>
  );
}