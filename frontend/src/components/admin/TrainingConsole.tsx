"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Terminal, Square } from "lucide-react";

interface TrainingConsoleProps {
  onCancel?: () => void;
}

export function TrainingConsole({ onCancel }: TrainingConsoleProps) {
  const [epoch, setEpoch] = useState(24);
  const totalEpochs = 50;
  const [history, setHistory] = useState([
    { epoch: 1, loss: 1.84, valAcc: 42.1 },
    { epoch: 5, loss: 1.12, valAcc: 65.4 },
    { epoch: 10, loss: 0.68, valAcc: 78.2 },
    { epoch: 15, loss: 0.41, valAcc: 83.5 },
    { epoch: 20, loss: 0.28, valAcc: 87.1 },
    { epoch: 24, loss: 0.183, valAcc: 89.8 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEpoch((prev) => {
        if (prev >= totalEpochs) return prev;
        const next = prev + 1;
        const newLoss = Math.max(0.08, +(0.183 - (next - 24) * 0.005 + (Math.random() * 0.01 - 0.005)).toFixed(3));
        const newValAcc = Math.min(96.5, +(89.8 + (next - 24) * 0.35 + (Math.random() * 0.4 - 0.2)).toFixed(1));
        
        setHistory((h) => [...h, { epoch: next, loss: newLoss, valAcc: newValAcc }]);
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const latest = history[history.length - 1];

  return (
    <div className="bg-[#0D0D10] border border-border rounded-lg p-5 font-mono text-xs space-y-4">
      {/* ML Terminal Header per Section 8.7 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center space-x-2.5">
          <Terminal size={15} className="text-accent-primary" />
          <span className="font-semibold text-text-primary tracking-wide">
            TRAINING RUN #048
          </span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary">Dataset: <strong className="text-text-primary">WBSL-v0.8</strong></span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary">Model: <strong className="text-text-primary">LSTM-v1.4</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-status-approved/20 text-status-approved border border-status-approved/30">
            RUNNING
          </span>
          <button
            onClick={onCancel}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated border border-border text-text-secondary hover:text-status-error transition-colors"
          >
            <Square size={11} />
            <span>Cancel Run</span>
          </button>
        </div>
      </div>

      {/* Epoch Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-text-secondary text-[11px]">
          <span>TRAINING PROGRESS</span>
          <span className="text-accent-primary font-bold">Epoch {epoch} / {totalEpochs}</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-accent-primary transition-all duration-500"
            style={{ width: `${(epoch / totalEpochs) * 100}%` }}
          />
        </div>
      </div>

      {/* Raw Metrics Readout per Section 8.7 */}
      <div className="p-3 bg-surface rounded border border-border/60 flex items-center justify-around text-center">
        <div>
          <div className="text-[10px] uppercase text-text-muted">Current Loss</div>
          <div className="text-base font-bold text-accent-secondary mt-0.5">{latest?.loss}</div>
        </div>
        <div className="h-6 w-[1px] bg-border" />
        <div>
          <div className="text-[10px] uppercase text-text-muted">Train Accuracy</div>
          <div className="text-base font-bold text-accent-primary mt-0.5">92.4%</div>
        </div>
        <div className="h-6 w-[1px] bg-border" />
        <div>
          <div className="text-[10px] uppercase text-text-muted">Validation Accuracy</div>
          <div className="text-base font-bold text-text-primary mt-0.5">{latest?.valAcc}%</div>
        </div>
      </div>

      {/* Two Side-by-Side Charts (Loss & Val Accuracy) per Section 8.7 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* Loss Graph */}
        <div className="bg-surface/50 border border-border p-3 rounded">
          <div className="text-[11px] text-text-secondary uppercase mb-2">Loss Convergence</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" stroke="#52525B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525B" domain={[0, 2]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141416", borderColor: "rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#A1A1AA" }}
                />
                <Line type="monotone" dataKey="loss" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Validation Accuracy Graph */}
        <div className="bg-surface/50 border border-border p-3 rounded">
          <div className="text-[11px] text-text-secondary uppercase mb-2">Validation Accuracy (%)</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" stroke="#52525B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525B" domain={[40, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141416", borderColor: "rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#A1A1AA" }}
                />
                <Line type="monotone" dataKey="valAcc" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
