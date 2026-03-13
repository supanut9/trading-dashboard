"use client";

import React, { useState, useEffect } from "react";
import { BacktestResults } from "@/components/BacktestResults";
import { 
  Play, 
  Settings2, 
  Loader2, 
  ArrowLeft, 
  AlertCircle, 
  LineChart, 
  Database, 
  FlaskConical,
  Zap,
  Clock,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BacktestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [apiOnline, setApiOnline] = useState(true);
  const [formData, setFormData] = useState({
    symbol: "BTC/USDT",
    timeframe: "1h",
    strategy: "sma",
    days: 30,
    initial_capital: 10000,
  });

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch("http://localhost:8005/api/v1/backtest", { method: "OPTIONS" });
        setApiOnline(true);
      } catch (e) {
        setApiOnline(false);
      }
    };
    checkApi();
  }, []);

  const handleRunBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch("http://localhost:8005/api/v1/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Backtest failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error running backtest. Make sure the Python API is running on port 8005.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* 1. Header Navigation */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FlaskConical size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantitative / Alpha Simulation</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">Backtest <span className="text-primary">Lab</span></h1>
          </div>
        </div>
        
        {!apiOnline && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest animate-pulse">
            <AlertCircle size={14} />
            Quant Engine Offline
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* 2. Configuration Panel */}
        <aside className="xl:col-span-3">
          <Card className="bg-card/50 border-border rounded-[2.5rem] p-4 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Settings2 size={80} />
            </div>
            
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-2 italic">
                <Settings2 size={18} className="text-primary" />
                Parameters
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Logic & Constraints</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-6">
              <form onSubmit={handleRunBacktest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Database size={12}/> Market Asset
                  </label>
                  <select 
                    className="w-full bg-secondary/50 border border-border rounded-xl p-3.5 text-xs font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                    value={formData.symbol}
                    onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                  >
                    <option value="BTC/USDT">Bitcoin (BTC/USDT)</option>
                    <option value="ETH/USDT">Ethereum (ETH/USDT)</option>
                    <option value="SOL/USDT">Solana (SOL/USDT)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Zap size={12}/> Execution Logic
                  </label>
                  <select 
                    className="w-full bg-secondary/50 border border-border rounded-xl p-3.5 text-xs font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                    value={formData.strategy}
                    onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                  >
                    <option value="sma">SMA Crossover (Trend)</option>
                    <option value="rsi">RSI Reversion (Mean)</option>
                    <option value="macd">MACD Crossover (Trend)</option>
                    <option value="breakout">Price Breakout (Vol)</option>
                    <option value="bollinger">Bollinger Bands (Vol)</option>
                    <option value="rsi,macd">Ensemble (RSI + MACD)</option>
                    <option value="ml">ML Model (XGBoost)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Timeframe</label>
                    <select 
                      className="w-full bg-secondary/50 border border-border rounded-xl p-3.5 text-xs font-bold outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      value={formData.timeframe}
                      onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                    >
                      <option value="15m">15m</option>
                      <option value="1h">1h</option>
                      <option value="4h">4h</option>
                      <option value="1d">1d</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Days</label>
                    <input 
                      type="number"
                      className="w-full bg-secondary/50 border border-border rounded-xl p-3.5 text-xs font-bold outline-none focus:border-primary/50 transition-all"
                      value={formData.days}
                      onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Init Capital (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 font-black text-xs">$</span>
                    <input 
                      type="number"
                      className="w-full bg-secondary/50 border border-border rounded-xl p-3.5 pl-8 text-xs font-black outline-none focus:border-primary/50 transition-all"
                      value={formData.initial_capital}
                      onChange={(e) => setFormData({...formData, initial_capital: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading || !apiOnline}
                  className="w-full h-14 bg-primary text-primary-foreground font-black rounded-2xl flex items-center justify-center gap-3 transition-all mt-4 shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-20 uppercase italic tracking-widest"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
                  {loading ? 'SIMULATING...' : 'Start Run'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6 px-4 py-6 bg-secondary/20 rounded-2xl border border-border/50">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Model Integrity</h4>
            <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
              Simulation logic uses real historical spot data with 0.1% slippage factor included for realistic alpha decay modeling.
            </p>
          </div>
        </aside>

        {/* 3. Main Stage (Results) */}
        <div className="xl:col-span-9">
          {results ? (
            <BacktestResults results={results} params={formData} />
          ) : (
            <Card className="bg-card/30 border-2 border-border border-dashed rounded-[3.5rem] h-[750px] flex flex-col items-center justify-center text-center p-12 relative overflow-hidden shadow-inner">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
              
              <div className="relative z-10 space-y-8 max-w-lg">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                  <div className="bg-secondary/80 p-10 rounded-[2.5rem] border border-border shadow-2xl relative">
                    <LineChart size={64} className="text-muted-foreground/40 animate-pulse" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-foreground text-3xl font-black tracking-tight italic uppercase mb-4">Awaiting Uplink</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-sm mx-auto">
                    The Quant Engine is primed for execution. Configure your asset pair and strategy logic to initiate a high-fidelity market simulation.
                  </p>
                </div>
                <div className="flex gap-4 justify-center pt-4 opacity-20">
                  <div className="h-1 w-12 rounded-full bg-primary animate-pulse" />
                  <div className="h-1 w-12 rounded-full bg-primary animate-pulse delay-150" />
                  <div className="h-1 w-12 rounded-full bg-primary animate-pulse delay-300" />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
