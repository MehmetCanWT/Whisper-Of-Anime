// src/app/page.tsx
// This is now primarily a Server Component for fetching list data with ISR

import AnimeListSection from '@/components/AnimeListSection';
import ClientQuoteSection from '@/components/ClientQuoteSection'; // New Client Component
import { getTopAnime, getTopAiringAnime, getTopUpcomingAnime } from '@/lib/api';
import { Anime } from '@/lib/types';
import styles from './page.module.css';

// Revalidate data for these lists every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch data for the lists on the server at build time or revalidation
  const topAnimeData: Anime[] = await getTopAnime();
  const topAiringAnimeData: Anime[] = await getTopAiringAnime();
  const topUpcomingAnimeData: Anime[] = await getTopUpcomingAnime();

  return (
    // The main-view and detail-view toggling will be handled by ClientQuoteSection
    // or by Next.js routing if we switch to /anime/[id] for detail pages later.
    // For now, ClientQuoteSection will manage its internal views.
    <>
      <ClientQuoteSection /> {/* Contains quote logic, Jikan placeholder, and detail view toggling */}
      
      <div className={`${styles.moreAnimeSections} w-full`}>
        <AnimeListSection 
          listId="top-anime-grid" 
          title="Most Popular Anime" 
          initialAnimeList={topAnimeData} 
          // isLoading is no longer needed here as data is pre-fetched or handled by Suspense
          errorText="Most popular anime could not be loaded." 
        />
        <AnimeListSection 
          listId="top-airing-grid" 
          title="Top Airing Anime" 
          initialAnimeList={topAiringAnimeData} 
          errorText="Top airing anime could not be loaded." 
        />
        <AnimeListSection 
          listId="top-upcoming-grid" 
          title="Top Upcoming Anime" 
          initialAnimeList={topUpcomingAnimeData} 
          errorText="Top upcoming anime could not be loaded." 
        />
      </div>
    </>
  );
}
