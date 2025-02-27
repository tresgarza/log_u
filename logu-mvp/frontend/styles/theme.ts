import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#0066FF',
    primaryDark: '#0052CC',
    secondary: '#6C757D',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    accent: '#4F46E5',
    text: {
      dark: '#1A1A1A',
      light: '#F8F9FA',
      gray: '#6C757D',
      primary: '#1A1A1A',
      secondary: '#6C757D',
      muted: '#A0AEC0'
    },
    textLight: '#6C757D',
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      light: '#FFFFFF',
      gray: '#F5F5F5'
    },
    background2: '#F0F0F0',
    border: {
      default: '#DEE2E6',
      light: '#E9ECEF'
    },
    light: '#F8F9FA',
    status: {
      success: '#28A745',
      error: '#DC3545',
      warning: '#FFC107',
      info: '#17A2B8'
    },
    gradient: {
      primary: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)',
      secondary: 'linear-gradient(135deg, #6C757D 0%, #495057 100%)'
    },
    gray: {
      200: '#E9ECEF',
      500: '#6C757D'
    }
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.05)'
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      secondary: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '3xl': '2rem'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
    full: '9999px'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem'
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  zIndices: {
    sticky: 100,
    docked: 10,
    dropdown: 1000,
    overlay: 2000
  },
  transitions: {
    base: '0.3s ease-in-out',
    fast: '0.15s ease-in-out'
  }
};

export default theme; 