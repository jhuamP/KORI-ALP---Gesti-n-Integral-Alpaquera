import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Power } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import styles from './Usuarios.module.css';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('TODOS');
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
      const response = await axios.get('http://localhost:3000/api/admin/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataArray = response.data.data || response.data || [];
      setUsuarios(dataArray);
        
        // Simular notificaciones basadas en usuarios recientes
        const recientes = dataArray.filter(u => {
          const date = new Date(u.creadoEn);
          const hoy = new Date();
          return (hoy - date) / (1000 * 60 * 60 * 24) < 2; // Últimos 2 días
        });
        
        setNotificaciones(recientes.map(u => 
          `Nuevo ${u.rol === 'PRODUCTOR' ? 'Vendedor' : 'Comprador'} registrado: ${u.nombre}`
        ));
      } catch (error) {
        console.error('Error fetching usuarios', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchUsuarios();
    }
  }, [token]);

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/admin/usuarios/${id}/toggle-activo`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualizar localmente para no hacer refetch
      setUsuarios(usuarios.map(u => 
        u.id === id ? { ...u, activo: !u.activo } : u
      ));
    } catch (error) {
      console.error('Error toggling status', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    if (filtro === 'TODOS') return true;
    return u.rol === filtro;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Supervisa a los compradores y vendedores de la plataforma.</p>
        </div>
        
        <div className={styles.notificationWrapper}>
          <button 
            className={styles.notifBtn} 
            onClick={() => setShowNotif(!showNotif)}
          >
            <Bell size={24} />
            {notificaciones.length > 0 && <span className={styles.badge}>{notificaciones.length}</span>}
          </button>
          
          {showNotif && (
            <div className={styles.notifDropdown}>
              <h4>Notificaciones</h4>
              {notificaciones.length === 0 ? (
                <p>No hay notificaciones nuevas</p>
              ) : (
                notificaciones.map((n, i) => (
                  <div key={i} className={styles.notifItem}>{n}</div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={filtro === 'TODOS' ? styles.activeTab : styles.tab} 
          onClick={() => setFiltro('TODOS')}
        >
          Todos
        </button>
        <button 
          className={filtro === 'PRODUCTOR' ? styles.activeTab : styles.tab} 
          onClick={() => setFiltro('PRODUCTOR')}
        >
          Vendedores
        </button>
        <button 
          className={filtro === 'COMPRADOR' ? styles.activeTab : styles.tab} 
          onClick={() => setFiltro('COMPRADOR')}
        >
          Compradores
        </button>
        <button 
          className={filtro === 'ADMIN' ? styles.activeTab : styles.tab} 
          onClick={() => setFiltro('ADMIN')}
        >
          Admins
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <p className={styles.loading}>Cargando usuarios...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>No hay usuarios en esta categoría.</td>
                </tr>
              ) : (
                usuariosFiltrados.map(user => (
                  <tr key={user.id}>
                    <td className={styles.fwBold}>{user.nombre}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[user.rol.toLowerCase()]}`}>
                        {user.rol === 'PRODUCTOR' ? 'Vendedor' : user.rol === 'COMPRADOR' ? 'Comprador' : 'Súper Admin'}
                      </span>
                    </td>
                    <td>
                      <span className={user.activo ? styles.statusActive : styles.statusInactive}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{new Date(user.creadoEn).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(user.id)}
                        className={user.activo ? styles.btnDesactivar : styles.btnActivar}
                        title={user.activo ? "Desactivar usuario" : "Activar usuario"}
                        disabled={user.rol === 'ADMIN'}
                        style={{
                          background: 'none', border: 'none', cursor: user.rol === 'ADMIN' ? 'not-allowed' : 'pointer',
                          color: user.rol === 'ADMIN' ? '#ccc' : (user.activo ? '#C62828' : '#2E7D32')
                        }}
                      >
                        <Power size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
