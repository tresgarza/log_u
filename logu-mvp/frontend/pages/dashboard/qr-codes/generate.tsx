import React, { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { qrCodeService } from '../../../services/qr-code.service';
import { toast } from 'react-toastify';

interface FormData {
  campaignId: string;
  redemptionValue: string;
  expiresAt: string;
  metadata: string;
}

const GenerateQRCode: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    campaignId: '',
    redemptionValue: '',
    expiresAt: '',
    metadata: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await qrCodeService.generateQRCode({
        campaignId: parseInt(formData.campaignId, 10),
        redemptionValue: parseFloat(formData.redemptionValue),
        expiresAt: new Date(formData.expiresAt),
        metadata: formData.metadata ? JSON.parse(formData.metadata) : {}
      });

      if (response.success) {
        toast.success('QR code generated successfully');
        router.push('/dashboard/qr-codes');
      } else {
        toast.error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Error generating QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <Header>
          <Title>Generate New QR Code</Title>
          <BackButton onClick={() => router.back()}>Back to QR Codes</BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="campaignId">Campaign ID</Label>
            <Input
              type="text"
              id="campaignId"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              required
              placeholder="Enter campaign ID"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="redemptionValue">Redemption Value ($)</Label>
            <Input
              type="number"
              id="redemptionValue"
              name="redemptionValue"
              value={formData.redemptionValue}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter redemption value"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="expiresAt">Expiration Date</Label>
            <Input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="metadata">Metadata (Optional JSON)</Label>
            <TextArea
              id="metadata"
              name="metadata"
              value={formData.metadata}
              onChange={handleChange}
              placeholder="Enter metadata as JSON"
              rows={4}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate QR Code'}
          </SubmitButton>
        </Form>
      </Container>
    </DashboardLayout>
  );
};

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
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

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
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

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

export default GenerateQRCode; 