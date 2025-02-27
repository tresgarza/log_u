import React, { useState } from 'react';
import { NextPage } from 'next';
import QRScanner from '../../components/QRScanner';
import Head from 'next/head';

interface VerificationResult {
  success: boolean;
  message: string;
  data?: {
    qrCode: {
      id: string;
      code: string;
      redemptionValue: number;
      status: string;
    };
    influencer: {
      id: number;
      name: string;
      email: string;
      profileImage?: string;
    };
  };
}

const VerifyPage: NextPage = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScanSuccess = async (decodedText: string) => {
    setIsScanning(false);
    await verifyCode(decodedText);
  };

  const handleScanError = (errorMessage: string) => {
    setError(`Scanner error: ${errorMessage}`);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setError('Please enter a QR code');
      return;
    }
    await verifyCode(manualCode);
  };

  const verifyCode = async (code: string) => {
    try {
      setError(null);
      setIsVerifying(true);
      
      // Mock API call - in production, replace with actual API call
      // const response = await fetch('/api/qrcodes/verify', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ code }),
      // });
      
      // Simulate API response with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful verification for demo
      const mockResponse = {
        success: true,
        message: 'QR code successfully verified and redeemed',
        data: {
          qrCode: {
            id: 'qr-123456',
            code: code,
            redemptionValue: 15.00,
            status: 'used'
          },
          influencer: {
            id: 1,
            name: 'Emma Johnson',
            email: 'emma@example.com',
            profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
          }
        }
      };
      
      // const data = await response.json();
      setResult(mockResponse);
    } catch (err) {
      setError('Failed to verify QR code. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setResult(null);
    setManualCode('');
    setError(null);
  };

  return (
    <div className="verify-container">
      <Head>
        <title>LogU - QR Code Verification</title>
        <meta name="description" content="Verify QR codes for LogU campaigns" />
      </Head>

      <main>
        <h1>QR Code Verification</h1>
        <p className="subtitle">Verify influencer QR codes at point of sale</p>
        
        {result ? (
          <div className="verification-result">
            <div className={`result-status ${result.success ? 'success' : 'failure'}`}>
              {result.success ? '✓ Verified' : '✗ Failed'}
            </div>
            
            <div className="result-details">
              {result.success && result.data ? (
                <>
                  <div className="influencer-info">
                    {result.data.influencer.profileImage && (
                      <img 
                        src={result.data.influencer.profileImage} 
                        alt={result.data.influencer.name}
                        className="profile-image"
                      />
                    )}
                    <div>
                      <h3>{result.data.influencer.name}</h3>
                      <p>{result.data.influencer.email}</p>
                    </div>
                  </div>
                  
                  <div className="redemption-info">
                    <div className="redemption-value">
                      <span className="currency">$</span>
                      {result.data.qrCode.redemptionValue.toFixed(2)}
                    </div>
                    <p className="redemption-label">Redemption Value</p>
                  </div>
                  
                  <div className="code-info">
                    <p><strong>Code:</strong> {result.data.qrCode.code}</p>
                    <p><strong>Status:</strong> {result.data.qrCode.status}</p>
                  </div>
                </>
              ) : (
                <p className="error-message">{result.message}</p>
              )}
            </div>
            
            <button 
              className="reset-button"
              onClick={resetVerification}
            >
              Verify Another Code
            </button>
          </div>
        ) : (
          <>
            <div className="verification-options">
              <button 
                className={`option-button ${isScanning ? 'active' : ''}`}
                onClick={() => setIsScanning(!isScanning)}
              >
                Scan QR Code
              </button>
              <span className="option-divider">or</span>
              <form onSubmit={handleManualSubmit} className="manual-form">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter code manually"
                  disabled={isVerifying}
                />
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </form>
            </div>
            
            {isScanning && (
              <div className="scanner-wrapper">
                <QRScanner 
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                  width={320}
                  height={320}
                />
              </div>
            )}
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </>
        )}
      </main>

      <style jsx>{`
        .verify-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }
        
        .subtitle {
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        
        .verification-options {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .option-button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .option-button:hover {
          background-color: #3367d6;
        }
        
        .option-button.active {
          background-color: #34a853;
        }
        
        .option-divider {
          color: #666;
          font-size: 1rem;
          margin: 0.5rem 0;
        }
        
        .manual-form {
          display: flex;
          width: 100%;
          max-width: 500px;
          gap: 0.5rem;
        }
        
        input {
          flex-grow: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        
        .submit-button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          white-space: nowrap;
        }
        
        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .scanner-wrapper {
          margin-top: 2rem;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .error-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          color: #c62828;
        }
        
        .verification-result {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .result-status {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }
        
        .result-status.success {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .result-status.failure {
          background-color: #ffebee;
          color: #c62828;
        }
        
        .result-details {
          margin-bottom: 1.5rem;
        }
        
        .influencer-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .profile-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .influencer-info h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #333;
        }
        
        .influencer-info p {
          margin: 0.25rem 0 0;
          color: #666;
        }
        
        .redemption-info {
          text-align: center;
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }
        
        .redemption-value {
          font-size: 3rem;
          font-weight: 700;
          color: #4caf50;
          line-height: 1;
        }
        
        .currency {
          font-size: 1.8rem;
          vertical-align: super;
        }
        
        .redemption-label {
          margin: 0.25rem 0 0;
          color: #666;
        }
        
        .code-info {
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 4px;
        }
        
        .code-info p {
          margin: 0.5rem 0;
        }
        
        .reset-button {
          width: 100%;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 1rem;
        }
        
        .reset-button:hover {
          background-color: #3367d6;
        }
        
        @media (max-width: 600px) {
          .verify-container {
            padding: 1rem;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          .verification-result {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyPage; 