    // src/components/SearchBar.tsx
    "use client";

    import { useState, useEffect, useRef, ChangeEvent } from 'react';
    import Link from 'next/link';
    import Image from 'next/image'; // Import next/image
    import { AnimeSuggestion } from '@/lib/types';
    // Assuming Header.module.css contains styles for .searchContainer, .searchInput etc.
    // If SearchBar has its own module, import that instead. For now, assuming styles are from Header.module.css
    import headerStyles from './Header.module.css'; 

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
      const searchContainerRef = useRef<HTMLDivElement>(null); // This ref is for the .searchContainer div
      const placeholderImageUrl = '/assest/placeholder-poster.png'; // Path to local placeholder

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
        // Use the ref on the outermost div of this component if it's the intended boundary
        <div ref={searchContainerRef} className={headerStyles.searchContainer}>
          <input
            type="text"
            id="anime-search-input"
            placeholder="Search for an anime..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => { if (inputValue.length >=3 && suggestions.length > 0) onSearchChange(inputValue);}} // Re-trigger search on focus if needed
            className={headerStyles.searchInput}
          />
          <div className={headerStyles.searchIcon}>
            ⚲
          </div>
          {suggestions.length > 0 && (
            <div id="search-suggestions" className={headerStyles.searchSuggestionsContainer}>
              {suggestions.map((anime) => (
                // Link will handle navigation, onClick will clear search
                <Link
                  href={`/#/anime/${anime.mal_id}`} 
                  key={anime.mal_id}
                  className={headerStyles.suggestionItem}
                  onClick={() => {
                    onSuggestionClick(anime.mal_id); // This might be redundant if Link handles navigation
                    setInputValue(''); 
                  }}
                >
                  <Image
                    src={anime.images.jpg.small_image_url || placeholderImageUrl}
                    alt={anime.title_english || anime.title}
                    width={40} // From CSS
                    height={60} // From CSS
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
    