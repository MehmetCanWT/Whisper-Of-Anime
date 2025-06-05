// src/lib/api.ts
import { Anime } from './types';

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';
const MAX_RETRIES = 2; // Reduced max retries
const RETRY_DELAY_MS = 1500; // Increased delay

interface JikanResponse {
  data: Anime[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pagination?: any; 
}

// This function will be used by our server-side API routes
export async function fetchDirectlyFromJikan(
  baseEndpoint: string, 
  filterParam?: string | null, 
  limit: number = 15,
  retries: number = MAX_RETRIES 
): Promise<Anime[]> {
  let url = `${JIKAN_API_BASE_URL}${baseEndpoint}?limit=${limit}&sfw=true`;
  if (filterParam && baseEndpoint === '/top/anime') {
    url += `&filter=${filterParam}`;
  }
  
  try {
    // console.log(`Fetching (lib/api) URL (Attempt ${MAX_RETRIES - retries + 1}): ${url}`);
    // When called from API routes, Next.js fetch's default caching can be leveraged by the route's revalidate.
    // Using { cache: 'no-store' } here ensures our API route always tries to get fresh data from Jikan,
    // and then our API route itself is cached by Next.js.
    const response = await fetch(url, { cache: 'no-store' }); 
    
    if (!response.ok) {
      if ((response.status === 429 || response.status >= 500) && retries > 0) {
        console.warn(`Retrying Jikan API (lib/api) for ${url} (${retries} retries left) after ${RETRY_DELAY_MS}ms. Status: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return fetchDirectlyFromJikan(baseEndpoint, filterParam, limit, retries - 1);
      }
      const errorData = await response.json().catch(() => ({ message: `Jikan API request failed with status ${response.status}` }));
      console.error(`Jikan API error (lib/api) for ${url}:`, errorData);
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
    console.error(`Error in fetchDirectlyFromJikan (${url}) after all retries:`, error);
    throw error; // Re-throw to be handled by the API route
  }
}

// These functions are now primarily for organizing the calls within API routes
export async function getTopAnime(): Promise<Anime[]> {
  return fetchDirectlyFromJikan('/top/anime', null);
}

export async function getTopAiringAnime(): Promise<Anime[]> {
  return fetchDirectlyFromJikan('/top/anime', 'airing');
}

export async function getTopUpcomingAnime(): Promise<Anime[]> {
  return fetchDirectlyFromJikan('/seasons/upcoming', null); 
}
