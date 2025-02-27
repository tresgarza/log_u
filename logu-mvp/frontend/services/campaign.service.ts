import api from './api';

export interface Campaign {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  brandId: number;
  objective?: string;
  targetAudience?: string;
  requirements?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilters {
  status?: Campaign['status'];
  brandId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CampaignsResponse {
  campaigns: Campaign[];
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalInfluencers: number;
  activeQRCodes: number;
  totalScans: number;
  totalConversions: number;
  conversionRate: number;
  totalSpent: number;
}

class CampaignService {
  async getCampaigns(filters?: CampaignFilters): Promise<ApiResponse<CampaignsResponse>> {
    try {
      const response = await api.get<ApiResponse<CampaignsResponse>>('/api/campaigns', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  async getCampaign(id: number) {
    try {
      const response = await api.get(`/api/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  async createCampaign(campaignData: Partial<Campaign>) {
    try {
      const response = await api.post('/api/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async updateCampaign(id: number, campaignData: Partial<Campaign>) {
    try {
      const response = await api.put(`/api/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(id: number) {
    try {
      const response = await api.delete(`/api/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  async getCampaignMetrics(id: number) {
    try {
      const response = await api.get(`/api/campaigns/${id}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign metrics:', error);
      throw error;
    }
  }

  async getBrandDashboardStats() {
    try {
      const response = await api.get('/api/campaigns/stats/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching brand dashboard stats:', error);
      throw error;
    }
  }
}

export const campaignService = new CampaignService(); 