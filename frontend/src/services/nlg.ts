import apiClient from "./api";

export interface NLGResponse {
  bengali_text: string | null;
  status: string;
  engine: string;
  tokens_used: number;
  error?: string;
  has_uncertainty?: boolean;
  gloss_used?: string;
}

export const nlgService = {
  getStatus: async (): Promise<{ llm_available: boolean; engine: string }> => {
    const res = await apiClient.get("/nlg/status");
    return res.data;
  },

  generate: async (gloss: string): Promise<NLGResponse> => {
    const res = await apiClient.post<NLGResponse>("/nlg/generate", { gloss });
    return res.data;
  },

  generateSequence: async (
    sequence: {
      gloss: string;
      confidence: number;
      unknown?: boolean;
      candidates?: { meaning: string; confidence: number }[];
    }[]
  ): Promise<NLGResponse> => {
    const res = await apiClient.post<NLGResponse>("/nlg/generate-sequence", { sequence });
    return res.data;
  },
};