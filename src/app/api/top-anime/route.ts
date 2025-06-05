     // src/app/api/top-anime/route.ts
     import { NextResponse } from 'next/server';
     import { getTopAnime } from '@/lib/api';
     
     export const revalidate = 300; // Revalidate this data every 5 minutes (300 seconds)
     
     export async function GET() {
       try {
         const animeList = await getTopAnime();
         return NextResponse.json(animeList);
       } catch (error) {
         console.error("Error in /api/top-anime route:", error);
         return NextResponse.json({ error: "Failed to fetch top anime" }, { status: 500 });
       }
     }
     