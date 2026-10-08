"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PrivacyGate } from "@/components/recording/PrivacyGate";
import { UploadRecovery } from "@/components/recording/UploadRecovery";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { useCamera } from "@/hooks/useCamera";
import { useRecording } from "@/hooks/useRecording";
import { useRecordingStore } from "@/store/recording-store";
import { contributionService } from "@/services/contributions";
import { Video, Square, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface LandmarkReplay {
  label: string;
  frames: number[][][];
  pose?: [number, number, number, number][][];
  face_mesh?: number[][][];
  source: string;
}

export default function ContributeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const {
    state,
    consentGiven,
    currentSignLabel,
    signerId,
    nmmTags,
    setState,
    setConsent,
    toggleNMMTag,
    resetNMMTags,
    incrementSamples,
  } = useRecordingStore();

  const { stream, videoRef, isReady, startCamera } = useCamera();
  const { isRecording, startRecording, stopRecording, recordedBlob, recordedUrl, clearRecording } = useRecording(stream);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState(false);
  const [refMedia, setRefMedia] = useState<LandmarkReplay | null>(null);

  useEffect(() => {
    if (consentGiven && !isReady) {
      startCamera();
    }
  }, [consentGiven, isReady, startCamera]);

  // Show the same active-model sequence used by Text -> Sign and the dataset viewer.
  useEffect(() => {
    if (!currentSignLabel) {
      return;
    }
    let cancelled = false;
    axios.get<LandmarkReplay>(`${API_BASE}/api/simulation/frames`, {
      params: { label: currentSignLabel },
    })
      .then((r) => {
        if (!cancelled) setRefMedia({ ...r.data, label: currentSignLabel });
      })
      .catch(() => {
        if (!cancelled) setRefMedia(null);
      });
    return () => {
      cancelled = true;
    };
  }, [currentSignLabel]);

  // Handle countdown before recording starts
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Side effects belong in an effect, NOT inside a setState updater.
      // Calling them during the updater runs them mid-render, which is what
      // produced "Cannot update a component while rendering a different component".
      setCountdown(null);
      startRecording();
      setState("RECORDING");
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, startRecording, setState]);

  const triggerRecording = () => {
    setCountdown(3);
  };

  const handleStopRecording = () => {
    stopRecording();
    setState("NMM_TAGGING");
  };

  // REAL upload: recorded video → backend extracts landmarks → npy + manifest
  const handleSubmitSample = async () => {
    if (!recordedBlob) {
      toast.error("No recording captured. Record a gesture first.");
      return;
    }
    setState("SUBMITTING_VIDEO");
    const fd = new FormData();
    fd.append("label", currentSignLabel || "UNKNOWN");
    fd.append("signer_id", signerId || "anonymous");
    fd.append("nmm_tags", JSON.stringify(nmmTags));
    fd.append("file", recordedBlob, `rec_${Date.now()}.webm`);
    try {
      const res = await contributionService.submitSample(sessionId, fd);
      incrementSamples();
      setState("SUBMITTED");
      toast.success(`Sample ${res.sample_id} uploaded (${res.frames} landmark frames)`);
    } catch {
      setUploadError(true);
      setState("NMM_TAGGING");
      toast.error("Upload failed — recording kept locally, retry when ready");
    }
  };

  if (!consentGiven) {
    return (
      <PageContainer className="py-8">
        <PrivacyGate
          onConsent={(sId, saveVideo) => {
            setConsent(sId, saveVideo);
            setState("REFERENCE_VIEW");
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">SESSION ID: {sessionId}</div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary mt-0.5">
            Recording: <span className="text-accent-primary">{currentSignLabel || "HELLO"}</span>
          </h1>
        </div>
        <div className="text-xs font-mono text-text-secondary">
          SIGNER: <strong className="text-text-primary">{signerId}</strong>
        </div>
      </div>

      {uploadError && (
        <UploadRecovery onRetry={() => { setUploadError(false); handleSubmitSample(); }} />
      )}

      {/* Camera Preview */}
      <div className="relative aspect-video w-full bg-surface border border-border rounded-lg overflow-hidden flex items-center justify-center">
        {state === "PREVIEW" && recordedUrl ? (
          <video src={recordedUrl} controls className="w-full h-full object-contain" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-7xl font-extrabold font-mono text-accent-primary animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Recording active badge */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-status-error text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>RECORDING GESTURE</span>
          </div>
        )}
      </div>

      {/* Watch and copy the active model's landmark sequence before recording */}
      {state === "REFERENCE_VIEW" && (
        <div className="p-4 bg-surface rounded-lg border border-border space-y-3">
          <div className="text-xs font-mono uppercase text-text-muted">
            ACTIVE MODEL SIGN — watch it, then copy the sign
          </div>
          {refMedia?.label === currentSignLabel && refMedia.frames.length ? (
            <LandmarkSimulation
              key={`${currentSignLabel}-${refMedia.source}`}
              frames={refMedia.frames}
              pose={refMedia.pose}
              faceMesh={refMedia.face_mesh}
              fps={15}
              title={refMedia.source}
            />
          ) : (
            <div className="aspect-video w-full bg-background border border-border rounded flex items-center justify-center text-xs font-mono text-text-muted">
              No landmark sequence is bundled for this sign in the active model.
            </div>
          )}
          <button
            onClick={() => setState("READY_TO_RECORD")}
            className="w-full py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors"
          >
            I have seen it — start recording
          </button>
        </div>
      )}

      {/* Workflow Controls based on State Machine */}
      {state === "READY_TO_RECORD" && (
        <div className="p-4 bg-surface rounded-lg border border-border flex justify-between items-center">
          <span className="text-xs font-mono text-text-secondary">Position yourself in frame and click Record</span>
          <button
            onClick={triggerRecording}
            className="flex items-center space-x-2 px-5 py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors"
          >
            <Video size={15} />
            <span>Start 3s Countdown</span>
          </button>
        </div>
      )}

      {state === "RECORDING" && (
        <div className="p-4 bg-surface rounded-lg border border-border flex justify-between items-center">
          <span className="text-xs font-mono text-status-error font-semibold">Gesture in progress...</span>
          <button
            onClick={handleStopRecording}
            className="flex items-center space-x-2 px-5 py-2.5 rounded bg-status-error text-white font-mono text-xs uppercase font-bold hover:bg-status-error/90 transition-colors"
          >
            <Square size={15} />
            <span>Finish Gesture</span>
          </button>
        </div>
      )}

      {/* NMM Tagging Step per Section 8 & 9.5 */}
      {state === "NMM_TAGGING" && (
        <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Tag Non-Manual Markers (NMM)</h3>
              <p className="text-xs text-text-secondary">Did you perform facial grammatical markers during this sample?</p>
            </div>
            <button
              onClick={() => setState("READY_TO_RECORD")}
              className="flex items-center space-x-1 text-xs font-mono text-text-secondary hover:text-text-primary"
            >
              <RotateCcw size={13} />
              <span>Retake</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "question", label: "Question (Raised Brows)" },
              { id: "wh_question", label: "WH-Question (Furrowed Brows)" },
              { id: "negation", label: "Negation (Head Shake)" },
              { id: "affirmation", label: "Affirmation (Head Nod)" },
              { id: "emphasis", label: "Emphasis (Intense Gaze)" },
              { id: "head_tilt", label: "Head Tilt" },
            ].map((tag) => (
              <label
                key={tag.id}
                onClick={() => toggleNMMTag(tag.id as any)}
                className={`p-3 rounded border text-xs font-mono cursor-pointer transition-colors ${
                  (nmmTags as any)[tag.id]
                    ? "bg-accent-primary/20 border-accent-primary text-text-primary font-semibold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>{tag.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmitSample}
            className="w-full py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors mt-2"
          >
            Confirm & Upload Sample
          </button>
        </div>
      )}

      {state === "SUBMITTING_VIDEO" && (
        <div className="p-6 bg-surface rounded-lg border border-border text-center text-xs font-mono text-text-secondary">
          Uploading recording & extracting landmarks on server...
        </div>
      )}

      {state === "SUBMITTED" && (
        <div className="p-8 bg-surface rounded-lg border border-border text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-status-approved/20 border border-status-approved flex items-center justify-center text-status-approved">
            <Check size={24} />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Gesture Successfully Ingested</h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Landmark sequence saved to the community dataset and queued for admin verification.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                resetNMMTags();
                clearRecording();
                setUploadError(false);
                setState("READY_TO_RECORD");
              }}
              className="px-4 py-2 rounded bg-accent-primary text-black text-xs font-mono font-semibold"
            >
              Record Another Sample
            </button>
            <button
              onClick={() => router.push("/contribute")}
              className="px-4 py-2 rounded bg-surface-elevated border border-border text-text-primary text-xs font-mono"
            >
              Choose Different Sign
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
