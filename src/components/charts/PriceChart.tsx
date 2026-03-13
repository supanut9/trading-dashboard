"use client";

import React from 'react';
import { LightweightChart } from './LightweightChart';
import { BotMetric } from '@/hooks/useBotWebSocket';

interface PriceChartProps {
  data: BotMetric[];
  dataKey: 'equity' | 'price';
  title: string;
  color?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  dataKey, 
  title, 
  color = "#3b82f6" 
}) => {
  const chartData = data.map(m => ({
    time: m.timestamp,
    value: m[dataKey]
  }));

  return (
    <div className="w-full h-full min-h-[350px]">
      {title && (
        <h3 className="text-slate-400 text-sm font-black mb-4 uppercase tracking-widest italic">
          {title}
        </h3>
      )}
      <LightweightChart data={chartData} color={color} />
    </div>
  );
};
