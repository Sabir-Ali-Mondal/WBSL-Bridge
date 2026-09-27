import { create } from "zustand";

export type RecordingState =
  | "CONSENT_GATE"
  | "SIGN_SELECTED"
  | "REFERENCE_VIEW"
  | "READY_TO_RECORD"
  | "COUNTDOWN"
  | "RECORDING"
  | "RECORDED"
  | "NMM_TAGGING"
  | "PREVIEW"
  | "SUBMITTING_LANDMARKS"
  | "SUBMITTING_VIDEO"
  | "SUBMITTED"
  | "UPLOAD_FAILED";

interface RecordingStore {
  state: RecordingState;
  sessionId: string | null;
  currentSignId: string | null;
  currentSignLabel: string | null;
  signerId: string | null;
  consentGiven: boolean;
  recordVideo: boolean;
  samplesRecorded: number;
  uploadQueue: { blob: Blob; metadata: any; status: "pending" | "uploading" | "failed" }[];
  nmmTags: {
    question: boolean;
    wh_question: boolean;
    negation: boolean;
    affirmation: boolean;
    emphasis: boolean;
    head_tilt: boolean;
  };

  setSession: (sessionId: string) => void;
  setState: (state: RecordingState) => void;
  setConsent: (signerId: string, recordVideo: boolean) => void;
  selectSign: (signId: string, label: string) => void;
  toggleNMMTag: (tag: keyof RecordingStore["nmmTags"]) => void;
  resetNMMTags: () => void;
  incrementSamples: () => void;
  addToUploadQueue: (blob: Blob, metadata: any) => void;
  updateUploadStatus: (index: number, status: "uploading" | "failed" | "pending") => void;
  resetSession: () => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  state: "CONSENT_GATE",
  sessionId: null,
  currentSignId: null,
  currentSignLabel: null,
  signerId: null,
  consentGiven: false,
  recordVideo: false,
  samplesRecorded: 0,
  uploadQueue: [],
  nmmTags: {
    question: false,
    wh_question: false,
    negation: false,
    affirmation: false,
    emphasis: false,
    head_tilt: false,
  },

  setSession: (sessionId) => set({ sessionId }),
  setState: (state) => set({ state }),
  setConsent: (signerId, recordVideo) =>
    set({ consentGiven: true, signerId, recordVideo, state: "SIGN_SELECTED" }),
  selectSign: (signId, label) =>
    set({ currentSignId: signId, currentSignLabel: label, state: "REFERENCE_VIEW" }),
  toggleNMMTag: (tag) =>
    set((s) => ({ nmmTags: { ...s.nmmTags, [tag]: !s.nmmTags[tag] } })),
  resetNMMTags: () =>
    set({
      nmmTags: {
        question: false,
        wh_question: false,
        negation: false,
        affirmation: false,
        emphasis: false,
        head_tilt: false,
      },
    }),
  incrementSamples: () => set((s) => ({ samplesRecorded: s.samplesRecorded + 1 })),
  addToUploadQueue: (blob, metadata) =>
    set((s) => ({ uploadQueue: [...s.uploadQueue, { blob, metadata, status: "pending" }] })),
  updateUploadStatus: (index, status) =>
    set((s) => {
      const q = [...s.uploadQueue];
      if (q[index]) q[index].status = status;
      return { uploadQueue: q };
    }),
  resetSession: () =>
    set({
      state: "CONSENT_GATE",
      currentSignId: null,
      currentSignLabel: null,
      samplesRecorded: 0,
      sessionId: null,
      uploadQueue: [],
    }),
}));
