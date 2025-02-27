import React, { useRef, useEffect, forwardRef } from 'react';
import { useAnime } from '../hooks/useAnime';
import theme from '../styles/theme';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  fullWidth?: boolean;
  animate?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  fullWidth = false,
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div ref={wrapperRef} className={`select-wrapper ${className}`}>
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <div className="select-container">
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          className="select"
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="arrow-icon"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {(error || helperText) && (
        <span className={`helper-text ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
      <style jsx>{`
        .select-wrapper {
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
        
        .select-container {
          position: relative;
          width: 100%;
        }
        
        .select {
          width: ${fullWidth ? '100%' : 'auto'};
          min-width: 200px;
          height: 40px;
          padding: ${theme.spacing.sm} ${theme.spacing.xl} ${theme.spacing.sm} ${theme.spacing.md};
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.base};
          color: ${theme.colors.text.dark};
          background: ${theme.colors.background.light};
          border: 2px solid ${theme.colors.text.muted}20;
          border-radius: ${theme.borderRadius.md};
          cursor: pointer;
          appearance: none;
          transition: all ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
          
          &:hover:not(:disabled) {
            border-color: ${theme.colors.text.muted}40;
          }
          
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
        }
        
        .arrow-icon {
          position: absolute;
          top: 50%;
          right: ${theme.spacing.sm};
          transform: translateY(-50%);
          color: ${theme.colors.text.muted};
          pointer-events: none;
          transition: transform ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
          
          .select:focus + & {
            transform: translateY(-50%) rotate(180deg);
          }
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

Select.displayName = 'Select';

export default Select; 