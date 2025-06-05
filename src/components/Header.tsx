// src/components/Header.tsx
"use client";

import Link from 'next/link';
// import Image from 'next/image'; // Image is used in SearchBar, not directly here
import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './Header.module.css'; 
import { AnimeSuggestion } from '@/lib/types';
import SearchBar from './SearchBar'; // Import the SearchBar component

const Header = () => {
  const [searchQuery, setSearchQuery] = useState(''); // This will be passed to SearchBar
  const [suggestions, setSuggestions] = useState<AnimeSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const searchTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // This function will be called by SearchBar when the input changes
  const handleSearchQueryChange = useCallback(async (query: string) => {
    setSearchQuery(query); // Update query in Header as well, if needed elsewhere
    setSearchError(null);

    if (searchTimeoutIdRef.current) {
      clearTimeout(searchTimeoutIdRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      // setShowSuggestions(false); // SearchBar can manage its own visibility
      return;
    }

    searchTimeoutIdRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      // console.log(`Fetching suggestions for: ${query}`);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5&sfw=true`);
        if (!response.ok) {
          if (response.status === 429) {
            console.warn("Too many requests to Jikan API.");
            setSearchError("Too many requests. Please wait.");
          } else {
            console.error(`API error: ${response.status}`);
            setSearchError(`API error: ${response.status}`);
          }
          setSuggestions([]);
          // setShowSuggestions(false);
          setIsLoadingSuggestions(false);
          return;
        }
        const data = await response.json();
        setSuggestions(data.data || []);
        // setShowSuggestions(data.data && data.data.length > 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error fetching search suggestions:", error);
        setSearchError("Failed to fetch suggestions.");
        setSuggestions([]);
        // setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 500); // Debounce time
  }, []); // Empty dependency array as it doesn't depend on other states from Header directly

  const clearSearchState = () => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchError(null);
    // setShowSuggestions(false); // SearchBar can handle its own visibility
  };
  
  return (
    <header id="site-header" className={styles.siteHeader}>
      <Link href="/#" id="home-icon" aria-label="Go to homepage" className={styles.homeIcon} onClick={clearSearchState}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </Link>
      <SearchBar
        initialQuery={searchQuery} // Pass initial query if needed, though SearchBar will likely manage its own input value
        onQueryChange={handleSearchQueryChange} // Function to call when input changes
        suggestions={suggestions}
        isLoading={isLoadingSuggestions}
        error={searchError}
        onSuggestionClick={clearSearchState} // Clear Header's search state when a suggestion is clicked
        onClearSuggestions={() => setSuggestions([])} // Function to clear suggestions from Header
      />
    </header>
  );
};

export default Header;
