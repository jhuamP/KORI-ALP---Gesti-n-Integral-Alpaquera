import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, Leaf, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';

const performanceData = [
  { month: 'Ene', fibra: 400, carne: 240 },
  { month: 'Feb', fibra: 300, carne: 139 },
  { month: 'Mar', fibra: 200, carne: 980 },
  { month: 'Abr', fibra: 278, carne: 390 },
  { month: 'May', fibra: 189, carne: 480 },
  { month: 'Jun', fibra: 239, carne: 380 },
  { month: 'Jul', fibra: 349, carne: 430 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { icon: <Package size={24} />, label: 'Alpacas Registradas', value: '142', subtext: '+12 este mes', color: 'var(--color-gold)' },
    { icon: <TrendingUp size={24} />, label: 'Valor Prom. Lote', value: '$3,250', subtext: 'Mercado Exportación', color: 'var(--color-success)' },
    { icon: <Award size={24} />, label: 'Micrones Prom.', value: '20.5µ', subtext: 'Calidad Fina', color: 'var(--color-sky)' },
    { icon: <Leaf size={24} />, label: 'Certificaciones', value: '3 Activas', subtext: 'SENASA, Orgánico', color: 'var(--color-sage)' },
  ];

  return (
    <div className={styles.page}>
      {/* Premium Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Panel de Productor: Kori Alp</h1>
          <p className={styles.subtitle}>
            Monitorea el crecimiento, la calidad genética y el rendimiento financiero de tu hato alpaquero en tiempo real.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryBtn} onClick={() => navigate('/app/inventario')}>Registrar Animal</button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/app/ofertas')}>Ver Ofertas</button>
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
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statSubtext}>{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Details Section */}
      <div className={styles.bottomSection}>
        <div className={styles.chartContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Rendimiento de Producción (kg)</h2>
            <select className={styles.filterSelect}>
              <option>Este Año</option>
              <option>Últimos 6 Meses</option>
            </select>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFibra" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#CD853F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#CD853F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCarne" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A3320" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4A3320" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A09B93" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A09B93" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0DCD1" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="fibra" stroke="#CD853F" fillOpacity={1} fill="url(#colorFibra)" name="Fibra (kg)" />
                <Area type="monotone" dataKey="carne" stroke="#4A3320" fillOpacity={1} fill="url(#colorCarne)" name="Carne (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Actividad Reciente</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityDot} style={{ background: 'var(--color-success)' }}></div>
              <div className={styles.activityContent}>
                <h4>Certificación SENASA aprobada</h4>
                <p>Lote #ALP-2024-B</p>
                <span>Hace 2 horas</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot} style={{ background: 'var(--color-gold)' }}></div>
              <div className={styles.activityContent}>
                <h4>Nueva oferta en Marketplace</h4>
                <p>Comprador: Textilera del Sur (Por $3,250)</p>
                <span>Hace 5 horas</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityDot} style={{ background: 'var(--color-sky)' }}></div>
              <div className={styles.activityContent}>
                <h4>Esquila registrada</h4>
                <p>25 alpacas raza Suri (45kg total)</p>
                <span>Ayer</span>
              </div>
            </div>
          </div>
          <button className={styles.viewAllBtn}>Ver todo el historial</button>
        </div>
      </div>
    </div>
  );
}
