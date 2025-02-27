import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryDark: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      info: string;
      accent: string;
      text: {
        dark: string;
        light: string;
        gray: string;
        primary: string;
        secondary: string;
        muted: string;
      };
      textLight: string;
      background: {
        primary: string;
        secondary: string;
        light: string;
        gray: string;
      };
      background2: string;
      border: {
        default: string;
        light: string;
      };
      light: string;
      status: {
        success: string;
        error: string;
        warning: string;
        info: string;
      };
      gradient: {
        primary: string;
        secondary: string;
      };
      gray: {
        200: string;
        500: string;
      };
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    typography: {
      fontFamily: {
        primary: string;
        secondary: string;
      };
      fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '3xl': string;
      };
      fontWeight: {
        regular: number;
        medium: number;
        semibold: number;
        bold: number;
      };
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeights: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    zIndices: {
      sticky: number;
      docked: number;
      dropdown: number;
      overlay: number;
    };
    transitions: {
      base: string;
      fast: string;
    };
  }
} 