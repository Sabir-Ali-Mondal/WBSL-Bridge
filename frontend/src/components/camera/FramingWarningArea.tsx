"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface FramingWarningAreaProps {
  cameraActive: boolean;
  handsDetected?: number;
  hasFace?: boolean;
  detected?: boolean;
  confidence?: number;
}

export function FramingWarningArea({
  cameraActive,
  handsDetected = 0,
  hasFace = true,
  detected = false,
  confidence = 0,
}: FramingWarningAreaProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("Framing looks good.");
  const [messageType, setMessageType] = useState<"good" | "info" | "warning">("good");

  // Debounce / cooldown refs to prevent rapid flipping
  const lastChangeTimeRef = useRef<number>(0);
  const consecutiveMissRef = useRef<number>(0);

  useEffect(() => {
    if (!cameraActive) {
      setCurrentMessage("Camera offline");
      setMessageType("info");
      return;
    }

    const now = Date.now();
    // Allow message updates at most once every 2000ms unless going from error to good
    const elapsed = now - lastChangeTimeRef.current;

    let candidateMessage = "Framing looks good.";
    let candidateType: "good" | "info" | "warning" = "good";

    if (!hasFace) {
      consecutiveMissRef.current += 1;
      if (consecutiveMissRef.current >= 3) {
        candidateMessage = "Face may be outside the frame.";
        candidateType = "warning";
      }
    } else {
      consecutiveMissRef.current = 0;
      if (handsDetected === 1) {
        candidateMessage = "One hand may be outside the frame.";
        candidateType = "info";
      } else if (handsDetected === 0 && !detected) {
        candidateMessage = "Try keeping your upper body in view.";
        candidateType = "info";
      } else {
        candidateMessage = "Framing looks good.";
        candidateType = "good";
      }
    }

    if (candidateMessage !== currentMessage && (elapsed > 2000 || candidateType === "good")) {
      setCurrentMessage(candidateMessage);
      setMessageType(candidateType);
      lastChangeTimeRef.current = now;
    }
  }, [cameraActive, handsDetected, hasFace, detected, confidence, currentMessage]);

  if (!cameraActive) {
    return null;
  }

  return (
    <div
      className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-2 transition-all duration-300 ${
        messageType === "good"
          ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
          : messageType === "warning"
          ? "bg-status-error/10 border-status-error/30 text-status-error"
          : "bg-surface-elevated/70 border-border text-text-secondary"
      }`}
      role="status"
      aria-live="polite"
    >
      {messageType === "good" ? (
        <CheckCircle2 size={13} className="shrink-0 text-accent-primary" />
      ) : messageType === "warning" ? (
        <AlertCircle size={13} className="shrink-0 text-status-error" />
      ) : (
        <Info size={13} className="shrink-0 text-text-muted" />
      )}
      <span className="truncate">{currentMessage}</span>
    </div>
  );
}
