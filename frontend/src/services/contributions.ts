import apiClient from "./api";
import { Contribution, ContributionSession, VerificationEvidence } from "@/lib/types";

export const contributionService = {
  createSession: async (signerId: string): Promise<ContributionSession> => {
    const res = await apiClient.post<ContributionSession>("/contributions/session", { signer_id: signerId });
    return res.data;
  },

  submitSample: async (sessionId: string, formData: FormData): Promise<{ sample_id: string; status: string; frames: number }> => {
    const res = await apiClient.post(`/contributions/session/${sessionId}/samples`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
    return res.data;
  },

  getContributions: async (): Promise<Contribution[]> => {
    const res = await apiClient.get<Contribution[]>("/admin/contributions");
    return res.data;
  },

  getEvidence: async (sampleId: string): Promise<VerificationEvidence> => {
    const res = await apiClient.get<VerificationEvidence>(`/admin/contributions/${sampleId}/evidence`);
    return res.data;
  },

  verifyContribution: async (sampleId: string, action: "accepted" | "rejected" | "needs_review", notes?: string): Promise<{ success: boolean }> => {
    const res = await apiClient.post(`/admin/contributions/${sampleId}/verify`, { action, notes });
    return res.data;
  },

};
