"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { datasetService } from "@/services/dataset";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Video, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = "http://localhost:8200";

export default function AdminSignDetailPage() {
  const params = useParams();
  const signId = params.signId as string;

  const { data: sign, isLoading, isError } = useQuery({
    queryKey: ["sign-detail", signId],
    queryFn: () => datasetService.getSignById(signId),
  });

  // Real extracted landmark sequence for this sign (no synthetic fallback).
  // A 258-dim run also returns `pose`, which the canvas draws as the violet
  // body layer; a 126-dim recording leaves it undefined.
  const { data: sim } = useQuery({
    queryKey: ["sim-frames", sign?.label],
    queryFn: async () =>
      (await axios.get(`${API_BASE}/api/simulation/frames`, { params: { label: sign!.label } })).data,
    enabled: !!sign,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs font-mono text-text-muted">
        Loading sign details...
      </div>
    );
  }

  if (isError || !sign) {
    return (
      <div className="py-12 text-center text-sm text-status-error">
        Could not load this sign. Check the backend connection or return to the dataset explorer.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/dataset"
        className="inline-flex items-center space-x-1.5 text-xs font-mono text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        <span>Back to Dataset Explorer</span>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-accent-primary">WBSL SIGN LEXICON</div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-1">
            {sign.label}
          </h1>
          <div className="bengali-text text-xl text-text-secondary mt-1">
            {sign.bengali_meaning}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/contribute`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90"
          >
            <Video size={14} />
            <span>Contribute Sample</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Category</div>
          <div className="text-xl font-bold text-text-primary mt-1">{sign.category}</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Language Dialect</div>
          <div className="text-xl font-bold text-accent-secondary mt-1">{sign.language}</div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="text-xs font-mono uppercase text-text-muted">
          Canonical Landmark Coordinate Reference
        </div>
        <LandmarkSimulation
          frames={sim?.frames}
          pose={sim?.pose}
          faceMesh={sim?.face_mesh}
          faceMeshConnections={sim?.face_mesh_connections}
          faceMeshError={sim?.face_mesh_error}
          fps={15}
          title={sim?.source}
        />
      </div>
    </div>
  );
}