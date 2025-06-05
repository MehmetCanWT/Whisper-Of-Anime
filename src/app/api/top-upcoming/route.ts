     // src/app/api/top-upcoming/route.ts
     import { NextResponse } from 'next/server';
     import { getTopUpcomingAnime } from '@/lib/api';
     
     export const revalidate = 3600; // Revalidate every hour
     
     export async function GET() {
       try {
         const animeList = await getTopUpcomingAnime();
         return NextResponse.json(animeList);
       } catch (error) {
         console.error("Error in /api/top-upcoming:", error);
         return NextResponse.json({ error: "Failed to fetch top upcoming anime" }, { status: 500 });
       }
     }
     