import { api } from './api';
import type { Rice, RiceCard, RiceCreate, PaginatedResponse } from '../types';

export const riceService = {
  // Get all rices for homepage cards (minimal data)
  getAllRices: async (page = 1, limit = 20, sortBy = 'popular', sortOrder = 'desc', q = '') => {
    const response = await api.get<PaginatedResponse<RiceCard>>('/rices/', {
      params: {
        skip: (page - 1) * limit,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
        q: q || undefined
      }
    });
    return response.data;
  },

  // Get single rice by ID
  getRiceById: async (id: number) => {
    const response = await api.get<Rice>(`/rices/${id}`);
    return response.data;
  },

  // Create new rice
  createRice: async (data: RiceCreate) => {
    const response = await api.post<Rice>('/rices/', data);
    return response.data;
  },


  // Get my rices
  getMyRices: async (page = 1, limit = 20, includeDeleted = false) => {
    const response = await api.get<PaginatedResponse<Rice>>('/rices/user/me/rices', {
      params: { skip: (page - 1) * limit, limit, include_deleted: includeDeleted }
    });
    return response.data;
  },

  // Update rice
  updateRice: async (id: number, data: { name?: string; dotfile_url?: string }) => {
    const response = await api.patch<Rice>(`/rices/${id}`, data);
    return response.data;
  },

  // Delete rice
  deleteRice: async (id: number, softDelete = true) => {
    await api.delete(`/rices/${id}`, {
      params: { soft_delete: softDelete }
    });
  },

  // Get rice stats
  getRiceStats: async (id: number) => {
    const response = await api.get(`/rices/${id}/stats`);
    return response.data;
  },
};