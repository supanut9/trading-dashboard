"use client";

import { useEffect, useState, useCallback } from 'react';

export interface BotMetric {
  timestamp: string;
  equity: number;
  symbol: string;
  price: number;
  bot_mode?: string;
}

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_BOT_WS_URL || 'ws://localhost:8081/api/v1/ws/metrics';

export const useBotWebSocket = (url: string = DEFAULT_WS_URL) => {
  const [metrics, setMetrics] = useState<BotMetric[]>([]);
  const [lastMetric, setLastMetric] = useState<BotMetric | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      console.log('Connected to Bot WebSocket');
    };

    socket.onmessage = (event) => {
      const data: BotMetric = JSON.parse(event.data);
      setLastMetric(data);
      setMetrics((prev) => [...prev.slice(-49), data]); // Keep last 50 points
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from Bot WebSocket');
    };

    return () => {
      socket.close();
    };
  }, [url]);

  return { metrics, lastMetric, isConnected };
};
