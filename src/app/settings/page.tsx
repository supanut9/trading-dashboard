"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Save, 
  RefreshCcw, 
  AlertTriangle,
  Lock,
  Unlock,
  ShieldAlert,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchRiskSettings, updateRiskSettings, RiskSettings } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<RiskSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchRiskSettings();
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    const success = await updateRiskSettings(settings);
    if (success) {
      setMessage({ type: 'success', text: 'Risk configuration updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Failed to update configuration' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-primary" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching Core Config</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Guardian Protocol / Security Layer</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-foreground">Risk <span className="text-primary">Shield</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          {message && (
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-right-4 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}>
              {message.text}
            </div>
          )}
          <Button 
            onClick={loadSettings}
            variant="outline" 
            className="h-12 w-12 rounded-2xl border-border bg-secondary/30 hover:bg-secondary/50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. Execution Constraints */}
          <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Lock size={80} />
            </div>
            <CardHeader className="p-8 border-b border-border bg-secondary/20">
              <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-3 italic text-foreground">
                <ShieldCheck size={20} className="text-primary" />
                Execution Limits
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Hard caps on order magnitude</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                  Max Position Size <span>(BTC)</span>
                </label>
                <input 
                  type="number" 
                  step="0.0001"
                  className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:border-primary/50 transition-all tabular-nums text-foreground"
                  value={settings?.max_position_size}
                  onChange={(e) => setSettings(prev => prev ? {...prev, max_position_size: parseFloat(e.target.value)} : null)}
                />
                <p className="text-[9px] text-muted-foreground/50 font-bold leading-relaxed">
                  The absolute maximum units of base currency allowed in a single position across all logic sub-routines.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                  Risk Per Trade <span>(%)</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:border-primary/50 transition-all tabular-nums text-foreground"
                    value={(settings?.max_risk_per_trade || 0) * 100}
                    onChange={(e) => setSettings(prev => prev ? {...prev, max_risk_per_trade: parseFloat(e.target.value) / 100} : null)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-black">%</span>
                </div>
                <p className="text-[9px] text-muted-foreground/50 font-bold leading-relaxed">
                  Percentage of total equity risked based on stop-loss distance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Circuit Breakers */}
          <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <ShieldAlert size={80} />
            </div>
            <CardHeader className="p-8 border-b border-border bg-secondary/20">
              <CardTitle className="text-lg font-black tracking-tight uppercase flex items-center gap-3 italic text-foreground">
                <AlertTriangle size={20} className="text-orange-500" />
                Circuit Breakers
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Automated kill-switch triggers</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                  Daily Loss Limit <span>(%)</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:border-primary/50 transition-all tabular-nums text-foreground"
                    value={(settings?.daily_loss_limit || 0) * 100}
                    onChange={(e) => setSettings(prev => prev ? {...prev, daily_loss_limit: parseFloat(e.target.value) / 100} : null)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-black">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex justify-between">
                  Max Drawdown (ATH) <span>(%)</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-secondary/50 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:border-primary/50 transition-all tabular-nums text-foreground"
                    value={(settings?.max_drawdown || 0) * 100}
                    onChange={(e) => setSettings(prev => prev ? {...prev, max_drawdown: parseFloat(e.target.value) / 100} : null)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 font-black">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Global Kill Switch State */}
        <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardContent className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center transition-all ${
                settings?.is_halted ? 'bg-destructive/20 text-destructive border-2 border-destructive/30' : 'bg-emerald-500/20 text-emerald-500 border-2 border-emerald-500/30'
              }`}>
                {settings?.is_halted ? <Lock size={32} /> : <Unlock size={32} />}
              </div>
              <div>
                <h3 className="text-xl font-black italic tracking-tight uppercase text-foreground">Engine Status: <span className={settings?.is_halted ? 'text-destructive' : 'text-emerald-500'}>
                  {settings?.is_halted ? 'HALTED' : 'OPERATIONAL'}
                </span></h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Manual override for all trade execution</p>
              </div>
            </div>
            <Button 
              type="button"
              variant={settings?.is_halted ? "secondary" : "destructive"}
              onClick={() => setSettings(prev => prev ? {...prev, is_halted: !prev.is_halted} : null)}
              className="h-14 px-8 rounded-2xl font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all"
            >
              {settings?.is_halted ? 'RESUME CORE' : 'FORCE HALT'}
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="h-16 px-12 rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? <RefreshCcw className="animate-spin" size={20} /> : <Save size={20} />}
            Commit Configuration
          </Button>
        </div>
      </form>

      <div className="bg-secondary/20 p-6 rounded-2xl border border-border flex gap-4">
        <Info className="text-primary shrink-0" size={20} />
        <p className="text-[10px] text-muted-foreground/80 font-medium leading-relaxed">
          Security parameters are enforced in the <span className="text-foreground font-black">trading-bot</span> core before any order is dispatched to the exchange. Changes are persistent across sessions but may be overridden by environment variables on system restart.
        </p>
      </div>
    </div>
  );
}
