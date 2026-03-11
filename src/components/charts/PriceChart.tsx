"use client";

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
      <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">
        {title}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              hide 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="#475569" 
              fontSize={12}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
              labelStyle={{ display: 'none' }}
              itemStyle={{ color: '#f8fafc' }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, title]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
