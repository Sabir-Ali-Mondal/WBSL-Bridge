export const APP_CONFIG = {
  name: "WBSL BRIDGE",
  fullName: "West Bengal Sign Language Translation & Research System",
  datasetVersion: "v0.8",
  modelVersion: "LSTM-v1.4",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8200/api",
};

export const NAVIGATION_LINKS = [
  { label: "Text → Sign", href: "/text-to-sign" },
  { label: "Sign → Text", href: "/sign-to-text" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
];

export const PIPELINE_STAGES = [
  { id: "camera", label: "CAMERA" },
  { id: "landmarks", label: "LANDMARKS" },
  { id: "recognition", label: "RECOGNITION" },
  { id: "nlg", label: "NLG" },
  { id: "tts", label: "TTS" },
] as const;
