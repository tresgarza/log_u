import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import theme from '../styles/theme';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Track page views and prevent unnecessary refreshes
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log(`App is navigating to: ${url}`);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    // Prevent the browser from scrolling to the top on route changes
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Add a global loading indicator */}
      <div id="page-transition-indicator" className="page-transition-indicator" />
      
      {/* Main app container */}
      <div className="app-container">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}

export default MyApp; 