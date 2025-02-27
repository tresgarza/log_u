import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Campaign, campaignService } from '../../services/campaign.service';
import { User, userService } from '../../services/user.service';
import { qrCodeService } from '../../services/qr-code.service';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface FormData {
  campaignId: string;
  influencerId: string;
  code: string;
  redemptionType: 'fixed' | 'percentage';
  redemptionValue: string;
  expiresAfter: string;
}

const GenerateQRCode: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [influencers, setInfluencers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    campaignId: '',
    influencerId: '',
    code: '',
    redemptionType: 'fixed',
    redemptionValue: '10.00',
    expiresAfter: '30'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active campaigns for the current brand
        const campaignsResponse = await campaignService.getCampaigns({ 
          status: 'active',
          brandId: user?.id 
        });
        setCampaigns(campaignsResponse.data.campaigns);

        // Fetch active influencers using the new method
        const influencers = await userService.getInfluencers();
        setInfluencers(influencers);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load necessary data');
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiresAfter));

      const response = await qrCodeService.generateQRCode({
        campaignId: parseInt(formData.campaignId),
        influencerId: parseInt(formData.influencerId),
        code: formData.code || undefined,
        redemptionType: formData.redemptionType,
        redemptionValue: parseFloat(formData.redemptionValue),
        expiresAt: expiresAt,
        metadata: {
          generatedAt: new Date(),
          generatedBy: 'brand-dashboard'
        }
      });

      if (response.success) {
        toast.success('QR code generated successfully');
        router.push(user && user.type === 'brand' ? `/dashboard/campaigns/${formData.campaignId}/qr-codes` : '/dashboard/qr-codes');
      } else {
        toast.error(response.message || 'Failed to generate QR code');
      }
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      toast.error(error.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Generate QR Codes</Title>
          <Subtitle>Create unique QR codes for influencers in your campaigns</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="campaignId">Select Campaign</Label>
            <Select
              id="campaignId"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a campaign --</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="influencerId">Select Influencer</Label>
            <Select
              id="influencerId"
              name="influencerId"
              value={formData.influencerId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select an influencer --</option>
              {influencers.map(influencer => (
                <option key={influencer.id} value={influencer.id}>
                  {influencer.name} ({influencer.email})
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="code">Custom Code (Optional)</Label>
            <Input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter custom code or leave empty for auto-generation"
              pattern="^[A-Za-z0-9_-]{4,32}$"
              title="Code must be 4-32 characters long and contain only letters, numbers, hyphens, and underscores"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="redemptionType">Redemption Type</Label>
              <Select
                id="redemptionType"
                name="redemptionType"
                value={formData.redemptionType}
                onChange={handleChange}
                required
              >
                <option value="fixed">Fixed Amount ($)</option>
                <option value="percentage">Percentage (%)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="redemptionValue">
                {formData.redemptionType === 'fixed' ? 'Amount ($)' : 'Percentage (%)'}
              </Label>
              <Input
                type="number"
                id="redemptionValue"
                name="redemptionValue"
                value={formData.redemptionValue}
                onChange={handleChange}
                required
                min="0"
                max={formData.redemptionType === 'percentage' ? "100" : undefined}
                step={formData.redemptionType === 'percentage' ? "1" : "0.01"}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="expiresAfter">Expires After (days)</Label>
              <Input
                type="number"
                id="expiresAfter"
                name="expiresAfter"
                value={formData.expiresAfter}
                onChange={handleChange}
                required
                min="1"
                max="365"
              />
            </FormGroup>
          </FormRow>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate QR Code'}
          </SubmitButton>
        </Form>
      </Container>
    </DashboardLayout>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
  opacity: 0.7;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }
`;

export default GenerateQRCode; 