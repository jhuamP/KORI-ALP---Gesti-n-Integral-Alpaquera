import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, FileText, LogOut, Package, Megaphone, Target, Store, CheckSquare, Users } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import styles from './MainLayout.module.css';

const sellerNavItems = [
  { path: '/app',                    icon: <LayoutDashboard size={20} />, label: 'Mi Panel'           },
  { path: '/app/publicaciones',      icon: <Store size={20} />,          label: 'Mis Publicaciones'  },
  { path: '/app/inventario',         icon: <Package size={20} />,        label: 'Mis Alpacas'        },
  { path: '/app/ofertas',            icon: <Megaphone size={20} />,      label: 'Costos'             },
];

const superAdminNavItems = [
  { path: '/app/superadmin',    icon: <LayoutDashboard size={20} />, label: 'Panel Principal'       },
  { path: '/app/usuarios',      icon: <Users size={20} />,           label: 'Gestión de Usuarios'   },
  { path: '/app/aprobaciones',  icon: <CheckSquare size={20} />,    label: 'Aprobar Publicaciones' },
];

const buyerNavItems = [
  { path: '/app',             icon: <Target size={20} />,          label: 'Mi Impacto'  },
  { path: '/app/catalogo',    icon: <ShoppingCart size={20} />,    label: 'Catálogo Premium' },
  { path: '/app/inversiones', icon: <FileText size={20} />,        label: 'Mis Inversiones' },
];

export default function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.rol === 'ADMIN') return superAdminNavItems;
    if (user?.rol === 'PRODUCTOR') return sellerNavItems;
    return buyerNavItems;
  };

  const navItems = getNavItems();

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
              end={path === '/app'}
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
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nombre || 'Usuario')}&background=${user?.rol === 'ADMIN' ? 'a0795a' : 'ffe0b0'}&color=${user?.rol === 'ADMIN' ? 'fff' : '4A3320'}`} 
              alt="Avatar" 
              className={styles.userAvatarImg} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={styles.userName}>{user?.nombre || 'Usuario'}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                {user?.rol === 'ADMIN' ? 'Súper Admin' : user?.rol === 'PRODUCTOR' ? 'Productor' : 'Inversionista'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> Salir
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
