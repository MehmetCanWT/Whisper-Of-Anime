// src/components/SearchBar.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link';

interface AnimeSuggestion {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      small_image_url?: string;
      image_url?: string;
    };
  };
}

interface SearchBarProps {
  onSearchChange: (query: string) => void;
  suggestions: AnimeSuggestion[];
  onSuggestionClick: (animeId: number) => void;
  clearSuggestions: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearchChange, 
  suggestions, 
  onSuggestionClick,
  clearSuggestions
}) => {
  const [inputValue, setInputValue] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    onSearchChange(query);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        clearSuggestions();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSuggestions]);

  return (
    <div ref={searchContainerRef} className="search-container relative flex items-center bg-search-bar-bg rounded-full py-[5px] px-[15px] shadow-[0_2px_5px_rgba(0,0,0,0.2)] border border-border-color flex-grow max-w-[450px]">
      <input
        type="text"
        id="anime-search-input"
        placeholder="Search for an anime..."
        value={inputValue}
        onChange={handleInputChange}
        className="flex-grow py-[10px] px-[5px] text-base border-none bg-transparent text-search-bar-icon placeholder-search-bar-placeholder focus:outline-none focus:ring-2 focus:ring-search-bar-focus-ring box-border"
      />
      <div className="search-icon-container text-search-bar-icon text-2xl pl-[10px]">
        ⚲
      </div>
      {suggestions.length > 0 && (
        <div id="search-suggestions" className="search-suggestions-container absolute top-full mt-1 left-0 right-0 bg-card-body-bg border border-border-color rounded-b-md max-h-[300px] overflow-y-auto z-[999] shadow-lg">
          {suggestions.map((anime) => (
            <Link
              href={`/#/anime/${anime.mal_id}`} // Use hash-based navigation for client-side routing
              key={anime.mal_id}
              className="suggestion-item flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-content-bg"
              onClick={() => {
                onSuggestionClick(anime.mal_id);
                setInputValue(''); // Clear input after click
              }}
            >
              <img
                src={anime.images.jpg.small_image_url || '/assest/placeholder-poster.png'}
                alt={anime.title_english || anime.title}
                className="w-10 h-15 object-cover rounded-sm"
              />
              <span className="text-sm">{anime.title_english || anime.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
