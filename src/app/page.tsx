   // src/app/page.tsx
   "use client"; // Keep this for quote functionality if it remains client-side
   
   import { useEffect, useState } from 'react';
   import JikanPlaceholder from '@/components/JikanPlaceholder';
   import AnimeApiContent from '@/components/AnimeApiContent';
   import QuoteDisplay from '@/components/QuoteDisplay';
   import AnimeListSection from '@/components/AnimeListSection';
   import AnimeDetailView from '@/components/AnimeDetailView'; // Keep for detail view logic
   import { QuoteItem, AnimeInfoForQuote, JikanAnimeFull, Anime } from '@/lib/types';
   import { getTopAnime, getTopAiringAnime, getTopUpcomingAnime } from '@/lib/api'; // Import new API functions
   import styles from './page.module.css';
   
   // Config for revalidation (ISR) - this applies if this page is primarily server-rendered for lists
   // export const revalidate = 3600; // Revalidate every hour (3600 seconds)
   // However, since we have client-side quote fetching and view toggling,
   // we'll fetch list data on the client for now, but with a caching strategy in mind for future.
   // For true ISR on lists, this component would need to be a Server Component or use getStaticProps in Pages Router.
   // With App Router, we can fetch data in Server Components passed as children or use Route Handlers + client fetch.
   
   export default function HomePage() {
     const [quoteItem, setQuoteItem] = useState<QuoteItem | null>(null);
     const [currentAnimeForQuote, setCurrentAnimeForQuote] = useState<AnimeInfoForQuote | null>(null);
     const [isLoadingQuote, setIsLoadingQuote] = useState(false); 
     const [showJikanPlaceholder, setShowJikanPlaceholder] = useState(true);
   
     const [detailedAnime, setDetailedAnime] = useState<JikanAnimeFull | null>(null);
     const [isLoadingDetail, setIsLoadingDetail] = useState(false);
     const [detailError, setDetailError] = useState<string | null>(null);
     
     const [currentView, setCurrentView] = useState<'main' | 'detail'>('main');
     const [activeAnimeId, setActiveAnimeId] = useState<string | null>(null);
   
     // States for anime lists
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
           } catch (jikanError) {
             console.error("Jikan API error for quote section:", jikanError);
             setCurrentAnimeForQuote(null);
           }
         } else {
           setCurrentAnimeForQuote(null);
         }
       } catch (error) {
         console.error("Error fetching quote:", error);
         setQuoteItem({ quote: "Could not load quote.", character: "Error", show: "Unknown" });
         setCurrentAnimeForQuote(null);
       } finally {
         setIsLoadingQuote(false);
       }
     };
     
     // Fetch anime lists on component mount if on main view
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
   
       if (currentView === 'main') {
         loadAnimeLists();
       }
     }, [currentView]); // Reload lists if user navigates back to main view
   
     useEffect(() => {
       const handleHashChange = () => {
         const hash = window.location.hash;
         if (hash.startsWith('#/anime/')) {
           const animeIdFromHash = hash.substring('#/anime/'.length);
           if (animeIdFromHash) {
             setActiveAnimeId(animeIdFromHash);
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
     }, [quoteItem, isLoadingQuote]);
   
     useEffect(() => {
       if (currentView === 'detail' && activeAnimeId) {
         const fetchDetails = async () => {
           setIsLoadingDetail(true);
           setDetailError(null);
           setDetailedAnime(null);
           window.scrollTo(0, 0);
           try {
             const response = await fetch(`https://api.jikan.moe/v4/anime/${activeAnimeId}/full`);
             if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(`API error: ${response.status} - ${response.statusText || errorData.message}`);
             }
             const data = await response.json();
             setDetailedAnime(data.data as JikanAnimeFull);
           } catch (err: any) {
             console.error("Error fetching anime details:", err);
             setDetailError(err.message || "Failed to load anime details.");
           } finally {
             setIsLoadingDetail(false);
           }
         };
         fetchDetails();
       }
     }, [activeAnimeId, currentView]);
   
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
             isLoadingDetail ? <p className={styles.pageMessage}>Loading anime details...</p> :
             detailError ? <p className={`${styles.pageMessage} ${styles.errorText}`}>Error: {detailError}</p> :
             detailedAnime ? <AnimeDetailView anime={detailedAnime} /> : <p className={`${styles.pageMessage} ${styles.infoText}`}>Anime details not found for ID: {activeAnimeId}</p>
           )}
         </div>
       </>
     );
   }
   