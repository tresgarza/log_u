import { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CampaignForm from '../../../components/campaigns/CampaignForm';
import { Campaign, campaignService } from '../../../services/campaign.service';

const NewCampaignPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Partial<Campaign>) => {
    setIsLoading(true);
    setError(null);

    try {
      await campaignService.createCampaign(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create campaign');
      throw err; // Re-throw to let the form handle the error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Create New Campaign</Title>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <CampaignForm onSubmit={handleSubmit} isLoading={isLoading} />
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
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => `${theme.colors.error}15`};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 0.5rem;
`;

export default NewCampaignPage; 