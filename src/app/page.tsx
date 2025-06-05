// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import JikanPlaceholder from '@/components/JikanPlaceholder';
import AnimeApiContent from '@/components/AnimeApiContent';
import QuoteDisplay from '@/components/QuoteDisplay';
import AnimeListSection from '@/components/AnimeListSection';
import AnimeDetailView from '@/components/AnimeDetailView';
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
  
  // currentView: 'main' (quote and lists) or 'detail' (single anime details)
  const [currentView, setCurrentView] = useState<'main' | 'detail'>('main');
  // activeAnimeId: stores the ID of the anime to be shown in the detail view
  const [activeAnimeId, setActiveAnimeId] = useState<string | null>(null);

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

  // Load anime lists when the component mounts or when returning to main view
  useEffect(() => {
    const loadAnimeLists = async () => {
      // console.log("Attempting to load anime lists because currentView is main.");
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

    if (currentView === 'main') {
      loadAnimeLists();
    }
  }, [currentView]); 

  // Fetch anime details function (memoized with useCallback)
  const fetchAnimeDetails = useCallback(async (animeId: string) => {
    if (!animeId) {
      setDetailError("No Anime ID provided.");
      setIsLoadingDetail(false);
      setDetailedAnime(null);
      return;
    }
    // console.log(`Fetching details for animeId in fetchAnimeDetails: ${animeId}`);
    setIsLoadingDetail(true);
    setDetailError(null);
    setDetailedAnime(null);
    window.scrollTo(0, 0); // Scroll to top when detail view loads/changes
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
  }, []); // Empty dependency array, as it doesn't rely on component's props/state directly

  // Effect to handle URL hash changes and trigger view/data updates
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      // console.log("Hash changed to:", hash, "Current activeAnimeId:", activeAnimeId, "Current view:", currentView);
      if (hash.startsWith('#/anime/')) {
        const animeIdFromHash = hash.substring('#/anime/'.length);
        if (animeIdFromHash) {
          if (animeIdFromHash !== activeAnimeId) { // Only update if ID is different
            // console.log(`New anime ID from hash: ${animeIdFromHash}. Updating activeAnimeId.`);
            setActiveAnimeId(animeIdFromHash); // This will trigger the detail fetch useEffect
          }
          if (currentView !== 'detail') {
            // console.log("Switching view to 'detail'");
            setCurrentView('detail');
          }
          setShowJikanPlaceholder(false); 
        } else { 
          // console.log("Hash is '#/anime/' (no ID), switching to main view.");
          if (currentView !== 'main') setCurrentView('main');
          setActiveAnimeId(null);
        }
      } else { 
        // console.log("No anime hash or different hash, switching to main view.");
        if (currentView !== 'main') setCurrentView('main');
        setActiveAnimeId(null);
        if (!quoteItem && !isLoadingQuote) { 
            setShowJikanPlaceholder(true);
        } else if (quoteItem || isLoadingQuote) { // Hide placeholder if a quote action has happened
            setShowJikanPlaceholder(false);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Call on initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  // This effect should primarily react to hash changes indirectly.
  // Direct dependencies that control its logic are included.
  }, [activeAnimeId, currentView, quoteItem, isLoadingQuote]); 

  // Effect to fetch details when activeAnimeId is set and view is 'detail'
  useEffect(() => {
    if (currentView === 'detail' && activeAnimeId) {
      // console.log(`Fetching details because activeAnimeId is now ${activeAnimeId} and view is ${currentView}.`);
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
          detailedAnime ? <AnimeDetailView anime={detailedAnime} /> : <p className={`${styles.pageMessage} ${styles.infoText}`}>Anime details not found for ID: {activeAnimeId}.</p>
        )}
         {currentView === 'detail' && !activeAnimeId && ( 
            <p className={`${styles.pageMessage} ${styles.errorText}`}>No Anime ID specified. Please select an anime.</p>
        )}
      </div>
    </>
  );
}

