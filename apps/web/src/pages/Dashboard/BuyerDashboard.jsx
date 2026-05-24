import React from 'react';
import { Target, Leaf, Heart, Globe } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function BuyerDashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.heroBanner} style={{ backgroundColor: '#5C715E' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Mi Impacto Kori Alp</h1>
          <p className={styles.subtitle}>
            Tu inversión no solo adquiere la mejor fibra del mundo, sino que transforma la vida de las comunidades alpaqueras y protege el ecosistema andino.
          </p>
        </div>
        <div className={styles.heroImageWrapper}>
          <img src="https://images.unsplash.com/photo-1596781285272-9720562e316a?q=80&w=800&auto=format&fit=crop" alt="Paisaje de Puno" className={styles.heroImage} />
          <div className={styles.heroOverlay}></div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: 'var(--color-success)', backgroundColor: 'rgba(92,113,94,0.1)' }}>
            <Leaf size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Huella de Carbono</p>
            <h3 className={styles.statValue}>-450 kg CO2</h3>
            <p className={styles.statSubtext}>Compensada por prácticas orgánicas</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: 'var(--color-sky)', backgroundColor: 'rgba(61,122,181,0.1)' }}>
            <Globe size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Familias Impactadas</p>
            <h3 className={styles.statValue}>12</h3>
            <p className={styles.statSubtext}>Comunidad de Carabaya</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: 'var(--color-gold-dark)', backgroundColor: 'rgba(154,112,32,0.1)' }}>
            <Heart size={24} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Comercio Justo</p>
            <h3 className={styles.statValue}>100%</h3>
            <p className={styles.statSubtext}>Sin intermediarios abusivos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
