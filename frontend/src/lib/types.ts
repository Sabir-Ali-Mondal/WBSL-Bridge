// --- API Response Types ---
export interface ApiError {
  detail: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// --- System Health ---
export type InferenceMode = "local" | "cloud";

export interface SystemHealth {
  api: boolean;
  model: boolean;
  tts: boolean;
  llm: boolean;
  inference_mode: InferenceMode;
  dataset_version: string;
  model_version: string;
}

// --- Pipeline & Recognition ---
export type PipelineStage = "camera" | "landmarks" | "recognition" | "nlg" | "tts";
export type PipelineStatus = "active" | "idle" | "error" | "waiting";

export interface NMMFlags {
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
  head_tilt?: boolean;
}

// --- Dataset & Contributions ---
export interface Sign {
  id: string;
  label: string;
  bengali_meaning: string;
  category: string;
  type: "word" | "phrase" | "sentence";
  approved_samples: number;
  pending_samples: number;
  rejected_samples: number;
  has_landmarks: boolean;
  language: "WBSL" | "ISL" | "BdSL";
}

export interface ContributionSession {
  session_id: string;
  signer_id: string;
  created_at: string;
  status: "active" | "completed" | "interrupted";
}

export interface Contribution {
  sample_id: string;
  session_id: string;
  label: string;
  signer_id: string;
  split: "train" | "val" | "test";
  source: "original" | "community" | "unknown_queue_promoted";
  verification: "pending" | "accepted" | "rejected" | "needs_review";
  verified_by: string | null;
  captured_at: string;
  frames: number;
  landmark_path: string;
  video_url?: string;
  upload_status: "pending" | "uploading" | "success" | "failed";
}

export interface VerificationEvidence {
  geometry_score: number;
  temporal_score: number;
  similarity_score: number;
  label_agreement: number;
  synthetic_score: number;
  model_predictions: { label: string; confidence: number }[];
  numerical_features: Record<string, number>;
  symbolic_tags: string[];
  movement_description: string;
  reasoning: {
    handshape_match: string;
    movement_match: string;
    temporal_match: string;
    nmm_detected: string;
    top_candidate: string;
  };
}
