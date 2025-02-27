import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { FiHome, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiMail, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../../services/auth.service';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

interface MenuItem {
  name: string;
  path: string;
  icon: ReactNode;
  brandOnly?: boolean;
  influencerOnly?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    type: string;
    avatar?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<{ id: string; text: string; read: boolean }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        // First check if user is authenticated
        if (!authService.isAuthenticated()) {
          router.push('/auth/login');
          return;
        }
        
        // Get current user
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          router.push('/auth/login');
          return;
        }
        
        // Set user data
        setUser({
          name: currentUser.name,
          email: currentUser.email,
          type: currentUser.userType,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            currentUser.name
          )}&background=4F46E5&color=fff`
        });
        
        // For development, add mock notifications
        if (process.env.NODE_ENV === 'development') {
          setNotifications([
            { id: '1', text: 'New campaign opportunity available', read: false },
            { id: '2', text: 'QR code scanned by customer', read: false },
            { id: '3', text: 'Payment processed successfully', read: true },
          ]);
        } else {
          // In production, fetch real notifications
          // await fetchNotifications();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome size={20} /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <FiBarChart2 size={20} />, brandOnly: true },
    { name: 'Campaigns', path: '/dashboard/campaigns', icon: <FiBarChart2 size={20} />, brandOnly: true },
    { name: 'Generate QR', path: '/dashboard/generate-qr', icon: <FiBarChart2 size={20} />, brandOnly: true },
    { name: 'Influencers', path: '/dashboard/influencers', icon: <FiUsers size={20} />, brandOnly: true },
    { name: 'My QR Codes', path: '/dashboard/qrcodes', icon: <FiBarChart2 size={20} />, influencerOnly: true },
    { name: 'Opportunities', path: '/dashboard/opportunities', icon: <FiBarChart2 size={20} />, influencerOnly: true },
    { name: 'Payments', path: '/dashboard/payments', icon: <FiBarChart2 size={20} />, influencerOnly: true },
    { name: 'Settings', path: '/dashboard/settings', icon: <FiSettings size={20} /> },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!user) return !item.brandOnly && !item.influencerOnly;
    if (item.brandOnly && user.type !== 'brand') return false;
    if (item.influencerOnly && user.type !== 'influencer') return false;
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading dashboard...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Mobile Header */}
      <MobileHeader>
        <MobileMenuButton onClick={toggleMobileSidebar}>
          {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </MobileMenuButton>
        <MobileLogo>LogU</MobileLogo>
        {user && (
          <MobileUserAvatar 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`} 
            alt={user.name} 
            onClick={() => setShowUserMenu(!showUserMenu)}
          />
        )}
      </MobileHeader>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || isMobileSidebarOpen) && (
          <Sidebar 
            as={motion.aside}
            initial={{ x: isMobileSidebarOpen ? -300 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            $isMobile={isMobileSidebarOpen}
          >
            <SidebarHeader>
              <Logo>LogU</Logo>
              {!isMobileSidebarOpen && (
                <SidebarToggle onClick={toggleSidebar}>
                  <FiMenu size={20} />
                </SidebarToggle>
              )}
            </SidebarHeader>

            <SidebarNav>
              {filteredMenuItems.map((item) => (
                <SidebarNavItem 
                  key={item.path} 
                  $isActive={router.pathname === item.path}
                >
                  <Link 
                    href={item.path} 
                    onClick={() => isMobileSidebarOpen && setIsMobileSidebarOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', width: '100%', textDecoration: 'none', color: 'inherit' }}
                  >
                    <SidebarNavIcon>{item.icon}</SidebarNavIcon>
                    <SidebarNavText>{item.name}</SidebarNavText>
                  </Link>
                </SidebarNavItem>
              ))}
            </SidebarNav>

            <SidebarFooter>
              <SidebarFooterItem onClick={handleLogout}>
                <SidebarNavIcon><FiLogOut size={20} /></SidebarNavIcon>
                <SidebarNavText>Logout</SidebarNavText>
              </SidebarFooterItem>
              
              {localStorage.getItem('logu-dev-mode') === 'true' && (
                <DevModeIndicator>
                  DEVELOPMENT MODE
                </DevModeIndicator>
              )}
            </SidebarFooter>
          </Sidebar>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <MainContent $sidebarOpen={isSidebarOpen && !isMobileSidebarOpen}>
        <Header>
          <HeaderTitle>{title}</HeaderTitle>
          
          <HeaderActions>
            <NotificationButton onClick={() => setShowNotifications(!showNotifications)}>
              <FiBell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <NotificationBadge>
                  {notifications.filter(n => !n.read).length}
                </NotificationBadge>
              )}
            </NotificationButton>
            
            {user && (
              <UserProfile onClick={() => setShowUserMenu(!showUserMenu)}>
                <UserAvatar 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`} 
                  alt={user.name} 
                />
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserType>{user.type}</UserType>
                </UserInfo>
                <FiChevronDown size={16} />
              </UserProfile>
            )}
          </HeaderActions>
          
          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <NotificationsDropdown
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationsHeader>
                  <h3>Notifications</h3>
                  <button>Mark all as read</button>
                </NotificationsHeader>
                
                {notifications.length === 0 ? (
                  <EmptyNotifications>No notifications</EmptyNotifications>
                ) : (
                  notifications.map(notification => (
                    <NotificationItem key={notification.id} $read={notification.read}>
                      <NotificationContent>
                        <NotificationText>{notification.text}</NotificationText>
                        <NotificationTime>2 hours ago</NotificationTime>
                      </NotificationContent>
                    </NotificationItem>
                  ))
                )}
                
                <NotificationsFooter>
                  <NotificationsFooterLink href="/dashboard/notifications">View all notifications</NotificationsFooterLink>
                </NotificationsFooter>
              </NotificationsDropdown>
            )}
          </AnimatePresence>
          
          {/* User Menu Dropdown */}
          <AnimatePresence>
            {showUserMenu && user && (
              <UserMenuDropdown
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <UserMenuItem>
                  <Link href="/dashboard/profile">Profile</Link>
                </UserMenuItem>
                <UserMenuItem>
                  <Link href="/dashboard/settings">Settings</Link>
                </UserMenuItem>
                <UserMenuDivider />
                <UserMenuItem onClick={handleLogout}>
                  Logout
                </UserMenuItem>
              </UserMenuDropdown>
            )}
          </AnimatePresence>
        </Header>
        
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
      
      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <SidebarOverlay 
          onClick={() => setIsMobileSidebarOpen(false)}
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.secondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${props => props.theme.colors.background.primary};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.fontSizes.lg};
  margin-top: 1rem;
`;

const Sidebar = styled.aside<{ $isMobile?: boolean }>`
  width: 280px;
  background-color: ${props => props.theme.colors.background.primary};
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: ${props => props.$isMobile ? 'fixed' : 'sticky'};
  top: 0;
  left: 0;
  z-index: ${props => props.theme.zIndices.sticky};
  box-shadow: ${props => props.$isMobile ? props.theme.shadows.xl : 'none'};
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.typography.fontFamily.secondary};
`;

const SidebarToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.gray};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.text.dark};
  }
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 1rem 0;
  margin: 0;
  flex: 1;
`;

const SidebarNavItem = styled.li<{ $isActive?: boolean }>`
  list-style: none;
  margin: 8px 0;
  padding: 0;
  border-radius: 8px;
  background-color: ${props => props.$isActive ? props.theme.colors.primary + '15' : 'transparent'};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.$isActive ? props.theme.colors.primary + '15' : props.theme.colors.primary + '10'};
  }
