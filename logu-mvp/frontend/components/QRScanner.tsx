import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  width?: number;
  height?: number;
  fps?: number;
}

const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onScanError,
  width = 400,
  height = 400,
  fps = 10
}) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const qrScannerRegionId = 'qr-scanner-region';

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5Qrcode(qrScannerRegionId);
    setHtml5QrCode(scanner);

    // Cleanup function to stop scanning when component unmounts
    return () => {
      if (scanner && scanning) {
        scanner.stop()
          .catch((err: Error) => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const startScanner = () => {
    if (!html5QrCode) return;

    const qrboxSize = Math.min(width, height) * 0.7;
    const config = { fps, qrbox: { width: qrboxSize, height: qrboxSize } };
    
    setScanning(true);
    
    html5QrCode.start(
      { facingMode: 'environment' },
      config,
      (decodedText: string) => {
        onScanSuccess(decodedText);
        // Optionally stop scanning after successful scan
        // html5QrCode.stop().catch(err => console.error('Error stopping scanner:', err));
        // setScanning(false);
      },
      (errorMessage: string) => {
        if (onScanError) {
          onScanError(errorMessage);
        }
      }
    ).catch((err: Error) => {
      console.error('Error starting scanner:', err);
      if (onScanError) {
        onScanError(err.toString());
      }
    });
  };

  const stopScanner = () => {
    if (html5QrCode && scanning) {
      html5QrCode.stop()
        .then(() => setScanning(false))
        .catch((err: Error) => console.error('Error stopping scanner:', err));
    }
  };

  return (
    <div className="qr-scanner-container">
      <div id={qrScannerRegionId} style={{ width, height }}></div>
      <div className="scanner-controls">
        {!scanning ? (
          <button 
            className="start-button"
            onClick={startScanner}
          >
            Start QR Scanner
          </button>
        ) : (
          <button 
            className="stop-button"
            onClick={stopScanner}
          >
            Stop QR Scanner
          </button>
        )}
      </div>
      
      <style jsx>{`
        .qr-scanner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          border-radius: 8px;
          background-color: #f8f9fa;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        #${qrScannerRegionId} {
          margin-bottom: 1rem;
          overflow: hidden;
          border-radius: 8px;
          border: 2px solid #ddd;
        }
        
        .scanner-controls {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        
        button:hover {
          transform: translateY(-2px);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        .start-button {
          background-color: #4caf50;
          color: white;
        }
        
        .start-button:hover {
          background-color: #43a047;
        }
        
        .stop-button {
          background-color: #f44336;
          color: white;
        }
        
        .stop-button:hover {
          background-color: #e53935;
        }
      `}</style>
    </div>
  );
};

export default QRScanner; 