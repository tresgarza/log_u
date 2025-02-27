import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import theme from '../../styles/theme';
import { FiBarChart2, FiTrendingUp, FiUsers, FiPackage } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  scans: number[];
  conversions: number[];
  influencers: number[];
  revenue: number[];
}

const Analytics: NextPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    scans: [],
    conversions: [],
    influencers: [],
    revenue: []
  });

  useEffect(() => {
    // Simulated data - replace with actual API call
    const fetchAnalytics = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const dates = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        setAnalyticsData({
          scans: dates.map(() => Math.floor(Math.random() * 100 + 50)),
          conversions: dates.map(() => Math.floor(Math.random() * 30 + 10)),
          influencers: dates.map(() => Math.floor(Math.random() * 20 + 5)),
          revenue: dates.map(() => Math.floor(Math.random() * 1000 + 500)),
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const scanData = {
    labels: Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'QR Scans',
        data: analyticsData.scans,
        borderColor: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}20`,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Conversions',
        data: analyticsData.conversions,
        borderColor: theme.colors.secondary,
        backgroundColor: `${theme.colors.secondary}20`,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <PageTitle>Analytics Dashboard</PageTitle>
          <TimeRangeSelector>
            <TimeRangeButton 
              active={timeRange === '7d'} 
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === '30d'} 
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === '90d'} 
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </TimeRangeButton>
          </TimeRangeSelector>
        </Header>

        <Grid>
          <ChartCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChartTitle>QR Scans & Conversions</ChartTitle>
            <ChartContainer>
              <Line data={scanData} options={chartOptions} />
            </ChartContainer>
          </ChartCard>

          <MetricsGrid>
            <MetricCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <MetricIcon><FiBarChart2 size={24} /></MetricIcon>
              <MetricContent>
                <MetricLabel>Total Scans</MetricLabel>
                <MetricValue>{analyticsData.scans.reduce((a, b) => a + b, 0)}</MetricValue>
                <MetricChange positive>+12.5% vs last period</MetricChange>
              </MetricContent>
            </MetricCard>

            <MetricCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <MetricIcon><FiTrendingUp size={24} /></MetricIcon>
              <MetricContent>
                <MetricLabel>Conversion Rate</MetricLabel>
                <MetricValue>3.8%</MetricValue>
                <MetricChange positive>+0.5% vs last period</MetricChange>
              </MetricContent>
            </MetricCard>

            <MetricCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <MetricIcon><FiUsers size={24} /></MetricIcon>
              <MetricContent>
                <MetricLabel>Active Influencers</MetricLabel>
                <MetricValue>48</MetricValue>
                <MetricChange positive>+8 vs last period</MetricChange>
              </MetricContent>
            </MetricCard>

            <MetricCard
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <MetricIcon><FiPackage size={24} /></MetricIcon>
              <MetricContent>
                <MetricLabel>Active Campaigns</MetricLabel>
                <MetricValue>12</MetricValue>
                <MetricChange positive>+3 vs last period</MetricChange>
              </MetricContent>
            </MetricCard>
          </MetricsGrid>
        </Grid>
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
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TimeRangeButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.background2};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const ChartTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const MetricIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const MetricChange = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => positive ? theme.colors.success : theme.colors.error};
`;

export default Analytics; 