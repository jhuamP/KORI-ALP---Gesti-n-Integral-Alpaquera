import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './Registro.css';

export default function Registro() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Se usa 'ADMIN' internamente para Productor/Vendedor según nuestro diseño dual
  const [rol, setRol] = useState('COMPRADOR');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ nombre, email, password, rol });
    if (success) {
      navigate('/app');
    }
  };

  return (
    <div className="registro-page">

      {/* PANEL IZQUIERDO */}
      <div className="left">
        <div>
          <div className="logo">

            <span className="logo-name">kori Alp</span>
          </div>

          <div className="brand-visual">
            <img src="https://cdn.vetverified.com/articles/6c3e6ee261f38e76da1223974b988a2da24141e89a14b97eab8fefe911332646.webp" alt="Kori Alp" className="brand-image" style={{ borderRadius: '12px' }} />
          </div>

          <div className="left-headline">
            <h2>Gestión andina<br />para el <em>siglo XXI</em></h2>
            <p className="tagline">Plataforma empresarial · Puno, Perú</p>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO (REGISTRO) */}
      <div className="right">
        <div className="form-container">
          <div className="right-header">
            <h1>Crea tu cuenta</h1>
            <p>Comienza a gestionar tu negocio hoy mismo</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

            {/* SELECCIÓN DE ROL DE USUARIO */}
            <label>Tipo de cuenta</label>
            <div className="role-selection">

              {/* Opción Comprador */}
              <label className="role-option">
                <input
                  type="radio"
                  name="user_role"
                  value="COMPRADOR"
                  checked={rol === 'COMPRADOR'}
                  onChange={() => setRol('COMPRADOR')}
                />
                <div className="role-card">
                  <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  <span>Comprador</span>
                  <p>Quiero adquirir insumos y productos</p>
                </div>
              </label>

              {/* Opción Vendedor */}
              <label className="role-option">
                <input
                  type="radio"
                  name="user_role"
                  value="PRODUCTOR"
                  checked={rol === 'PRODUCTOR'}
                  onChange={() => setRol('PRODUCTOR')}
                />
                <div className="role-card">
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="21" x2="9" y2="9"></line><line x1="9" y1="9" x2="21" y2="9"></line><line x1="3" y1="14" x2="9" y2="14"></line></svg>
                  <span>Vendedor</span>
                  <p>Quiero ofrecer y distribuir productos</p>
                </div>
              </label>

            </div>

            {/* CAMPOS DEL FORMULARIO */}
            <div className="field">
              <label htmlFor="fullname">Nombre completo</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullname"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  required
                />
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  required
                />
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>

          <p className="register-row">¿Ya tienes cuenta?<Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>

    </div>
  );
}
