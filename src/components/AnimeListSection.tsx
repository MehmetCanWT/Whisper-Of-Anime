// src/components/AnimeListSection.tsx
"use client";

import AnimeCard from './AnimeCard';
import { Anime } from '@/lib/types'; 
import styles from './AnimeListSection.module.css'; 

interface Props {
  listId: string; 
  title: string;
  initialAnimeList: Anime[]; 
  isLoading: boolean; // isLoading prop'u eklendi
  errorText: string;
}

const AnimeListSection: React.FC<Props> = ({ listId, title, initialAnimeList, isLoading, errorText }) => {
  return (
    <section id={`${listId}-section`} className={styles.animeListSection}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>
      {isLoading ? ( // isLoading prop'u kullanılıyor
        <p className={styles.loadingText}>Loading anime...</p>
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

