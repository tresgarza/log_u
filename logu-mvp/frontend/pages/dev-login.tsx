import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import theme from '../styles/theme';

const DevLogin: NextPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<'brand' | 'influencer'>('brand');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const bypassAuth = async () => {
    setIsLoading(true);
    setMessage('Setting up development access...');
    
    try {
      // Store the development token in localStorage
      localStorage.setItem('logu-dev-token', 'logu-dev-access-2023');
      localStorage.setItem('logu-dev-user-type', userType);
      localStorage.setItem('logu-dev-mode', 'true');
      localStorage.setItem('logu-user-name', 'Development User');
      localStorage.setItem('logu-user-email', 'dev@logu.test');
      localStorage.setItem('logu-user-id', '999');
      
      setMessage('Development access configured! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setMessage('Error setting up development access: ' + (error instanceof Error ? error.message : String(error)));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    setShowOptions(isDev);
    
    if (!isDev) {
      setMessage('Developer access is only available in development mode.');
    }
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Development Login | LogU</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="dev-banner">
        <span className="dev-icon">⚠️</span> DEVELOPMENT MODE <span className="dev-icon">⚠️</span>
      </div>
      
      <header className="header">
        <div className="logo">
          <Link href="/" className="logo-link">
            <span className="logo-text">LogU</span>
            <span className="logo-dev">DEV</span>
          </Link>
        </div>
        <nav className="nav">
          <Link href="/" className="nav-link">Volver al Inicio</Link>
        </nav>
      </header>

      <main>
        <div className="content-wrapper">
          <div className="card">
            <h1 className="title">Acceso para Desarrolladores</h1>
            
            {showOptions ? (
              <>
                <div className="section">
                  <h2 className="section-title">Selecciona el tipo de usuario</h2>
                  <div className="user-type-selector">
                    <button 
                      className={`user-type-btn ${userType === 'brand' ? 'active' : ''}`}
                      onClick={() => setUserType('brand')}
                    >
                      <div className="user-type-icon">🏢</div>
                      <div className="user-type-label">
                        <span className="user-type-name">Marca</span>
                        <span className="user-type-desc">Accede como empresa</span>
                      </div>
                    </button>
                    
                    <button 
                      className={`user-type-btn ${userType === 'influencer' ? 'active' : ''}`}
                      onClick={() => setUserType('influencer')}
                    >
                      <div className="user-type-icon">👤</div>
                      <div className="user-type-label">
                        <span className="user-type-name">Influencer</span>
                        <span className="user-type-desc">Accede como creador</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="section">
                  <h2 className="section-title">Opciones de desarrollo</h2>
                  <div className="options-grid">
                    <div className="option-card">
                      <div className="option-icon">🔑</div>
                      <div className="option-content">
                        <h3>Acceso Rápido</h3>
                        <p>Bypass de autenticación para pruebas</p>
                        <button 
                          className="option-btn"
                          onClick={bypassAuth}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Configurando...' : 'Acceder'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="option-card">
                      <div className="option-icon">🧪</div>
                      <div className="option-content">
                        <h3>Entorno de Pruebas</h3>
                        <p>Datos de prueba pre-cargados</p>
                        <button 
                          className="option-btn"
                          onClick={() => {
                            localStorage.setItem('logu-test-data', 'true');
                            bypassAuth();
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Configurando...' : 'Cargar Datos'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {message && (
                  <div className={`message ${isLoading ? 'loading' : ''}`}>
                    {isLoading && <div className="spinner"></div>}
                    <p>{message}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="restricted-message">
                <div className="restricted-icon">🔒</div>
                <p>El acceso para desarrolladores solo está disponible en modo de desarrollo.</p>
                <Link href="/" className="back-btn">
                  Volver al Inicio
                </Link>
              </div>
            )}
            
            <div className="note">
              <p>
                <strong>Nota:</strong> Esta página es exclusivamente para pruebas de desarrollo y permite 
                omitir los flujos normales de autenticación. No debe implementarse en entornos de producción.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>LogU Development Environment &copy; {new Date().getFullYear()}</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f0f2f5;
          font-family: ${theme.typography.fontFamily.primary};
        }
        
        .dev-banner {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 0.5rem;
          background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
          color: white;
          text-align: center;
          font-weight: bold;
          z-index: 100;
          letter-spacing: 1px;
          box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
        }
        
        .dev-icon {
          margin: 0 0.5rem;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          margin-top: 2.5rem;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: 700;
        }
        
        .logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        
        .logo-text {
          background: ${theme.colors.gradient.primary};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: ${theme.typography.fontFamily.secondary};
        }
        
        .logo-dev {
          font-size: 0.8rem;
          background: ${theme.colors.gradient.accent};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: 0.5rem;
          padding: 0.1rem 0.4rem;
          border: 1px dashed ${theme.colors.accent};
          border-radius: 4px;
        }
        
        .nav-link {
          text-decoration: none;
          color: ${theme.colors.text.dark};
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0.5rem 0.75rem;
          border-radius: ${theme.borderRadius.md};
        }
        
        .nav-link:hover {
          color: ${theme.colors.primary};
          background: rgba(79, 70, 229, 0.05);
        }
        
        main {
          flex: 1;
          padding: 2rem;
        }
        
        .content-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          margin-bottom: 2rem;
        }
        
        .title {
          margin: 0 0 2rem;
          font-size: 2rem;
          color: ${theme.colors.text.dark};
          text-align: center;
          font-weight: 700;
        }
        
        .section {
          margin-bottom: 2.5rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          margin: 0 0 1.5rem;
          color: ${theme.colors.text.dark};
          font-weight: 600;
        }
        
        .user-type-selector {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .user-type-btn {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 1.25rem;
          border: 2px solid #eaeaea;
          background: #f9f9f9;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .user-type-btn.active {
          border-color: ${theme.colors.primary};
          background: rgba(79, 70, 229, 0.05);
        }
        
        .user-type-icon {
          font-size: 1.75rem;
          margin-right: 1rem;
        }
        
        .user-type-label {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        
        .user-type-name {
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }
        
        .user-type-desc {
          font-size: 0.875rem;
          color: ${theme.colors.text.gray};
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .option-card {
          display: flex;
          align-items: flex-start;
          padding: 1.5rem;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .option-card:hover {
          border-color: ${theme.colors.primary};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .option-icon {
          font-size: 1.75rem;
          margin-right: 1rem;
          margin-top: 0.25rem;
        }
        
        .option-content {
          flex: 1;
        }
        
        .option-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }
        
        .option-content p {
          margin: 0 0 1rem;
          font-size: 0.875rem;
          color: ${theme.colors.text.gray};
        }
        
        .option-btn {
          padding: 0.5rem 1rem;
          background: ${theme.colors.primary};
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .option-btn:hover:not(:disabled) {
          background: #4338ca;
        }
        
        .option-btn:disabled {
          background: #a5a5a5;
          cursor: not-allowed;
        }
        
        .message {
          margin: 1.5rem 0;
          padding: 1rem;
          border-radius: 8px;
          background: #e6f7ff;
          color: #0070f3;
          display: flex;
          align-items: center;
        }
        
        .message.loading {
          background: #f0f7ff;
        }
        
        .message p {
          margin: 0;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 112, 243, 0.3);
          border-radius: 50%;
          border-top-color: #0070f3;
          animation: spin 1s linear infinite;
          margin-right: 0.75rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .restricted-message {
          text-align: center;
          padding: 2rem 1rem;
        }
        
        .restricted-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .back-btn {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: ${theme.colors.primary};
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .back-btn:hover {
          background: #4338ca;
        }
        
        .note {
          margin-top: 2rem;
          padding: 1rem;
          border: 1px dashed #ff6b6b;
          border-radius: 8px;
          background: #fff5f5;
          font-size: 0.9rem;
        }
        
        .note p {
          margin: 0;
          line-height: 1.5;
        }
        
        .footer {
          text-align: center;
          padding: 1.5rem;
          color: ${theme.colors.text.gray};
          font-size: 0.875rem;
          border-top: 1px solid #eaeaea;
          margin-top: 2rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .card {
            padding: 1.5rem;
          }
          
          .user-type-selector {
            flex-direction: column;
          }
          
          .user-type-btn {
            width: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: ${theme.typography.fontFamily.primary};
          background: #f0f2f5;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default DevLogin; 