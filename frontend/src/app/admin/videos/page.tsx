"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";

const API_BASE = "http://localhost:8200";

interface ModelSign {
  label: string;
  bengali: string;
}

interface LandmarkReplay {
  frames: number[][][];
  pose?: [number, number, number, number][][];
  face_mesh?: number[][][];
  source: string;
}

export default function ModelSimulationPage() {
  const [active, setActive] = React.useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["coverage"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/coverage`)).data,
  });
  const signs: ModelSign[] = data?.items ?? [];
  const current = signs.find((sign) => sign.label === active) ?? signs[0];

  const { data: replay, isLoading: replayLoading, isError: replayError } = useQuery({
    queryKey: ["model-simulation", current?.label],
    queryFn: async () => (await axios.get<LandmarkReplay>(
      `${API_BASE}/api/simulation/frames`,
      { params: { label: current!.label } },
    )).data,
    enabled: !!current,
    retry: false,
  });

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="text-xs font-mono uppercase text-text-muted">ACTIVE MODEL SIMULATION</div>
      <h1 className="text-2xl font-bold text-text-primary">Landmark Sequence Inspector</h1>
      <p className="text-xs text-text-secondary">
        These sequences are read directly from {data?.active_model ?? "the active model"} and match its recognition vocabulary.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="bg-surface border border-border rounded-lg overflow-y-auto max-h-[560px]">
          {isLoading ? (
            <div className="p-4 text-xs font-mono text-text-muted">Loading active model vocabulary...</div>
          ) : isError ? (
            <div className="p-4 text-xs font-mono text-status-error">Could not load model vocabulary.</div>
          ) : signs.map((sign) => (
            <button
              key={sign.label}
              type="button"
              onClick={() => setActive(sign.label)}
              className={`w-full text-left px-3 py-2 text-xs font-mono border-b border-border ${
                current?.label === sign.label
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-surface-elevated"
              }`}
            >
              {sign.label}
            </button>
          ))}
          {!isLoading && !isError && signs.length === 0 && (
            <div className="p-4 text-xs font-mono text-text-muted">
              The active model has no bundled landmark sequences.
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          {replay ? (
            <>
              <LandmarkSimulation
                key={`${current?.label}-${replay.source}`}
                frames={replay.frames}
                pose={replay.pose}
                faceMesh={replay.face_mesh}
                fps={15}
                title={replay.source}
              />
              <div className="mt-3 text-[10px] font-mono text-text-muted">
                {current?.label} · {current?.bengali}
              </div>
            </>
          ) : (
            <div className="aspect-video flex items-center justify-center text-center px-5 text-xs font-mono text-text-muted">
              {replayLoading
                ? "Loading bundled landmark sequence..."
                : replayError
                ? "Could not load this model sequence."
                : "Select a model sign to simulate."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
