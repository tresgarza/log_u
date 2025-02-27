import React from 'react';
import theme from '../styles/theme';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  color = theme.colors.primary,
  fullScreen = false,
  text,
  className = '',
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return '24px';
      case 'lg':
        return '48px';
      default:
        return '32px';
    }
  };

  const spinnerSize = getSize();

  return (
    <div className={`loading-container ${className}`}>
      <div className="spinner" role="status">
        <svg
          width={spinnerSize}
          height={spinnerSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="spinner-track"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            className="spinner-head"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            pathLength="100"
          />
        </svg>
      </div>
      {text && <p className="loading-text">{text}</p>}
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: ${theme.spacing.sm};
          color: ${color};
          ${fullScreen ? `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${theme.colors.background.light}CC;
            backdrop-filter: blur(4px);
            z-index: ${theme.zIndex.overlay};
          ` : ''}
        }
        
        .spinner {
          animation: rotate 2s linear infinite;
        }
        
        .spinner-track {
          opacity: 0.2;
        }
        
        .spinner-head {
          stroke-dasharray: 100;
          stroke-dashoffset: 75;
          transform-origin: center;
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .loading-text {
          margin: 0;
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.sm};
          color: ${theme.colors.text.dark};
        }
      `}</style>
    </div>
  );
};

export default Loading; 