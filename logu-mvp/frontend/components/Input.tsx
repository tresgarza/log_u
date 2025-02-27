import React, { useRef, useEffect, forwardRef } from 'react';
import { useAnime } from '../hooks/useAnime';
import theme from '../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled';
  animate?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  fullWidth = false,
  variant = 'outlined',
  animate = true,
  className = '',
  ...props
}, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const anime = useAnime();

  useEffect(() => {
    if (!animate || !wrapperRef.current) return;

    anime({
      targets: wrapperRef.current,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutExpo'
    });
  }, [animate, anime]);

  const getVariantStyles = () => {
    const baseStyles = `
      width: ${fullWidth ? '100%' : 'auto'};
      min-width: 200px;
      height: 40px;
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      font-family: ${theme.typography.fontFamily.primary};
      font-size: ${theme.typography.fontSize.base};
      color: ${theme.colors.text.dark};
      border-radius: ${theme.borderRadius.md};
      transition: all ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
      
      &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}20;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      ${error ? `
        border-color: ${theme.colors.status.error} !important;
        &:focus {
          box-shadow: 0 0 0 3px ${theme.colors.status.error}20;
        }
      ` : ''}
    `;

    switch (variant) {
      case 'filled':
        return `
          ${baseStyles}
          background: ${theme.colors.background.gray};
          border: 2px solid transparent;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.background.gray}90;
          }
          
          &:focus {
            background: ${theme.colors.background.light};
          }
        `;
      default:
        return `
          ${baseStyles}
          background: ${theme.colors.background.light};
          border: 2px solid ${theme.colors.text.muted}20;
          
          &:hover:not(:disabled) {
            border-color: ${theme.colors.text.muted}40;
          }
        `;
    }
  };

  return (
    <div ref={wrapperRef} className={`input-wrapper ${className}`}>
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <div className="input-container">
        {startIcon && (
          <span className="icon start-icon">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          className="input"
          {...props}
        />
        {endIcon && (
          <span className="icon end-icon">
            {endIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <span className={`helper-text ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
      <style jsx>{`
        .input-wrapper {
          display: inline-flex;
          flex-direction: column;
          gap: ${theme.spacing.xs};
          width: ${fullWidth ? '100%' : 'auto'};
        }
        
        .label {
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.sm};
          font-weight: ${theme.typography.fontWeight.medium};
          color: ${theme.colors.text.dark};
        }
        
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        .input {
          ${getVariantStyles()}
          ${startIcon ? 'padding-left: 2.5rem;' : ''}
          ${endIcon ? 'padding-right: 2.5rem;' : ''}
        }
        
        .icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: ${theme.colors.text.muted};
          pointer-events: none;
        }
        
        .start-icon {
          left: ${theme.spacing.sm};
        }
        
        .end-icon {
          right: ${theme.spacing.sm};
        }
        
        .helper-text {
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.sm};
          color: ${theme.colors.text.muted};
          
          &.error {
            color: ${theme.colors.status.error};
          }
        }
      `}</style>
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 