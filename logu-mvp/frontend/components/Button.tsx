import React, { useRef, useEffect, useState } from 'react';
import { animations } from '../hooks/useAnime';
import theme from '../styles/theme';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const useAnime = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return {
    isHovered,
    isPressed,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
  };
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    
    const enterAnimation = () => {
      useAnime().onMouseEnter();
    };

    const leaveAnimation = () => {
      useAnime().onMouseLeave();
    };

    button.addEventListener('mouseenter', enterAnimation);
    button.addEventListener('mouseleave', leaveAnimation);

    return () => {
      button.removeEventListener('mouseenter', enterAnimation);
      button.removeEventListener('mouseleave', leaveAnimation);
    };
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.text.light};
          &:hover {
            background: ${theme.colors.gradient.secondary};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary}10;
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.text.light};
          &:hover {
            background: ${theme.colors.gradient.primary};
          }
        `;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
        `;
    }
  };

  const anime = useAnime();

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${className}`}
    >
      {children}
      <style jsx>{`
        .button {
          ${getVariantStyles()}
          ${getSizeStyles()}
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: ${theme.borderRadius.md};
          font-family: ${theme.typography.fontFamily.primary};
          font-weight: ${theme.typography.fontWeight.medium};
          cursor: pointer;
          transition: all 0.2s ease;
          width: ${fullWidth ? '100%' : 'auto'};
          position: relative;
          overflow: hidden;
          box-shadow: ${theme.shadows.sm};
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            &:hover {
              transform: none;
            }
          }

          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px ${theme.colors.primary}40;
          }

          &:active {
            transform: translateY(1px);
          }
        }
      `}</style>
    </button>
  );
};

const StyledButton = styled.button<ButtonProps>`
  ${props => {
    const anime = useAnime();
    return css`
      // ... existing styles ...
    `;
  }}
`;

export default Button; 