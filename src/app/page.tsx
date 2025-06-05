// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
// useRouter, usePathname Next.js App Router'da sayfa bazlı yönlendirme için kullanılır.
// Biz client-side hash routing kullandığımız için bunlara doğrudan ihtiyacımız olmayabilir,
// ancak kafa karışıklığını önlemek için şimdilik burada tutabiliriz.
// import { useRouter, usePathname } from 'next/navigation'; 
import JikanPlaceholder from '@/components/JikanPlaceholder';
import AnimeApiContent from '@/components/AnimeApiContent';
import QuoteDisplay from '@/components/QuoteDisplay';
import AnimeListSection from '@/components/AnimeListSection';
import AnimeDetailView from '@/components/AnimeDetailView'; // Detay görünümü için
import { QuoteItem, AnimeInfoForQuote, JikanAnimeFull, Anime } from '@/lib/types';
import { getTopAnime, getTopAiringAnime, getTopUpcomingAnime } from '@/lib/api'; 
import styles from './page.module.css';

export default function HomePage() {
  const [quoteItem, setQuoteItem] = useState<QuoteItem | null>(null);
  const [currentAnimeForQuote, setCurrentAnimeForQuote] = useState<AnimeInfoForQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false); 
  const [showJikanPlaceholder, setShowJikanPlaceholder] = useState(true);

  const [detailedAnime, setDetailedAnime] = useState<JikanAnimeFull | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<'main' | 'detail'>('main');
  const [activeAnimeId, setActiveAnimeId] = useState<string | null>(null); // To trigger detail fetch

  const placeholderPosterUrl = '/assest/placeholder-poster.png';

  const fetchQuoteAndAnimeInfo = async () => {
    setShowJikanPlaceholder(false); 
    setIsLoadingQuote(true);       
    setCurrentAnimeForQuote(null); 
    setQuoteItem(null);            
    
    try {
      const quoteResponse = await fetch('https://yurippe.vercel.app/api/quotes?random=1');
      if (!quoteResponse.ok) throw new Error(`Yurippe API error: ${quoteResponse.status}`);
      const quoteData = await quoteResponse.json();
      const newQuoteItem = quoteData[0] as QuoteItem;
      setQuoteItem(newQuoteItem);

      if (newQuoteItem?.show) {
        try {
          const cleanedShowName = newQuoteItem.show.replace(/\//g, ' ');
          const jikanResponse = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanedShowName)}&limit=1&sfw=true`);
          if (!jikanResponse.ok) throw new Error(`Jikan API error: ${jikanResponse.status}`);
          const jikanData = await jikanResponse.json();
          if (jikanData.data && jikanData.data.length > 0) {
            setCurrentAnimeForQuote(jikanData.data[0] as AnimeInfoForQuote);
          } else {
            setCurrentAnimeForQuote(null); 
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (jikanError: any) {
          console.error("Jikan API error for quote section:", jikanError);
          setCurrentAnimeForQuote(null);
        }
      } else {
        setCurrentAnimeForQuote(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching quote:", error);
      setQuoteItem({ quote: "Could not load quote.", character: "Error", show: "Unknown" });
      setCurrentAnimeForQuote(null);
    } finally {
      setIsLoadingQuote(false);
    }
  };
  
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);
  const [topUpcomingAnime, setTopUpcomingAnime] = useState<Anime[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  useEffect(() => {
    const loadAnimeLists = async () => {
      setIsLoadingLists(true);
      const [popular, airing, upcoming] = await Promise.all([
        getTopAnime(),
        getTopAiringAnime(),
        getTopUpcomingAnime()
      ]);
      setTopAnime(popular);
      setTopAiringAnime(airing);
      setTopUpcomingAnime(upcoming);
      setIsLoadingLists(false);
    };
    // Load lists only when main view is active
    if (currentView === 'main') {
        loadAnimeLists();
    }
  }, [currentView]); 

  const fetchAnimeDetails = useCallback(async (animeId: string) => {
    if (!animeId) return;
    setIsLoadingDetail(true);
    setDetailError(null);
    setDetailedAnime(null); // Clear previous details
    window.scrollTo(0, 0);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      const data = await response.json();
      setDetailedAnime(data.data as JikanAnimeFull);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching anime details:", err);
      setDetailError(err.message || "Failed to load anime details.");
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/anime/')) {
        const animeIdFromHash = hash.substring('#/anime/'.length);
        if (animeIdFromHash) {
          if (animeIdFromHash !== activeAnimeId || currentView !== 'detail') { // Fetch only if ID changed or view changes to detail
            setActiveAnimeId(animeIdFromHash); 
            setCurrentView('detail');
          }
          setShowJikanPlaceholder(false); 
        } else { 
          if (currentView !== 'main') { // If hash is just #/anime/ switch to main
            setCurrentView('main');
            setActiveAnimeId(null);
          }
        }
      } else { 
        if (currentView !== 'main') { // If hash is not for anime, switch to main
            setCurrentView('main');
            setActiveAnimeId(null);
        }
        // Manage placeholder visibility on main view
        if (!quoteItem && !isLoadingQuote) { 
            setShowJikanPlaceholder(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check on component mount

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  // Dependencies for hash change logic
  }, [activeAnimeId, currentView, quoteItem, isLoadingQuote]); 

  // Fetch details when activeAnimeId is set AND currentView is 'detail'
  useEffect(() => {
    if (currentView === 'detail' && activeAnimeId) {
      fetchAnimeDetails(activeAnimeId);
    }
  }, [activeAnimeId, currentView, fetchAnimeDetails]);


  return (
    <>
      <div id="main-view" style={{ display: currentView === 'main' ? 'flex' : 'none' }} className={`${styles.mainViewContainer} w-full flex-col items-center`}>
        <main className={styles.quoteBox} role="main" aria-label="Anime quote generator">
          <div className={styles.quoteContainer}>
            <div className={styles.animeInfo} aria-label="Anime information">
              {showJikanPlaceholder ? (
                <JikanPlaceholder />
              ) : (
                <AnimeApiContent 
                  anime={currentAnimeForQuote} 
                  showNameFromQuoteApi={quoteItem?.show || (isLoadingQuote ? "" : "Unknown")} 
                  placeholderPosterUrl={placeholderPosterUrl}
                  isLoading={isLoadingQuote}
                />
              )}
            </div>

            <div className={styles.quoteText}>
              <QuoteDisplay 
                quote={quoteItem?.quote || (showJikanPlaceholder ? "Click the button to get a quote." : (isLoadingQuote ? "Loading quote..." : "Quote not found."))} 
                author={quoteItem?.character || ""} 
              />
              <button 
                onClick={fetchQuoteAndAnimeInfo} 
                aria-label="Generate new anime quote"
                className={styles.newQuoteButton}
              >
                New Quote
              </button>
            </div>
          </div>
        </main>

        <div className={`${styles.moreAnimeSections} w-full`}>
          <AnimeListSection listId="top-anime-grid" title="Most Popular Anime" initialAnimeList={topAnime} isLoading={isLoadingLists} errorText="Most popular anime could not be loaded." />
          <AnimeListSection listId="top-airing-grid" title="Top Airing Anime" initialAnimeList={topAiringAnime} isLoading={isLoadingLists} errorText="Top airing anime could not be loaded." />
          <AnimeListSection listId="top-upcoming-grid" title="Top Upcoming Anime" initialAnimeList={topUpcomingAnime} isLoading={isLoadingLists} errorText="Top upcoming anime could not be loaded." />
        </div>
      </div>

      <div id="detail-view" style={{ display: currentView === 'detail' ? 'block' : 'none' }} className={`${styles.detailViewContainer} w-full`}> 
        {currentView === 'detail' && activeAnimeId && (
          isLoadingDetail ? <p className={styles.pageMessage}>Loading anime details for ID: {activeAnimeId}...</p> :
          detailError ? <p className={`${styles.pageMessage} ${styles.errorText}`}>Error: {detailError}</p> :
          detailedAnime ? <AnimeDetailView anime={detailedAnime} /> : <p className={`${styles.pageMessage} ${styles.infoText}`}>Anime details not found for ID: {activeAnimeId}. Please try again or go back.</p>
        )}
         {currentView === 'detail' && !activeAnimeId && ( 
            <p className={`${styles.pageMessage} ${styles.errorText}`}>No Anime ID specified. Please go back and select an anime.</p>
        )}
      </div>
    </>
  );
}

