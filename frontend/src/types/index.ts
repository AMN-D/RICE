// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  github_url?: string;
  created_at: string;
}

// Rice types
export interface Rice {
  id: string;
  user_id: string;
  title: string;
  description: string;
  distro: string;
  window_manager?: string;
  dotfile_link?: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  user?: User;
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
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

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