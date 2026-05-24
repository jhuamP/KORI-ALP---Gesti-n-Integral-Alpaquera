import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './PublicNavbar.css';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavClick = (selector) => {
    setMenuOpen(false);
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="public-navbar">
      <div className="navbar-logo" onClick={() => { setMenuOpen(false); navigate('/'); }}>
        <svg className="nav-logo-icon" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 30 L10 18 Q10 14 13 13 L13 8 Q13 5 15 5 L16 5 Q17 5 17 6 L17 8 Q19 8 20 10 Q22 10 22 13 L22 30" stroke="#ffffff" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
          <path d="M15 5 L14 2 L16.5 4" stroke="#ffffff" strokeWidth="1.1" strokeLinejoin="round" fill="none"/>
          <path d="M13 22 L11.5 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M15 22 L14 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M19 22 L18 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M21 22 L22.5 30" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="16.5" cy="7" r=".8" fill="#ffffff"/>
          <path d="M22 16 Q25 15 24 18" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        </svg>
        <span className="nav-logo-text">KORI ALP</span>
      </div>

      <button className="navbar-mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
      </button>

      <div className={`navbar-menu-wrapper ${menuOpen ? 'is-open' : ''}`}>
        <div className="navbar-links">
          <a href="#marketplace" onClick={(e) => { e.preventDefault(); handleNavClick('#marketplace'); }}>Catálogo</a>
          <a href="#nosotros" onClick={(e) => { e.preventDefault(); handleNavClick('#nosotros'); }}>Nosotros</a>
          <a href="#impacto" onClick={(e) => { e.preventDefault(); handleNavClick('#impacto'); }}>Impacto Social</a>
        </div>

        <div className="navbar-auth">
          <Link to="/login" className="nav-btn-signin" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
          <Link to="/registro" className="nav-btn-signup" onClick={() => setMenuOpen(false)}>Regístrate</Link>
        </div>
      </div>
    </nav>
  );
}
