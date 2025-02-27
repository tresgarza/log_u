import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAnime } from '../hooks/useAnime';
import theme from '../styles/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
}) => {
  const toastRef = useRef<HTMLDivElement>(null);
  const anime = useAnime();
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!toastRef.current) return;

    const toast = toastRef.current;

    const animation = anime({
      targets: toast,
      translateX: [50, 0],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutExpo'
    });

    timerRef.current = setTimeout(() => {
      anime({
        targets: toast,
        translateX: [0, 50],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInExpo',
        complete: onClose
      });
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      animation?.pause();
    };
  }, [anime, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return `
          background: ${theme.colors.status.success}15;
          border-color: ${theme.colors.status.success};
          color: ${theme.colors.status.success};
        `;
      case 'error':
        return `
          background: ${theme.colors.status.error}15;
          border-color: ${theme.colors.status.error};
          color: ${theme.colors.status.error};
        `;
      case 'warning':
        return `
          background: ${theme.colors.status.warning}15;
          border-color: ${theme.colors.status.warning};
          color: ${theme.colors.status.warning};
        `;
      default:
        return `
          background: ${theme.colors.status.info}15;
          border-color: ${theme.colors.status.info};
          color: ${theme.colors.status.info};
        `;
    }
  };

  const getPositionStyles = () => {
    const base = 'position: fixed; z-index: ' + theme.zIndex.toast + ';';
    switch (position) {
      case 'top-left':
        return base + 'top: 1rem; left: 1rem;';
      case 'bottom-right':
        return base + 'bottom: 1rem; right: 1rem;';
      case 'bottom-left':
        return base + 'bottom: 1rem; left: 1rem;';
      default:
        return base + 'top: 1rem; right: 1rem;';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.6666 5L7.49992 14.1667L3.33325 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 6.66667V10M10 13.3333H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 7.5V10.8333M10 14.1667H10.0083M2.92508 15.8333H17.0751C18.3334 15.8333 19.1584 14.4583 18.5251 13.3333L11.3501 1.66667C10.7167 0.541667 9.28342 0.541667 8.65008 1.66667L1.47508 13.3333C0.841748 14.4583 1.66675 15.8333 2.92508 15.8333Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 13.3333V10M10 6.66667H10.0083M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  const toastContent = (
    <div ref={toastRef} className="toast" role="alert">
      <div className="icon">
        {getIcon()}
      </div>
      <p className="message">{message}</p>
      <button className="close-button" onClick={onClose} aria-label="Close toast">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <style jsx>{`
        .toast {
          ${getPositionStyles()}
          ${getTypeStyles()}
          display: flex;
          align-items: center;
          gap: ${theme.spacing.sm};
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          border-left: 4px solid;
          border-radius: ${theme.borderRadius.md};
          box-shadow: ${theme.shadows.lg};
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.sm};
          opacity: 0;
          max-width: 400px;
        }
        
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .message {
          margin: 0;
          flex: 1;
        }
        
        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0;
          background: none;
          border: none;
          border-radius: ${theme.borderRadius.sm};
          color: currentColor;
          cursor: pointer;
          opacity: 0.7;
          transition: all ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
          
          &:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.1);
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 2px currentColor;
          }
        }
      `}</style>
    </div>
  );

  return typeof window !== 'undefined'
    ? createPortal(toastContent, document.body)
    : null;
};

export default Toast; 