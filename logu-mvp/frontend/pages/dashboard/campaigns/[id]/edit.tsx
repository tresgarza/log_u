import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import CampaignForm from '../../../../components/campaigns/CampaignForm';
import { Campaign, campaignService } from '../../../../services/campaign.service';

const EditCampaignPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        const response = await campaignService.getCampaign(Number(id));
        setCampaign(response.data.campaign);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load campaign');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleSubmit = async (data: Partial<Campaign>) => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      await campaignService.updateCampaign(Number(id), data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update campaign');
      throw err; // Re-throw to let the form handle the error
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign && !error) {
    return (
      <DashboardLayout>
        <Container>
          <LoadingState>Loading campaign...</LoadingState>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Edit Campaign</Title>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {campaign && (
          <CampaignForm
            initialData={campaign}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
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

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default EditCampaignPage; 