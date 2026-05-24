import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/app');
    }
  };

  const handleGoogleResponse = async (response) => {
    const success = await loginWithGoogle(response.credential);
    if (success) {
      navigate('/app');
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1047530932596-placeholder.apps.googleusercontent.com',
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large', width: '380' }
      );
    }
  }, []);

  return (
    <div className="login-page">
      <div className="login-left">
        <div>
          <div className="login-logo">
            <svg className="logo-icon" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 30 L10 18 Q10 14 13 13 L13 8 Q13 5 15 5 L16 5 Q17 5 17 6 L17 8 Q19 8 20 10 Q22 10 22 13 L22 30" stroke="#ffffff" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
              <path d="M15 5 L14 2 L16.5 4" stroke="#ffffff" strokeWidth="1.1" strokeLinejoin="round" fill="none"/>
              <path d="M13 22 L11.5 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M15 22 L14 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M19 22 L18 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M21 22 L22.5 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="16.5" cy="7" r=".8" fill="#ffffff"/>
              <path d="M22 16 Q25 15 24 18" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="logo-name">kori Alp</span>
          </div>

          <div className="brand-visual">
            <img src="https://cdn.vetverified.com/articles/6c3e6ee261f38e76da1223974b988a2da24141e89a14b97eab8fefe911332646.webp" alt="Kori Alp Illustration" className="brand-image" style={{ borderRadius: '12px' }} />
          </div>

          <div className="left-headline">
            <h2>Gestión andina<br />para el <em>siglo XXI</em></h2>
            <p className="tagline">Plataforma empresarial · Puno, Perú</p>
          </div>
        </div>

        <div className="testimonial">
          <p>Kori Alp transformó la forma en que gestionamos nuestra cadena de suministro. Precisión, velocidad y control total.</p>
          <cite>— Area de soporte tecnico</cite>
        </div>
      </div>

      <div className="login-right">
        <div className="form-container">
          <div className="right-header">
            <h1>Bienvenido de vuelta</h1>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  required
                />
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            <div className="field">
              <div className="field-row">
                <label htmlFor="password">Contraseña</label>
                <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                />
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Cargando...' : <>
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', marginRight: '6px', stroke: 'white', fill: 'none', strokeWidth: '2' }}>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                Iniciar sesión
              </>}
            </button>
          </form>

          <div className="sep"><span>o</span></div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: '44px' }}>
            <div id="googleBtn"></div>
          </div>

          <p className="register-row">¿No tienes cuenta?<Link to="/registro">Regístrate gratis</Link></p>

          <p className="security-note">
            <svg viewBox="0 0 24 24"><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" /></svg>
            Sesión protegida con cifrado TLS 256-bit
          </p>
        </div>
      </div>
    </div>
  );
}
