"use client";

import React, { useState, useEffect } from 'react';
import { useBotWebSocket } from '@/hooks/useBotWebSocket';
import { PriceChart } from '@/components/charts/PriceChart';
import { LiveTradeMetrics } from '@/components/LiveTradeMetrics';
import { TradeHistory } from '@/components/TradeHistory';
import { 
  ShieldAlert, 
  ArrowUpRight, 
  Network,
  Cpu,
  Globe,
  Lock,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPositions, fetchTrades, panicBot, Position, Trade } from '@/lib/api';

export default function Dashboard() {
  const { metrics, lastMetric, isConnected } = useBotWebSocket();
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const posData = await fetchPositions();
      setPositions(posData);
      const tradeData = await fetchTrades();
      setTrades(tradeData);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePanic = async () => {
    if (confirm('Are you sure you want to close all positions?')) {
      const success = await panicBot();
      if (success) alert('Panic signal sent!');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Top Navigation / Status Area */}
      <header className="flex justify-between items-end">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe size={14} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Market Node / Tokyo-01</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic">LIVE <span className="text-primary">TERMINAL</span></h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Execution Mode</span>
            <div className={`flex items-center gap-2 ${lastMetric?.bot_mode === 'live' ? 'text-rose-500' : 'text-emerald-500'} font-mono text-xs font-black uppercase italic`}>
              <Activity size={12} />
              {lastMetric?.bot_mode || 'PAPER'}_TRADING
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Secure</span>
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold">
              <Lock size={12} />
              ENCRYPTED_SSL
            </div>
          </div>
          <Button 
            variant="destructive"
            onClick={handlePanic}
            className="h-12 px-8 rounded-2xl font-black text-xs shadow-lg shadow-destructive/20 uppercase italic tracking-widest transition-all hover:scale-105 active:scale-95"
          >
            <ShieldAlert size={18} className="mr-2" />
            Kill Switch
          </Button>
        </div>
      </header>

      {/* Main Stats Layer */}
      <LiveTradeMetrics lastMetric={lastMetric} isConnected={isConnected} positions={positions} />

      {/* Primary Data Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/50 border-border rounded-[2.5rem] p-2 overflow-hidden shadow-2xl relative">
          <CardHeader className="px-8 pt-8 pb-0 flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Portfolio Velocity</p>
              <CardTitle className="text-2xl font-black tracking-tighter italic uppercase">Equity Stream</CardTitle>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Activity size={20} />
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <PriceChart data={metrics} dataKey="equity" title="" color="#10b981" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border rounded-[2.5rem] p-2 overflow-hidden shadow-2xl relative">
          <CardHeader className="px-8 pt-8 pb-0 flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Market Pulse</p>
              <CardTitle className="text-2xl font-black tracking-tighter italic uppercase">BTC Price Live</CardTitle>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Zap size={20} />
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <PriceChart data={metrics} dataKey="price" title="" color="#3b82f6" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Execution Layer (Table moved here) */}
          <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl h-full">
            <CardHeader className="px-8 py-6 border-b border-border flex flex-row items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-3 space-y-0">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Network size={18} className="text-primary" />
                </div>
                <CardTitle className="font-black tracking-tight uppercase text-sm italic">Active Allocations</CardTitle>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest bg-background/50 px-3 py-1 rounded-full border border-border">POOLED_LIQUIDITY_V3</div>
            </CardHeader>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/10">
                    <th className="px-8 py-5 border-b border-border">Asset Core</th>
                    <th className="px-8 py-5 border-b border-border">Execution</th>
                    <th className="px-8 py-5 border-b border-border">Magnitude</th>
                    <th className="px-8 py-5 border-b border-border text-right">Yield</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isConnected && positions.length > 0 ? (
                    positions.map((pos) => {
                      const pnl = lastMetric ? (lastMetric.price - pos.entry) * pos.size : 0;
                      const pnlPct = (pnl / (pos.entry * pos.size)) * 100;
                      return (
                        <tr key={pos.symbol} className="group border-b border-border/50 hover:bg-secondary/20 transition-all cursor-pointer">
                          <td className="px-8 py-7">
                            <div className="flex items-center gap-4">
                              <div className="h-11 w-11 bg-gradient-to-br from-primary/30 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center font-black text-sm text-primary shadow-inner">₿</div>
                              <span className="font-black text-foreground text-xl tracking-tighter">{pos.symbol}</span>
                            </div>
                          </td>
                          <td className="px-8 py-7">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${pos.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} font-black text-[10px] uppercase tracking-widest border shadow-sm`}>
                              <ArrowUpRight size={14} className={pos.side === 'SELL' ? 'rotate-90' : ''} />
                              {pos.side === 'BUY' ? 'Strategic Long' : 'Strategic Short'}
                            </div>
                          </td>
                          <td className="px-8 py-7 font-mono text-slate-300 font-bold text-lg">{pos.size.toFixed(4)}</td>
                          <td className="px-8 py-7 text-right">
                            <div className="flex flex-col items-end">
                              <span className={`${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-black text-2xl tracking-tighter`}>
                                {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className={`text-[10px] ${pnl >= 0 ? 'text-emerald-500/50' : 'text-rose-500/50'} font-black uppercase tracking-widest`}>
                                {pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}% Net
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs opacity-50">
                        {isConnected ? 'No Active Positions' : 'Reconnecting...'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card className="bg-card/50 border-border rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Strategy Context</h3>
              <div className="p-2 bg-secondary rounded-lg">
                <Cpu size={18} className="text-primary" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Active Logic</div>
                <div className="text-xl font-black italic tracking-tight text-foreground">MULTIVARIATE_ALPHA_V2</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Compute Load</div>
                  <div className="text-lg font-black italic tracking-tight text-primary">4.2%</div>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[42%] animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <Button variant="ghost" className="w-full justify-between h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-bold uppercase text-[10px] tracking-widest">
              System Diagnostics
              <ArrowUpRight size={14} />
            </Button>
          </div>
        </Card>
      </div>

      <TradeHistory trades={trades} />
    </div>
  );
}
