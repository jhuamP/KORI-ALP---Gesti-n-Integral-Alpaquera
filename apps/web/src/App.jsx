import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout principal (Dashboard con Sidebar)
import MainLayout from '@components/Layout/MainLayout';

// ─── Páginas Públicas ───
import LandingPage from './pages/LandingPage/LandingPage';
import TrazabilidadPage from './pages/Trazabilidad/TrazabilidadPage';

// ─── Autenticación ───
import Login from './pages/Auth/Login';
import Registro from '@pages/Auth/Registro';

// ─── Páginas del Administrador (Vendedor) ───
import Dashboard from '@pages/Dashboard/Dashboard';
import Inventario from '@pages/Inventario/Inventario';
import Ofertas from '@pages/Ofertas/Ofertas';

// ─── Páginas del Comprador (Empresario) ───
import BuyerDashboard from '@pages/Dashboard/BuyerDashboard';
import Catalogo from '@pages/Catalogo/Catalogo';
import MisInversiones from '@pages/MisInversiones/MisInversiones';

// ─── Páginas del Super Administrador ───
import SuperAdminDashboard from '@pages/SuperAdmin/SuperAdminDashboard';
import Usuarios from '@pages/SuperAdmin/Usuarios';
import AprobacionPublicaciones from '@pages/SuperAdmin/AprobacionPublicaciones';

// ─── Páginas del Vendedor/Productor ───
import MisPublicaciones from '@pages/Vendedor/MisPublicaciones';

// ─── Otros ───
import NotFound from '@pages/NotFound';
import { useAuthStore } from '@store/authStore';

/**
 * Protege rutas que requieren autenticación.
 * Si no hay token, redirige al login.
 */
const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

/**
 * Muestra el Dashboard correcto según el rol del usuario:
 * - ADMIN → Dashboard de Vendedor
 * - COMPRADOR → Dashboard de Impacto
 */
const DashboardSwitcher = () => {
  const { user } = useAuthStore();
  if (user?.rol === 'ADMIN') return <SuperAdminDashboard />;
  if (user?.rol === 'PRODUCTOR') return <Dashboard />;
  return <BuyerDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Rutas Públicas ─── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/trazabilidad/:id" element={<TrazabilidadPage />} />
        
        {/* ─── Autenticación ─── */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* ─── Rutas Protegidas (Admin vs Comprador) ─── */}
        <Route path="/app" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<DashboardSwitcher />} />
          
          {/* Rutas del Productor / Vendedor */}
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="publicaciones" element={<MisPublicaciones />} />
          
          {/* Rutas del Comprador */}
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="inversiones" element={<MisInversiones />} />

          {/* Rutas del Súper Administrador */}
          <Route path="superadmin" element={<SuperAdminDashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="aprobaciones" element={<AprobacionPublicaciones />} />
        </Route>

        {/* ─── 404 ─── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
