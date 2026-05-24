import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/app');
    }
  };

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

            <button type="submit" className="btn-primary">
              <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              Iniciar sesión
            </button>
          </form>

          <div className="sep"><span>o</span></div>

          <button className="btn-google">
            <svg className="g" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>

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
