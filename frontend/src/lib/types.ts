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

export interface Candidate {
  meaning: string;
  confidence: number;
  evidence: string;
}

export interface NMMFlags {
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
  head_tilt?: boolean;
}

export interface PipelineEvent {
  type:
    | "status"
    | "landmarks"
    | "sign_detected"
    | "unknown_sign"
    | "candidates_ready"
    | "nmm_update"
    | "emotion_update"
    | "sentence_end"
    | "bengali_output"
    | "tts_ready"
    | "error";
  stage?: PipelineStage;
  status?: PipelineStatus;
  gloss?: string;
  confidence?: number;
  timestamp?: [number, number];
  window_id?: number;
  candidates?: Candidate[];
  markers?: NMMFlags;
  emotion?: string;
  text?: string;
  has_uncertain?: boolean;
  audio_url?: string;
  engine?: "edge-tts" | "banglatts";
  duration_ms?: number;
  message?: string;
  hands?: number;
  face?: boolean;
  pose?: boolean;
  fps?: number;
  gloss_sequence?: string[];
}

// --- WebSocket Payloads (Frontend -> Backend) ---
export interface WsLandmarksPayload {
  type: "landmarks";
  frame_id: number;
  timestamp: number;
  hands_left: number[][] | null;   // 21 x 3
  hands_right: number[][] | null;  // 21 x 3
  face: number[][] | null;         // 468 x 3
  pose: number[][] | null;         // 33 x 3
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
  reference_video_url: string | null;
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

// --- Training & Models ---
export interface ModelVersion {
  id: string;
  version: string;
  dataset_version: string;
  status: "active" | "archived" | "training" | "evaluating";
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  created_at: string;
}

export interface TrainingEvent {
  type:
    | "epoch_start"
    | "epoch_end"
    | "batch_progress"
    | "training_complete"
    | "training_error"
    | "export_progress";
  epoch?: number;
  total_epochs?: number;
  loss?: number;
  accuracy?: number;
  val_accuracy?: number;
  batch?: number;
  total_batches?: number;
  model_id?: string;
  final_accuracy?: number;
  message?: string;
  stage?: string;
  percent?: number;
}
