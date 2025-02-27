import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

type UserType = 'brand' | 'influencer' | null;

export default function Register() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!userType) {
      setError('Por favor seleccione si es una marca o influencer');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.terms) {
      setError('Debe aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      // Mock registration - will be replaced with actual API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual registration API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, userType }),
      // });
      
      // if (!response.ok) {
      //   const data = await response.json();
      //   throw new Error(data.message || 'Error al registrarse');
      // }
      
      // Route to onboarding
      router.push(`/auth/onboarding?type=${userType}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Registro | LogU</title>
        <meta name="description" content="Regístrate en LogU como marca o influencer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Crear Cuenta</h1>

        <div className="card">
          {userType === null ? (
            <div className="user-type-selection">
              <h2>¿Cómo te gustaría registrarte?</h2>
              <div className="user-type-options">
                <button 
                  className="user-type-button"
                  onClick={() => handleUserTypeSelect('brand')}
                >
                  <div className="icon">🏢</div>
                  <h3>Como Marca</h3>
                  <p>Promociona tus productos y servicios con influencers</p>
                </button>
                <button 
                  className="user-type-button"
                  onClick={() => handleUserTypeSelect('influencer')}
                >
                  <div className="icon">👤</div>
                  <h3>Como Influencer</h3>
                  <p>Colabora con marcas y monetiza tu audiencia</p>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error">{error}</div>}
              
              <div className="selected-type">
                Te estás registrando como: 
                <strong>{userType === 'brand' ? ' Marca' : ' Influencer'}</strong>
                <button 
                  type="button" 
                  className="change-type" 
                  onClick={() => setUserType(null)}
                >
                  Cambiar
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="name">
                  {userType === 'brand' ? 'Nombre de la Marca' : 'Nombre Completo'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={userType === 'brand' ? 'Ingresa el nombre de tu marca' : 'Ingresa tu nombre completo'}
                  required
                />
              </div>

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
                  placeholder="Crea una contraseña segura"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="terms">
                  Acepto los <Link href="/terms">Términos y Condiciones</Link> y la <Link href="/privacy">Política de Privacidad</Link>
                </label>
              </div>

              <div className="form-group">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>

              <div className="links">
                <Link href="/auth/login">¿Ya tienes cuenta? Inicia sesión</Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <style jsx>{`
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
          max-width: 600px;
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

        .user-type-selection h2 {
          text-align: center;
          margin-top: 0;
          margin-bottom: 2rem;
          color: #333;
        }

        .user-type-options {
          display: flex;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .user-type-options {
            flex-direction: column;
          }
        }

        .user-type-button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1.5rem;
          background: #f9f9f9;
          border: 2px solid #eaeaea;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .user-type-button:hover {
          border-color: #0070f3;
          transform: translateY(-5px);
        }

        .icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .user-type-button h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .user-type-button p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .selected-type {
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: #f0f7ff;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .change-type {
          margin-left: auto;
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .change-type:hover {
          text-decoration: underline;
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

        .form-group.checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .form-group.checkbox input {
          width: auto;
          margin-top: 0.25rem;
        }

        .form-group.checkbox label {
          font-weight: normal;
          font-size: 0.9rem;
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
      `}</style>
    </div>
  );
} 