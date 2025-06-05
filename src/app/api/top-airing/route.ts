     // src/app/api/top-airing/route.ts
     import { NextResponse } from 'next/server';
     import { getTopAiringAnime } from '@/lib/api';
     
     export const revalidate = 3600; // Revalidate every hour
     
     export async function GET() {
       try {
         const animeList = await getTopAiringAnime();
         return NextResponse.json(animeList);
       } catch (error) {
         console.error("Error in /api/top-airing:", error);
         return NextResponse.json({ error: "Failed to fetch top airing anime" }, { status: 500 });
       }
     }
     