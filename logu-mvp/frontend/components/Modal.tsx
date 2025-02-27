import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAnime } from '../hooks/useAnime';
import theme from '../styles/theme';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const anime = useAnime();

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !modalRef.current) return;

    anime({
      targets: overlayRef.current,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutExpo'
    });

    anime({
      targets: modalRef.current,
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutExpo'
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, anime, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  const getModalSize = () => {
    switch (size) {
      case 'sm':
        return '400px';
      case 'lg':
        return '800px';
      default:
        return '600px';
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div className="modal-header">
          {title && (
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button className="close-button" onClick={onClose} aria-label="Close modal">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="modal-content">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          padding: ${theme.spacing.md};
          z-index: ${theme.zIndex.modal};
          opacity: 0;
        }
        
        .modal {
          position: relative;
          width: 100%;
          max-width: ${getModalSize()};
          max-height: calc(100vh - ${theme.spacing.xl});
          background: ${theme.colors.background.light};
          border-radius: ${theme.borderRadius.lg};
          box-shadow: ${theme.shadows.xl};
          opacity: 0;
          overflow: hidden;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${theme.spacing.lg};
          border-bottom: 1px solid ${theme.colors.text.muted}20;
        }
        
        .modal-title {
          margin: 0;
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.xl};
          font-weight: ${theme.typography.fontWeight.semibold};
          color: ${theme.colors.text.dark};
        }
        
        .close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          background: none;
          border: none;
          border-radius: ${theme.borderRadius.md};
          color: ${theme.colors.text.muted};
          cursor: pointer;
          transition: all ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
          
          &:hover {
            background: ${theme.colors.text.muted}10;
            color: ${theme.colors.text.dark};
          }
          
          &:focus {
            outline: none;
            box-shadow: 0 0 0 3px ${theme.colors.primary}20;
          }
        }
        
        .modal-content {
          padding: ${theme.spacing.lg};
          overflow-y: auto;
          max-height: calc(100vh - 200px);
          
          &::-webkit-scrollbar {
            width: 8px;
          }
          
          &::-webkit-scrollbar-track {
            background: transparent;
          }
          
          &::-webkit-scrollbar-thumb {
            background: ${theme.colors.text.muted}20;
            border-radius: ${theme.borderRadius.full};
            
            &:hover {
              background: ${theme.colors.text.muted}40;
            }
          }
        }
        
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: ${theme.spacing.sm};
          padding: ${theme.spacing.lg};
          border-top: 1px solid ${theme.colors.text.muted}20;
        }
      `}</style>
    </div>
  );

  return typeof window !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};

export default Modal; 