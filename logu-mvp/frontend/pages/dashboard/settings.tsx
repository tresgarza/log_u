import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import theme from '../../styles/theme';
import { FiUser, FiDollarSign, FiBell, FiLock, FiSave, FiPlus } from 'react-icons/fi';

interface PaymentMethod {
  id: string;
  type: 'paypal' | 'bank' | 'stripe';
  details: string;
  isDefault: boolean;
}

interface NotificationSetting {
  type: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const Settings: NextPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    bio: 'Digital content creator specializing in lifestyle and tech reviews.',
    avatar: 'https://i.pravatar.cc/150?img=8',
    socialLinks: {
      instagram: '@johndoe',
      tiktok: '@johndoe',
      youtube: '@johndoe',
    },
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'paypal',
      details: 'john@example.com',
      isDefault: true,
    },
    {
      id: '2',
      type: 'bank',
      details: '**** **** **** 4321',
      isDefault: false,
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      type: 'New Campaign Opportunities',
      email: true,
      push: true,
      sms: false,
    },
    {
      type: 'Payment Updates',
      email: true,
      push: true,
      sms: true,
    },
    {
      type: 'Campaign Status Changes',
      email: true,
      push: false,
      sms: false,
    },
    {
      type: 'Platform Updates',
      email: true,
      push: false,
      sms: false,
    },
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
    alert('Profile updated successfully!');
  };

  const handleNotificationToggle = (index: number, channel: 'email' | 'push' | 'sms') => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index] = {
      ...updatedNotifications[index],
      [channel]: !updatedNotifications[index][channel],
    };
    setNotifications(updatedNotifications);
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Settings</Title>
        </Header>

        <Content>
          <Sidebar>
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser size={20} />
              Profile
            </TabButton>
            <TabButton
              active={activeTab === 'payments'}
              onClick={() => setActiveTab('payments')}
            >
              <FiDollarSign size={20} />
              Payment Methods
            </TabButton>
            <TabButton
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            >
              <FiBell size={20} />
              Notifications
            </TabButton>
            <TabButton
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            >
              <FiLock size={20} />
              Security
            </TabButton>
          </Sidebar>

          <MainContent>
            {activeTab === 'profile' && (
              <Section
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SectionTitle>Profile Information</SectionTitle>
                <form onSubmit={handleProfileUpdate}>
                  <FormGrid>
                    <FormGroup>
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup full>
                      <Label>Bio</Label>
                      <TextArea
                        value={profile.bio}
                        onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Instagram</Label>
                      <Input
                        type="text"
                        value={profile.socialLinks.instagram}
                        onChange={e => setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                        })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>TikTok</Label>
                      <Input
                        type="text"
                        value={profile.socialLinks.tiktok}
                        onChange={e => setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, tiktok: e.target.value }
                        })}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>YouTube</Label>
                      <Input
                        type="text"
                        value={profile.socialLinks.youtube}
                        onChange={e => setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, youtube: e.target.value }
                        })}
                      />
                    </FormGroup>
                  </FormGrid>
                  <Button type="submit">
                    <FiSave size={20} />
                    Save Changes
                  </Button>
                </form>
              </Section>
            )}

            {activeTab === 'payments' && (
              <Section
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SectionTitle>Payment Methods</SectionTitle>
                <PaymentMethodsGrid>
                  {paymentMethods.map(method => (
                    <PaymentMethodCard key={method.id}>
                      <PaymentMethodIcon>
                        {method.type === 'paypal' && '💰'}
                        {method.type === 'bank' && '🏦'}
                        {method.type === 'stripe' && '💳'}
                      </PaymentMethodIcon>
                      <PaymentMethodDetails>
                        <PaymentMethodType>
                          {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                        </PaymentMethodType>
                        <PaymentMethodInfo>{method.details}</PaymentMethodInfo>
                      </PaymentMethodDetails>
                      <DefaultButton
                        onClick={() => handleSetDefaultPayment(method.id)}
                        active={method.isDefault}
                      >
                        {method.isDefault ? 'Default' : 'Set as Default'}
                      </DefaultButton>
                    </PaymentMethodCard>
                  ))}
                  <AddPaymentMethod>
                    <FiPlus size={24} />
                    Add Payment Method
                  </AddPaymentMethod>
                </PaymentMethodsGrid>
              </Section>
            )}

            {activeTab === 'notifications' && (
              <Section
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SectionTitle>Notification Preferences</SectionTitle>
                <NotificationTable>
                  <thead>
                    <tr>
                      <th>Notification Type</th>
                      <th>Email</th>
                      <th>Push</th>
                      <th>SMS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification, index) => (
                      <tr key={notification.type}>
                        <td>{notification.type}</td>
                        <td>
                          <Toggle
                            checked={notification.email}
                            onChange={() => handleNotificationToggle(index, 'email')}
                          />
                        </td>
                        <td>
                          <Toggle
                            checked={notification.push}
                            onChange={() => handleNotificationToggle(index, 'push')}
                          />
                        </td>
                        <td>
                          <Toggle
                            checked={notification.sms}
                            onChange={() => handleNotificationToggle(index, 'sms')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </NotificationTable>
              </Section>
            )}

            {activeTab === 'security' && (
              <Section
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SectionTitle>Security Settings</SectionTitle>
                <FormGrid>
                  <FormGroup>
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </FormGroup>
                  <FormGroup>
                    <Label>New Password</Label>
                    <Input type="password" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </FormGroup>
                </FormGrid>
                <Button>
                  <FiSave size={20} />
                  Update Password
                </Button>
              </Section>
            )}
          </MainContent>
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

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TabButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ active, theme }) => active ? theme.colors.primary : 'white'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.background};
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const Section = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div<{ full?: boolean }>`
  grid-column: ${({ full }) => full ? '1 / -1' : 'span 1'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const PaymentMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const PaymentMethodCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem;
`;

const PaymentMethodIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const PaymentMethodDetails = styled.div`
  flex: 1;
`;

const PaymentMethodType = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const PaymentMethodInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const DefaultButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 0.5rem;
  background: ${({ theme, active }) => active ? `${theme.colors.primary}10` : 'transparent'};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => `${theme.colors.primary}10`};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddPaymentMethod = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NotificationTable = styled.table`
  width: 100%;
  border-spacing: 0;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textLight};
  }

  td {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Toggle = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  width: 36px;
  height: 20px;
  appearance: none;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }

  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: 2px;
    transition: all 0.2s ease;
  }

  &:checked:before {
    left: 18px;
  }
`;

export default Settings; 