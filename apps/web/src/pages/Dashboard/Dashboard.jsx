import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, Store, Clock, Award } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuthStore } from '@store/authStore';
import styles from './Dashboard.module.css';

const API = 'http://localhost:3000/api';
const COLORS = ['#4A3320', '#CD853F', '#8B5A2B', '#DEB887'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [alpacas, setAlpacas] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [alpacasRes, pubRes] = await Promise.all([
        fetch(`${API}/alpacas`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/mercado/mis-publicaciones`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const alpacasData = await alpacasRes.json();
      const pubData = await pubRes.json();
      
      setAlpacas(alpacasData.data || []);
      setPublicaciones(pubData.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── KPIs Reales ──
  const alpacasActivas = alpacas.filter(a => a.estado === 'ACTIVO').length;
  const publicacionesActivas = publicaciones.filter(p => p.estado === 'ACTIVA').length;
  const publicacionesPendientes = publicaciones.filter(p => p.estado === 'PAUSADA').length;
  
  const micronesPromedio = alpacasActivas > 0 
    ? (alpacas.filter(a => a.estado === 'ACTIVO' && a.micrones).reduce((acc, curr) => acc + parseFloat(curr.micrones), 0) / alpacas.filter(a => a.estado === 'ACTIVO' && a.micrones).length).toFixed(1)
    : '—';

  const stats = [
    { icon: <Package size={24} />, label: 'Alpacas en Hato', value: alpacasActivas.toString(), subtext: 'Animales activos', color: 'var(--color-gold)' },
    { icon: <Store size={24} />, label: 'Lotes Activos', value: publicacionesActivas.toString(), subtext: 'En el catálogo', color: 'var(--color-success)' },
    { icon: <Clock size={24} />, label: 'En Revisión', value: publicacionesPendientes.toString(), subtext: 'Pendientes de admin', color: 'var(--color-warning)' },
    { icon: <Award size={24} />, label: 'Micrones Prom.', value: `${micronesPromedio}µ`, subtext: 'Calidad del hato', color: 'var(--color-sky)' },
  ];

  // ── Datos para Gráficos ──
  const alpacasPorRaza = [
    { name: 'Huacaya', value: alpacas.filter(a => a.raza === 'HUACAYA').length },
    { name: 'Suri', value: alpacas.filter(a => a.raza === 'SURI').length },
  ].filter(d => d.value > 0);

  // ── Actividad Reciente (Últimas publicaciones y alpacas) ──
  const recentActivity = [...publicaciones, ...alpacas]
    .sort((a, b) => new Date(b.creadoEn || b.createdAt) - new Date(a.creadoEn || a.createdAt))
    .slice(0, 4);

  return (
    <div className={styles.page}>
      {/* Premium Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>¡Hola, {user?.nombre?.split(' ')[0] || 'Productor'}!</h1>
          <p className={styles.subtitle}>
            Bienvenido a tu panel de control de Kori Alp. Gestiona tu hato alpaquero, publica tus lotes a precios justos y conecta con compradores de todo el mundo.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryBtn} onClick={() => navigate('/app/inventario')}>Registrar Alpaca</button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/app/publicaciones')}>Publicar Lote</button>
          </div>
        </div>
        <div className={styles.heroImageWrapper}>
          <img src="https://images.unsplash.com/photo-1542152862-243e8bb8ea07?q=80&w=800&auto=format&fit=crop" alt="Alpacas en los Andes" className={styles.heroImage} />
          <div className={styles.heroOverlay}></div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIconWrapper} style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
              {stat.icon}
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{stat.label}</p>
              <h3 className={styles.statValue}>{loading ? '...' : stat.value}</h3>
              <p className={styles.statSubtext}>{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Details Section */}
      <div className={styles.bottomSection}>
        <div className={styles.chartContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Distribución del Hato (Razas)</h2>
          </div>
          <div className={styles.chartWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
              <p style={{ color: '#aaa' }}>Cargando datos...</p>
            ) : alpacasPorRaza.length === 0 ? (
               <p style={{ color: '#aaa' }}>Aún no hay alpacas registradas.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alpacasPorRaza}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alpacasPorRaza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Actividad Reciente</h2>
          <div className={styles.activityList}>
            {loading ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Cargando actividad...</p>
            ) : recentActivity.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center' }}>Aún no hay actividad reciente.</p>
            ) : (
              recentActivity.map((item, i) => {
                const isPublicacion = !!item.titulo; // Publicaciones tienen título
                const dotColor = isPublicacion 
                  ? (item.estado === 'ACTIVA' ? 'var(--color-success)' : 'var(--color-warning)')
                  : 'var(--color-sky)';
                
                return (
                  <div key={i} className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: dotColor }}></div>
                    <div className={styles.activityContent}>
                      <h4>{isPublicacion ? 'Lote publicado' : 'Alpaca registrada'}</h4>
                      <p>{isPublicacion ? item.titulo : `Arete: ${item.arete} - ${item.raza}`}</p>
                      <span>{new Date(item.creadoEn || item.createdAt).toLocaleDateString('es-PE')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button className={styles.viewAllBtn} onClick={() => navigate('/app/publicaciones')}>Ver mis publicaciones</button>
        </div>
      </div>
    </div>
  );
}
