import { api } from './api';
import type { Media, MediaCreate, MediaUpdate, MediaReorder } from '../types/index';


export const mediaService = {
  // Get all media for a theme
  getThemeMedia: async (themeId: number): Promise<Media[]> => {
    const response = await api.get<Media[]>(`/media/theme/${themeId}`);
    return response.data;
  },

  // Get single media by ID
  getMedia: async (mediaId: number): Promise<Media> => {
    const response = await api.get<Media>(`/media/${mediaId}`);
    return response.data;
  },

  // Add media to theme
  addMedia: async (themeId: number, data: MediaCreate): Promise<Media> => {
    const response = await api.post<Media>(`/media/theme/${themeId}`, data);
    return response.data;
  },

  // Update media
  updateMedia: async (mediaId: number, data: MediaUpdate): Promise<Media> => {
    const response = await api.patch<Media>(`/media/${mediaId}`, data);
    return response.data;
  },

  // Delete media
  deleteMedia: async (mediaId: number): Promise<void> => {
    await api.delete(`/media/${mediaId}`);
  },

  // Reorder theme media
  reorderMedia: async (themeId: number, mediaOrder: MediaReorder[]): Promise<Media[]> => {
    const response = await api.post<Media[]>(`/media/theme/${themeId}/reorder`, {
      media_order: mediaOrder
    });
    return response.data;
  },
};

export type { Media as MediaType };