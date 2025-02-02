import type { Hub, Collection } from "./types";

const API_BASE = "https://d1q0vy0v52gyjr.cloudfront.net";

export async function fetchHub(): Promise<Hub> {
  const response = await fetch(`${API_BASE}/hub.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch hub data");
  }
  return response.json();
}

export function getImageUrl(url: string | undefined, width: number, height: number): string {
  if (!url) return "";
  return `${url}&size=${width}x${height}&format=webp`;
}

export async function fetchCollection(id: string): Promise<Collection> {
  const response = await fetch(`${API_BASE}/collections/${id}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch collection ${id}`);
  }
  return response.json();
}
