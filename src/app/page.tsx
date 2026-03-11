"use client";

import React from 'react';
import { useBotWebSocket } from '@/hooks/useBotWebSocket';
import { PriceChart } from '@/components/charts/PriceChart';
import { AlertTriangle, Activity, Database, Zap } from 'lucide-react';

export default function Dashboard() {
  const { metrics, lastMetric, isConnected } = useBotWebSocket();

  const handlePanic = async () => {
    if (confirm('Are you sure you want to close all positions?')) {
      try {
        const res = await fetch('http://localhost:8081/api/v1/panic', { method: 'POST' });
        if (res.ok) alert('Panic signal sent!');
      } catch (e) {
        console.error('Failed to send panic signal', e);
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Command Center</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-widest">
              {isConnected ? 'System Online' : 'System Offline'}
            </span>
          </div>
        </div>
        <button 
          onClick={handlePanic}
          className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/50 px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          <AlertTriangle size={18} />
          PANIC SELL
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          label="Total Equity" 
          value={`$${lastMetric?.equity.toLocaleString() || '100,000'}`} 
          icon={<Activity className="text-blue-500" size={20} />} 
        />
        <MetricCard 
          label="BTC/USDT Price" 
          value={`$${lastMetric?.price.toLocaleString() || '70,000'}`} 
          icon={<Zap className="text-yellow-500" size={20} />} 
        />
        <MetricCard 
          label="Active Trades" 
          value="1" 
          icon={<Database className="text-emerald-500" size={20} />} 
        />
        <MetricCard 
          label="Strategy" 
          value="ML_XGBoost" 
          icon={<Activity className="text-purple-500" size={20} />} 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PriceChart 
          data={metrics} 
          dataKey="equity" 
          title="Portfolio Equity" 
          color="#10b981" 
        />
        <PriceChart 
          data={metrics} 
          dataKey="price" 
          title="Live Asset Price" 
          color="#3b82f6" 
        />
      </div>

      {/* Position Table Mock */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">Open Positions</h3>
        <table className="w-full text-left">
          <thead className="text-slate-500 text-sm border-b border-slate-800">
            <tr>
              <th className="pb-4 font-semibold">Symbol</th>
              <th className="pb-4 font-semibold">Side</th>
              <th className="pb-4 font-semibold">Size</th>
              <th className="pb-4 font-semibold">Entry</th>
              <th className="pb-4 font-semibold text-right">PnL</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-800/50">
              <td className="py-4 font-bold">BTC/USDT</td>
              <td className="py-4"><span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs">LONG</span></td>
              <td className="py-4">0.1 BTC</td>
              <td className="py-4">$68,500.00</td>
              <td className="py-4 text-right text-emerald-500 font-bold">+$1,570.41</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
        {icon}
      </div>
      <div>
        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</div>
        <div className="text-xl font-bold text-slate-100">{value}</div>
      </div>
    </div>
  );
}
