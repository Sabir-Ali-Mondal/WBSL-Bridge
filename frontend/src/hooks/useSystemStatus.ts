"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { SystemHealth } from "@/lib/types";

export function useSystemStatus() {
  const { data, isError, isLoading } = useQuery<SystemHealth>({
    queryKey: ["system-health"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<SystemHealth>("/system/health");
        return res.data;
      } catch {
        // A backend that cannot be reached is OFFLINE. Reporting green here
        // made the navbar diagnostics lie exactly when they mattered most.
        return {
          api: false,
          model: false,
          tts: false,
          llm: false,
          inference_mode: "local",
          dataset_version: "unknown",
          model_version: "unreachable",
        };
      }
    },
    refetchInterval: 10000, // Poll every 10 seconds per Section 7.5
  });

  return {
    health: data || {
      api: false,
      model: false,
      tts: false,
      llm: false,
      inference_mode: "local",
      dataset_version: "v0.8",
      model_version: "LSTM-v1.4",
    },
    isError,
    isLoading,
  };
}
