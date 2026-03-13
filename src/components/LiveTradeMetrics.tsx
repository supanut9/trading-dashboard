"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Layers
} from "lucide-react";

interface LiveTradeMetricsProps {
  lastMetric: any;
  isConnected: boolean;
  positions?: any[];
}

export function LiveTradeMetrics({ lastMetric, isConnected, positions = [] }: LiveTradeMetricsProps) {
  const [startTime] = useState(Date.now());
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const totalExposure = positions.reduce((acc, pos) => acc + (pos.size * (lastMetric?.price || pos.entry)), 0);
  const totalExposureBtc = positions.reduce((acc, pos) => acc + pos.size, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard 
        label="Portfolio Equity" 
        value={`$${lastMetric?.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '100,000.00'}`} 
        subValue="Live Market Value"
        icon={<TrendingUp className="text-emerald-400" size={20} />}
        pulse={isConnected}
      />
      <MetricCard 
        label="BTC/USDT Price" 
        value={`$${lastMetric?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '70,000.00'}`} 
        subValue="Binance Spot Index"
        icon={<Zap className="text-yellow-400" size={20} />}
        pulse={isConnected}
      />
      <MetricCard 
        label="Risk Exposure" 
        value={`${totalExposureBtc.toFixed(4)} BTC`} 
        subValue={`$${totalExposure.toLocaleString(undefined, { maximumFractionDigits: 0 })} Value`}
        icon={<ShieldCheck className="text-blue-400" size={20} />}
      />
      <MetricCard 
        label="Bot Runtime" 
        value={uptime} 
        subValue="Uptime Session"
        icon={<Clock className="text-purple-400" size={20} />}
      />
    </div>
  );
}

function MetricCard({ label, value, subValue, icon, pulse }: { label: string; value: string; subValue: string; icon: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-lg transition-all hover:border-slate-700">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
          {pulse && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
          {label}
        </div>
        <div className="text-2xl font-black text-slate-100 tracking-tighter mb-1">{value}</div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{subValue}</div>
      </div>
    </div>
  );
}
