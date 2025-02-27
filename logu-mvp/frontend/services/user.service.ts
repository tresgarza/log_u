import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  type: 'brand' | 'influencer';
  status: 'active' | 'inactive';
  emailVerified: boolean;
  phone?: string;
  bio?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  type?: User['type'];
  status?: User['status'];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface InfluencersResponse {
  influencers: User[];
}

class UserService {
  async getInfluencers(): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<InfluencersResponse>>('/api/users/influencers');
      return response.data.data.influencers;
    } catch (error) {
      console.error('Error fetching influencers:', error);
      throw error;
    }
  }

  async getUsers(filters?: UserFilters) {
    try {
      const response = await api.get('/api/users', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUser(id: number) {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<User>) {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 