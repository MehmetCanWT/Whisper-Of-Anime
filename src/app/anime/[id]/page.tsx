// src/app/anime/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Next.js hook to get route parameters
import AnimeDetailView from '@/components/AnimeDetailView';
import { JikanAnimeFull } from '@/lib/types';
import styles from './page.module.css'; // Styles for this specific page

export default function AnimeIdPage() { // Renamed component for clarity
  const params = useParams();
  // params.id can be string or string[]. Ensure it's a string.
  const animeId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [anime, setAnime] = useState<JikanAnimeFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (animeId && typeof animeId === 'string') { // Ensure animeId is a valid string
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
        } catch (err: any) {
          console.error("Error fetching anime details:", err);
          setError(err.message || "Failed to load anime details.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnimeDetails();
    } else if (animeId) { // If animeId is defined but not a string (e.g. string[])
        setError("Invalid Anime ID in URL.");
        setIsLoading(false);
    } else { // If animeId is undefined
        // This case should ideally not happen if routing is set up correctly and links are valid
        // but as a fallback:
        // setError("Anime ID not provided in URL.");
        // setIsLoading(false);
        // Or redirect to home, though that might cause a loop if this page is loaded by mistake
    }
  }, [animeId]);

  if (isLoading) {
    return <div className={styles.pageContainer}><p className={styles.pageMessage}>Loading anime details...</p></div>;
  }

  if (error) {
    return <div className={styles.pageContainer}><p className={`${styles.pageMessage} ${styles.errorText}`}>Error: {error}</p></div>;
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
