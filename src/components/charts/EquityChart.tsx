"use client";

import React from "react";
import { LightweightChart } from "./LightweightChart";

interface EquityChartProps {
  data: { time: string | number; value: number }[];
  title?: string;
  color?: string;
}

export function EquityChart({ data, title, color = "#10b981" }: EquityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Stream Data Available</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-slate-100 text-lg font-black mb-6 tracking-tight flex items-center gap-2 uppercase italic">
          <div className="h-4 w-1 bg-brand-primary rounded-full" />
          {title}
        </h3>
      )}
      <div className="h-[400px] w-full bg-slate-900/30 rounded-[2rem] p-6 border border-white/5">
        <LightweightChart data={data} color={color} />
      </div>
    </div>
  );
}
