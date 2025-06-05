     // src/app/api/top-anime/route.ts
     import { NextResponse } from 'next/server';
     import { getTopAnime } from '@/lib/api'; // Assuming getTopAnime is in lib/api.ts
     
     export const revalidate = 3600; // Revalidate this route every hour
     
     export async function GET() {
       try {
         const animeList = await getTopAnime();
         return NextResponse.json(animeList);
       } catch (error) {
         console.error("Error in /api/top-anime:", error);
         return NextResponse.json({ error: "Failed to fetch top anime" }, { status: 500 });
       }
     }
     