import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '@components/Layout/MainLayout';

// Páginas
import Dashboard from '@pages/Dashboard/Dashboard';
import Costos from '@pages/Costos/Costos';
import Mercado from '@pages/Mercado/Mercado';
import Formal from '@pages/Formal/Formal';
import Alpacas from '@pages/Alpacas/Alpacas';
import Login from '@pages/Auth/Login';
import Registro from '@pages/Auth/Registro';
import NotFound from '@pages/NotFound';

// Store de autenticación
import { useAuthStore } from '@store/authStore';

// Ruta protegida
const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="alpacas" element={<Alpacas />} />
          <Route path="costos" element={<Costos />} />
          <Route path="mercado" element={<Mercado />} />
          <Route path="formal" element={<Formal />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
