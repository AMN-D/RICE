import { api } from './api';
import type { ThemeCreate } from '../types';

interface Theme {
  id: number;
  rice_id: number;
  name: string;
  description: string | null;
  tags: string | null;
  display_order: number;
  date_added: string;
  media: any[];
}

export const themeService = {
  // Get themes for a rice
  getThemesByRice: async (riceId: number) => {
    const response = await api.get<Theme[]>(`/themes/rice/${riceId}`);
    return response.data;
  },

  // Get a single theme by ID
  getTheme: async (themeId: number) => {
    const response = await api.get<Theme>(`/themes/${themeId}`);
    return response.data;
  },

  // Add theme to rice
  addTheme: async (riceId: number, data: ThemeCreate) => {
    const response = await api.post<Theme>(`/themes/rice/${riceId}`, data);
    return response.data;
  },

  // Update theme
  updateTheme: async (themeId: number, data: Partial<ThemeCreate>) => {
    const response = await api.patch<Theme>(`/themes/${themeId}`, data);
    return response.data;
  },

  // Delete theme
  deleteTheme: async (themeId: number) => {
    await api.delete(`/themes/${themeId}`);
  },
};