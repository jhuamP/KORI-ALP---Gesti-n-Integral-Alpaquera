import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import styles from './MainLayout.module.css';

const navItems = [
  { path: '/',        icon: '📊', label: 'Dashboard'  },
  { path: '/alpacas', icon: '🦙', label: 'Mi Hato'    },
  { path: '/costos',  icon: '💰', label: 'Costos'     },
  { path: '/mercado', icon: '🛒', label: 'Mercado'    },
  { path: '/formal',  icon: '📄', label: 'Formalizar' },
];

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🦙</span>
          <span className={styles.logoText}>KORI ALP</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userAvatar}>👤</span>
            <span className={styles.userName}>{user?.nombre || 'Productor'}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Salir
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
