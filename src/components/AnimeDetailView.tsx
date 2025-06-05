// src/components/AnimeDetailView.tsx
"use client"; 

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { JikanAnimeFull, Trailer } from '@/lib/types'; 
import styles from './AnimeDetailView.module.css'; 

interface Props {
  anime: JikanAnimeFull;
}

const AnimeDetailView: React.FC<Props> = ({ anime }) => {
  const placeholderPosterUrl = '/assest/placeholder-poster.png';
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(0); 
  const [currentTrailerSrc, setCurrentTrailerSrc] = useState<string | null>(null);

  const allTagsRaw = [
    ...(anime.genres || []),
    ...(anime.themes || []),
    ...(anime.demographics || [])
  ];
  const uniqueTags = Array.from(new Set(allTagsRaw.filter(tag => tag && tag.name).map(tag => tag.name)));

  const trailerThumbnailSrc = anime.trailer?.images?.maximum_image_url || 
                            anime.trailer?.images?.medium_image_url || 
                            anime.trailer?.images?.default_image_url || 
                            null; 

  const getPreparedEmbedUrl = useCallback((trailer: Trailer | undefined | null, enableAutoplay: boolean): string | null => {
    let embedUrlString = trailer?.embed_url;
    if (!embedUrlString && trailer?.youtube_id) {
        embedUrlString = `https://www.youtube.com/embed/${trailer.youtube_id}`;
    }

    if (embedUrlString) {
      try {
        const url = new URL(embedUrlString);
        if (enableAutoplay) {
            url.searchParams.set('autoplay', '1');
        } else {
            // Ensure autoplay is explicitly off if not intended for this call
            url.searchParams.set('autoplay', '0'); 
        }
        url.searchParams.set('enablejsapi', '1'); 
        if (typeof window !== 'undefined' && !url.searchParams.has('origin')) {
            url.searchParams.set('origin', window.location.origin);
        }
        return url.toString();
      } catch (e) {
        // console.error("Invalid embed URL in getPreparedEmbedUrl:", embedUrlString, e);
        return null; 
      }
    }
    return null;
  }, []); // No dependencies, it's a pure function of its arguments
  
  const canDisplayTrailerThumbnail = !!trailerThumbnailSrc;
  const canOpenModalForTrailer = !!getPreparedEmbedUrl(anime.trailer, false);
  const canOpenTrailerLinkDirectly = !!(anime.trailer?.url && !canOpenModalForTrailer);

  const openTrailer = () => {
    const urlWithAutoplay = getPreparedEmbedUrl(anime.trailer, true);
    if (urlWithAutoplay) { 
      setCurrentTrailerSrc(urlWithAutoplay); 
      setTrailerKey(prevKey => prevKey + 1); 
      setIsTrailerModalOpen(true);
    } else if (anime.trailer?.url) { 
      window.open(anime.trailer.url, '_blank');
    }
  };

  const closeTrailerModal = useCallback(() => {
    setIsTrailerModalOpen(false);
    // When modal closes, set src to a non-autoplay version or null to stop video.
    // The key change for the next open will ensure autoplay=1 is effective.
    setCurrentTrailerSrc(getPreparedEmbedUrl(anime.trailer, false)); 
  }, [anime.trailer, getPreparedEmbedUrl]); 
  
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTrailerModal();
      }
    };
    if (isTrailerModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isTrailerModalOpen, closeTrailerModal]);

  // Effect to handle body overflow when modal is open
  useEffect(() => {
    if (isTrailerModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [isTrailerModalOpen]);


  return (
    <>
      <div className={styles.detailContainer}>
        <div className={styles.posterArea}>
          <Image 
            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || placeholderPosterUrl} 
            alt={anime.title_english || anime.title || 'Anime Poster'}
            className={styles.posterImage}
            width={300}
            height={450} 
            style={{ objectFit: 'cover' }} 
            priority
          />
          {(canOpenModalForTrailer && trailerThumbnailSrc) && (
             <div 
              className={styles.trailerThumbnailContainer}
              onClick={openTrailer}
              title="Play Trailer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openTrailer}
              >
              <Image 
                  src={trailerThumbnailSrc} 
                  alt={`${anime.title || 'Anime'} Trailer Thumbnail`}
                  className={styles.trailerThumbnail} 
                  layout="fill"
                  objectFit="cover"
              />
              <div className={styles.trailerPlayButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
              </div>
            </div>
          )}
          {!trailerThumbnailSrc && canOpenModalForTrailer && (
               <button onClick={openTrailer} className={styles.watchTrailerButton}>
                   Watch Trailer
               </button>
           )}
        </div>

        <div className={styles.infoArea}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <h1 className={styles.title}>
                {anime.title_english || anime.title}
              </h1>
              {anime.title_japanese && (
                <h2 className={styles.titleJapanese}>
                  {anime.title_japanese}
                </h2>
              )}
            </div>
            {anime.url && (
              <div className={styles.malLinkContainer}>
                <a 
                  href={anime.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.malLink}
                >
                  View on MyAnimeList
                </a>
              </div>
            )}
          </div>
          
          <div className={styles.scoreRank}>
            {anime.score != null && (
              <div className={styles.score}>
                <span className={styles.scoreValue}>{anime.score.toFixed(2)}</span>
                <span className={styles.scoreLabel}>Score</span>
              </div>
            )}
            {anime.rank != null && (
              <div className={styles.rank}>
                <span className={styles.rankValue}>#{anime.rank}</span>
                <span className={styles.rankLabel}>Ranked</span>
              </div>
            )}
            {anime.popularity != null && (
              <div className={styles.popularity}>
                <span className={styles.popularityValue}>#{anime.popularity}</span>
                <span className={styles.popularityLabel}>Popularity</span>
              </div>
            )}
          </div>

          {anime.synopsis && (
            <div className={styles.synopsis}>
              <h3>Synopsis</h3>
              <p>
                  {anime.synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '').replace(/\(Source: .*\)/g, '').trim()}
              </p>
            </div>
          )}
          
          <div className={styles.metaGrid}>
            {anime.type && <div className={styles.metaItem}><strong>Type:</strong> {anime.type}</div>}
            {anime.episodes != null && <div className={styles.metaItem}><strong>Episodes:</strong> {anime.episodes}</div>}
            {anime.status && <div className={styles.metaItem}><strong>Status:</strong> {anime.status}</div>}
            {anime.aired?.string && <div className={styles.metaItem}><strong>Aired:</strong> {anime.aired.string}</div>}
            {anime.duration && <div className={styles.metaItem}><strong>Duration:</strong> {anime.duration}</div>}
            {anime.rating && <div className={styles.metaItem}><strong>Rating:</strong> {anime.rating}</div>}
            {anime.source && <div className={styles.metaItem}><strong>Source:</strong> {anime.source}</div>}
            {(anime.studios && anime.studios.length > 0) && (
              <div className={styles.metaItem}><strong>Studios:</strong> {anime.studios.map(s => s.name).join(', ')}</div>
            )}
            {(anime.producers && anime.producers.length > 0) && (
              <div className={styles.metaItem}><strong>Producers:</strong> {anime.producers.map(p => p.name).join(', ')}</div>
            )}
            {(anime.licensors && anime.licensors.length > 0) && (
              <div className={styles.metaItem}><strong>Licensors:</strong> {anime.licensors.map(l => l.name).join(', ')}</div>
            )}
          </div>

          {uniqueTags.length > 0 && (
            <div className={styles.tagsContainer}>
              <h3>Tags</h3>
              <div className={styles.tags}>
                {uniqueTags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerModalOpen && currentTrailerSrc && (
        <div className={`${styles.trailerModalOverlay} ${isTrailerModalOpen ? styles.open : ''}`} onClick={closeTrailerModal}>
          <div className={styles.trailerModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.trailerModalCloseButton} onClick={closeTrailerModal} aria-label="Close trailer">×</button>
            <div className={styles.videoResponsiveModal}>
              <iframe
                key={trailerKey} 
                src={currentTrailerSrc} 
                title="Anime Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimeDetailView;
