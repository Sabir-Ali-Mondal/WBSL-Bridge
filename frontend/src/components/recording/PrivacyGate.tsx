"use client";
import React, { useState } from "react";
import { ShieldCheck, Info } from "lucide-react";

interface PrivacyGateProps {
  onConsent: (signerId: string, recordVideo: boolean) => void;
}

export function PrivacyGate({ onConsent }: PrivacyGateProps) {
  const [signerId, setSignerId] = useState("");
  const [recordVideo, setRecordVideo] = useState(false);
  const [checks, setChecks] = useState({
    consentRecord: false,
    consentUse: false,
    understandDeletion: false,
    declareOwnership: false,
  });

  const allChecked =
    checks.consentRecord &&
    checks.consentUse &&
    checks.understandDeletion &&
    checks.declareOwnership &&
    signerId.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allChecked) {
      onConsent(signerId.trim(), recordVideo);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface border border-border p-6 sm:p-8 rounded-lg">
      <div className="flex items-center space-x-3 pb-4 border-b border-border">
        <ShieldCheck className="text-accent-primary" size={24} />
        <div>
          <h2 className="text-lg font-semibold text-text-primary tracking-tight">
            Signer Consent & Data Privacy Gate
          </h2>
          <div className="text-xs font-mono text-text-muted">
            COMPLIANCE: Digital Personal Data Protection (DPDP) Act 2023
          </div>
        </div>
      </div>

      <div className="my-5 p-4 rounded bg-surface-elevated border border-border/80 text-xs text-text-secondary leading-relaxed space-y-2">
        <div className="flex items-center space-x-2 text-text-primary font-medium">
          <Info size={14} className="text-accent-secondary" />
          <span>How WBSL Bridge processes your gesture data</span>
        </div>
        <p>
          By default, WBSL Bridge records <strong>coordinate landmarks only</strong> (21 hand joints, 33 body pose points, and facial mesh contours). No raw facial recordings are stored on public research servers unless you explicitly opt in below.
        </p>
        <p>
          You hold the perpetual right under DPDP guidelines to request deletion of any contributed sample associated with your unique Signer ID.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
            Signer ID / Pseudonym *
          </label>
          <input
            type="text"
            required
            value={signerId}
            onChange={(e) => setSignerId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
            placeholder="e.g. signer_kolkata_04"
            className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
          />
          <div className="text-[11px] text-text-muted mt-1 font-mono">
            Alphanumeric identifier to retain deletion authority.
          </div>
        </div>

        {/* 4 Mandatory Checkboxes per Section 8.3 */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.consentRecord}
              onChange={(e) => setChecks({ ...checks, consentRecord: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I consent to recording my gestures using computer vision landmark tracking.</span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.consentUse}
              onChange={(e) => setChecks({ ...checks, consentUse: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I consent to using anonymized landmark coordinate vectors for training the WBSL AI model.</span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.understandDeletion}
              onChange={(e) => setChecks({ ...checks, understandDeletion: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I understand I can request sample deletion at any time using my Signer ID.</span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.declareOwnership}
              onChange={(e) => setChecks({ ...checks, declareOwnership: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I declare that I am demonstrating authentic West Bengal Sign Language (WBSL) gestures.</span>
          </label>
        </div>

        {/* Radio Option: Landmarks vs Video per Section 8.3 */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
            Data Storage Preference
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded border flex items-start space-x-2.5 cursor-pointer text-xs ${
                !recordVideo
                  ? "bg-accent-primary/10 border-accent-primary text-text-primary"
                  : "bg-surface border-border text-text-secondary"
              }`}
            >
              <input
                type="radio"
                name="storageMode"
                checked={!recordVideo}
                onChange={() => setRecordVideo(false)}
                className="mt-0.5 accent-accent-primary"
              />
              <div>
                <strong className="block font-semibold">Landmarks Only</strong>
                <span className="text-[11px] text-text-muted">Recommended for privacy. Only coordinate data is transmitted.</span>
              </div>
            </label>

            <label
              className={`p-3 rounded border flex items-start space-x-2.5 cursor-pointer text-xs ${
                recordVideo
                  ? "bg-accent-secondary/10 border-accent-secondary text-text-primary"
                  : "bg-surface border-border text-text-secondary"
              }`}
            >
              <input
                type="radio"
                name="storageMode"
                checked={recordVideo}
                onChange={() => setRecordVideo(true)}
                className="mt-0.5 accent-accent-secondary"
              />
              <div>
                <strong className="block font-semibold">Save Video Also</strong>
                <span className="text-[11px] text-text-muted">Assists human researchers in verifying ambiguous handshapes.</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!allChecked}
          className={`w-full py-2.5 px-4 rounded text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
            allChecked
              ? "bg-accent-primary text-black hover:bg-accent-primary/90"
              : "bg-surface-elevated text-text-muted cursor-not-allowed border border-border"
          }`}
        >
          Authorize Session & Begin Recording
        </button>
      </form>
    </div>
  );
}
