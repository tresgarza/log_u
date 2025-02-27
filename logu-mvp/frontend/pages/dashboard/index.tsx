import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import theme from '../../styles/theme';
import { FiBarChart2, FiUsers, FiPackage, FiDollarSign, FiTrendingUp, FiCalendar, FiShoppingBag, FiGift } from 'react-icons/fi';
import authService from '../../services/auth.service';
import { qrCodeService } from '../../services/qr-code.service';
import { useAuth } from '../../hooks/useAuth';
import { campaignService } from '../../services/campaign.service';
import api from '../../services/api';

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalInfluencers: number;
  activeQRCodes: number;
  totalScans: number;
  totalConversions: number;
  conversionRate: number;
  totalSpent: number;
}

interface DashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
  };
}

interface InfluencerStatsResponse {
  success: boolean;
  data: {
    activeQRCodes: number;
    totalScans: number;
    totalEarnings: number;
    conversionRate: number;
  };
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, positive }) => (
  <StatCardWrapper>
    <StatHeader>
      <StatIcon>{icon}</StatIcon>
      <StatChange $positive={positive}>
        {change && (
          <>
            {positive ? '↑' : '↓'} {change}
          </>
        )}
      </StatChange>
    </StatHeader>
    <StatValue>{value}</StatValue>
    <StatTitle>{title}</StatTitle>
  </StatCardWrapper>
);

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, link, color }) => (
  <ActionCardWrapper href={link}>
    <ActionIcon $color={color}>{icon}</ActionIcon>
    <ActionContent>
      <ActionTitle>{title}</ActionTitle>
      <ActionDescription>{description}</ActionDescription>
    </ActionContent>
  </ActionCardWrapper>
);

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandStats = async () => {
      try {
        const response = await campaignService.getBrandDashboardStats() as DashboardResponse;
        setStats(response.data.stats);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    const fetchInfluencerStats = async () => {
      try {
        const response = await api.get<InfluencerStatsResponse>('/api/qrcodes/stats/dashboard');
        const data = response.data.data;
        // Map QR code stats to the dashboard stats format
        setStats({
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalInfluencers: 0,
          activeQRCodes: data.activeQRCodes,
          totalScans: data.totalScans,
          totalConversions: data.totalScans,
          conversionRate: data.conversionRate,
          totalSpent: data.totalEarnings
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      if (user.userType === 'brand') {
        fetchBrandStats();
      } else if (user.userType === 'influencer') {
        fetchInfluencerStats();
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Brand dashboard content
  const brandContent = (
    <>
      <DashboardSection>
        <SectionTitle>Overview</SectionTitle>
        {loading ? (
          <LoadingState>Loading statistics...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : stats ? (
          <StatsGrid>
            <StatCard 
              title="Total Campaigns" 
              value={formatNumber(stats.totalCampaigns)} 
              icon={<FiPackage size={24} />} 
              change={`${((stats.activeCampaigns / stats.totalCampaigns) * 100).toFixed(0)}%`}
              positive={true} 
            />
            <StatCard 
              title="Active Influencers" 
              value={formatNumber(stats.totalInfluencers)} 
              icon={<FiUsers size={24} />} 
              change="8%" 
              positive={true} 
            />
            <StatCard 
              title="QR Scans" 
              value={formatNumber(stats.totalScans)} 
              icon={<FiBarChart2 size={24} />} 
              change={`${((stats.totalConversions / stats.totalScans) * 100).toFixed(0)}%`}
              positive={true} 
            />
            <StatCard 
              title="Conversion Rate" 
              value={formatPercentage(stats.conversionRate)} 
              icon={<FiTrendingUp size={24} />} 
              change={formatPercentage(stats.conversionRate - 2.7)}
              positive={stats.conversionRate > 2.7} 
            />
          </StatsGrid>
        ) : null}
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionsGrid>
          <ActionCard 
            title="Create Campaign" 
            description="Launch a new marketing campaign" 
            icon={<FiCalendar size={24} />} 
            link="/dashboard/campaigns/new" 
            color={theme.colors.primary}
          />
          <ActionCard 
            title="Generate QR Code" 
            description="Create QR codes for influencers" 
            icon={<FiPackage size={24} />} 
            link="/dashboard/generate-qr" 
            color={theme.colors.secondary}
          />
          <ActionCard 
            title="Find Influencers" 
            description="Discover and connect with influencers" 
            icon={<FiUsers size={24} />} 
            link="/dashboard/influencers" 
            color={theme.colors.accent}
          />
          <ActionCard 
            title="View Analytics" 
            description="Track campaign performance" 
            icon={<FiBarChart2 size={24} />} 
            link="/dashboard/analytics" 
            color="#3B82F6"
          />
        </ActionsGrid>
      </DashboardSection>
    </>
  );

  // Influencer dashboard content
  const influencerContent = (
    <>
      <DashboardSection>
        <SectionTitle>Overview</SectionTitle>
        <StatsGrid>
          <StatCard 
            title="Active QR Codes" 
            value={stats?.activeQRCodes.toString() || ''} 
            icon={<FiPackage size={24} />}
          />
          <StatCard 
            title="Total Scans" 
            value={stats?.totalScans.toString() || ''} 
            icon={<FiBarChart2 size={24} />}
          />
          <StatCard 
            title="Earnings" 
            value={`$${stats?.totalSpent.toFixed(2) || ''}`} 
            icon={<FiDollarSign size={24} />}
          />
          <StatCard 
            title="Conversion Rate" 
            value={`${stats?.conversionRate.toFixed(1) || ''}%`} 
            icon={<FiTrendingUp size={24} />}
          />
        </StatsGrid>
      </DashboardSection>

      <DashboardSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionsGrid>
          <ActionCard 
            title="My QR Codes" 
            description="View and manage your QR codes" 
            icon={<FiPackage size={24} />} 
            link="/dashboard/qr-codes" 
            color={theme.colors.primary}
          />
          <ActionCard 
            title="Find Opportunities" 
            description="Discover new campaign opportunities" 
            icon={<FiGift size={24} />} 
            link="/dashboard/opportunities" 
            color={theme.colors.secondary}
          />
          <ActionCard 
            title="Track Earnings" 
            description="View your payment history" 
            icon={<FiDollarSign size={24} />} 
            link="/dashboard/payments" 
            color={theme.colors.accent}
          />
          <ActionCard 
            title="Campaign Applications" 
            description="Manage your campaign applications" 
            icon={<FiShoppingBag size={24} />} 
            link="/dashboard/applications" 
            color="#3B82F6"
          />
        </ActionsGrid>
      </DashboardSection>
    </>
  );

  return (
    <DashboardLayout title="Dashboard">
      <Head>
        <title>Dashboard | LogU</title>
        <meta name="description" content="LogU Dashboard" />
      </Head>

      <WelcomeMessage>
        Welcome back, <span>{user?.name}</span>
      </WelcomeMessage>

      {user?.userType === 'brand' ? brandContent : influencerContent}
    </DashboardLayout>
  );
};

// Styled Components
const DashboardSection = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.text.dark};
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCardWrapper = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.success : theme.colors.error};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCardWrapper = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $color }) => `${$color}10`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const WelcomeMessage = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text.dark};
  margin-bottom: 2rem;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.error};
`;

export default Dashboard; 