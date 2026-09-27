"use client";

export function usePipeline() {
  return {
    isConnected: false,
    startPipeline: () => {},
    stopPipeline: () => {},
  };
}
