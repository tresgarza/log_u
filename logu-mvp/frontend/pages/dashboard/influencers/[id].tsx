import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import theme from '../../../styles/theme';
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiBarChart2,
  FiUsers,
  FiInstagram,
  FiYoutube,
  FiLink,
  FiMapPin,
  FiCalendar,
  FiStar,
} from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import Link from 'next/link';

interface SocialStats {
  platform: 'instagram' | 'tiktok' | 'youtube';
  followers: number;
  engagement: number;
  posts: number;
  averageLikes: number;
  averageComments: number;
}

interface Campaign {
  id: string;
  name: string;
  brand: string;
  brandLogo: string;
  status: 'active' | 'completed';
  earnings: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

interface Influencer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  categories: string[];
  socialStats: SocialStats[];
  metrics: {
    totalEarnings: number;
    totalConversions: number;
    averageEngagement: number;
    campaignsCompleted: number;
  };
  campaigns: Campaign[];
}

const InfluencerDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [influencer, setInfluencer] = useState<Influencer | null>(null);

  useEffect(() => {
    const fetchInfluencer = async () => {
      if (!id) return;

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockInfluencer: Influencer = {
          id: id as string,
          name: 'Sarah Johnson',
          avatar: 'https://i.pravatar.cc/150?img=1',
          email: 'sarah@example.com',
          phone: '+1 234 567 8900',
          location: 'Los Angeles, CA',
          bio: 'Lifestyle and fashion content creator passionate about sustainable fashion and mindful living.',
          categories: ['Fashion', 'Lifestyle', 'Beauty', 'Travel'],
          socialStats: [
            {
              platform: 'instagram',
              followers: 125000,
              engagement: 3.8,
              posts: 850,
              averageLikes: 4500,
              averageComments: 120,
            },
            {
              platform: 'tiktok',
              followers: 250000,
              engagement: 12.5,
              posts: 450,
              averageLikes: 15000,
              averageComments: 200,
            },
            {
              platform: 'youtube',
              followers: 75000,
              engagement: 8.2,
              posts: 120,
              averageLikes: 3500,
              averageComments: 150,
            },
          ],
          metrics: {
            totalEarnings: 45000,
            totalConversions: 2500,
            averageEngagement: 8.2,
            campaignsCompleted: 12,
          },
          campaigns: [
            {
              id: 'camp1',
              name: 'Summer Collection Launch',
              brand: 'Fashion Brand',
              brandLogo: 'https://i.pravatar.cc/40?img=2',
              status: 'active',
              earnings: 5000,
              conversions: 350,
              startDate: '2024-06-01T00:00:00Z',
              endDate: '2024-08-31T00:00:00Z',
            },
            {
              id: 'camp2',
              name: 'Holiday Campaign',
              brand: 'Beauty Brand',
              brandLogo: 'https://i.pravatar.cc/40?img=3',
              status: 'completed',
              earnings: 3500,
              conversions: 280,
              startDate: '2024-05-01T00:00:00Z',
              endDate: '2024-05-31T00:00:00Z',
            },
          ],
        };

        setInfluencer(mockInfluencer);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching influencer:', error);
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  if (!influencer) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getSocialIcon = (platform: SocialStats['platform']) => {
    switch (platform) {
      case 'instagram':
        return <FiInstagram size={24} />;
      case 'tiktok':
        return <SiTiktok size={24} />;
      case 'youtube':
        return <FiYoutube size={24} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <BackButton href="/dashboard/influencers">
            <FiArrowLeft size={20} />
            Back to Influencers
          </BackButton>
        </Header>

        <Content>
          <MainColumn>
            <Section>
              <ProfileHeader>
                <Avatar src={influencer.avatar} alt={influencer.name} />
                <ProfileInfo>
                  <Name>{influencer.name}</Name>
                  <Categories>
                    {influencer.categories.map(category => (
                      <Category key={category}>{category}</Category>
                    ))}
                  </Categories>
                  <ContactInfo>
                    <ContactItem>
                      <FiMail size={16} />
                      {influencer.email}
                    </ContactItem>
                    <ContactItem>
                      <FiPhone size={16} />
                      {influencer.phone}
                    </ContactItem>
                    <ContactItem>
                      <FiMapPin size={16} />
                      {influencer.location}
                    </ContactItem>
                  </ContactInfo>
                </ProfileInfo>
              </ProfileHeader>
              <Bio>{influencer.bio}</Bio>
            </Section>

            <Section>
              <SectionTitle>Social Media Presence</SectionTitle>
              <SocialGrid>
                {influencer.socialStats.map(stat => (
                  <SocialCard key={stat.platform}>
                    <SocialHeader>
                      <SocialIcon $platform={stat.platform}>
                        {getSocialIcon(stat.platform)}
                      </SocialIcon>
                      <SocialPlatform>
                        {stat.platform.charAt(0).toUpperCase() + stat.platform.slice(1)}
                      </SocialPlatform>
                    </SocialHeader>
                    <SocialStats>
                      <SocialStat>
                        <SocialStatLabel>Followers</SocialStatLabel>
                        <SocialStatValue>{formatNumber(stat.followers)}</SocialStatValue>
                      </SocialStat>
                      <SocialStat>
                        <SocialStatLabel>Engagement</SocialStatLabel>
                        <SocialStatValue>{stat.engagement}%</SocialStatValue>
                      </SocialStat>
                      <SocialStat>
                        <SocialStatLabel>Posts</SocialStatLabel>
                        <SocialStatValue>{formatNumber(stat.posts)}</SocialStatValue>
                      </SocialStat>
                    </SocialStats>
                    <SocialEngagement>
                      <EngagementItem>
                        <EngagementLabel>Avg. Likes</EngagementLabel>
                        <EngagementValue>{formatNumber(stat.averageLikes)}</EngagementValue>
                      </EngagementItem>
                      <EngagementItem>
                        <EngagementLabel>Avg. Comments</EngagementLabel>
                        <EngagementValue>{formatNumber(stat.averageComments)}</EngagementValue>
                      </EngagementItem>
                    </SocialEngagement>
                  </SocialCard>
                ))}
              </SocialGrid>
            </Section>

            <Section>
              <SectionTitle>Campaign History</SectionTitle>
              <CampaignsGrid>
                {influencer.campaigns.map(campaign => (
                  <CampaignCard key={campaign.id}>
                    <CampaignHeader>
                      <BrandLogo src={campaign.brandLogo} alt={campaign.brand} />
                      <CampaignInfo>
                        <CampaignName>{campaign.name}</CampaignName>
                        <BrandName>{campaign.brand}</BrandName>
                      </CampaignInfo>
                      <StatusBadge $status={campaign.status}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </StatusBadge>
                    </CampaignHeader>
                    <CampaignStats>
                      <CampaignStat>
                        <CampaignStatIcon>
                          <FiDollarSign size={16} />
                        </CampaignStatIcon>
                        <CampaignStatContent>
                          <CampaignStatLabel>Earnings</CampaignStatLabel>
                          <CampaignStatValue>{formatCurrency(campaign.earnings)}</CampaignStatValue>
                        </CampaignStatContent>
                      </CampaignStat>
                      <CampaignStat>
                        <CampaignStatIcon>
                          <FiBarChart2 size={16} />
                        </CampaignStatIcon>
                        <CampaignStatContent>
                          <CampaignStatLabel>Conversions</CampaignStatLabel>
                          <CampaignStatValue>{campaign.conversions}</CampaignStatValue>
                        </CampaignStatContent>
                      </CampaignStat>
                    </CampaignStats>
                    <CampaignDates>
                      <FiCalendar size={16} />
                      {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </CampaignDates>
                  </CampaignCard>
                ))}
              </CampaignsGrid>
            </Section>
          </MainColumn>

          <Sidebar>
            <SidebarSection>
              <SectionTitle>Performance Metrics</SectionTitle>
              <MetricsGrid>
                <MetricCard>
                  <MetricIcon>
                    <FiDollarSign size={24} />
                  </MetricIcon>
                  <MetricContent>
                    <MetricValue>{formatCurrency(influencer.metrics.totalEarnings)}</MetricValue>
                    <MetricLabel>Total Earnings</MetricLabel>
                  </MetricContent>
                </MetricCard>

                <MetricCard>
                  <MetricIcon>
                    <FiBarChart2 size={24} />
                  </MetricIcon>
                  <MetricContent>
                    <MetricValue>{influencer.metrics.totalConversions}</MetricValue>
                    <MetricLabel>Total Conversions</MetricLabel>
                  </MetricContent>
                </MetricCard>

                <MetricCard>
                  <MetricIcon>
                    <FiStar size={24} />
                  </MetricIcon>
                  <MetricContent>
                    <MetricValue>{influencer.metrics.averageEngagement}%</MetricValue>
                    <MetricLabel>Avg. Engagement</MetricLabel>
                  </MetricContent>
                </MetricCard>

                <MetricCard>
                  <MetricIcon>
                    <FiUsers size={24} />
                  </MetricIcon>
                  <MetricContent>
                    <MetricValue>{influencer.metrics.campaignsCompleted}</MetricValue>
                    <MetricLabel>Campaigns Completed</MetricLabel>
                  </MetricContent>
                </MetricCard>
              </MetricsGrid>
            </SidebarSection>
          </Sidebar>
        </Content>
      </Container>
    </DashboardLayout>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const BackButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 1rem;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Category = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Bio = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const SocialCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const SocialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SocialIcon = styled.div<{ $platform: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $platform }) => {
    switch ($platform) {
      case 'instagram':
        return '#E1306C20';
      case 'tiktok':
        return '#00F2EA20';
      case 'youtube':
        return '#FF000020';
      default:
        return theme.colors.background;
    }
  }};
  color: ${({ $platform }) => {
    switch ($platform) {
      case 'instagram':
        return '#E1306C';
      case 'tiktok':
        return '#00F2EA';
      case 'youtube':
        return '#FF0000';
      default:
        return '#000000';
    }
  }};
`;

const SocialPlatform = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const SocialStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SocialStat = styled.div`
  text-align: center;
`;

const SocialStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const SocialStatValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SocialEngagement = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const EngagementItem = styled.div`
  text-align: center;
`;

const EngagementLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const EngagementValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const CampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const CampaignCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const CampaignHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const CampaignInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CampaignName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BrandName = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ theme, $status }) =>
    $status === 'active' ? `${theme.colors.success}20` : `${theme.colors.info}20`};
  color: ${({ theme, $status }) =>
    $status === 'active' ? theme.colors.success : theme.colors.info};
`;

const CampaignStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CampaignStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CampaignStatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CampaignStatContent = styled.div``;

const CampaignStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const CampaignStatValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const CampaignDates = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SidebarSection = styled(Section)`
  padding: 1.25rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
`;

const MetricIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

export default InfluencerDetails; 