// src/lib/api.ts
import { Anime } from './types'; 

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

interface JikanResponse {
  data: Anime[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination?: any; 
}

async function fetchJikanEndpoint(endpoint: string, limit: number = 15): Promise<Anime[]> {
  const url = `${JIKAN_API_BASE_URL}${endpoint}?limit=${limit}&sfw=true`;
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); 
    if (!response.ok) {
      console.error(`Jikan API error for ${url}: ${response.status} - ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      console.error("Error data:", errorData);
      return []; 
    }
    const data: JikanResponse = await response.json();
    
    const uniqueAnimeMap = new Map<number, Anime>();
    (data.data || []).forEach((anime: Anime) => {
      if (anime.mal_id && !uniqueAnimeMap.has(anime.mal_id)) {
        uniqueAnimeMap.set(anime.mal_id, anime);
      }
    });
    return Array.from(uniqueAnimeMap.values()).slice(0, 12); 

  } catch (error) {
    console.error(`Error fetching from Jikan (${url}):`, error);
    return [];
  }
}

export async function getTopAnime(): Promise<Anime[]> {
  return fetchJikanEndpoint('/top/anime');
}

export async function getTopAiringAnime(): Promise<Anime[]> {
  return fetchJikanEndpoint('/top/anime', 15);
}

export async function getTopUpcomingAnime(): Promise<Anime[]> {
  return fetchJikanEndpoint('/seasons/upcoming');
}
