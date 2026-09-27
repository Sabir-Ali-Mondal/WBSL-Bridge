"use client";
import React, { useState } from "react";
import { BarChart3, HelpCircle, ArrowUpRight } from "lucide-react";

export default function AdminEvaluationPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const classes = ["HELLO", "THANK YOU", "WATER", "HELP", "HOW ARE YOU"];

  // Mock confusion matrix values (5x5)
  const matrix = [
    [45, 1, 0, 1, 1],
    [2, 33, 0, 0, 0],
    [0, 0, 51, 1, 0],
    [1, 0, 2, 37, 1],
    [0, 1, 0, 2, 26],
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">BENCHMARK METRICS</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Model Evaluation & Confusion Matrix
        </h1>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Macro F1 Score</div>
          <div className="text-2xl font-bold text-accent-primary mt-1">91.4%</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Precision</div>
          <div className="text-2xl font-bold text-text-primary mt-1">92.8%</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Recall</div>
          <div className="text-2xl font-bold text-text-primary mt-1">90.2%</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">NMM Detection Acc</div>
          <div className="text-2xl font-bold text-accent-secondary mt-1">88.6%</div>
        </div>
      </div>

      {/* Confusion Matrix per Section 9.7 */}
      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
            GESTURE CONFUSION MATRIX (TEST SPLIT: 200 SAMPLES)
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            X: Predicted • Y: True Ground Truth
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-text-muted">TRUE \ PRED</th>
                {classes.map((cls) => (
                  <th key={cls} className="p-2 text-text-secondary">{cls}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rIdx) => (
                <tr key={classes[rIdx]}>
                  <td className="p-2 text-left font-bold text-text-secondary">{classes[rIdx]}</td>
                  {row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    const intensity = isDiagonal ? "bg-accent-primary/20 text-accent-primary font-bold border-accent-primary/40" : val > 0 ? "bg-status-error/10 text-status-error" : "text-text-muted";
                    return (
                      <td
                        key={cIdx}
                        className={`p-3 border border-border/40 ${intensity}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
