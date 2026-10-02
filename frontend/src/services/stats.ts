import apiClient from "./api";

export interface DatasetStats {
  total_signs: number;
  total_approved_samples: number;
  total_pending_samples: number;
  total_rejected_samples: number;
  languages: string[];
  categories: string[];
  dataset_version: string;
  model_version: string;
}

export interface AdminStats {
  total_signs: number;
  total_approved_samples: number;
  total_pending_samples: number;
  total_rejected_samples: number;
  model_active: string;
  model_classes: number;
  contract?: {
    kind?: string;
    feature_width?: number;
  };
  llm_available: boolean;
  llm_model: string;
  inference_mode: string;
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