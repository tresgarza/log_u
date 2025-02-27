import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAnime, animations } from '../hooks/useAnime';
import theme from '../styles/theme';
import { DefaultTheme } from 'styled-components';

const themeWithTypes = theme as DefaultTheme;

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const animate = useAnime();

  useEffect(() => {
    // Only run animations if the elements exist and anime.js is loaded
    if (titleRef.current && animate) {
      animate({
        targets: titleRef.current,
        ...animations.slideUp,
        delay: 300
      });
    }

    if (descriptionRef.current && animate) {
      animate({
        targets: descriptionRef.current,
        ...animations.fadeIn,
        delay: 800
      });
    }

    // Animate cards with stagger
    if (cardsRef.current && animate) {
      animate({
        targets: '.card',
        ...animations.scaleIn,
        delay: animations.staggerChildren(100).delay,
        duration: 400,
        easing: 'easeOutExpo'
      });
    }

    // Animate CTA button
    if (ctaRef.current && animate) {
      animate({
        targets: ctaRef.current,
        ...animations.popIn,
        delay: 1200
      });
    }
  }, [animate]);

  return (
    <div className="container">
      <Head>
        <title>LogU - Conectando marcas e influencers</title>
        <meta name="description" content="Plataforma para conectar marcas e influencers, gestionar campañas de marketing y automatizar pagos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="logo">
          <span className="logo-text">LogU</span>
        </div>
        <nav className="nav">
          <Link href="/auth/login" className="nav-link">Iniciar Sesión</Link>
          <Link href="/auth/register" className="nav-link register">Registrarse</Link>
          <Link href="/dev-login" className="nav-link dev-link">Modo Desarrollador</Link>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1 className="title" ref={titleRef}>
            Conectando <span className="brand">Marcas</span> e <span className="brand accent">Influencers</span>
          </h1>

          <p className="description" ref={descriptionRef}>
            La plataforma integral que revoluciona la colaboración entre marcas e influencers, 
            optimizando campañas y maximizando resultados con tecnología avanzada.
          </p>

          <div className="cta-container" ref={ctaRef}>
            <Link href="/auth/register" className="cta-button">
              Comenzar Ahora
            </Link>
            <Link href="/dev-login" className="cta-button secondary">
              Modo Desarrollador
            </Link>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">¿Por qué elegir LogU?</h2>
          
          <div className="grid" ref={cardsRef}>
            <div className="card">
              <div className="card-content">
                <div className="card-icon">🔍</div>
                <h3>Búsqueda Inteligente</h3>
                <p>Encuentra los influencers perfectos para tu marca con nuestro algoritmo de coincidencia avanzado.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="card-icon">📊</div>
                <h3>Análisis en Tiempo Real</h3>
                <p>Monitorea el rendimiento de tus campañas con métricas detalladas y visualizaciones claras.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="card-icon">💰</div>
                <h3>Pagos Automatizados</h3>
                <p>Gestiona contratos y pagos sin complicaciones con nuestro sistema seguro y transparente.</p>
              </div>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="card-icon">🚀</div>
                <h3>Crecimiento Acelerado</h3>
                <p>Potencia tu presencia digital y aumenta tu ROI con estrategias optimizadas.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">LogU</span>
            <p className="footer-tagline">Conectando el futuro del marketing digital</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Plataforma</h4>
              <Link href="#caracteristicas">Características</Link>
              <Link href="#precios">Precios</Link>
              <Link href="#testimonios">Testimonios</Link>
            </div>
            
            <div className="footer-column">
              <h4>Recursos</h4>
              <Link href="#blog">Blog</Link>
              <Link href="#guias">Guías</Link>
              <Link href="#soporte">Soporte</Link>
            </div>
            
            <div className="footer-column">
              <h4>Empresa</h4>
              <Link href="#nosotros">Sobre Nosotros</Link>
              <Link href="#contacto">Contacto</Link>
              <Link href="#legal">Legal</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LogU. Todos los derechos reservados.</p>
          <div className="dev-note">
            <Link href="/dev-login">Acceso para Desarrolladores</Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: ${themeWithTypes.colors.background};
          font-family: ${themeWithTypes.typography.fontFamily};
          color: ${themeWithTypes.colors.text};
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: ${themeWithTypes.shadows.sm};
        }

        .logo {
          font-size: 1.8rem;
          font-weight: ${themeWithTypes.typography.fontWeight.bold};
        }

        .logo-text {
          background: linear-gradient(135deg, ${themeWithTypes.colors.primary}, ${themeWithTypes.colors.primaryDark});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: ${themeWithTypes.typography.fontFamily};
        }

        .nav {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .nav-link {
          text-decoration: none;
          color: ${themeWithTypes.colors.text};
          font-weight: ${themeWithTypes.typography.fontWeight.medium};
          transition: all 0.2s ease;
          padding: 0.5rem 0.75rem;
          border-radius: ${themeWithTypes.borderRadius.md};
        }

        .nav-link:hover {
          color: ${themeWithTypes.colors.primary};
        }

        .nav-link.register {
          background: ${themeWithTypes.colors.primary};
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: ${themeWithTypes.borderRadius.md};
        }

        .nav-link.register:hover {
          background: ${themeWithTypes.colors.primaryDark};
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: ${themeWithTypes.shadows.md};
        }

        .nav-link.dev-link {
          font-size: ${themeWithTypes.typography.fontSize.xs};
          color: ${themeWithTypes.colors.textLight};
          padding: 0.25rem 0.5rem;
          border: 1px dashed ${themeWithTypes.colors.textLight};
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem 2rem;
          background: linear-gradient(to bottom, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.8));
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/images/pattern.svg');
          opacity: 0.05;
          z-index: -1;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: ${themeWithTypes.typography.fontSize.xl};
          font-weight: ${themeWithTypes.typography.fontWeight.bold};
          text-align: center;
          margin: 0;
          padding: 0 1rem;
        }

        .brand {
          color: ${themeWithTypes.colors.primary};
        }

        .brand.accent {
          color: ${themeWithTypes.colors.info};
        }

        .description {
          color: ${themeWithTypes.colors.textLight};
          font-size: ${themeWithTypes.typography.fontSize.lg};
          line-height: 1.6;
          max-width: 800px;
          margin: 2rem auto;
          text-align: center;
        }

        .cta-container {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cta-button {
          display: inline-block;
          padding: 1rem 2rem;
          background: ${themeWithTypes.colors.primary};
          color: white;
          border-radius: ${themeWithTypes.borderRadius.md};
          font-weight: ${themeWithTypes.typography.fontWeight.semibold};
          transition: all 0.2s ease;
        }

        .cta-button:hover {
          background: ${themeWithTypes.colors.primaryDark};
          transform: translateY(-2px);
          box-shadow: ${themeWithTypes.shadows.md};
        }

        .cta-button.secondary {
          background: ${themeWithTypes.colors.secondary};
          margin-left: 1rem;
        }

        .cta-button.secondary:hover {
          background: ${themeWithTypes.colors.textLight};
        }

        .features {
          padding: 5rem 2rem;
          background: white;
        }

        .section-title {
          color: ${themeWithTypes.colors.text};
          font-size: ${themeWithTypes.typography.fontSize.xl};
          font-weight: ${themeWithTypes.typography.fontWeight.bold};
          text-align: center;
          margin-bottom: 3rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: ${themeWithTypes.borderRadius.lg};
          padding: 2rem;
          text-decoration: none;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          box-shadow: ${themeWithTypes.shadows.md};
          overflow: hidden;
          position: relative;
          height: 100%;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: ${themeWithTypes.shadows.lg};
        }

        .card:hover .card-icon {
          transform: scale(1.1);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .card-icon {
          font-size: ${themeWithTypes.fontSizes.xl};
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: ${themeWithTypes.typography.fontSize.xl};
          font-weight: ${themeWithTypes.typography.fontWeight.semibold};
          color: ${themeWithTypes.colors.text};
        }

        .card p {
          margin: 0;
          font-size: ${themeWithTypes.typography.fontSize.md};
          line-height: 1.6;
          color: ${themeWithTypes.colors.textLight};
          flex-grow: 1;
        }

        footer {
          background: ${themeWithTypes.colors.background};
          color: ${themeWithTypes.colors.text};
          padding: 4rem 2rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 3rem;
        }

        .footer-logo {
          flex: 1;
          min-width: 250px;
        }

        .footer-logo .logo-text {
          font-size: 2rem;
          background: linear-gradient(135deg, #fff 0%, #d1d5db 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tagline {
          color: ${themeWithTypes.colors.textLight};
          margin-top: 0.5rem;
        }

        .footer-links {
          display: flex;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-column h4 {
          margin: 0 0 1rem;
          font-size: ${themeWithTypes.typography.fontSize.lg};
          color: ${themeWithTypes.colors.text};
        }

        .footer-column a {
          color: ${themeWithTypes.colors.textLight};
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-column a:hover {
          color: white;
        }

        .footer-bottom {
          background: ${themeWithTypes.colors.background};
          color: ${themeWithTypes.colors.textLight};
          padding: 1rem 2rem;
          text-align: center;
          border-top: 1px solid ${themeWithTypes.colors.border};
        }

        .dev-note a {
          color: ${themeWithTypes.colors.textLight};
          font-size: ${themeWithTypes.typography.fontSize.sm};
          text-decoration: underline;
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (max-width: 768px) {
          .header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .nav {
            width: 100%;
            justify-content: center;
          }

          .title {
            font-size: ${themeWithTypes.fontSizes.lg};
          }

          .description {
            font-size: ${themeWithTypes.fontSizes.lg};
          }

          .footer-content {
            flex-direction: column;
            gap: 2rem;
          }

          .footer-links {
            width: 100%;
            gap: 2rem;
          }

          .footer-column {
            flex: 1;
            min-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .cta-container {
            flex-direction: column;
            width: 100%;
          }

          .cta-button {
            width: 100%;
            text-align: center;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: ${themeWithTypes.typography.fontFamily};
          background: ${themeWithTypes.colors.background};
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
        }

        ::selection {
          background: ${themeWithTypes.colors.primary};
          color: white;
        }
      `}</style>
    </div>
  );
} 