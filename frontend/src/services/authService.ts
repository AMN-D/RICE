import { api } from './api';

export const authService = {
  // Redirect to OAuth login
  login: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error: any) {
      // If 404, user is logged in but no profile yet
      if (error.response?.status === 404) {
        return { id: 0, username: null, avatar_url: null, bio: null, github_url: null };
      }
      return null;
    }
  },
};