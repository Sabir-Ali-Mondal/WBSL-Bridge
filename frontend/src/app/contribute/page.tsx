"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { contributionService } from "@/services/contributions";
import { useRecordingStore } from "@/store/recording-store";
import { Search, ArrowRight, Video } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface NeedsDataSign {
  id: string;
  label: string;
  bengali: string;
  current: number;
  target: number;
}

export default function ContributePage() {
  const router = useRouter();
  const { setSession, selectSign } = useRecordingStore();
  const [search, setSearch] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [needsData, setNeedsData] = useState<NeedsDataSign[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/contributions/needs-data`)
      .then((res) => setNeedsData(res.data.items))
      .catch(() => setNeedsData([]));
  }, []);

  const filtered = search
    ? needsData.filter((s) =>
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.bengali.includes(search)
      )
    : needsData;

  const handleStartSession = async (signId: string, label: string) => {
    setIsStarting(true);
    try {
      const sess = await contributionService.createSession("signer_temp");
      setSession(sess.session_id);
      selectSign(signId, label);
      router.push(`/contribute/session/${sess.session_id}`);
    } catch {
      toast.error("Failed to initiate contribution session");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <PageContainer className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-status-pending">
          <span className="w-2 h-2 rounded-full bg-status-pending" />
          <span>COMMUNITY KINEMATIC DATA INGESTION</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Contribute to WBSL
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Help improve AI recognition accuracy for West Bengal Sign Language.
          Record authentic gestures from your district to diversify the open research dataset.
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a specific sign to contribute..."
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">
            PRIORITY: NEEDS MORE DATA (LOWEST SAMPLE COUNTS)
          </span>
          <span className="text-xs font-mono text-status-pending">
            TARGET: 50 SAMPLES / SIGN
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-text-muted">
            No signs found matching your search.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent-primary/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-text-primary">{item.label}</span>
                    <span className="font-bengali text-sm text-text-secondary">{item.bengali}</span>
                  </div>
                  <div className="text-xs font-mono text-text-muted">
                    Samples recorded: <strong className="text-accent-primary">{item.current}</strong> / {item.target} target
                  </div>
                </div>
                <button
                  disabled={isStarting}
                  onClick={() => handleStartSession(item.id, item.label)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded bg-accent-primary text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-primary/90 transition-colors shrink-0 disabled:opacity-50"
                >
                  <Video size={14} />
                  <span>Record This Sign</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
