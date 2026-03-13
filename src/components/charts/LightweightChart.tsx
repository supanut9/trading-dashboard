"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineData, AreaSeries, Time } from 'lightweight-charts';

interface LightweightChartProps {
  data: { time: string | number; value: number }[];
  color?: string;
}

export const LightweightChart: React.FC<LightweightChartProps> = ({ 
  data, 
  color = '#10b981' 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 350,
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    const lineSeries = chart.addSeries(AreaSeries, {
      lineColor: color,
      topColor: `${color}33`,
      bottomColor: `${color}00`,
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    chartRef.current = chart;
    lineSeriesRef.current = lineSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [color]);

  useEffect(() => {
    if (lineSeriesRef.current && data.length > 0) {
      // Lightweight charts requires data to be sorted by time
      const chartData: LineData[] = data.map(d => ({
        time: (typeof d.time === 'string' ? Math.floor(new Date(d.time).getTime() / 1000) : d.time) as Time,
        value: d.value
      })).sort((a, b) => (a.time as number) - (b.time as number));
      
      lineSeriesRef.current.setData(chartData);
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full" />;
};
