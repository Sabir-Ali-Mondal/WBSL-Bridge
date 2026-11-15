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
  face_avatar?: number[][][];
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
      <div className="pb-3 border-b border-[#263449]">
        <div className="text-xs font-mono uppercase text-[#64748B]">AVATAR DATA SIMULATION</div>
        <h1 className="text-2xl font-bold text-[#F1F5F9] mt-0.5">Avatar Landmark Inspector</h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-mono">
          These sequences are read directly from{" "}
          <span className="text-[#F1F5F9]">{data?.active_model ?? "the active model"}</span>{" "}
          and match its recognition vocabulary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="bg-[#0D1726] border border-[#263449] rounded-lg overflow-hidden flex flex-col max-h-[560px]">
          <div className="px-3 py-2 bg-[#111E30] border-b border-[#263449] text-[10px] font-mono uppercase text-[#64748B] flex justify-between items-center">
            <span>Model Glosses</span>
            <span className="text-[#94A3B8] font-bold">{signs.length}</span>
          </div>
          <div className="overflow-y-auto divide-y divide-[#263449] flex-1">
            {isLoading ? (
              <div className="p-4 text-xs font-mono text-[#64748B]">Loading active model vocabulary...</div>
            ) : isError ? (
              <div className="p-4 text-xs font-mono text-[#EF4444]">Could not load model vocabulary.</div>
            ) : signs.map((sign) => (
              <button
                key={sign.label}
                type="button"
                onClick={() => setActive(sign.label)}
                className={`w-full text-left px-3 py-2 text-xs font-mono transition-colors ${
                  current?.label === sign.label
                    ? "bg-[#34D399]/10 text-[#34D399] font-semibold"
                    : "text-[#94A3B8] hover:bg-[#111E30] hover:text-[#F1F5F9]"
                }`}
              >
                {sign.label}
              </button>
            ))}
            {!isLoading && !isError && signs.length === 0 && (
              <div className="p-4 text-xs font-mono text-[#64748B]">
                The active model has no bundled landmark sequences.
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0D1726] border border-[#263449] rounded-lg p-4">
          {replay ? (
            <>
              <LandmarkSimulation
                key={`${current?.label}-${replay.source}`}
                frames={replay.frames}
                pose={replay.pose}
                faceAvatar={replay.face_avatar}
                fps={15}
                title={replay.source}
              />
              <div className="mt-3 text-[10px] font-mono text-[#64748B] flex items-center gap-2">
                <span className="text-[#F1F5F9] font-bold">{current?.label}</span>
                <span>·</span>
                <span className="text-[#94A3B8]">{current?.bengali}</span>
              </div>
            </>
          ) : (
            <div className="aspect-video flex items-center justify-center text-center px-5 text-xs font-mono text-[#64748B] bg-[#111E30]/40 rounded-lg border border-[#263449]/60">
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
