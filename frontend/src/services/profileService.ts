import { api } from './api';
import type { User, ProfileData } from '../types';

export const profileService = {
  // Complete profile
  completeProfile: async (data: ProfileData) => {
    const response = await api.post<User>('/profile/complete', data);
    return response.data;
  },

  // Get current user profile
  getMyProfile: async () => {
    const response = await api.get<User>('/profile/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<ProfileData>) => {
    const response = await api.put<User>('/profile/me', data);
    return response.data;
  },

  // Delete profile/account
  deleteProfile: async () => {
    const response = await api.delete('/profile/me');
    return response.data;
  },
};