const API_BASE = "http://localhost:8081/api/v1";

export interface Position {
  symbol: string;
  side: string;
  size: number;
  entry: number;
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
