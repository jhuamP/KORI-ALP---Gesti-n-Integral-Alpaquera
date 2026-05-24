import React from 'react';
import { FileText, Download } from 'lucide-react';
import styles from '../../pages/Costos/Costos.module.css';

export default function MisInversiones() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--color-earth)', marginBottom: '1rem' }}>Mis Inversiones y Trazabilidad</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>Historial de lotes adquiridos y certificados de origen (Blockchain).</p>
      
      <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
        <div className={styles.kpiCard} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div className={styles.kpiIcon} style={{ background: 'var(--color-gold-light)', color: 'var(--color-earth)' }}><FileText size={24}/></div>
            <div>
              <h3>Lote Premium Huacaya (ALP-001)</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Comprado el: 15 de Enero, 2026</p>
              <p style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Procesando Envío (Puerto de Ilo)</p>
            </div>
          </div>
          <button className={styles.primaryBtn}><Download size={18}/> Certificado de Origen</button>
        </div>
      </div>
    </div>
  );
}
