import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import theme from '../../styles/theme';
import { FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiDownload, FiFilter } from 'react-icons/fi';

interface Payment {
  id: string;
  campaignName: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  date: string;
  paymentMethod: string;
  transactionId?: string;
}

const Payments: NextPage = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    lastPayment: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockPayments: Payment[] = Array.from({ length: 10 }, (_, i) => ({
          id: `pay-${i + 1}`,
          campaignName: `Campaign ${i + 1}`,
          amount: Math.floor(Math.random() * 900) + 100,
          status: ['pending', 'processing', 'paid', 'failed'][Math.floor(Math.random() * 4)] as Payment['status'],
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethod: ['PayPal', 'Bank Transfer', 'Stripe'][Math.floor(Math.random() * 3)],
          transactionId: Math.random() > 0.5 ? `TXN-${Math.random().toString(36).substr(2, 9)}` : undefined,
        }));

        setPayments(mockPayments);

        // Calculate stats
        const total = mockPayments.reduce((sum, payment) => sum + (payment.status === 'paid' ? payment.amount : 0), 0);
        const pending = mockPayments.reduce((sum, payment) => sum + (payment.status === 'pending' ? payment.amount : 0), 0);
        const lastPaid = Math.max(...mockPayments
          .filter(payment => payment.status === 'paid')
          .map(payment => payment.amount));

        setStats({
          totalEarnings: total,
          pendingPayments: pending,
          lastPayment: lastPaid,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return payment.status === 'pending' || payment.status === 'processing';
    if (filter === 'paid') return payment.status === 'paid';
    return true;
  });

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'processing':
        return theme.colors.info;
      case 'paid':
        return theme.colors.success;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.gray[500];
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Payments</Title>
          <FilterDropdown>
            <FiFilter size={20} />
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </FilterDropdown>
        </Header>

        <StatsGrid>
          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatIcon $color={theme.colors.primary}>
              <FiDollarSign size={24} />
            </StatIcon>
            <StatContent>
              <StatLabel>Total Earnings</StatLabel>
              <StatValue>${stats.totalEarnings.toFixed(2)}</StatValue>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatIcon $color={theme.colors.warning}>
              <FiClock size={24} />
            </StatIcon>
            <StatContent>
              <StatLabel>Pending Payments</StatLabel>
              <StatValue>${stats.pendingPayments.toFixed(2)}</StatValue>
            </StatContent>
          </StatCard>

          <StatCard
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatIcon $color={theme.colors.success}>
              <FiCheckCircle size={24} />
            </StatIcon>
            <StatContent>
              <StatLabel>Last Payment</StatLabel>
              <StatValue>${stats.lastPayment.toFixed(2)}</StatValue>
            </StatContent>
          </StatCard>
        </StatsGrid>

        <PaymentsTable>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, index) => (
              <TableRow
                key={payment.id}
                as={motion.tr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td>{payment.campaignName}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>
                  <StatusBadge $color={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </StatusBadge>
                </td>
                <td>{formatDate(payment.date)}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.transactionId || '-'}</td>
                <td>
                  <ActionButton disabled={!payment.transactionId}>
                    <FiDownload size={16} />
                    Receipt
                  </ActionButton>
                </td>
              </TableRow>
            ))}
          </tbody>
        </PaymentsTable>
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

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => `${$color}10`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PaymentsTable = styled.table`
  width: 100%;
  background: white;
  border-radius: 1rem;
  border-spacing: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  th {
    text-align: left;
    padding: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textLight};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const TableRow = styled.tr`
  &:last-child td {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Payments; 