`;

const SidebarNavIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${props => props.theme.colors.primary};
`;

const SidebarNavText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const SidebarFooterItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.gray};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.text.dark};
  }
`;

const DevModeIndicator = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.status.warning};
  color: white;
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.bold};
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.md};
  letter-spacing: 0.05em;
`;

const MainContent = styled.div<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.$sidebarOpen ? '280px' : '0'};
  transition: margin-left ${props => props.theme.transitions.fast};
  width: ${props => props.$sidebarOpen ? 'calc(100% - 280px)' : '100%'};

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
    padding-top: 60px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: ${props => props.theme.colors.background.light};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndices.docked};
  box-shadow: ${props => props.theme.shadows.sm};
  height: 70px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text.dark};

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.gray};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  position: relative;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.text.dark};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.error};
  color: white;
  font-size: 0.7rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  width: 18px;
  height: 18px;
  border-radius: ${props => props.theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transitions.fast};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  object-fit: cover;
  transition: all ${props => props.theme.transitions.base};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  transition: all ${props => props.theme.transitions.base};
`;

const UserName = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.text.dark};
`;

const UserType = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.text.gray};
  text-transform: capitalize;
`;

const NotificationsDropdown = styled.div`
  position: absolute;
  top: 70px;
  right: 2rem;
  width: 320px;
  background-color: ${props => props.theme.colors.background.light};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.xl};
  z-index: ${props => props.theme.zIndices.dropdown};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.base};
`;

const NotificationsHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ${props => props.theme.transitions.base};
`;

const NotificationItem = styled.div<{ $read?: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: ${props => props.$read ? 'transparent' : 'rgba(79, 70, 229, 0.05)'};
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const NotificationContent = styled.div`
  p {
    margin: 0 0 0.25rem;
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.text.dark};
  }
`;

const NotificationText = styled.p`
  margin: 0 0 0.25rem;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text.dark};
`;

const NotificationTime = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.text.gray};
`;

const EmptyNotifications = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.text.gray};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const NotificationsFooter = styled.div`
  padding: 1rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  a {
    color: ${props => props.theme.colors.primary};
    font-size: ${props => props.theme.fontSizes.sm};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NotificationsFooterLink = styled.a`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.sm};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 70px;
  right: 2rem;
  width: 200px;
  background-color: ${props => props.theme.colors.background.light};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.xl};
  z-index: ${props => props.theme.zIndices.dropdown};
  overflow: hidden;
`;

const UserMenuItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  a {
    color: ${props => props.theme.colors.text.dark};
    text-decoration: none;
    display: block;
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
`;

const ContentWrapper = styled.main`
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
`;

const MobileHeader = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${props => props.theme.colors.background.primary};
  z-index: ${props => props.theme.zIndices.sticky};
  padding: 0 1rem;
  box-shadow: ${props => props.theme.shadows.sm};

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileLogo = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`;

const MobileUserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  object-fit: cover;
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndices.overlay};
`;

export default DashboardLayout; 