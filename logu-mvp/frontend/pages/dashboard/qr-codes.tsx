import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FiSearch, FiFilter, FiDownload, FiPlus, FiBarChart2, FiClock, FiDollarSign, FiEye, FiTrash2, FiBriefcase } from 'react-icons/fi';
import { QRCode, qrCodeService } from '../../services/qr-code.service';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ModalComponent = dynamic(() => import('../../components/common/Modal'), { ssr: false });
const QRCodeDisplayComponent = dynamic(() => import('react-qr-code'), { ssr: false });

type QRCodeStatus = 'active' | 'used' | 'expired' | 'revoked';

interface QRCodeDisplayProps {
  value: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
}

const QRCodes: NextPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<QRCodeStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [exporting, setExporting] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    fetchQRCodes();
  }, [filter]);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const response = await qrCodeService.getMyQRCodes({
        status: filter === 'all' ? undefined : filter as QRCodeStatus
      });
      if (response.success) {
        setQRCodes(response.data.qrCodes);
      } else {
        toast.error('Failed to fetch QR codes');
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Error loading QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await qrCodeService.exportQRCodes({
        status: filter === 'all' ? undefined : filter as QRCodeStatus
      });
      if (response.success) {
        window.open(response.data.url, '_blank');
        toast.success('QR codes exported successfully');
      } else {
        toast.error('Failed to export QR codes');
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
        fetchQRCodes(); // Refresh the list
      } else {
        toast.error('Failed to revoke QR code');
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
          <Title>My QR Codes</Title>
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
                onChange={(e) => setFilter(e.target.value as QRCodeStatus | 'all')}
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
            <ActionButton as={Link} href="/dashboard/qr-codes/generate">
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
                <p>You don't have any QR codes yet.</p>
                <p>Join campaigns to start generating QR codes!</p>
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

                <CampaignSection>
                  {qrCode.campaignDetails && (
                    <>
                      <CampaignName>
                        <FiBriefcase size={16} />
                        {qrCode.campaignDetails.name}
                      </CampaignName>
                      {qrCode.campaignDetails.brand && (
                        <BrandName>
                          by {qrCode.campaignDetails.brand.name}
                        </BrandName>
                      )}
                    </>
                  )}
                </CampaignSection>

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
              <QRCodeModalSection>
                <QRCodeDisplayComponent
                  value={selectedQRCode.code}
                  size={200}
                  level="M"
                />
              </QRCodeModalSection>

              <QRCodeModalInfo>
                <QRCodeModalField>
                  <FieldLabel>Code:</FieldLabel>
                  <FieldValue>{selectedQRCode.code}</FieldValue>
                </QRCodeModalField>

                {selectedQRCode.campaignDetails && (
                  <>
                    <QRCodeModalField>
                      <FieldLabel>Campaign:</FieldLabel>
                      <FieldValue>{selectedQRCode.campaignDetails.name}</FieldValue>
                    </QRCodeModalField>

                    {selectedQRCode.campaignDetails.brand && (
                      <QRCodeModalField>
                        <FieldLabel>Brand:</FieldLabel>
                        <FieldValue>{selectedQRCode.campaignDetails.brand.name}</FieldValue>
                      </QRCodeModalField>
                    )}
                  </>
                )}

                <QRCodeModalField>
                  <FieldLabel>Status:</FieldLabel>
                  <StatusBadge status={selectedQRCode.status}>
                    {selectedQRCode.status.charAt(0).toUpperCase() + selectedQRCode.status.slice(1)}
                  </StatusBadge>
                </QRCodeModalField>

                <QRCodeModalField>
                  <FieldLabel>Value:</FieldLabel>
                  <FieldValue>${selectedQRCode.redemptionValue.toFixed(2)}</FieldValue>
                </QRCodeModalField>

                <QRCodeModalField>
                  <FieldLabel>Expires:</FieldLabel>
                  <FieldValue>{format(new Date(selectedQRCode.expiresAt), 'MMM d, yyyy')}</FieldValue>
                </QRCodeModalField>
              </QRCodeModalInfo>
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
  flex-wrap: wrap;
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

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme, $variant }) => {
    if ($variant === 'danger') {
      return theme.colors.error;
    }
    return theme.colors.primary;
  }};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, $variant }) => {
      if ($variant === 'danger') {
        return theme.colors.error + 'dd';
      }
      return theme.colors.primary + 'dd';
    }};
  }

  &:disabled {
    background: ${({ theme, $variant }) => {
      if ($variant === 'danger') {
        return theme.colors.error + '20';
      }
      return theme.colors.border;
    }};
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const QRCodeInfo = styled.div`
  flex: 1;
`;

const QRCodeID = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
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
      case 'used':
        return theme.colors.info + '20';
      case 'expired':
        return theme.colors.warning + '20';
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
        return theme.colors.info;
      case 'expired':
        return theme.colors.warning;
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

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ActionLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}10`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error};

    &:hover {
      background: ${({ theme }) => `${theme.colors.error}10`};
    }
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

const QRCodeModalSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
`;

const QRCodeModalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const QRCodeModalField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
`;

const FieldValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CampaignSection = styled.div`
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
`;

const CampaignName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const BrandName = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 0.25rem;
  margin-left: 1.5rem;
`;

export default QRCodes; 