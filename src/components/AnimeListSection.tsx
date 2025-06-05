// src/components/AnimeListSection.tsx
"use client"; // Keep as client component if it has any client-side logic or for consistency

// Removed useEffect and useState for data fetching, as data is passed via props
import AnimeCard from './AnimeCard';
import { Anime } from '@/lib/types'; 
import styles from './AnimeListSection.module.css'; 

interface Props {
  listId: string; 
  title: string;
  initialAnimeList: Anime[]; // Renamed from filter to initialAnimeList
  // isLoading prop can be added if page.tsx wants to show loading state for lists too
  errorText: string;
}

const AnimeListSection: React.FC<Props> = ({ listId, title, initialAnimeList, errorText }) => {
  // isLoading state is removed, assuming data is ready when passed
  // or page.tsx will handle the overall loading state for lists

  return (
    <section id={`${listId}-section`} className={styles.animeListSection}>
      <h2 className={styles.sectionTitle}>
        {title}
      </h2>
      {initialAnimeList && initialAnimeList.length > 0 ? (
        <div id={listId} className={styles.animeGrid}>
          {initialAnimeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        // Show errorText if initialAnimeList is empty after fetch attempt
        <p className={styles.errorText}>{errorText}</p>
      )}
    </section>
  );
};

export default AnimeListSection;
