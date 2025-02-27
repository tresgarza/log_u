import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import theme from '../../styles/theme';
import { FiSearch, FiFilter, FiPackage, FiDollarSign, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';
import { Campaign, campaignService } from '../../services/campaign.service';
import { campaignApplicationService } from '../../services/campaign-application.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Opportunities: NextPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [applying, setApplying] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getCampaigns({ 
        status: filter === 'all' ? undefined : filter 
      });
      if (response.success) {
        setCampaigns(response.data.campaigns);
      } else {
        toast.error('Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Error loading campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (campaignId: number) => {
    try {
      setApplying(prev => ({ ...prev, [campaignId]: true }));
      const response = await campaignApplicationService.applyToCampaign({
        campaignId,
        message: 'I am interested in this campaign and would love to participate!'
      });
      
      if (response.success) {
        toast.success('Application submitted successfully!');
        // Refresh campaigns to update status
        fetchCampaigns();
      } else {
        toast.error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying to campaign:', error);
      toast.error('Error submitting application');
    } finally {
      setApplying(prev => ({ ...prev, [campaignId]: false }));
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && campaign.status === filter;
  });

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Campaign Opportunities</Title>
          <Actions>
            <SearchBar>
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchBar>
            <FilterDropdown>
              <FiFilter size={20} />
              <select 
                value={filter} 
                onChange={(e) => {
                  setFilter(e.target.value);
                  fetchCampaigns();
                }}
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </FilterDropdown>
          </Actions>
        </Header>

        {loading ? (
          <LoadingState>Loading campaigns...</LoadingState>
        ) : filteredCampaigns.length === 0 ? (
          <EmptyState>No campaigns found</EmptyState>
        ) : (
          <Grid>
            {filteredCampaigns.map((campaign, index) => (
              <CampaignCard
                key={campaign.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CardHeader>
                  <BrandInfo>
                    <CampaignName>{campaign.name}</CampaignName>
                    <BrandName>Brand #{campaign.brandId}</BrandName>
                  </BrandInfo>
                  <StatusBadge status={campaign.status}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </StatusBadge>
                </CardHeader>

                <Description>{campaign.description}</Description>

                <Stats>
                  <Stat>
                    <StatIcon><FiDollarSign size={16} /></StatIcon>
                    <div>
                      <StatLabel>Budget</StatLabel>
                      <StatValue>${campaign.budget}</StatValue>
                    </div>
                  </Stat>
                  <Stat>
                    <StatIcon><FiCalendar size={16} /></StatIcon>
                    <div>
                      <StatLabel>Duration</StatLabel>
                      <StatValue>
                        {Math.ceil((new Date(campaign.endDate).getTime() - 
                          new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                      </StatValue>
                    </div>
                  </Stat>
                  <Stat>
                    <StatIcon><FiUsers size={16} /></StatIcon>
                    <div>
                      <StatLabel>Target</StatLabel>
                      <StatValue>{campaign.targetAudience || 'All'}</StatValue>
                    </div>
                  </Stat>
                </Stats>

                {campaign.requirements && (
                  <Requirements>
                    <RequirementsTitle>Requirements</RequirementsTitle>
                    <RequirementsList>
                      {campaign.requirements.split('\n').map((req, i) => (
                        <RequirementItem key={i}>{req}</RequirementItem>
                      ))}
                    </RequirementsList>
                  </Requirements>
                )}

                <ApplyButton
                  disabled={campaign.status !== 'active' || applying[campaign.id!]}
                  onClick={() => campaign.id && handleApply(campaign.id)}
                  as={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {applying[campaign.id!] ? 'Applying...' : 
                   campaign.status === 'active' ? 'Apply Now' : 'Campaign ' + campaign.status}
                  <FiArrowRight size={20} />
                </ApplyButton>
              </CampaignCard>
            ))}
          </Grid>
        )}
      </Container>
    </DashboardLayout>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};

  input {
    border: none;
    outline: none;
    background: none;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    min-width: 200px;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textLight};
    }
  }
`;

const FilterDropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};

  select {
    border: none;
    outline: none;
    background: none;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CampaignCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const BrandInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CampaignName = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const BrandName = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success + '20';
      case 'draft':
        return theme.colors.warning + '20';
      case 'completed':
        return theme.colors.info + '20';
      default:
        return theme.colors.border;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'draft':
        return theme.colors.warning;
      case 'completed':
        return theme.colors.info;
      default:
        return theme.colors.text;
    }
  }};
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.5;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary + '10'};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  display: block;
`;

const StatValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: block;
`;

const Requirements = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
`;

const RequirementsTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RequirementItem = styled.li`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "•";
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default Opportunities; 