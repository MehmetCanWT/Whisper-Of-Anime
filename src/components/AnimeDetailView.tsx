// src/components/AnimeDetailView.tsx
"use client"; 

import { useState } from 'react';
import { JikanAnimeFull } from '@/lib/types'; 
import styles from './AnimeDetailView.module.css'; 

interface Props {
  anime: JikanAnimeFull;
}

const AnimeDetailView: React.FC<Props> = ({ anime }) => {
  const placeholderPosterUrl = '/assest/placeholder-poster.png';
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  const allTagsRaw = [
    ...(anime.genres || []),
    ...(anime.themes || []),
    ...(anime.demographics || [])
  ];
  const uniqueTags = Array.from(new Set(allTagsRaw.filter(tag => tag && tag.name).map(tag => tag.name)));

  const openTrailerModal = () => {
    if (anime.trailer?.embed_url) { // Prioritize embed_url for modal
      setIsTrailerModalOpen(true);
    } else if (anime.trailer?.url) {
      window.open(anime.trailer.url, '_blank');
    }
  };

  const closeTrailerModal = () => {
    setIsTrailerModalOpen(false);
  };

  const trailerEmbedUrl = anime.trailer?.embed_url
      ? (anime.trailer.embed_url.includes('?')
          ? anime.trailer.embed_url.replace('autoplay=1', 'autoplay=0') + '&enablejsapi=1' 
          : anime.trailer.embed_url + '?autoplay=0&enablejsapi=1')
      : null;

  return (
    <>
      <div className={styles.detailContainer}>
        <div className={styles.posterArea}>
          <img 
            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || placeholderPosterUrl} 
            alt={anime.title_english || anime.title || 'Anime Poster'}
            className={styles.posterImage}
          />
          {anime.trailer?.youtube_id && (anime.trailer?.images?.medium_image_url || anime.trailer?.images?.maximum_image_url) && (
             <div 
              className={styles.trailerThumbnailContainer}
              onClick={openTrailerModal}
              title="Play Trailer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openTrailerModal()}
              >
              <img 
                  src={anime.trailer.images.maximum_image_url || anime.trailer.images.medium_image_url} 
                  alt={`${anime.title || 'Anime'} Trailer Thumbnail`}
                  className={styles.trailerThumbnail} 
              />
              <div className={styles.trailerPlayButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
              </div>
            </div>
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
            {anime.score && (
              <div className={styles.score}>
                <span className={styles.scoreValue}>{anime.score.toFixed(2)}</span>
                <span className={styles.scoreLabel}>Score</span>
              </div>
            )}
            {anime.rank && (
              <div className={styles.rank}>
                <span className={styles.rankValue}>#{anime.rank}</span>
                <span className={styles.rankLabel}>Ranked</span>
              </div>
            )}
            {anime.popularity && (
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
            {anime.episodes && <div className={styles.metaItem}><strong>Episodes:</strong> {anime.episodes}</div>}
            {anime.status && <div className={styles.metaItem}><strong>Status:</strong> {anime.status}</div>}
            {anime.aired?.string && <div className={styles.metaItem}><strong>Aired:</strong> {anime.aired.string}</div>}
            {anime.duration && <div className={styles.metaItem}><strong>Duration:</strong> {anime.duration}</div>}
            {anime.rating && <div className={styles.metaItem}><strong>Rating:</strong> {anime.rating}</div>}
            {anime.source && <div className={styles.metaItem}><strong>Source:</strong> {anime.source}</div>}
            
            {/* Corrected mapping with checks */}
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

      {isTrailerModalOpen && trailerEmbedUrl && (
        <div className={styles.trailerModalOverlay} onClick={closeTrailerModal}>
          <div className={styles.trailerModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.trailerModalCloseButton} onClick={closeTrailerModal}>×</button>
            <div className={styles.videoResponsiveModal}>
              <iframe
                src={trailerEmbedUrl}
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
