import axios from 'axios';
import api from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface QRCode {
  id: number;
  code: string;
  campaignId: number;
  influencerId: number;
  status: 'active' | 'used' | 'expired' | 'revoked';
  redemptionType: 'fixed' | 'percentage';
  redemptionValue: number;
  usedAt?: string;
  expiresAt: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  campaignDetails?: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
    brand?: {
      id: number;
      name: string;
      profileImage?: string;
    }
  };
}

export interface GenerateQRCodeData {
  campaignId: number;
  influencerId: number;
  code?: string;
  redemptionType: 'fixed' | 'percentage';
  redemptionValue: number;
  expiresAt: Date;
  metadata?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface QRCodeResponse {
  qrCode: QRCode;
}

export interface QRCodesResponse {
  qrCodes: QRCode[];
}

class QRCodeService {
  async generateQRCode(data: GenerateQRCodeData): Promise<ApiResponse<QRCodeResponse>> {
    try {
      const response = await api.post<ApiResponse<QRCodeResponse>>('/api/qrcodes', data);
      return response.data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  async getQRCodes(filters?: { campaignId?: number; influencerId?: number; status?: QRCode['status'] }): Promise<ApiResponse<QRCodesResponse>> {
    try {
      const response = await api.get<ApiResponse<QRCodesResponse>>('/api/qrcodes', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      throw error;
    }
  }

  async getQRCode(id: number): Promise<ApiResponse<QRCodeResponse>> {
    try {
      const response = await api.get<ApiResponse<QRCodeResponse>>(`/api/qrcodes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching QR code:', error);
      throw error;
    }
  }

  async revokeQRCode(id: number): Promise<ApiResponse<QRCodeResponse>> {
    try {
      const response = await api.post<ApiResponse<QRCodeResponse>>(`/api/qrcodes/${id}/revoke`);
      return response.data;
    } catch (error) {
      console.error('Error revoking QR code:', error);
      throw error;
    }
  }

  async getMyQRCodes(filters?: { status?: QRCode['status'] }): Promise<ApiResponse<QRCodesResponse>> {
    try {
      const response = await api.get<ApiResponse<QRCodesResponse>>('/api/qrcodes/my', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching my QR codes:', error);
      throw error;
    }
  }

  async exportQRCodes(filters?: { status?: QRCode['status'] }): Promise<ApiResponse<{ url: string }>> {
    try {
      const response = await api.get<ApiResponse<{ url: string }>>('/api/qrcodes/export', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error exporting QR codes:', error);
      throw error;
    }
  }

  async updateQRCode(id: number, data: Partial<QRCode>): Promise<ApiResponse<QRCodeResponse>> {
    try {
      const response = await api.patch<ApiResponse<QRCodeResponse>>(`/api/qrcodes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating QR code:', error);
      throw error;
    }
  }

  async getCampaignQRCodes(campaignId: number, filters?: { status?: QRCode['status'] }): Promise<ApiResponse<QRCodesResponse>> {
    try {
      const response = await axios.get<ApiResponse<QRCodesResponse>>(`${API_URL}/api/campaigns/${campaignId}/qrcodes`, {
        params: filters,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign QR codes:', error);
      throw error;
    }
  }
}

export const qrCodeService = new QRCodeService(); 