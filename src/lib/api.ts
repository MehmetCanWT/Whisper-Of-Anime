// src/lib/api.ts
import { Anime } from './types';

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';

interface JikanResponse {
  data: Anime[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination?: any; 
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
  return fetchJikanEndpoint('/top/anime', null);
}

export async function getTopAiringAnime(): Promise<Anime[]> {
  return fetchJikanEndpoint('/top/anime', 'airing');
}

export async function getTopUpcomingAnime(): Promise<Anime[]> {
  return fetchJikanEndpoint('/seasons/upcoming', null); 
}
