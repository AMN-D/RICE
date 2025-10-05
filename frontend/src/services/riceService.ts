import { api } from './api';
import type { Rice } from '../types';

export const riceService = {
  getAllRices: async (page = 1, size = 20, sortBy = 'recent') => {
    const response = await api.get<Rice[]>('/rices/', {
      params: { skip: (page - 1) * size, limit: size, sort_by: sortBy }
    });
    return response.data;
  },

  getRiceById: async (id: number) => {
    const response = await api.get<Rice>(`/rices/${id}`);
    return response.data;
  },
};