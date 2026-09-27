import apiClient from "./api";
import { Sign, PaginatedResponse } from "@/lib/types";

export const datasetService = {
  getSigns: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    language?: string;
  }): Promise<PaginatedResponse<Sign>> => {
    const response = await apiClient.get<PaginatedResponse<Sign>>("/dataset/signs", { params });
    return response.data;
  },

  getSignById: async (id: string): Promise<Sign> => {
    const res = await apiClient.get<Sign>(`/dataset/signs/${id}`);
    return res.data;
  },
};