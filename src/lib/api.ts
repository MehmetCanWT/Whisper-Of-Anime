// src/lib/api.ts
import { Anime } from './types';

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

interface JikanResponse {
  data: Anime[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination?: any; // Keeping this as any for now, as pagination structure might vary or not be strictly typed yet
}

async function fetchJikanEndpoint(baseEndpoint: string, filterParam?: string | null, limit: number = 15): Promise<Anime[]> {
  let url = `${JIKAN_API_BASE_URL}${baseEndpoint}?limit=${limit}&sfw=true`;
  if (filterParam && baseEndpoint === '/top/anime') {
    url += `&filter=${filterParam}`;
  }
  
  try {
    const response = await fetch(url); 
    if (!response.ok) {
      console.error(`Jikan API error for ${url}: ${response.status} - ${response.statusText}`);
      // Try to parse error response from Jikan if available
      const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
      console.error("Error data from Jikan:", errorData);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) { // Added type annotation for caught error
    console.error(`Error fetching from Jikan (${url}):`, error.message || error);
    return [];
  }
}

export async function getTopAnime(): Promise<Anime[]> {
  return fetchJikanEndpoint('/top/anime', null);
}

export async function getTopAiringAnime(): Promise<Anime[]> {
  // Using /top/anime with filter=airing as it often gives more relevant "top" airing
  return fetchJikanEndpoint('/top/anime', 'airing');
}

export async function getTopUpcomingAnime(): Promise<Anime[]> {
  // The /seasons/upcoming endpoint does not use the 'filter' query parameter
  return fetchJikanEndpoint('/seasons/upcoming', null); 
}
