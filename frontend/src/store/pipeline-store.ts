import { create } from "zustand";
import { PipelineStage, PipelineStatus, Candidate, NMMFlags } from "@/lib/types";

interface PipelineStore {
  stages: Record<PipelineStage, PipelineStatus>;
  fps: number;
  detectedSigns: { gloss: string; confidence: number }[];
  currentCandidates: Candidate[];
  nmmActive: NMMFlags;
  bengaliOutput: string;
  hasUncertainty: boolean;
  isDemoMode: boolean;

  updateStage: (stage: PipelineStage, status: PipelineStatus) => void;
  setFps: (fps: number) => void;
  addDetectedSign: (gloss: string, confidence: number) => void;
  clearDetectedSigns: () => void;
  setCandidates: (candidates: Candidate[]) => void;
  setNMM: (flags: NMMFlags) => void;
  setBengaliOutput: (text: string, uncertain: boolean) => void;
  setDemoMode: (isDemo: boolean) => void;
  resetPipeline: () => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  stages: {
    camera: "idle",
    landmarks: "idle",
    recognition: "idle",
    nlg: "idle",
    tts: "idle",
  },
  fps: 0,
  detectedSigns: [],
  currentCandidates: [],
  nmmActive: {
    question: false,
    wh_question: false,
    negation: false,
    affirmation: false,
    emphasis: false,
  },
  bengaliOutput: "",
  hasUncertainty: false,
  isDemoMode: false,

  updateStage: (stage, status) =>
    set((s) => ({ stages: { ...s.stages, [stage]: status } })),
  setFps: (fps) => set({ fps }),
  addDetectedSign: (gloss, confidence) =>
    set((s) => ({
      detectedSigns: [...s.detectedSigns, { gloss, confidence }].slice(-20),
    })),
  clearDetectedSigns: () => set({ detectedSigns: [] }),
  setCandidates: (candidates) => set({ currentCandidates: candidates }),
  setNMM: (flags) => set({ nmmActive: flags }),
  setBengaliOutput: (text, uncertain) =>
    set({ bengaliOutput: text, hasUncertainty: uncertain }),
  setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
  resetPipeline: () =>
    set({
      stages: {
        camera: "idle",
        landmarks: "idle",
        recognition: "idle",
        nlg: "idle",
        tts: "idle",
      },
      fps: 0,
      detectedSigns: [],
      currentCandidates: [],
      bengaliOutput: "",
      hasUncertainty: false,
    }),
}));
