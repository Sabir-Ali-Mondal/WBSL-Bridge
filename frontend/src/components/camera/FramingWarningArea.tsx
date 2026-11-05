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

  // Borderless, same fills and corner radius as the rest of the workspace.
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors duration-300 ${
        messageType === "good"
          ? "bg-accent-primary/10 text-accent-primary"
          : messageType === "warning"
          ? "bg-status-error/10 text-status-error"
          : "bg-black/20 text-text-secondary"
      }`}
      role="status"
      aria-live="polite"
    >
      {messageType === "good" ? (
        <CheckCircle2 size={14} className="shrink-0" />
      ) : messageType === "warning" ? (
        <AlertCircle size={14} className="shrink-0" />
      ) : (
        <Info size={14} className="shrink-0 text-text-muted" />
      )}
      <span className="truncate">{currentMessage}</span>
    </div>
  );
}