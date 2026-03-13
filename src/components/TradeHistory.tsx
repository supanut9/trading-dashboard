"use client";

import React from 'react';
import { Trade } from '@/lib/api';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <Card className="bg-card/50 border-border rounded-[2.5rem] overflow-hidden shadow-2xl mt-8">
      <CardHeader className="px-8 py-6 border-b border-border flex flex-row items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-3 space-y-0">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <History size={18} className="text-primary" />
          </div>
          <CardTitle className="font-black tracking-tight uppercase text-sm italic">Trade Execution History</CardTitle>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest bg-background/50 px-3 py-1 rounded-full border border-border flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          LEDGER_ACTIVE
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] bg-secondary/10">
              <th className="px-8 py-5 border-b border-border">Timestamp</th>
              <th className="px-8 py-5 border-b border-border">Asset Core</th>
              <th className="px-8 py-5 border-b border-border">Execution</th>
              <th className="px-8 py-5 border-b border-border">Price Matrix</th>
              <th className="px-8 py-5 border-b border-border text-right">Magnitude</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {trades && trades.length > 0 ? (
              trades.map((trade) => (
                <tr key={trade.id} className="group border-b border-border/50 hover:bg-secondary/20 transition-all cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px] font-bold">
                      <Clock size={12} className="opacity-50" />
                      {trade.timestamp ? new Date(trade.timestamp).toLocaleString(undefined, { 
                        month: 'short', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      }) : 'PENDING...'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-foreground text-base tracking-tighter">{trade.symbol}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${trade.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} font-black text-[9px] uppercase tracking-widest border shadow-sm`}>
                      {trade.side === 'BUY' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {trade.side === 'BUY' ? 'LIMIT_BUY' : 'LIMIT_SELL'}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-slate-300 font-bold text-sm">
                    ${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-muted-foreground font-bold text-sm">
                    {trade.size.toFixed(4)} <span className="text-[10px] opacity-50 ml-1">BTC</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-16 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-40">
                  No execution history detected in local ledger
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
