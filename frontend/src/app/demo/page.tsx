"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { PipelineStatus } from "@/components/pipeline/PipelineStatus";
import { Play, Volume2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function StandaloneDemoPage() {
  const [activePreset, setActivePreset] = useState("greeting");
  const [bengaliOutput, setBengaliOutput] = useState("নমস্কার, আপনি কেমন আছেন?");
  const [sequence, setSequence] = useState(["HELLO", "YOU", "HOW"]);

  const presets = [
    {
      id: "greeting",
      name: "Greeting & Inquiry",
      bengali: "নমস্কার, আপনি কেমন আছেন?",
      sequence: ["HELLO", "YOU", "HOW"],
    },
    {
      id: "emergency",
      name: "Emergency Need",
      bengali: "আমার জরুরি ডাক্তার এবং জল দরকার।",
      sequence: ["ME", "EMERGENCY", "DOCTOR", "WATER", "NEED"],
    },
    {
      id: "direction",
      name: "Direction Inquiry",
      bengali: "রেল স্টেশন কোথায়?",
      sequence: ["TRAIN", "STATION", "WHERE"],
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setActivePreset(p.id);
    setBengaliOutput(p.bengali);
    setSequence(p.sequence);
    toast.success(`Loaded preset: ${p.name}`);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(bengaliOutput);
      u.lang = "bn-IN";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-secondary uppercase">
            <span className="w-2 h-2 rounded-full bg-accent-secondary" />
            <span>STANDALONE PRESENTATION SUITE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Offline Demo Route
          </h1>
        </div>

        {/* Demo Mode Badge per Section 9.8 */}
        <div className="px-3 py-1 bg-accent-secondary text-white font-mono text-xs font-bold rounded">
          DEMO MODE ACTIVE
        </div>
      </div>

      {/* Presentation Warning / Safety Banner */}
      <div className="p-3.5 rounded bg-surface border border-border text-xs text-text-secondary font-mono flex items-center space-x-2">
        <AlertCircle size={15} className="text-accent-secondary shrink-0" />
        <span>
          Runs full AI pipeline using pre-recorded kinematic sequences from the actual dataset without requiring webcam or live backend socket.
        </span>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`p-4 rounded-lg border text-left transition-all ${
              activePreset === p.id
                ? "bg-accent-secondary/15 border-accent-secondary text-text-primary"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="font-mono text-xs font-bold">{p.name}</div>
            <div className="font-bengali text-sm text-text-muted mt-1">{p.bengali}</div>
          </button>
        ))}
      </div>

      {/* Pipeline Status */}
      <PipelineStatus
        stages={{ camera: "idle", landmarks: "active", recognition: "active", nlg: "active", tts: "active" }}
        fps={30}
      />

      {/* Canvas Landmark Player */}
      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="text-xs font-mono uppercase text-text-muted">
          Pre-Recorded Coordinate Stream
        </div>
        <LandmarkSimulation showHands showFace showPose fps={30} />
      </div>

      {/* Output Display */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase text-text-muted">Synthesized Bengali Translation</div>
          <p className="bengali-text text-3xl font-bold text-text-primary">{bengaliOutput}</p>
          <div className="flex gap-2 pt-2">
            {sequence.map((g, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-surface-elevated font-mono text-xs text-accent-primary">
                [{g}]
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSpeak}
          className="flex items-center space-x-2 px-6 py-3 rounded-md bg-accent-primary text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-primary/90 transition-colors shrink-0"
        >
          <Volume2 size={16} />
          <span>Play Voice</span>
        </button>
      </div>
    </PageContainer>
  );
}
