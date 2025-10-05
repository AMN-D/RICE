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
  themes_count: number;
  reviews_count: number;
  avg_rating: number | null;
  preview_image: string | null;
}

// Theme types
export interface Theme {
  id: string;
  rice_id: string;
  name: string;
  color_scheme?: string;
  created_at: string;
}

// Media types
export type MediaType = 'image' | 'video';

export interface Media {
  id: string;
  theme_id: string;
  media_type: MediaType;
  media_url: string;
  display_order: number;
  created_at: string;
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

export interface MediaCreate {
  url: string;
  media_type: 'IMAGE' | 'VIDEO';
  display_order: number;
  thumbnail_url?: string;
}

export interface ThemeCreate {
  name: string;
  description?: string;
  tags?: string;
  display_order: number;
  media: MediaCreate[];
}

export interface RiceCreate {
  name: string;
  dotfile_url: string;
  themes: ThemeCreate[];
}