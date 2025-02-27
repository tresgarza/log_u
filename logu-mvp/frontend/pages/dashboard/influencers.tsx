import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import theme from '../../styles/theme';
import { FiSearch, FiFilter, FiUser, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';
import { userService } from '../../services/user.service';

interface Influencer {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
}

const Influencers: NextPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const data = await userService.getInfluencers();
        setInfluencers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching influencers:', error);
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const filteredInfluencers = influencers.filter(inf => 
    inf.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Influencers</Title>
          <Actions>
            <SearchBar>
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="Search influencers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchBar>
          </Actions>
        </Header>

        <Grid>
          {loading ? (
            <div>Loading...</div>
          ) : filteredInfluencers.map((influencer, index) => (
            <InfluencerCard
              key={influencer.id}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CardHeader>
                <Avatar src={influencer.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}`} alt={influencer.name} />
                <div>
                  <Name>{influencer.name}</Name>
                  <Email>{influencer.email}</Email>
                </div>
              </CardHeader>

              {influencer.bio && <Bio>{influencer.bio}</Bio>}

              <CardActions>
                <ActionButton>View Profile</ActionButton>
                <ActionButton primary>Contact</ActionButton>
              </CardActions>
            </InfluencerCard>
          ))}
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

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid ${theme.colors.border};
  border-radius: 0.5rem;
  width: 300px;

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
  }

  svg {
    color: ${theme.colors.text.secondary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfluencerCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const Email = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
  margin: 0.25rem 0 0;
`;

const Bio = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
  margin: 1rem 0;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.primary ? theme.colors.primary : theme.colors.border};
  border-radius: 0.25rem;
  background: ${props => props.primary ? theme.colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : theme.colors.text.primary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;

  &:hover {
    background: ${props => props.primary ? theme.colors.primary : theme.colors.background};
  }
`;

export default Influencers; 