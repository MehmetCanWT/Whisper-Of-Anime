   // src/components/Header.tsx
   "use client";

   import Link from 'next/link'; // Use Next.js Link
   import Image from 'next/image';
   import { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
   import styles from './Header.module.css'; 
   import { AnimeSuggestion } from '@/lib/types';

   const Header = () => {
     const [searchQuery, setSearchQuery] = useState('');
     const [suggestions, setSuggestions] = useState<AnimeSuggestion[]>([]);
     const [showSuggestions, setShowSuggestions] = useState(false);
     const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout | null>(null);
     const searchContainerRef = useRef<HTMLDivElement>(null);

     const fetchSearchSuggestions = async (query: string) => {
       if (query.length < 3) {
         setSuggestions([]);
         setShowSuggestions(false);
         return;
       }
       try {
         const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5&sfw=true`);
         if (!response.ok) throw new Error(`API error: ${response.status}`);
         const data = await response.json();
         setSuggestions(data.data || []);
         setShowSuggestions(true);
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       } catch (error: any) {
         console.error("Error fetching search suggestions:", error);
         setSuggestions([]);
         setShowSuggestions(false);
       }
     };

     const debouncedSearch = useCallback((query: string) => {
       if (searchTimeoutId) clearTimeout(searchTimeoutId);
       const newTimeoutId = setTimeout(() => fetchSearchSuggestions(query), 300);
       setSearchTimeoutId(newTimeoutId);
     }, [searchTimeoutId, fetchSearchSuggestions]);

     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
       const query = e.target.value;
       setSearchQuery(query);
       if (query.length === 0) {
           setShowSuggestions(false);
           setSuggestions([]);
       } else {
           debouncedSearch(query);
       }
     };

     const clearSearchAndSuggestions = () => {
       setSuggestions([]);
       setShowSuggestions(false);
       setSearchQuery('');
     };
     
     useEffect(() => {
       const handleClickOutside = (event: MouseEvent) => {
         if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
           setShowSuggestions(false);
         }
       };
       document.addEventListener('mousedown', handleClickOutside);
       return () => document.removeEventListener('mousedown', handleClickOutside);
     }, []);

     return (
       <header id="site-header" className={styles.siteHeader}>
         <Link href="/" id="home-icon" aria-label="Go to homepage" className={styles.homeIcon} onClick={clearSearchAndSuggestions}>
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
             onFocus={() => { if (searchQuery.length >=3 && suggestions.length > 0) setShowSuggestions(true);}}
           />
           <div className={styles.searchIcon}>⚲</div>
           {showSuggestions && suggestions.length > 0 && (
             <div id="search-suggestions" className={styles.searchSuggestionsContainer}>
               {suggestions.map((anime) => (
                 <Link
                   href={`/anime/${anime.mal_id}`} // Direct Next.js route
                   key={anime.mal_id}
                   className={styles.suggestionItem}
                   onClick={clearSearchAndSuggestions} // Clear search when a suggestion is clicked
                 >
                   <Image
                     src={anime.images.jpg.small_image_url || '/assest/placeholder-poster.png'}
                     alt={anime.title_english || anime.title || 'Anime Suggestion Poster'}
                     width={40}
                     height={60}
                     // className={styles.suggestionImage} // Eğer özel stil gerekirse
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

