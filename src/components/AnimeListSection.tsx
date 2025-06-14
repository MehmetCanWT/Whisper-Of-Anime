"use client";

import AnimeCard from './AnimeCard';
import { Anime } from '@/lib/types'; 
import styles from './AnimeListSection.module.css'; 

// 1. UPDATE THE PROPS INTERFACE
// It now accepts the anime list and loading state directly from the parent page.
interface Props {
  listId: string; 
  title: string;
  initialAnimeList: Anime[]; // This replaces 'apiEndpoint'
  isLoading: boolean;         // Added to receive loading state
  errorText: string;
}

// 2. SIMPLIFY THE COMPONENT
// All internal data fetching (useState, useEffect) is removed.
const AnimeListSection: React.FC<Props> = ({ listId, title, initialAnimeList, isLoading, errorText }) => {
  return (
    <section id={`${listId}-section`} className={styles.animeListSection}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>

      {/* 3. RENDER BASED ON PROPS */}
      {/* The component now shows a loading state, the list, or an error based on the props it receives. */}
      {isLoading ? (
        <div className={styles.animeGrid}>
          {/* Display skeleton loaders for a better user experience */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : initialAnimeList && initialAnimeList.length > 0 ? (
        <div id={listId} className={styles.animeGrid}>
          {initialAnimeList.map((anime) => (
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

