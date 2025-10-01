"use client";
import React from "react";
import type { FlaskApiResponse } from "@/lib/types";

const options = [
  { label: "Battery Analytics", value: "analytics" },
  { label: "RUL Prediction", value: "rul" },
  { label: "Reuse Modeling", value: "reuse" },
];

interface AnalyticsHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  analyticsData: FlaskApiResponse | null;
}

export default function AnalyticsHeader({
  activeTab,
  setActiveTab,
  analyticsData,
}: AnalyticsHeaderProps) {
  return (
    <div>
      {/* Header Navigation */}
      <div className="flex justify-center items-center gap-4 py-6">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveTab(opt.value)}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-300
              backdrop-blur-sm border shadow-lg
              ${
                activeTab === opt.value
                  ? "bg-gradient-to-r from-[#10a37f] to-[#0ea46f] text-white border-[#10a37f] shadow-lg shadow-[#10a37f]/25 transform scale-105"
                  : "bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500/60 hover:text-white hover:scale-102"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
