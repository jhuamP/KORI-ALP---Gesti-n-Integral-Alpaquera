import React from 'react';
import styles from './Dashboard.module.css';

const stats = [
  { icon: '🦙', label: 'Total Alpacas', value: '—', color: 'gold' },
  { icon: '💰', label: 'Costo/Animal', value: '—', color: 'earth' },
  { icon: '🛒', label: 'Publicaciones', value: '—', color: 'sky' },
  { icon: '📄', label: 'Documentos', value: '—', color: 'success' },
];

const modulos = [
  {
    icon: '🦙',
    titulo: 'Mi Hato',
    desc: 'Registra y gestiona tus alpacas por raza, edad, calidad de fibra y estado.',
    path: '/alpacas',
    color: '#C8962A',
  },
  {
    icon: '💰',
    titulo: 'Costos Integral',
    desc: 'Calcula el costo real de crianza y obtén el precio justo sugerido para cada línea de valor.',
    path: '/costos',
    color: '#3DAA6E',
  },
  {
    icon: '🛒',
    titulo: 'Mercado Directo',
    desc: 'Conecta directamente con compradores textiles, gastronómicos e industriales. Sin intermediarios.',
    path: '/mercado',
    color: '#3D7AB5',
  },
  {
    icon: '📄',
    titulo: 'Formalizar',
    desc: 'Genera boletas, guías de remisión y documentos SUNAT. Guía paso a paso para exportar.',
    path: '/formal',
    color: '#9A7020',
  },
];

export default function Dashboard() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>¡Bienvenido a KORI ALP 🦙!</h1>
          <p className={styles.subtitle}>
            Tecnología que nace en los Andes y llega al mundo.
          </p>
        </div>
        <div className={styles.badge}>Beta v0.1</div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map(({ icon, label, value, color }) => (
          <div key={label} className={`${styles.statCard} ${styles[color]}`}>
            <span className={styles.statIcon}>{icon}</span>
            <div>
              <p className={styles.statLabel}>{label}</p>
              <p className={styles.statValue}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Módulos */}
      <h2 className={styles.sectionTitle}>Módulos del Sistema</h2>
      <div className={styles.modulosGrid}>
        {modulos.map(({ icon, titulo, desc, path, color }) => (
          <a key={titulo} href={path} className={styles.moduloCard}>
            <div className={styles.moduloIcon} style={{ background: `${color}20`, color }}>
              {icon}
            </div>
            <h3 className={styles.moduloTitulo}>{titulo}</h3>
            <p className={styles.moduloDesc}>{desc}</p>
            <span className={styles.moduloLink}>Ir al módulo →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
