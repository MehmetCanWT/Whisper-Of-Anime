    // src/components/AnimeApiContent.tsx
    "use client"; 

    import Link from 'next/link';
    import Image from 'next/image'; // Import next/image
    import { AnimeInfoForQuote } from '@/lib/types';
    import styles from './AnimeApiContent.module.css';

    interface Props {
      anime: AnimeInfoForQuote | null;
      showNameFromQuoteApi: string;
      placeholderPosterUrl: string;
      isLoading: boolean;
    }

    const AnimeApiContent: React.FC<Props> = ({ anime, showNameFromQuoteApi, placeholderPosterUrl, isLoading }) => {
      if (isLoading) {
        return (
          <div id="anime-api-content-wrapper" className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading info...</p>
          </div>
        );
      }

      if (!anime) {
        return (
          <div id="anime-api-content-wrapper" className={styles.apiContentWrapper}>
            <Image 
                src={placeholderPosterUrl} 
                alt="Anime poster not available" 
                className={styles.animeImage}
                width={280} // Match CSS max-width
                height={400} // Approximate height for a poster
                style={{ objectFit: 'cover' }}
            />
            <h3 className={styles.animeTitle}>{showNameFromQuoteApi}</h3>
            <p className={styles.animeDetailText}>Detailed anime information could not be loaded.</p>
          </div>
        );
      }

      const displayTitle = anime.title_english || anime.title;
      const allTagsRaw = [...(anime.genres || []), ...(anime.themes || []), ...(anime.demographics || [])];
      const uniqueTags = Array.from(new Set(allTagsRaw.filter(tag => tag && tag.name).map(tag => tag.name))).slice(0, 3);
      const imageUrl = anime.images.jpg.large_image_url || anime.images.jpg.image_url || placeholderPosterUrl;

      return (
        <div id="anime-api-content-wrapper" className={styles.apiContentWrapper}>
          <Image 
            id="anime-image" 
            src={imageUrl} 
            alt={`${displayTitle} Poster`} 
            className={styles.animeImage}
            width={280} // Match CSS max-width
            height={400} // Approximate height (adjust based on typical aspect ratio)
            style={{ objectFit: 'cover' }} // Keep object-fit if CSS class doesn't cover it
            priority={true} // If this is LCP element consider adding priority
          />
          <h3 id="anime-title" className={styles.animeTitle}>
            <Link href={`/#/anime/${anime.mal_id}`} className={styles.animeTitleLink}>
              {displayTitle}
            </Link>
          </h3>
          <p id="anime-details" className={styles.animeDetailText}>
            {anime.type || 'N/A'} | {anime.episodes || '?'} Episodes | {anime.aired?.string || 'N/A'}
          </p>
          {anime.rating && <p id="anime-rating" className={styles.animeDetailText}>Content Rating: {anime.rating}</p>}
          {anime.status && <p id="anime-status" className={styles.animeDetailText}>Status: {anime.status}</p>}
          {anime.rank && <p id="anime-rank" className={styles.animeDetailText}>Rank: #{anime.rank}</p>}
          {uniqueTags.length > 0 && (
            <p id="anime-tags" className={styles.animeDetailText}>
              Tags: {uniqueTags.join(', ')}
            </p>
          )}
        </div>
      );
    };

    export default AnimeApiContent;
    