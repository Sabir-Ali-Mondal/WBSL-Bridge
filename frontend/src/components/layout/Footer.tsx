import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface text-text-secondary py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="text-text-primary font-bold tracking-tight text-lg">
            {APP_CONFIG.name}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md">
            West Bengal Sign Language Translation & Computational Research Framework.
            Bridging Deaf communication through landmark-based computer vision, NMM parsing, and native Bengali NLG.
          </p>
          <div className="text-xs font-mono text-text-muted">
            Department of Computer Science & Engineering • Research Prototype
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-mono tracking-wider text-text-primary font-semibold">
            System Modules
          </div>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/sign-to-text" className="hover:text-text-primary transition-colors">Sign → Bengali</Link></li>
            <li><Link href="/text-to-sign" className="hover:text-text-primary transition-colors">Bengali → Sign</Link></li>
            <li><Link href="/contribute" className="hover:text-text-primary transition-colors">Signer Contribution</Link></li>
            <li><Link href="/demo" className="hover:text-text-primary transition-colors">Demo Mode</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-mono tracking-wider text-text-primary font-semibold">
            Research Team
          </div>
          <ul className="space-y-1 text-xs text-text-secondary font-mono">
            <li>Sabir Ali Mondal</li>
            <li>Koushaki Singha</li>
            <li>Monirul Halder</li>
            <li>Firdos Shakih</li>
          </ul>
          <div className="pt-2 text-xs text-text-muted">
            DPDP Act 2023 Compliant • Privacy-First Landmarks
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted font-mono">
        <div>© 2026 WBSL Bridge Project. All rights reserved.</div>
        <div className="mt-2 sm:mt-0 flex space-x-4">
          <span>Dataset: {APP_CONFIG.datasetVersion}</span>
          <span>Engine: {APP_CONFIG.modelVersion}</span>
        </div>
      </div>
    </footer>
  );
}
