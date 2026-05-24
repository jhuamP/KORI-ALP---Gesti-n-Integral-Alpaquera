import React, { useState, useEffect } from 'react';
import { Users, Store, Package, ShoppingBag, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import styles from './SuperAdminDashboard.module.css';

const API = '/api';

export default function SuperAdminDashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Panel Principal Kori Alp</h1>
        <p>Visión general de la plataforma y actividad del ecosistema.</p>
      </header>
      
      {loading ? (
        <p style={{ color: '#aaa' }}>Cargando métricas globales...</p>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <Users size={20} color="#4A3320" />
                <h3>Usuarios</h3>
              </div>
              <p className={styles.statValue}>{stats?.usuarios?.total || 0}</p>
              <div className={styles.statDetails}>
                <span>{stats?.usuarios?.productores || 0} Vendedores</span>
                <span>{stats?.usuarios?.compradores || 0} Compradores</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <Package size={20} color="#2E7D32" />
                <h3>Alpacas Registradas</h3>
              </div>
              <p className={styles.statValue}>{stats?.alpacas?.activas || 0}</p>
              <div className={styles.statDetails}>
                <span style={{ color: '#2E7D32' }}><CheckCircle size={12}/> Activas en hatos</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <Store size={20} color="#CD853F" />
                <h3>Mercado (Lotes)</h3>
              </div>
              <p className={styles.statValue}>{stats?.publicaciones?.activas || 0}</p>
              <div className={styles.statDetails}>
                <span style={{ color: '#E65100' }}><Clock size={12}/> {stats?.publicaciones?.pendientes || 0} pendientes de aprobación</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.cardHeader}>
                <ShoppingBag size={20} color="#1976D2" />
                <h3>Solicitudes de Compra</h3>
              </div>
              <p className={styles.statValue}>{stats?.solicitudes?.pendientes || 0}</p>
              <div className={styles.statDetails}>
                <span style={{ color: '#1976D2' }}><TrendingUp size={12}/> En proceso</span>
              </div>
            </div>
          </div>
          
          <div className={styles.content}>
            <h2>Resumen del Ecosistema</h2>
            <div className={styles.placeholder} style={{ background: '#f9f9f9', border: '1px solid #eee', padding: '2rem', borderRadius: '12px' }}>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                El ecosistema Kori Alp está conectando exitosamente a productores alpaqueros con compradores internacionales. 
                Utiliza el menú lateral para gestionar usuarios, revisar y aprobar las publicaciones pendientes, y asegurar que la plataforma mantenga los estándares de Comercio Justo.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
