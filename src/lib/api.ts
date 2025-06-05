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
    // ISR için revalidate, API rotasının (örneğin /api/top-anime/route.ts) kendisinde ayarlanır.
    // Buradaki fetch, Jikan'dan veriyi çekmek için standart bir fetch olmalı.
    // Next.js'in fetch'i varsayılan olarak veriyi önbelleğe alabilir. 
    // Her zaman Jikan'dan en taze veriyi çekmek için cache: 'no-store' kullanabiliriz.
    const response = await fetch(url, { cache: 'no-store' }); 
    
    if (!response.ok) {
      console.error(`Jikan API error for ${url}: ${response.status} - ${response.statusText}`);
      const errorData = await response.json().catch(() => ({ message: "Failed to parse Jikan error response" }));
      console.error("Jikan error data:", errorData);
      // Propagate a more specific error or return empty
      throw new Error(errorData.message || `Jikan API request failed with status ${response.status}`);
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
    throw error; // Re-throw the error to be caught by the API route
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
