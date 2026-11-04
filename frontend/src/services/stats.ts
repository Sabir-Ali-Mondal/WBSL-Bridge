import apiClient from "./api";

export interface AdminStats {
  total_signs: number;
  avatar_classes: number;
  model_active: string | null;
  model_classes: number;
  contract?: {
    kind?: string;
    feature_width?: number;
    frames?: number;
  };
  llm_available: boolean;
  llm_model: string;
  inference_mode: string;
  ai_mode: string;
  dataset_version: string;
}

export const statsService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>("/admin/stats");
    return res.data;
  },
};