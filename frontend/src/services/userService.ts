import { api } from './api';

interface PublicUser {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  picture: string | null;
}

export const userService = {
  // Get user by ID
  getUserById: async (userId: number): Promise<PublicUser> => {
    const response = await api.get<PublicUser>(`/users/${userId}`);
    return response.data;
  },

  // Get user's rices
  getUserRices: async (userId: number, skip = 0, limit = 20) => {
    const response = await api.get(`/rices/user/${userId}`, {
      params: { skip, limit }
    });
    return response.data;
  },
};

// Export the type so it can be used in components
export type { PublicUser };