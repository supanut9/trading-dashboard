const API_BASE = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8081/api/v1";

export interface Position {
  symbol: string;
  side: string;
  size: number;
  entry: number;
}

export interface Trade {
  id: number;
  symbol: string;
  side: string;
  price: number;
  size: number;
  timestamp: string;
}

export interface RiskSettings {
  max_position_size: number;
  max_risk_per_trade: number;
  daily_loss_limit: number;
  max_drawdown: number;
  is_halted: boolean;
}

export const fetchPositions = async (): Promise<Position[]> => {
  try {
    const response = await fetch(`${API_BASE}/positions`);
    if (!response.ok) throw new Error("Failed to fetch positions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching positions:", error);
    return [];
  }
};

export const fetchTrades = async (): Promise<Trade[]> => {
  try {
    const response = await fetch(`${API_BASE}/trades`);
    if (!response.ok) throw new Error("Failed to fetch trades");
    return await response.json();
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
};

export const panicBot = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/panic`, {
      method: "POST",
    });
    return response.ok;
  } catch (error) {
    console.error("Error triggering panic:", error);
    return false;
  }
};

export const fetchRiskSettings = async (): Promise<RiskSettings | null> => {
  try {
    const response = await fetch(`${API_BASE}/risk`);
    if (!response.ok) throw new Error("Failed to fetch risk settings");
    return await response.json();
  } catch (error) {
    console.error("Error fetching risk settings:", error);
    return null;
  }
};

export const updateRiskSettings = async (settings: RiskSettings): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/risk`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating risk settings:", error);
    return false;
  }
};
