import { api } from './api';
import type { Rice, RiceCreate } from '../types';

export const riceService = {
  // Get all rices
  getAllRices: async (page = 1, size = 20, sortBy = 'recent') => {
    const response = await api.get<Rice[]>('/rices/', {
      params: { skip: (page - 1) * size, limit: size, sort_by: sortBy }
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
  getMyRices: async (includeDeleted = false) => {
    const response = await api.get<Rice[]>('/rices/user/me/rices', {
      params: { include_deleted: includeDeleted }
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