import { useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';

interface AnimationConfig {
  targets: string | HTMLElement | HTMLElement[] | null;
  duration?: number;
  delay?: number | ((el: HTMLElement, i: number) => number);
  easing?: string;
  [key: string]: any;
}

export const animations = {
  fadeIn: {
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutExpo',
  },
  slideUp: {
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutExpo',
  },
  slideIn: {
    translateX: [-20, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutExpo',
  },
  scaleIn: {
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 400,
    easing: 'easeOutExpo',
  },
  buttonHover: {
    scale: 1.05,
    duration: 200,
    easing: 'easeOutExpo',
  },
  cardHover: {
    scale: 1.02,
    translateY: -5,
    duration: 200,
    easing: 'easeOutExpo',
  },
  popIn: {
    scale: [0.9, 1],
    opacity: [0, 1],
    duration: 400,
    easing: 'easeOutExpo',
  },
  shake: {
    translateX: [-10, 10, -10, 10, 0],
    duration: 400,
    easing: 'easeInOutSine',
  },
  gradientFlow: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    duration: 10000,
    easing: 'linear',
    loop: true,
  },
  staggerChildren: (staggerValue: number) => ({
    delay: (el: HTMLElement, i: number) => i * staggerValue,
  }),
} as const;

export const useAnime = () => {
  const animate = useCallback((config: AnimationConfig) => {
    if (!config.targets) return;
    return anime({
      ...config,
    });
  }, []);

  return animate;
};

export type Animations = typeof animations; 