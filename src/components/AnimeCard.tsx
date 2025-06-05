   // src/components/AnimeCard.tsx
   "use client";

   import Link from 'next/link';
   import Image from 'next/image';
   import { Anime } from '@/lib/types';
   import styles from './AnimeCard.module.css';

   interface Props {
     anime: Anime;
   }

   const AnimeCard: React.FC<Props> = ({ anime }) => {
     const displayTitle = anime.title_english || anime.title || "Untitled Anime";
     const placeholderPoster = '/assest/placeholder-poster.png';
     const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || placeholderPoster;


     const getStatusChipDetails = (status?: string) => {
       if (!status) return { className: '', text: '' };
       if (status === 'Finished Airing') return { className: styles.chipStatusFinished, text: 'Finished Airing' };
       if (status === 'Currently Airing') return { className: styles.chipStatusAiring, text: 'Airing' };
       if (status === 'Not yet aired') return { className: styles.chipStatusNotYet, text: 'Not Yet Aired' };
       return { className: styles.chip, text: status };
     };

     const statusDetails = getStatusChipDetails(anime.status);

     return (
       // Use Next.js Link component for navigation
       <Link href={`/anime/${anime.mal_id}`} className={styles.animeCardLink}>
         <div className={styles.cardCover}>
           <Image
             src={imageUrl}
             alt={displayTitle}
             title={displayTitle}
             width={180} 
             height={250} 
             style={{ objectFit: 'cover', display: 'block' }}
           />
           {anime.rating && (
             <div className={styles.cardRated}>
               <small>{anime.rating.split(' - ')[0]}</small> 
             </div>
           )}
         </div>
         <div className={styles.cardBody}>
           {anime.status && statusDetails.text && (
             <div className={`${styles.chip} ${statusDetails.className}`}>
               <span>{statusDetails.text}</span>
             </div>
           )}
           <div className={styles.cardMeta}>
             <small>{anime.season ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year || ''}` : (anime.aired?.prop?.from?.year || 'N/A')}</small>
             {anime.episodes && (
               <>
                 <div className={styles.divider}></div>
                 <small>{anime.episodes} episodes</small>
               </>
             )}
           </div>
           <h4 className={styles.cardTitle} title={displayTitle}>
             {displayTitle}
           </h4>
           <div className={styles.cardRating}>
             <div className={styles.cardScore}>
               <div className={styles.cardScoreValue}>
                 {anime.score && (
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                   </svg>
                 )}
                 {anime.score ? anime.score.toFixed(1) : 'N/A'}
               </div>
               <small>{anime.members ? `${(anime.members / 1000).toFixed(0)}k users` : ''}</small>
             </div>
             <div className={styles.cardRank}>
               <div className={styles.cardRankValue}>
                 {anime.rank && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 9l14 0"></path><path d="M5 15l14 0"></path><path d="M11 4l-4 16"></path><path d="M17 4l-4 16"></path>
                    </svg>
                 )}
                 {anime.rank ? `#${anime.rank}` : 'N/A'}
               </div>
               <small>Ranking</small>
             </div>
           </div>
           <div className={styles.cardGenres}>
             {(anime.genres || []).slice(0, 2).map(genre => (
               <div key={genre.mal_id} className={`${styles.chip} ${styles.chipGenre}`}>
                 <span>{genre.name}</span>
               </div>
             ))}
             {(anime.genres || []).length > 2 && (
               <div className={`${styles.chip} ${styles.chipGenre} ${styles.chipGenreMore}`}>
                 <span>+{ (anime.genres || []).length - 2}</span>
               </div>
             )}
           </div>
         </div>
       </Link>
     );
   };

   export default AnimeCard;

