"use client";
import React from "react";
import { TrainingConsole } from "@/components/admin/TrainingConsole";
import { toast } from "sonner";

export default function AdminTrainingPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-accent-secondary">EXPERIMENT ORCHESTRATION</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          ML Model Training & Checkpoint Console
        </h1>
      </div>

      <TrainingConsole
        onCancel={() => toast.info("Training interrupt signal sent to worker")}
      />
    </div>
  );
}
