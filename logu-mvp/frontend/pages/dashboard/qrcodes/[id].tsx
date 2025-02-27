import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import theme from '../../../styles/theme';
import {
  FiArrowLeft,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiBarChart2,
  FiUsers,
  FiMapPin,
  FiClock,
  FiSmartphone,
  FiGlobe,
  FiCalendar,
} from 'react-icons/fi';
import Link from 'next/link';
import { QRCode } from 'react-qrcode-logo';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ScanData {
  id: string;
  timestamp: string;
  location: string;
  device: string;
  browser: string;
  converted: boolean;
}

interface QRCode {
  id: string;
  name: string;
  campaign: {
    id: string;
    name: string;
    brand: string;
    brandLogo: string;
  };
  influencer: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  metrics: {
    totalScans: number;
    uniqueScans: number;
    conversions: number;
    conversionRate: number;
  };
  locationStats: Array<{
    city: string;
    country: string;
    scans: number;
  }>;
  deviceStats: Array<{
    device: string;
    percentage: number;
  }>;
  recentScans: ScanData[];
}

const QRCodeDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [qrCode, setQRCode] = useState<QRCode | null>(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (!id) return;

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockQRCode: QRCode = {
          id: id as string,
          name: 'Summer Collection QR Code',
          campaign: {
            id: 'camp1',
            name: 'Summer Collection Launch',
            brand: 'Fashion Brand',
            brandLogo: 'https://i.pravatar.cc/40?img=1',
          },
          influencer: {
            id: 'inf1',
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/40?img=2',
          },
          createdAt: '2024-06-01T00:00:00Z',
          metrics: {
            totalScans: 1250,
            uniqueScans: 980,
            conversions: 320,
            conversionRate: 32.65,
          },
          locationStats: [
            { city: 'New York', country: 'United States', scans: 250 },
            { city: 'Los Angeles', country: 'United States', scans: 180 },
            { city: 'London', country: 'United Kingdom', scans: 150 },
            { city: 'Toronto', country: 'Canada', scans: 120 },
            { city: 'Sydney', country: 'Australia', scans: 100 },
          ],
          deviceStats: [
            { device: 'iOS', percentage: 45 },
            { device: 'Android', percentage: 40 },
            { device: 'Desktop', percentage: 15 },
          ],
          recentScans: [
            {
              id: 'scan1',
              timestamp: '2024-06-15T14:30:00Z',
              location: 'New York, United States',
              device: 'iPhone 13',
              browser: 'Safari',
              converted: true,
            },
            {
              id: 'scan2',
              timestamp: '2024-06-15T14:15:00Z',
              location: 'London, United Kingdom',
              device: 'Samsung Galaxy S21',
              browser: 'Chrome',
              converted: false,
            },
            {
              id: 'scan3',
              timestamp: '2024-06-15T14:00:00Z',
              location: 'Toronto, Canada',
              device: 'iPhone 12',
              browser: 'Safari',
              converted: true,
            },
          ],
        };

        setQRCode(mockQRCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching QR code:', error);
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [id]);

  if (!qrCode) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <BackButton href="/dashboard/qr-codes">
            <FiArrowLeft size={20} />
            Back to QR Codes
          </BackButton>
          <Actions>
            <ActionButton>
              <FiDownload size={20} />
              Download QR
            </ActionButton>
            <ActionButton>
              <FiEdit2 size={20} />
              Edit
            </ActionButton>
            <ActionButton $variant="danger">
              <FiTrash2 size={20} />
              Delete
            </ActionButton>
          </Actions>
        </Header>

        <Content>
          <MainColumn>
            <Section>
              <QRHeader>
                <QRInfo>
                  <QRName>{qrCode.name}</QRName>
                  <QRMeta>
                    Created on {formatDate(qrCode.createdAt)} for{' '}
                    <Link href={`/dashboard/campaigns/${qrCode.campaign.id}`}>
                      {qrCode.campaign.name}
                    </Link>
                  </QRMeta>
                </QRInfo>
                <CampaignInfo>
                  <BrandLogo src={qrCode.campaign.brandLogo} alt={qrCode.campaign.brand} />
                  <div>
                    <BrandName>{qrCode.campaign.brand}</BrandName>
                    <InfluencerName>
                      by{' '}
                      <Link href={`/dashboard/influencers/${qrCode.influencer.id}`}>
                        {qrCode.influencer.name}
                      </Link>
                    </InfluencerName>
                  </div>
                </CampaignInfo>
              </QRHeader>

              <MetricsGrid>
                <MetricCard>
                  <MetricIcon>
                    <FiBarChart2 size={24} />
                  </MetricIcon>
                  <MetricContent>
                    <MetricValue>{qrCode.metrics.totalScans}</MetricValue>
                    <MetricLabel>Total Scans</MetricLabel>
                    <MetricMeta>{qrCode.metrics.uniqueScans} unique visitors</MetricMeta>
                  </MetricContent>
                </MetricCard>

                <MetricCard>
                  <MetricIcon>
                    <FiUsers size={24} />
                  </MetricIcon>
                  <MetricContent>
                    <MetricValue>{qrCode.metrics.conversions}</MetricValue>
                    <MetricLabel>Conversions</MetricLabel>
                    <MetricMeta>{qrCode.metrics.conversionRate}% conversion rate</MetricMeta>
                  </MetricContent>
                </MetricCard>
              </MetricsGrid>
            </Section>

            <Section>
              <SectionTitle>Recent Scans</SectionTitle>
              <ScansTable>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {qrCode.recentScans.map(scan => (
                    <tr key={scan.id}>
                      <td>{formatDateTime(scan.timestamp)}</td>
                      <td>{scan.location}</td>
                      <td>{scan.device}</td>
                      <td>{scan.browser}</td>
                      <td>
                        <ScanStatus $converted={scan.converted}>
                          {scan.converted ? 'Converted' : 'Scanned'}
                        </ScanStatus>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ScansTable>
            </Section>
          </MainColumn>

          <Sidebar>
            <SidebarSection>
              <SectionTitle>Location Stats</SectionTitle>
              <LocationList>
                {qrCode.locationStats.map(stat => (
                  <LocationItem key={stat.city}>
                    <LocationIcon>
                      <FiMapPin size={16} />
                    </LocationIcon>
                    <LocationContent>
                      <LocationName>
                        {stat.city}, {stat.country}
                      </LocationName>
                      <LocationScans>{stat.scans} scans</LocationScans>
                    </LocationContent>
                    <LocationPercentage>
                      {Math.round((stat.scans / qrCode.metrics.totalScans) * 100)}%
                    </LocationPercentage>
                  </LocationItem>
                ))}
              </LocationList>
            </SidebarSection>

            <SidebarSection>
              <SectionTitle>Device Distribution</SectionTitle>
              <DeviceStats>
                {qrCode.deviceStats.map(stat => (
                  <DeviceStat key={stat.device}>
                    <DeviceInfo>
                      <DeviceIcon>
                        {stat.device === 'iOS' || stat.device === 'Android' ? (
                          <FiSmartphone size={16} />
                        ) : (
                          <FiGlobe size={16} />
                        )}
                      </DeviceIcon>
                      <DeviceName>{stat.device}</DeviceName>
                    </DeviceInfo>
                    <DevicePercentage>{stat.percentage}%</DevicePercentage>
                    <DeviceBar>
                      <DeviceBarFill $percentage={stat.percentage} />
                    </DeviceBar>
                  </DeviceStat>
                ))}
              </DeviceStats>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme, $variant }) =>
    $variant === 'danger' ? `${theme.colors.error}20` : 'white'};
  color: ${({ theme, $variant }) =>
    $variant === 'danger' ? theme.colors.error : theme.colors.text};
  border: 1px solid ${({ theme, $variant }) =>
    $variant === 'danger' ? theme.colors.error : theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === 'danger' ? theme.colors.error : theme.colors.background};
    color: ${({ $variant }) => ($variant === 'danger' ? 'white' : undefined)};
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

const QRHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const QRInfo = styled.div`
  flex: 1;
`;

const QRName = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const QRMeta = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CampaignInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const BrandName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

const InfluencerName = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  display: flex;
  align-items: flex-start;
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
  margin-bottom: 0.5rem;
`;

const MetricMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const ScansTable = styled.table`
  width: 100%;
  border-spacing: 0;

  th, td {
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
  }

  th {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textLight};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ScanStatus = styled.span<{ $converted: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ theme, $converted }) =>
    $converted ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ theme, $converted }) =>
    $converted ? theme.colors.success : theme.colors.warning};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SidebarSection = styled(Section)`
  padding: 1.25rem;
`;

const LocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LocationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LocationIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LocationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const LocationName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LocationScans = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const LocationPercentage = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DeviceStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DeviceStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DeviceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DeviceIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeviceName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DevicePercentage = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DeviceBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
`;

const DeviceBarFill = styled.div<{ $percentage: number }>`
  width: ${({ $percentage }) => $percentage}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

export default QRCodeDetails; 