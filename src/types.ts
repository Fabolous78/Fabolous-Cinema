export type MediaType = 'movie' | 'series';

export type UserRole = 'admin' | 'client' | 'guest';

export interface AuthUser {
  role: UserRole;
  email?: string;
  username?: string;
}

export type WatchStatus = 'plan_to_watch' | 'watching' | 'completed' | 'on_hold' | 'dropped';

export interface EpisodeData {
  episodeNumber: number;
  title: string;
  durationMinutes: number;
  airDate?: string;
  overview?: string;
}

export interface SeasonData {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  episodes: EpisodeData[];
}

export interface MediaItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  poster: string;
  backdrop?: string;
  overview: string;
  genres: string[];
  releaseYear: number;
  rating: number; // 0 to 10
  director?: string;
  creator?: string;
  cast: string[];
  runtime?: number; // Minutes for movies
  totalSeasons?: number; // For series
  totalEpisodes?: number; // For series
  seasonsData?: SeasonData[]; // Detailed season data for series
  trailerUrl?: string;
  moods?: string[];
  addedBy?: 'system' | 'user';
}

export interface UserProgress {
  mediaId: string;
  status: WatchStatus;
  userRating?: number; // 0 to 10 scale
  userReview?: string;
  favorite: boolean;
  lastWatchedDate?: string;
  rewatchCount: number;
  // For series:
  currentSeason?: number;
  currentEpisode?: number;
  watchedEpisodes?: Record<string, boolean>; // e.g. { "s1e1": true, "s1e2": true }
  notes?: string;
}

export interface CustomList {
  id: string;
  name: string;
  description: string;
  iconName: string;
  mediaIds: string[];
  createdAt: string;
}

export interface RecommendationItem {
  title: string;
  type: MediaType;
  releaseYear: number;
  genres: string[];
  matchPercentage: number;
  synopsis: string;
  whyRecommended: string;
  recommendedForMood?: string;
  similarTo?: string;
  posterUrl?: string;
}

export interface RecommendationRequest {
  favoriteGenres: string[];
  currentMood?: string;
  preferredType?: 'movie' | 'series' | 'all';
  maxRuntime?: number;
  customPrompt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedTitles?: string[];
}
