"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Beaker, 
  Activity, 
  Terminal,
  ChevronRight,
  Hexagon,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const navItems = [
  { name: "Live Terminal", href: "/", icon: LayoutDashboard },
  { name: "Backtest Lab", href: "/backtest", icon: Beaker },
  { name: "Security", href: "/settings", icon: ShieldCheck },
  { name: "ML Models", href: "#", icon: Terminal, disabled: true },
  { name: "Analytics", href: "#", icon: Activity, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Hexagon size={22} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-tight uppercase italic">AURA QUANT</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Live Engine v2</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.disabled ? "#" : item.href}
              className="block"
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-between px-3 h-11 rounded-xl transition-all",
                  isActive ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  item.disabled && "opacity-40 cursor-not-allowed grayscale"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
                  <span className="font-bold tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-primary" />}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Card className="bg-muted/30 border-border p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            Core Status
          </div>
          <div className="space-y-2">
            <div className="text-[10px] text-muted-foreground flex justify-between items-center font-bold uppercase tracking-wider">
              Latency <span className="text-emerald-500 font-mono italic">14ms</span>
            </div>
            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%] animate-in slide-in-from-left duration-1000" />
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}
