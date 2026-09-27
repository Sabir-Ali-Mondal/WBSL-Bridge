import React from "react";
export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">SYSTEM SETTINGS</div>
      <h1 className="text-2xl font-bold text-text-primary">System Settings</h1>
      <div className="p-6 bg-surface border border-border rounded-lg space-y-3 font-mono text-xs">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">API PORT</span>
          <span className="text-text-primary">8000</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">LLM ENDPOINT</span>
          <span className="text-text-primary">OpenAI-compatible (env-driven)</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">TTS ENGINE</span>
          <span className="text-text-primary">edge-tts → BanglaTTS fallback</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">MODEL</span>
          <span className="text-text-primary">sign_mlp.onnx (35 classes)</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-text-muted">PYTHON</span>
          <span className="text-text-primary">3.11 · mediapipe 0.10.14</span>
        </div>
      </div>
    </div>
  );
}