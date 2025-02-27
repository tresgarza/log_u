import React, { useRef, useEffect } from 'react';
import { useAnime, animations } from '../hooks/useAnime';
import theme from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof theme.spacing;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'lg',
  className = '',
  onClick,
  animate = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const anime = useAnime();

  useEffect(() => {
    if (!animate || !cardRef.current) return;

    const card = cardRef.current;
    
    const enterAnimation = () => {
      anime({
        targets: card,
        scale: 1.02,
        translateY: -5,
        duration: 200,
        easing: 'easeOutExpo'
      });
    };

    const leaveAnimation = () => {
      anime({
        targets: card,
        scale: 1,
        translateY: 0,
        duration: 200,
        easing: 'easeOutExpo'
      });
    };

    card.addEventListener('mouseenter', enterAnimation);
    card.addEventListener('mouseleave', leaveAnimation);

    return () => {
      card.removeEventListener('mouseenter', enterAnimation);
      card.removeEventListener('mouseleave', leaveAnimation);
    };
  }, [animate, anime]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return `
          background: ${theme.colors.background.light};
          box-shadow: ${theme.shadows.lg};
        `;
      case 'outlined':
        return `
          background: ${theme.colors.background.light};
          border: 1px solid ${theme.colors.text.muted}20;
        `;
      default:
        return `
          background: ${theme.colors.background.light};
          box-shadow: ${theme.shadows.sm};
        `;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`card ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
      <style jsx>{`
        .card {
          ${getVariantStyles()}
          padding: ${theme.spacing[padding]};
          border-radius: ${theme.borderRadius.lg};
          transition: all ${theme.transitions.duration.normal} ${theme.transitions.timing.ease};
          ${onClick ? 'cursor: pointer;' : ''}
          
          &:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px ${theme.colors.primary}40;
          }
        }
      `}</style>
    </div>
  );
};

export default Card; 