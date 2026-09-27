"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { setAuthToken } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setAuthToken(apiKey.trim());
    toast.success("Researcher credentials authorized");
    router.push("/admin");
  };

  return (
    <PageContainer className="py-20 max-w-md mx-auto">
      <div className="bg-surface border border-border p-8 rounded-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-elevated border border-border flex items-center justify-center text-accent-primary">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Researcher Authentication
          </h1>
          <p className="text-xs text-text-secondary">
            Access internal verification controls and ML training consoles
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
              Researcher Bearer Token
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter authorization key..."
              className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded bg-accent-primary text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-primary/90 transition-colors"
          >
            Authenticate Session
          </button>
        </form>

        <div className="text-center text-[11px] font-mono text-text-muted">
          For demo purposes, any token string provides admin workspace access.
        </div>
      </div>
    </PageContainer>
  );
}
