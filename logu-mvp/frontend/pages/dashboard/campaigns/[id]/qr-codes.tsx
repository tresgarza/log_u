import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { QRCode, qrCodeService } from '../../../../services/qr-code.service';
import { Campaign, campaignService } from '../../../../services/campaign.service';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Link from 'next/link';
import { FiSearch, FiFilter, FiDownload, FiPlus, FiBarChart2, FiClock, FiDollarSign, FiEye, FiTrash2 } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const ModalComponent = dynamic(() => import('../../../../components/common/Modal'), { ssr: false });
const QRCodeDisplayComponent = dynamic(() => import('react-qr-code'), { ssr: false });

const CampaignQRCodes: NextPage = () => {
  const router = useRouter();
  const { id: campaignId } = router.query;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [exporting, setExporting] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      fetchData();
    }
  }, [campaignId, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaign details
      const campaignResponse = await campaignService.getCampaign(Number(campaignId));
      if (campaignResponse.success) {
        setCampaign(campaignResponse.data.campaign);
      }

      // Fetch QR codes for the campaign
      const qrResponse = await qrCodeService.getCampaignQRCodes(Number(campaignId), {
        status: filter === 'all' ? undefined : filter
      });
      if (qrResponse.success) {
        setQRCodes(qrResponse.data.qrCodes);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await qrCodeService.exportQRCodes({
        campaignId: Number(campaignId),
        status: filter === 'all' ? undefined : filter
      });
      if (response.success) {
        window.open(response.data.url, '_blank');
        toast.success('QR codes exported successfully');
      }
    } catch (error) {
      console.error('Error exporting QR codes:', error);
      toast.error('Error exporting QR codes');
    } finally {
      setExporting(false);
    }
  };

  const handleViewQRCode = (qrCode: QRCode) => {
    setSelectedQRCode(qrCode);
    setShowQRModal(true);
  };

  const handleRevokeQRCode = async (qrCode: QRCode) => {
    try {
      setRevoking(qrCode.id?.toString() || null);
      const response = await qrCodeService.updateQRCode(qrCode.id!, { status: 'revoked' });
      if (response.success) {
        toast.success('QR code revoked successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Error revoking QR code:', error);
      toast.error('Error revoking QR code');
    } finally {
      setRevoking(null);
    }
  };

  const filteredQRCodes = qrCodes.filter(qrCode => 
    qrCode.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Campaign QR Codes</Title>
          {campaign && <Subtitle>{campaign.name}</Subtitle>}
          <Actions>
            <SearchBar>
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="Search QR codes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchBar>
            <FilterDropdown>
              <FiFilter size={20} />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All QR Codes</option>
                <option value="active">Active</option>
                <option value="used">Used</option>
                <option value="expired">Expired</option>
                <option value="revoked">Revoked</option>
              </select>
            </FilterDropdown>
            <ActionButton onClick={handleExport} disabled={exporting}>
              <FiDownload size={20} />
              {exporting ? 'Exporting...' : 'Export'}
            </ActionButton>
            <ActionButton as={Link} href={`/dashboard/generate-qr?campaignId=${campaignId}`}>
              <FiPlus size={20} />
              Generate New
            </ActionButton>
          </Actions>
        </Header>

        {loading ? (
          <LoadingState>Loading QR codes...</LoadingState>
        ) : filteredQRCodes.length === 0 ? (
          <EmptyState>
            {search || filter !== 'all' ? (
              <>
                <p>No QR codes found matching your criteria.</p>
                <p>Try adjusting your search or filter settings.</p>
              </>
            ) : (
              <>
                <p>No QR codes have been generated for this campaign yet.</p>
                <p>Click "Generate New" to create your first QR code!</p>
              </>
            )}
          </EmptyState>
        ) : (
          <Grid>
            {filteredQRCodes.map((qrCode, index) => (
              <QRCodeCard
                key={qrCode.id}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CardHeader>
                  <QRCodeImage>
                    <QRCodeDisplayComponent
                      value={qrCode.code}
                      size={80}
                      level="M"
                    />
                  </QRCodeImage>
                  <QRCodeInfo>
                    <QRCodeID>{qrCode.code}</QRCodeID>
                    <StatusBadge status={qrCode.status}>
                      {qrCode.status.charAt(0).toUpperCase() + qrCode.status.slice(1)}
                    </StatusBadge>
                  </QRCodeInfo>
                </CardHeader>

                <Stats>
                  <Stat>
                    <StatIcon><FiBarChart2 size={16} /></StatIcon>
                    <div>
                      <StatLabel>Scans</StatLabel>
                      <StatValue>0</StatValue>
                    </div>
                  </Stat>
                  <Stat>
                    <StatIcon><FiClock size={16} /></StatIcon>
                    <div>
                      <StatLabel>Expires</StatLabel>
                      <StatValue>{format(new Date(qrCode.expiresAt), 'MMM d, yyyy')}</StatValue>
                    </div>
                  </Stat>
                  <Stat>
                    <StatIcon><FiDollarSign size={16} /></StatIcon>
                    <div>
                      <StatLabel>Value</StatLabel>
                      <StatValue>${qrCode.redemptionValue.toFixed(2)}</StatValue>
                    </div>
                  </Stat>
                </Stats>

                <CardActions>
                  <ActionLink onClick={() => handleViewQRCode(qrCode)}>
                    <FiEye size={16} />
                    View Details
                  </ActionLink>
                  {qrCode.status === 'active' && (
                    <ActionLink 
                      onClick={() => handleRevokeQRCode(qrCode)}
                      disabled={revoking === qrCode.id?.toString()}
                      className="danger"
                    >
                      <FiTrash2 size={16} />
                      {revoking === qrCode.id?.toString() ? 'Revoking...' : 'Revoke'}
                    </ActionLink>
                  )}
                </CardActions>
              </QRCodeCard>
            ))}
          </Grid>
        )}

        {showQRModal && selectedQRCode && (
          <ModalComponent
            isOpen={showQRModal}
            onClose={() => {
              setShowQRModal(false);
              setSelectedQRCode(null);
            }}
            title="QR Code Details"
          >
            <ModalContent>
              <QRCodeLarge>
                <QRCodeDisplayComponent
                  value={selectedQRCode.code}
                  size={200}
                  level="M"
                />
              </QRCodeLarge>
              
              <QRCodeValue>
                ${selectedQRCode.redemptionValue.toFixed(2)}
              </QRCodeValue>
              
              <QRCodeDetails>
                <DetailRow>
                  <DetailLabel>Code:</DetailLabel>
                  <DetailValue>{selectedQRCode.code}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={selectedQRCode.status}>
                      {selectedQRCode.status.charAt(0).toUpperCase() + selectedQRCode.status.slice(1)}
                    </StatusBadge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Influencer:</DetailLabel>
                  <DetailValue>{selectedQRCode.influencer?.name}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Created:</DetailLabel>
                  <DetailValue>{format(new Date(selectedQRCode.createdAt), 'MMM d, yyyy')}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Expires:</DetailLabel>
                  <DetailValue>{format(new Date(selectedQRCode.expiresAt), 'MMM d, yyyy')}</DetailValue>
                </DetailRow>
                {selectedQRCode.usedAt && (
                  <DetailRow>
                    <DetailLabel>Used:</DetailLabel>
                    <DetailValue>{format(new Date(selectedQRCode.usedAt), 'MMM d, yyyy')}</DetailValue>
                  </DetailRow>
                )}
              </QRCodeDetails>
            </ModalContent>
          </ModalComponent>
        )}
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  opacity: 0.7;
  margin-bottom: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  flex: 1;
  min-width: 200px;

  input {
    border: none;
    outline: none;
    margin-left: 0.5rem;
    width: 100%;
  }
`;

const FilterDropdown = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;

  select {
    border: none;
    outline: none;
    margin-left: 0.5rem;
    background: transparent;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const QRCodeCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const QRCodeImage = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const QRCodeInfo = styled.div`
  flex: 1;
`;

const QRCodeID = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success + '20';
      case 'used':
        return theme.colors.warning + '20';
      case 'expired':
        return theme.colors.error + '20';
      case 'revoked':
        return theme.colors.error + '20';
      default:
        return theme.colors.border;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'used':
        return theme.colors.warning;
      case 'expired':
        return theme.colors.error;
      case 'revoked':
        return theme.colors.error;
      default:
        return theme.colors.text;
    }
  }};
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
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
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.5;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
`;

const StatValue = styled.div`
  font-weight: 600;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ActionLink = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 0;
  font-size: 0.875rem;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;

  p {
    margin: 0.5rem 0;
  }
`;

const ModalContent = styled.div`
  padding: 2rem;
  text-align: center;
`;

const QRCodeLarge = styled.div`
  display: inline-block;
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const QRCodeValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const QRCodeDetails = styled.div`
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  margin: 0.5rem 0;
`;

const DetailLabel = styled.div`
  width: 100px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
`;

const DetailValue = styled.div`
  flex: 1;
  font-weight: 500;
`;

export default CampaignQRCodes; 