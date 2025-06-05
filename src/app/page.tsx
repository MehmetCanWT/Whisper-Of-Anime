   // src/app/page.tsx
   "use client";

   import { useEffect, useState } from 'react';
   import JikanPlaceholder from '@/components/JikanPlaceholder';
   import AnimeApiContent from '@/components/AnimeApiContent';
   import QuoteDisplay from '@/components/QuoteDisplay';
   import AnimeListSection from '@/components/AnimeListSection';
   import { QuoteItem, AnimeInfoForQuote, Anime } from '@/lib/types';
   import { getTopAnime, getTopAiringAnime, getTopUpcomingAnime } from '@/lib/api'; 
   import styles from './page.module.css'; // Bu dosyanın var olduğundan emin olun

   export default function HomePage() {
     const [quoteItem, setQuoteItem] = useState<QuoteItem | null>(null);
     const [currentAnimeForQuote, setCurrentAnimeForQuote] = useState<AnimeInfoForQuote | null>(null);
     const [isLoadingQuote, setIsLoadingQuote] = useState(false); 
     const [showJikanPlaceholder, setShowJikanPlaceholder] = useState(true);

     const [topAnime, setTopAnime] = useState<Anime[]>([]);
     const [topAiringAnime, setTopAiringAnime] = useState<Anime[]>([]);
     const [topUpcomingAnime, setTopUpcomingAnime] = useState<Anime[]>([]);
     const [isLoadingLists, setIsLoadingLists] = useState(true);

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
       loadAnimeLists();
     }, []); 
   
     useEffect(() => {
       if (quoteItem || isLoadingQuote) {
           setShowJikanPlaceholder(false);
       } else {
           setShowJikanPlaceholder(true);
       }
     }, [quoteItem, isLoadingQuote]);

     return (
       <div id="main-page-content" className={`${styles.mainViewContainer} w-full flex-col items-center`}>
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
     );
   }

             
