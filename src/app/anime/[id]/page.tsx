// src/app/anime/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import AnimeDetailView from '@/components/AnimeDetailView'; 
import { JikanAnimeFull } from '@/lib/types'; 
import styles from './page.module.css'; 

export default function AnimeIdPage() { 
  const params = useParams();
  const animeId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [anime, setAnime] = useState<JikanAnimeFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (animeId && typeof animeId === 'string') { 
      const fetchAnimeDetails = async () => {
        setIsLoading(true);
        setError(null);
        setAnime(null);
        window.scrollTo(0, 0);
        try {
          const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.message || `API error: ${response.status}`);
          }
          const data = await response.json();
          setAnime(data.data as JikanAnimeFull);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("Error fetching anime details:", err);
          setError(err.message || "Failed to load anime details.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnimeDetails();
    } else if (animeId) { 
        setError("Invalid Anime ID in URL.");
        setIsLoading(false);
    } 
  }, [animeId]);

  if (isLoading) {
    return <div className={styles.pageContainer}><p className={styles.pageMessage}>Loading anime details...</p></div>;
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <p className={`${styles.pageMessage} ${styles.errorText}`}>Error: {error}</p>
        <button onClick={() => window.location.href = '/'} className="mt-4 py-2 px-4 bg-accent-color text-main-bg rounded">Go Home</button>
      </div>
    );
  }

  if (!anime) {
    return <div className={styles.pageContainer}><p className={`${styles.pageMessage} ${styles.infoText}`}>Anime details not found.</p></div>;
  }

  return (
    <div id="detail-view-content" className={`${styles.pageContainer} w-full`}> 
      <AnimeDetailView anime={anime} />
    </div>
  );
}
