// src/lib/types.ts

export interface ImageSet {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JpgImages {
  jpg: ImageSet;
}

export interface TrailerImages {
    medium_image_url?: string;
    maximum_image_url?: string;
}

export interface Trailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images?: TrailerImages | null; 
}

export interface NameUrlPair {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AiredInfo {
  from: string | null;
  to: string | null;
  prop: {
    from: { day: number | null; month: number | null; year: number | null };
    to: { day: number | null; month: number | null; year: number | null };
  };
  string: string | null;
}

export interface BroadcastInfo {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: JpgImages;
  trailer?: Trailer;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  type?: string;
  source?: string;
  episodes?: number | null;
  status?: string;
  airing?: boolean;
  aired?: AiredInfo;
  duration?: string;
  rating?: string; 
  score?: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number;
  favorites?: number;
  synopsis?: string | null;
  background?: string | null;
  season?: string | null;
  year?: number | null;
  broadcast?: BroadcastInfo;
  producers?: NameUrlPair[];
  licensors?: NameUrlPair[];
  studios?: NameUrlPair[];
  genres?: NameUrlPair[];
  explicit_genres?: NameUrlPair[];
  themes?: NameUrlPair[];
  demographics?: NameUrlPair[];
}

export interface AnimeInfoForQuote {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images: JpgImages;
  url: string;
  type?: string;
  episodes?: number | null;
  status?: string;
  aired?: { string?: string | null };
  rating?: string;
  rank?: number | null;
  genres?: Array<{ mal_id: number; name: string }>;
  themes?: Array<{ mal_id: number; name: string }>;
  demographics?: Array<{ mal_id: number; name: string }>;
}

export interface QuoteItem {
  quote: string;
  character: string;
  show: string; 
}

export interface AnimeSuggestion {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      small_image_url?: string;
      image_url?: string;
    };
  };
}

export interface JikanAnimeFull extends Anime {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relations?: Array<any>; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  external?: Array<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  streaming?: Array<any>;
}
