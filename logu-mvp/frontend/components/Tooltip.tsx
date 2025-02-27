import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAnime } from '../hooks/useAnime';
import theme from '../styles/theme';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const anime = useAnime();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollX + 8;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(() => {
        updatePosition();
        if (tooltipRef.current) {
          anime({
            targets: tooltipRef.current,
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 200,
            easing: 'easeOutExpo'
          });
        }
      });
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (tooltipRef.current) {
      anime({
        targets: tooltipRef.current,
        opacity: 0,
        scale: 0.95,
        duration: 150,
        easing: 'easeInExpo',
        complete: () => setIsVisible(false)
      });
    }
  };

  const getArrowStyles = () => {
    const baseStyles = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: ${theme.colors.text.dark};
      transform: rotate(45deg);
    `;

    switch (position) {
      case 'top':
        return baseStyles + `
          bottom: -4px;
          left: calc(50% - 4px);
        `;
      case 'right':
        return baseStyles + `
          left: -4px;
          top: calc(50% - 4px);
        `;
      case 'bottom':
        return baseStyles + `
          top: -4px;
          left: calc(50% - 4px);
        `;
      case 'left':
        return baseStyles + `
          right: -4px;
          top: calc(50% - 4px);
        `;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="tooltip-trigger"
      >
        {children}
      </div>
      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className={`tooltip ${className}`}
          role="tooltip"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
        >
          <div className="tooltip-content">
            {content}
          </div>
          <div className="tooltip-arrow" />
          <style jsx>{`
            .tooltip {
              position: fixed;
              z-index: ${theme.zIndex.tooltip};
              pointer-events: none;
              opacity: 0;
            }
            
            .tooltip-content {
              background: ${theme.colors.text.dark};
              color: ${theme.colors.text.light};
              padding: ${theme.spacing.xs} ${theme.spacing.sm};
              border-radius: ${theme.borderRadius.md};
              font-family: ${theme.typography.fontFamily.primary};
              font-size: ${theme.typography.fontSize.sm};
              line-height: ${theme.typography.lineHeight.snug};
              white-space: nowrap;
              box-shadow: ${theme.shadows.lg};
            }
            
            .tooltip-arrow {
              ${getArrowStyles()}
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip; 