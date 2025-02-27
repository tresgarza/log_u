import React from 'react';
import theme from '../styles/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary}15;
          color: ${theme.colors.secondary};
        `;
      case 'success':
        return `
          background: ${theme.colors.status.success}15;
          color: ${theme.colors.status.success};
        `;
      case 'error':
        return `
          background: ${theme.colors.status.error}15;
          color: ${theme.colors.status.error};
        `;
      case 'warning':
        return `
          background: ${theme.colors.status.warning}15;
          color: ${theme.colors.status.warning};
        `;
      case 'info':
        return `
          background: ${theme.colors.status.info}15;
          color: ${theme.colors.status.info};
        `;
      default:
        return `
          background: ${theme.colors.primary}15;
          color: ${theme.colors.primary};
        `;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
        `;
      default:
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
        `;
    }
  };

  return (
    <span className={`badge ${className}`}>
      {children}
      <style jsx>{`
        .badge {
          ${getVariantStyles()}
          ${getSizeStyles()}
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: ${theme.typography.fontFamily.primary};
          font-weight: ${theme.typography.fontWeight.medium};
          border-radius: ${rounded ? theme.borderRadius.full : theme.borderRadius.md};
          white-space: nowrap;
          transition: all ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
        }
      `}</style>
    </span>
  );
};

export default Badge; 