import { api } from './api';
import { Rice, PaginatedResponse } from '../types';

export const riceService = {
  getAllRices: async (page = 1, size = 20) => {
    const response = await api.get<PaginatedResponse<Rice>>('/rices/', {
      params: { skip: (page - 1) * size, limit: size }
    });
    return response.data;
  },

  getRiceById: async (id: string) => {
    const response = await api.get<Rice>(`/rices/${id}`);
    return response.data;
  },

  searchRices: async (query: string, page = 1, size = 20) => {
    const response = await api.get<PaginatedResponse<Rice>>('/rices/search/', {
      params: { q: query, skip: (page - 1) * size, limit: size }
    });
    return response.data;
  },

  getUserRices: async (userId: string) => {
    const response = await api.get<Rice[]>(`/rices/user/${userId}`);
    return response.data;
  },
};