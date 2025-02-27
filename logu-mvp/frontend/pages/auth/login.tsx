import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import authService from '../../services/auth.service';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Por favor complete todos los campos');
        return;
      }

      await authService.login(formData);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async (userType: 'brand' | 'influencer') => {
    setLoading(true);
    setError('');

    try {
      const email = userType === 'brand' ? 'brand@logu-test.com' : 'influencer@logu-test.com';
      const password = userType === 'brand' ? 'brand123' : 'influencer123';
      
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Dev login error:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión en modo desarrollador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Iniciar Sesión | LogU</title>
        <meta name="description" content="Inicia sesión en LogU para acceder a tu cuenta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Iniciar Sesión</h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingresa tu correo electrónico"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>

            <div className="links">
              <Link href="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
              <Link href="/auth/register">¿No tienes cuenta? Regístrate</Link>
            </div>
          </form>

          {process.env.NODE_ENV === 'development' && (
            <div className="dev-login">
              <h3>Acceso para desarrolladores</h3>
              <div className="dev-buttons">
                <button 
                  onClick={() => handleDevLogin('brand')} 
                  className="dev-button brand"
                  disabled={loading}
                >
                  Login como Marca
                </button>
                <button 
                  onClick={() => handleDevLogin('influencer')} 
                  className="dev-button influencer"
                  disabled={loading}
                >
                  Login como Influencer
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>
        {`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom, #ffffff, #f0f0f0);
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 500px;
        }

        .title {
          margin: 0 0 2rem 0;
          line-height: 1.15;
          font-size: 2.5rem;
          text-align: center;
          color: #333;
        }

        .card {
          width: 100%;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .error {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        input:focus {
          border-color: #0070f3;
          outline: none;
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover {
          background-color: #0051cc;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .links {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .links a {
          color: #0070f3;
          text-decoration: none;
        }

        .links a:hover {
          text-decoration: underline;
        }

        .dev-login {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }

        .dev-login h3 {
          text-align: center;
          margin-bottom: 1rem;
          color: #666;
          font-size: 1rem;
        }

        .dev-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .dev-button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: white;
        }

        .dev-button.brand {
          background-color: #4caf50;
        }

        .dev-button.brand:hover {
          background-color: #388e3c;
        }

        .dev-button.influencer {
          background-color: #ff9800;
        }

        .dev-button.influencer:hover {
          background-color: #f57c00;
        }

        .dev-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        `}
      </style>
    </div>
  );
} 