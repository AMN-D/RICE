// User types
export interface User {
  id: number;
  username: string | null;
  email?: string;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
}

export interface ProfileData {
  username: string;
  bio?: string;
  github_url?: string;
  avatar_url?: string;
}

// Rice types
export interface Rice {
  id: number;
  user_id: number;
  name: string;
  dotfile_url: string;
  views: number;
  dotfile_clicks: number;
  date_added: string;
  date_updated?: string;
  themes_count: number;
  reviews_count: number;
  avg_rating: number | null;
  preview_image: string | null;
  themes?: Theme[];
}

// Theme types  
export interface Theme {
  id: number;
  rice_id: number;
  name: string;
  description: string | null;
  tags: string | null;
  display_order: number;
  date_added: string;
  media?: Media[];
}

// Media types
export type MediaType = 'IMAGE' | 'VIDEO';

export interface Media {
  id: number;
  theme_id: number;
  url: string;
  media_type: MediaType;
  display_order: number;
  thumbnail_url: string | null;
  date_added: string;
}

export interface MediaCreate {
  url: string;
  media_type: MediaType;
  display_order: number;
  thumbnail_url?: string;
}

export interface MediaUpdate {
  url?: string;
  display_order?: number;
  thumbnail_url?: string;
}

export interface MediaReorder {
  media_id: number;
  display_order: number;
}

// Review types
export interface Review {
  id: string;
  rice_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: User;
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface ThemeCreate {
  name: string;
  description?: string;
  tags?: string;
  display_order: number;
  media?: MediaCreate[];
}

export interface RiceCreate {
  name: string;
  dotfile_url: string;
  themes: ThemeCreate[];
}