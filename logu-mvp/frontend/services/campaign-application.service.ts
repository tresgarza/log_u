import api from './api';
import { AxiosResponse } from 'axios';

export interface CampaignApplication {
  id?: number;
  campaignId: number;
  influencerId: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  compensation?: number;
  brandFeedback?: string;
  influencerRating?: number;
  brandRating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const campaignApplicationService = {
  // Get all applications for an influencer
  getMyApplications: async (filters?: { status?: string }): Promise<ApiResponse<{ applications: CampaignApplication[] }>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    
    const response: AxiosResponse<ApiResponse<{ applications: CampaignApplication[] }>> = 
      await api.get(`/campaign-applications/my-applications?${params.toString()}`);
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id: number): Promise<ApiResponse<{ application: CampaignApplication }>> => {
    const response: AxiosResponse<ApiResponse<{ application: CampaignApplication }>> = 
      await api.get(`/campaign-applications/${id}`);
    return response.data;
  },

  // Apply to a campaign
  applyToCampaign: async (application: { 
    campaignId: number; 
    message?: string;
  }): Promise<ApiResponse<{ application: CampaignApplication }>> => {
    const response: AxiosResponse<ApiResponse<{ application: CampaignApplication }>> = 
      await api.post('/campaign-applications', application);
    return response.data;
  },

  // Update application
  updateApplication: async (
    id: number, 
    updates: Partial<CampaignApplication>
  ): Promise<ApiResponse<{ application: CampaignApplication }>> => {
    const response: AxiosResponse<ApiResponse<{ application: CampaignApplication }>> = 
      await api.put(`/campaign-applications/${id}`, updates);
    return response.data;
  },

  // Cancel application
  cancelApplication: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = 
      await api.post(`/campaign-applications/${id}/cancel`);
    return response.data;
  },

  // Rate brand
  rateBrand: async (
    applicationId: number, 
    rating: number
  ): Promise<ApiResponse<{ application: CampaignApplication }>> => {
    const response: AxiosResponse<ApiResponse<{ application: CampaignApplication }>> = 
      await api.post(`/campaign-applications/${applicationId}/rate-brand`, { rating });
    return response.data;
  }
}; 