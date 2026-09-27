"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { datasetService } from "@/services/dataset";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Video, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function SignDetailPage() {
  const params = useParams();
  const signId = params.signId as string;

  const { data: sign, isLoading } = useQuery({
    queryKey: ["sign-detail", signId],
    queryFn: () => datasetService.getSignById(signId),
  });

  if (isLoading || !sign) {
    return (
      <PageContainer className="py-12 text-center text-xs font-mono text-text-muted">
        Loading sign details...
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 max-w-4xl">
      <Link
        href="/dataset"
        className="inline-flex items-center space-x-1.5 text-xs font-mono text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        <span>Back to Signs Catalog</span>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Approved Samples</div>
          <div className="text-xl font-bold text-status-approved mt-1">{sign.approved_samples}</div>
        </div>
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
        <LandmarkSimulation showHands showFace showPose fps={30} />
      </div>
    </PageContainer>
  );
}
