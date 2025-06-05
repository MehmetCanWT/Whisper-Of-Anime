// src/components/ClientQuoteSection.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import JikanPlaceholder from '@/components/JikanPlaceholder';
import AnimeApiContent from '@/components/AnimeApiContent';
import QuoteDisplay from '@/components/QuoteDisplay';
import AnimeDetailView from '@/components/AnimeDetailView';
import { QuoteItem, AnimeInfoForQuote, JikanAnimeFull } from '@/lib/types';
import pageStyles from '../app/page.module.css'; 

export default function ClientQuoteSection() {
  const [quoteItem, setQuoteItem] = useState<QuoteItem | null>(null);
  const [currentAnimeForQuote, setCurrentAnimeForQuote] = useState<AnimeInfoForQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false); 
  const [showJikanPlaceholder, setShowJikanPlaceholder] = useState(true);

  const [detailedAnime, setDetailedAnime] = useState<JikanAnimeFull | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<'main' | 'detail'>('main');
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
        } catch (jikanError: any) { // Added type annotation for caught error
          console.error("Jikan API error for quote section:", jikanError);
          setCurrentAnimeForQuote(null);
        }
      } else {
        setCurrentAnimeForQuote(null);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // Added type annotation for caught error
      console.error("Error fetching quote:", error);
      setQuoteItem({ quote: "Could not load quote.", character: "Error", show: "Unknown" });
      setCurrentAnimeForQuote(null);
    } finally {
      setIsLoadingQuote(false);
    }
  };
  
  const fetchAnimeDetails = useCallback(async (animeId: string) => {
    if (!animeId) return;
    setIsLoadingDetail(true);
    setDetailError(null);
    setDetailedAnime(null);
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
    } catch (err: any) { // Added type annotation for caught error
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
          if (animeIdFromHash !== activeAnimeId) {
            setActiveAnimeId(animeIdFromHash);
          }
          setCurrentView('detail');
          setShowJikanPlaceholder(false); 
        } else {
          setCurrentView('main');
          setActiveAnimeId(null);
        }
      } else {
        setCurrentView('main');
        setActiveAnimeId(null);
        if (!quoteItem && !isLoadingQuote) { 
            setShowJikanPlaceholder(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeAnimeId, quoteItem, isLoadingQuote]); 

  useEffect(() => {
    if (currentView === 'detail' && activeAnimeId) {
      fetchAnimeDetails(activeAnimeId);
    }
  }, [activeAnimeId, currentView, fetchAnimeDetails]);

  if (currentView === 'detail') {
    return (
        <div id="detail-view-wrapper" className={`${pageStyles.detailViewContainer} w-full`}> 
            {isLoadingDetail ? <p className={pageStyles.pageMessage}>Loading anime details...</p> :
            detailError ? <p className={`${pageStyles.pageMessage} ${pageStyles.errorText}`}>Error: {detailError}</p> :
            detailedAnime ? <AnimeDetailView anime={detailedAnime} /> : <p className={`${pageStyles.pageMessage} ${pageStyles.infoText}`}>Anime details not found for ID: {activeAnimeId}</p>
            }
        </div>
    );
  }

  return (
    <main className={pageStyles.quoteBox} role="main" aria-label="Anime quote generator">
      <div className={pageStyles.quoteContainer}>
        <div className={pageStyles.animeInfo} aria-label="Anime information">
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

        <div className={pageStyles.quoteText}>
          <QuoteDisplay 
            quote={quoteItem?.quote || (showJikanPlaceholder ? "Click the button to get a quote." : (isLoadingQuote ? "Loading quote..." : "Quote not found."))} 
            author={quoteItem?.character || ""} 
          />
          <button 
            onClick={fetchQuoteAndAnimeInfo} 
            aria-label="Generate new anime quote"
            className={pageStyles.newQuoteButton}
          >
            New Quote
          </button>
        </div>
      </div>
    </main>
  );
}
