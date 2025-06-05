// src/components/AnimeListSection.tsx
"use client";

import { useEffect, useState } from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '@/lib/types'; 
import styles from './AnimeListSection.module.css'; 

interface Props {
  listId: string; 
  title: string;
  apiEndpoint: string; // e.g., '/api/top-anime'
  errorText: string;
}

const AnimeListSection: React.FC<Props> = ({ listId, title, apiEndpoint, errorText }) => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeListData = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        // Fetch from your Next.js API route
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `API Route error: ${response.status}`);
        }
        const data = await response.json();
        setAnimeList(data || []);
      } catch (error: unknown) {
        console.error(`Error fetching for ${title} from ${apiEndpoint}:`, error);
        setFetchError((error as Error).message || "Failed to load list");
        setAnimeList([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeListData();
  }, [apiEndpoint, title]);

  return (
    <section id={`${listId}-section`} className={styles.animeListSection}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>
      {isLoading ? (
        <p className={styles.loadingText}>Loading anime...</p>
      ) : fetchError ? (
        <p className={styles.errorText}>{fetchError}</p>
      ) : animeList.length > 0 ? (
        <div id={listId} className={styles.animeGrid}>
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        <p className={styles.errorText}>{errorText}</p>
      )}
    </section>
  );
};

export default AnimeListSection;
