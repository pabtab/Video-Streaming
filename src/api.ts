import type { Hub, Collection } from "./types";

const API_BASE = "https://d1q0vy0v52gyjr.cloudfront.net";

export async function fetchHub(): Promise<Hub> {
  const response = await fetch(`${API_BASE}/hub.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch hub data");
  }
  return response.json();
}
