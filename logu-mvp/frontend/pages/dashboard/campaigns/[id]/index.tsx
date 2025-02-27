import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { FiEdit2, FiTrash2, FiBarChart2, FiUsers, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Campaign, campaignService } from '../../../../services/campaign.service';

interface CampaignMetrics {
  totalApplications: number;
  totalQRCodes: number;
  usedQRCodes: number;
  conversionRate: number;
}

interface CampaignResponse {
  success: boolean;
  data: {
    campaign: Campaign;
  };
}

interface MetricsResponse {
  success: boolean;
  data: {
    metrics: CampaignMetrics;
  };
}

const CampaignDetailsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch campaign details
        const campaignResponse = await campaignService.getCampaign(Number(id)) as CampaignResponse;
        setCampaign(campaignResponse.data.campaign);

        // Fetch campaign metrics
        const metricsResponse = await campaignService.getCampaignMetrics(Number(id)) as MetricsResponse;
        setMetrics(metricsResponse.data.metrics);
      } catch (err: any) {
        console.error('Error fetching campaign details:', err);
        setError(err.response?.data?.message || 'Failed to load campaign details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !campaign) return;

    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignService.deleteCampaign(Number(id));
      router.push('/dashboard/campaigns');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'completed':
        return '#6366F1';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Container>
          <LoadingState>Loading campaign details...</LoadingState>
        </Container>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Container>
          <ErrorMessage>{error}</ErrorMessage>
        </Container>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <Container>
          <ErrorMessage>Campaign not found</ErrorMessage>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <TitleSection>
            <Title>{campaign.name}</Title>
            <Status color={getStatusColor(campaign.status)}>
              {campaign.status}
            </Status>
          </TitleSection>
          <Actions>
            <ActionButton
              onClick={() => router.push(`/dashboard/campaigns/${id}/edit`)}
              title="Edit Campaign"
            >
              <FiEdit2 size={20} />
              Edit
            </ActionButton>
            <ActionButton onClick={handleDelete} title="Delete Campaign" $danger>
              <FiTrash2 size={20} />
              Delete
            </ActionButton>
          </Actions>
        </Header>

        <Section>
          <SectionTitle>Campaign Details</SectionTitle>
          <DetailsGrid>
            <DetailCard>
              <Label>Description</Label>
              <Value>{campaign.description}</Value>
            </DetailCard>
            <DetailCard>
              <Label>Budget</Label>
              <Value>${campaign.budget.toLocaleString()}</Value>
            </DetailCard>
            <DetailCard>
              <Label>Start Date</Label>
              <Value>{new Date(campaign.startDate).toLocaleDateString()}</Value>
            </DetailCard>
            <DetailCard>
              <Label>End Date</Label>
              <Value>{new Date(campaign.endDate).toLocaleDateString()}</Value>
            </DetailCard>
          </DetailsGrid>
        </Section>

        {metrics && (
          <Section>
            <SectionTitle>Campaign Metrics</SectionTitle>
            <MetricsGrid>
              <MetricCard>
                <MetricIcon>
                  <FiUsers size={24} />
                </MetricIcon>
                <MetricContent>
                  <MetricValue>{metrics.totalApplications}</MetricValue>
                  <MetricLabel>Total Applications</MetricLabel>
                </MetricContent>
              </MetricCard>
              <MetricCard>
                <MetricIcon>
                  <FiBarChart2 size={24} />
                </MetricIcon>
                <MetricContent>
                  <MetricValue>{metrics.usedQRCodes} / {metrics.totalQRCodes}</MetricValue>
                  <MetricLabel>QR Codes Used</MetricLabel>
                </MetricContent>
              </MetricCard>
              <MetricCard>
                <MetricIcon>
                  <FiDollarSign size={24} />
                </MetricIcon>
                <MetricContent>
                  <MetricValue>${campaign.budget.toLocaleString()}</MetricValue>
                  <MetricLabel>Campaign Budget</MetricLabel>
                </MetricContent>
              </MetricCard>
              <MetricCard>
                <MetricIcon>
                  <FiTrendingUp size={24} />
                </MetricIcon>
                <MetricContent>
                  <MetricValue>{metrics.conversionRate.toFixed(1)}%</MetricValue>
                  <MetricLabel>Conversion Rate</MetricLabel>
                </MetricContent>
              </MetricCard>
            </MetricsGrid>
          </Section>
        )}
      </Container>
    </DashboardLayout>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Status = styled.span<{ color: string }>`
  padding: 0.25rem 0.75rem;
  background: ${({ color }) => `${color}15`};
  color: ${({ color }) => color};
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme, $danger }) =>
    $danger ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme, $danger }) =>
      $danger ? theme.colors.error : theme.colors.primaryDark};
    opacity: 0.9;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const DetailCard = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MetricIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 0.5rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default CampaignDetailsPage; 