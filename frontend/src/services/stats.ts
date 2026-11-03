import apiClient from "./api";

export interface DatasetStats {
  total_signs: number;
  languages: string[];
  categories: string[];
  dataset_version: string;
  model_version: string;
}

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
  getDatasetStats: async (): Promise<DatasetStats> => {
    const res = await apiClient.get<DatasetStats>("/dataset/stats");
    return res.data;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>("/admin/stats");
    return res.data;
  },
};