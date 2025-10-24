export interface DownloadLink {
    quality: string;
    url: string;
    size: string;
    subscriptionRequired: boolean;
}

export interface Episode {
    episodeNumber: number;
    title: string;
    downloadLinks: DownloadLink[];
    streamUrl?: string;
}

export interface Season {
    seasonNumber: number;
    episodes: Episode[];
}

export interface Comment {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: string;
}

export interface Movie {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    backdropUrl?: string;
    rating: number;
    year: number;
    genres: string[];
    quality: string[]; // Still useful for general display
    type: 'Movie' | 'Series';
    country: string;
    languageDetails: string[];
    director?: string;
    stars?: string[];
    seasons?: Season[];
    downloadLinks?: DownloadLink[];
    featured?: boolean;
    duration?: number;
    trailerUrl?: string;
    streamUrl?: string;
    comments?: Comment[];
    views: number;
    downloads: { timestamp: string }[];
}

export interface User {
    id: string; // This will be the Firebase Auth UID
    username: string;
    subscriptionActive: boolean;
    subscriptionEndDate?: string;
    watchlist?: string[];
}

export interface SupportMessage {
    id: string;
    userId: string;
    username: string;
    text: string;
    imageUrl?: string;
    timestamp: string;
    isResolved: boolean;
}