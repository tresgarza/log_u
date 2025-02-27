import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Campaign, campaignService } from '../../../services/campaign.service';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';

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

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.base};
  font-weight: ${props => props.theme.fontWeights.medium};
  text-decoration: none;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.secondary : props.theme.colors.background.gray};
  }
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CampaignCard = styled.div`
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  text-transform: capitalize;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${props.theme.colors.status.active}20;
          color: ${props.theme.colors.status.active};
        `;
      case 'draft':
        return `
          background: ${props.theme.colors.status.pending}20;
          color: ${props.theme.colors.status.pending};
        `;
      case 'completed':
        return `
          background: ${props.theme.colors.status.completed}20;
          color: ${props.theme.colors.status.completed};
        `;
      default:
        return `
          background: ${props.theme.colors.status.warning}20;
          color: ${props.theme.colors.status.warning};
        `;
    }
  }}
`;

const CardDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const DetailValue = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const ViewButton = styled.a`
  display: block;
  width: 100%;
  padding: 0.75rem;
  text-align: center;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.base};
  color: ${props => props.theme.colors.text.primary};
  font-weight: ${props => props.theme.fontWeights.medium};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background.gray};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
`;

const EmptyMessage = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background: ${props => `${props.theme.colors.error}10`};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.base};
  margin-bottom: 1.5rem;
`;

const CampaignsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Campaign['status'] | 'all'>('all');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignService.getCampaigns({
          brandId: user?.id,
          ...(statusFilter !== 'all' && { status: statusFilter }),
        });
        setCampaigns(response.data.campaigns);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === 'brand') {
      fetchCampaigns();
    }
  }, [user, statusFilter]);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignService.deleteCampaign(id);
      setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
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

  return (
    <DashboardLayout>
      <Head>
        <title>Campaigns - LogU</title>
      </Head>

      <Container>
        <Header>
          <div>
            <Title>Campaigns</Title>
            <Description>Manage your marketing campaigns</Description>
          </div>
          <Link href="/dashboard/campaigns/new" passHref>
            <CreateButton type="button">
              <FiPlus size={20} />
              Create Campaign
            </CreateButton>
          </Link>
        </Header>

        <FilterBar>
          <FilterButton
            $active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton
            $active={statusFilter === 'draft'}
            onClick={() => setStatusFilter('draft')}
          >
            Draft
          </FilterButton>
          <FilterButton
            $active={statusFilter === 'active'}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </FilterButton>
          <FilterButton
            $active={statusFilter === 'completed'}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </FilterButton>
        </FilterBar>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <LoadingMessage>Loading campaigns...</LoadingMessage>
        ) : campaigns.length === 0 ? (
          <EmptyState>
            <EmptyMessage>No campaigns found</EmptyMessage>
            <Link href="/dashboard/campaigns/new" passHref>
              <CreateButton type="button">
                <FiPlus size={20} />
                Create Your First Campaign
              </CreateButton>
            </Link>
          </EmptyState>
        ) : (
          <CampaignGrid>
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id}>
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                  <StatusBadge status={campaign.status}>
                    {campaign.status}
                  </StatusBadge>
                </CardHeader>
                <CardDescription>{campaign.description}</CardDescription>
                <CardDetails>
                  <DetailItem>
                    <DetailLabel>Start Date:</DetailLabel>
                    <DetailValue>
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>End Date:</DetailLabel>
                    <DetailValue>
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </DetailValue>
                  </DetailItem>
                  {campaign.budget && (
                    <DetailItem>
                      <DetailLabel>Budget:</DetailLabel>
                      <DetailValue>
                        ${campaign.budget.toLocaleString()}
                      </DetailValue>
                    </DetailItem>
                  )}
                </CardDetails>
                <CardActions>
                  <ActionButton
                    onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                    title="View Details"
                  >
                    <FiEye size={18} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/edit`)}
                    title="Edit Campaign"
                  >
                    <FiEdit2 size={18} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleDelete(campaign.id)}
                    title="Delete Campaign"
                    $danger
                  >
                    <FiTrash2 size={18} />
                  </ActionButton>
                </CardActions>
              </CampaignCard>
            ))}
          </CampaignGrid>
        )}
      </Container>
    </DashboardLayout>
  );
};

const Status = styled.span<{ color: string }>`
  padding: 0.25rem 0.75rem;
  background: ${({ color }) => `${color}15`};
  color: ${({ color }) => color};
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme, $danger }) =>
    $danger ? theme.colors.error + '15' : theme.colors.primary + '15'};
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.error : theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, $danger }) =>
      $danger ? theme.colors.error + '25' : theme.colors.primary + '25'};
  }
`;

export default CampaignsPage; 