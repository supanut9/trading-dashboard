"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  Target, 
  Scale, 
  ArrowUpRight,
  ArrowDownRight,
  Info,
  History,
  Coins
} from "lucide-react";
import { EquityChart } from "./charts/EquityChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Trade {
  timestamp: string;
  symbol: string;
  side: string;
  price: number;
  size: number;
  commission: number;
  value: number;
}

interface BacktestResultsProps {
  results: {
    total_return: number;
    max_drawdown: number;
    sharpe_ratio: number;
    volatility: number;
    final_equity: number;
    peak_equity: number;
    equity_curve: any[];
    trades: Trade[];
  };
  params: any;
}

export function BacktestResults({ results, params }: BacktestResultsProps) {
  const totalProfit = results.final_equity - params.initial_capital;
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultCard 
          label="Net Alpha" 
          value={`$${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${(results.total_return * 100).toFixed(2)}% ROI`}
          icon={<Target className="text-primary" size={20} />}
          trend={results.total_return >= 0 ? "up" : "down"}
        />
        <ResultCard 
          label="Risk/Reward" 
          value={results.sharpe_ratio.toFixed(2)}
          subValue="Sharpe Ratio"
          icon={<Scale className="text-blue-400" size={20} />}
        />
        <ResultCard 
          label="Max Pressure" 
          value={`${(results.max_drawdown * 100).toFixed(2)}%`}
          subValue="Drawdown Limit"
          icon={<ShieldAlert className="text-destructive" size={20} />}
          trend="down"
        />
        <ResultCard 
          label="Executions" 
          value={results.trades.length.toString()} 
          subValue="Closed Trades"
          icon={<Activity className="text-emerald-400" size={20} />}
        />
      </div>

      {/* 2. Main Performance Chart */}
      <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-border bg-secondary/20 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-3 italic">
              <TrendingUp size={20} className="text-primary" />
              Equity Trajectory
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Portfolio expansion over time-series data</CardDescription>
          </div>
          <div className="flex gap-3">
            <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 tracking-widest uppercase italic">
              {params.strategy}
            </div>
            <div className="bg-background/50 text-muted-foreground text-[10px] font-black px-3 py-1 rounded-full border border-border tracking-widest uppercase">
              {params.symbol}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <EquityChart data={results.equity_curve} />
        </CardContent>
      </Card>

      {/* 3. Trade History Table */}
      <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-border bg-secondary/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-3 italic">
                <History size={20} className="text-primary" />
                Raw Execution Log
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Sequential order fill matrix</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-background/50 px-4 py-2 rounded-xl border border-border">
              Total Fills: <span className="text-primary font-mono ml-1">{results.trades.length}</span>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/10">
                <th className="px-8 py-5 border-b border-border">Timestamp</th>
                <th className="px-8 py-5 border-b border-border">Action</th>
                <th className="px-8 py-5 border-b border-border">Unit Price</th>
                <th className="px-8 py-5 border-b border-border">Magnitude</th>
                <th className="px-8 py-5 border-b border-border text-right">Value (USD)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {results.trades.length > 0 ? (
                results.trades.map((trade, i) => (
                  <tr key={i} className="group border-b border-border/50 hover:bg-secondary/20 transition-all cursor-pointer">
                    <td className="px-8 py-6 text-muted-foreground/80 font-mono text-[11px] font-bold italic">
                      {trade.timestamp ? new Date(trade.timestamp).toLocaleString() : 'UNDEFINED'}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        trade.side === 'BUY' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      }`}>
                        {trade.side === 'BUY' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-foreground font-black tracking-tight tabular-nums">
                      ${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-6 text-muted-foreground font-bold tabular-nums">
                      {trade.size.toFixed(4)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-foreground font-black text-lg tracking-tighter tabular-nums">${trade.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">Fee: ${trade.commission.toFixed(2)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                      <Coins size={48} className="text-muted-foreground" />
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Zero Market Activity Logged</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ResultCard({ label, value, subValue, icon, trend }: { label: string; value: string; subValue: string; icon: React.ReactNode; trend?: "up" | "down" }) {
  return (
    <Card className="bg-card/50 border-border p-6 rounded-[2rem] relative overflow-hidden group shadow-xl transition-all hover:border-primary/30">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          {label}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-black text-foreground tracking-tighter italic uppercase">{value}</div>
          <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg inline-block w-fit uppercase tracking-widest ${
            trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 
            trend === 'down' ? 'text-destructive bg-destructive/10' : 
            'text-muted-foreground bg-secondary'
          }`}>
            {subValue}
          </div>
        </div>
      </div>
    </Card>
  );
}
