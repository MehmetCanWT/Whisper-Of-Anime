// src/components/SearchBar.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import styles from './Header.module.css'; 
import { AnimeSuggestion } from '@/lib/types';

interface SearchBarProps {
  // Removed initialQuery as inputValue will manage its own state
  onQueryChange: (query: string) => void; 
  suggestions: AnimeSuggestion[];
  isLoading: boolean;
  error: string | null;
  onSuggestionClick: (animeId: number) => void; // Pass animeId for navigation
  onClearSuggestions: () => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onQueryChange, 
  suggestions, 
  isLoading,
  error,
  onSuggestionClick,
  onClearSuggestions
}) => {
  const [inputValue, setInputValue] = useState(''); // Input value managed locally
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const placeholderImageUrl = '/assest/placeholder-poster.png';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query); // Update local state immediately for responsiveness
    onQueryChange(query); // Notify parent (Header) to handle debounced fetching

    if (query.length >= 2) {
      // setShowSuggestionsList(true); // Parent will control this based on suggestions array
    } else {
      setShowSuggestionsList(false);
      onClearSuggestions(); 
    }
  };

  const handleLocalSuggestionClick = (animeId: number) => {
    onSuggestionClick(animeId); // Notify parent to handle navigation and state clearing
    setInputValue(''); 
    setShowSuggestionsList(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
        // onClearSuggestions(); // Parent should clear its own suggestions state if needed
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Show suggestions if loading, or if there's an error, 
    // or if there are suggestions and input has enough characters.
    if (isLoading || error || (suggestions.length > 0 && inputValue.length >=2) ) {
        setShowSuggestionsList(true);
    } else if (inputValue.length < 2) { // Explicitly hide if input is too short
        setShowSuggestionsList(false);
    }
    // If no loading, no error, no suggestions, but input is long enough, it means "No results found"
    // which is handled inside the render logic.
  }, [suggestions, isLoading, error, inputValue]);

  return (
    <div className={styles.searchContainer} ref={searchBarRef}>
      <input
        type="text"
        id="anime-search-input"
        placeholder="Search for an anime..."
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => { 
          if (inputValue.length >= 2 && (suggestions.length > 0 || error || isLoading)) {
            setShowSuggestionsList(true);
          }
        }}
        className={styles.searchInput}
      />
      <div className={styles.searchIcon}>
        ⚲
      </div>
      {showSuggestionsList && (
        <div id="search-suggestions" className={styles.searchSuggestionsContainer}>
          {isLoading && <div className={styles.suggestionItem}><span>Loading...</span></div>}
          {error && <div className={`${styles.suggestionItem} ${styles.suggestionError}`}><span>{error}</span></div>}
          {!isLoading && !error && suggestions.length === 0 && inputValue.length >= 2 && (
            <div className={styles.suggestionItem}><span>No results found for "{inputValue}".</span></div>
          )}
          {!isLoading && !error && suggestions.map((anime) => (
            <Link
              href={`/#/anime/${anime.mal_id}`} 
              key={anime.mal_id}
              className={styles.suggestionItem}
              onClick={() => handleLocalSuggestionClick(anime.mal_id)} 
            >
              <Image
                src={anime.images.jpg.small_image_url || placeholderImageUrl}
                alt={anime.title_english || anime.title || 'Anime Suggestion Poster'}
                width={40}
                height={60}
                style={{ objectFit: 'cover', borderRadius: '3px' }}
              />
              <span>{anime.title_english || anime.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
