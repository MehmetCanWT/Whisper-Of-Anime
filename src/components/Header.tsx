    // src/components/Header.tsx
    "use client";

    import Link from 'next/link'; // Next.js Link for navigation
    import Image from 'next/image';
    import { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
    import styles from './Header.module.css'; 
    import { AnimeSuggestion } from '@/lib/types';

    const Header = () => {
      const [searchQuery, setSearchQuery] = useState('');
      const [suggestions, setSuggestions] = useState<AnimeSuggestion[]>([]);
      const [showSuggestions, setShowSuggestions] = useState(false);
      const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
      const [searchError, setSearchError] = useState<string | null>(null);
      const searchContainerRef = useRef<HTMLDivElement>(null);
      const searchTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

      const fetchSearchSuggestions = useCallback(async (query: string) => {
        if (query.length < 2) {
          setSuggestions([]);
          setShowSuggestions(false);
          setSearchError(null);
          return;
        }
        setIsLoadingSuggestions(true);
        setSearchError(null);
        try {
          const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5&sfw=true`);
          if (!response.ok) {
            if (response.status === 429) {
              setSearchError("Too many requests. Wait a moment.");
            } else {
              setSearchError(`API error: ${response.status}`);
            }
            setSuggestions([]); setShowSuggestions(false); setIsLoadingSuggestions(false); return;
          }
          const data = await response.json();
          setSuggestions(data.data || []);
          setShowSuggestions(data.data && data.data.length > 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Error fetching search suggestions:", error);
          setSearchError("Failed to fetch suggestions.");
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, []);

      const debouncedSearch = useCallback((query: string) => {
        if (searchTimeoutIdRef.current) clearTimeout(searchTimeoutIdRef.current);
        searchTimeoutIdRef.current = setTimeout(() => fetchSearchSuggestions(query), 500);
      }, [fetchSearchSuggestions]);

      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchError(null);
        if (query.length === 0) {
            setShowSuggestions(false); setSuggestions([]);
            if (searchTimeoutIdRef.current) clearTimeout(searchTimeoutIdRef.current);
        } else if (query.length >= 2) {
            debouncedSearch(query);
        } else {
            setShowSuggestions(false); setSuggestions([]);
        }
      };

      const handleSuggestionClick = () => {
        setShowSuggestions(false);
        setSearchQuery('');
        setSuggestions([]);
      };
      
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
            setSearchError(null);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          if (searchTimeoutIdRef.current) clearTimeout(searchTimeoutIdRef.current);
        };
      }, []);

      return (
        <header id="site-header" className={styles.siteHeader}>
          <Link href="/" id="home-icon" aria-label="Go to homepage" className={styles.homeIcon} onClick={handleSuggestionClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </Link>
          <div className={styles.searchContainer} ref={searchContainerRef}>
            <input 
              type="text" 
              id="anime-search-input" 
              placeholder="Search for an anime..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => { if (searchQuery.length >=2 && (suggestions.length > 0 || isLoadingSuggestions || searchError)) setShowSuggestions(true);}}
            />
            <div className={styles.searchIcon}>⚲</div>
            {showSuggestions && (
              <div id="search-suggestions" className={styles.searchSuggestionsContainer}>
                {isLoadingSuggestions && <div className={styles.suggestionItem}><span>Loading...</span></div>}
                {searchError && <div className={`${styles.suggestionItem} ${styles.suggestionError}`}><span>{searchError}</span></div>}
                {!isLoadingSuggestions && !searchError && suggestions.length === 0 && searchQuery.length >= 2 && (
                  <div className={styles.suggestionItem}><span>No results found for "{searchQuery}".</span></div>
                )}
                {!isLoadingSuggestions && !searchError && suggestions.map((anime) => (
                  <Link
                    href={`/anime/${anime.mal_id}`} // Direct Next.js route
                    key={anime.mal_id}
                    className={styles.suggestionItem}
                    onClick={handleSuggestionClick} 
                  >
                    <Image
                      src={anime.images.jpg.small_image_url || '/assest/placeholder-poster.png'}
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
        </header>
      );
    };

    export default Header;
    