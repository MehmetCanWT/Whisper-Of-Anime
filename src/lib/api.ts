   // src/lib/api.ts
   import { Anime } from './types'; // Assuming your Anime type is defined here
   
   const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4';
   
   interface JikanResponse {
     data: Anime[];
     pagination?: any; // Add other pagination fields if needed
   }
   
   async function fetchJikanEndpoint(endpoint: string, limit: number = 15): Promise<Anime[]> {
     const url = `${JIKAN_API_BASE_URL}${endpoint}?limit=${limit}&sfw=true`;
     try {
       const response = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
       if (!response.ok) {
         console.error(`Jikan API error for ${url}: ${response.status} - ${response.statusText}`);
         const errorData = await response.json().catch(() => ({}));
         console.error("Error data:", errorData);
         return []; // Return empty array on error
       }
       const data: JikanResponse = await response.json();
       
       // Filter out duplicates based on mal_id before returning
       const uniqueAnimeMap = new Map<number, Anime>();
       (data.data || []).forEach((anime: Anime) => {
         if (anime.mal_id && !uniqueAnimeMap.has(anime.mal_id)) {
           uniqueAnimeMap.set(anime.mal_id, anime);
         }
       });
       return Array.from(uniqueAnimeMap.values()).slice(0, 12); // Return up to 12 unique items
   
     } catch (error) {
       console.error(`Error fetching from Jikan (${url}):`, error);
       return [];
     }
   }
   
   export async function getTopAnime(): Promise<Anime[]> {
     return fetchJikanEndpoint('/top/anime');
   }
   
   export async function getTopAiringAnime(): Promise<Anime[]> {
     return fetchJikanEndpoint('/top/anime', 15); // Jikan's top/anime with filter is often better for airing
     // Or use seasons/now if preferred, but top/anime usually has more relevant "top airing"
     // return fetchJikanEndpoint('/seasons/now');
   }
   
   export async function getTopUpcomingAnime(): Promise<Anime[]> {
     return fetchJikanEndpoint('/seasons/upcoming');
   }
   