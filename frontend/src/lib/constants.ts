export const APP_CONFIG = {
  name: "WBSL BRIDGE",
  fullName: "West Bengal Sign Language Translation & Research System",
  datasetVersion: "v0.8",
  modelVersion: "LSTM-v1.4",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws",
};

export const NAVIGATION_LINKS = [
  { label: "Text → Sign", href: "/text-to-sign" },
  { label: "Sign → Text", href: "/sign-to-text" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
];

export const ADMIN_NAVIGATION_LINKS = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Contributions", href: "/admin/contributions", icon: "CheckSquare" },
  { label: "Signs Catalog", href: "/admin/signs", icon: "BookOpen" },
  { label: "Dataset Explorer", href: "/admin/dataset", icon: "Database" },
  { label: "Models Registry", href: "/admin/models", icon: "Cpu" },
  { label: "Video Inspector", href: "/admin/videos", icon: "Video" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export const PIPELINE_STAGES = [
  { id: "camera", label: "CAMERA" },
  { id: "landmarks", label: "LANDMARKS" },
  { id: "recognition", label: "RECOGNITION" },
  { id: "nlg", label: "NLG" },
  { id: "tts", label: "TTS" },
] as const;
