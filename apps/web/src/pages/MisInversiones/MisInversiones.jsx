import React from 'react';
import { FileText, Download } from 'lucide-react';

export default function MisInversiones() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--color-earth)', marginBottom: '1rem' }}>Mis Inversiones y Trazabilidad</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>Historial de lotes adquiridos y certificados de origen.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <img src="https://images.unsplash.com/photo-1589136777351-fdc9c9cb1669?q=80&w=150&auto=format&fit=crop" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', boxShadow: 'var(--shadow-sm)' }} alt="Lote Premium" />
            <div style={{ 
              width: '50px', height: '50px', 
              background: 'var(--color-gold-light)', 
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-earth)'
            }}>
              <FileText size={24}/>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-text)', fontSize: '1.1rem' }}>Lote Premium Huacaya (ALP-001)</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Comprado el: 15 de Enero, 2026</p>
              <p style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '0.9rem' }}>Procesando Envío (Puerto de Ilo)</p>
            </div>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--color-earth)', color: '#fff',
            border: 'none', padding: '0.8rem 1.5rem',
            borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
          }}>
            <Download size={18}/> Certificado de Origen
          </button>
        </div>
      </div>
    </div>
  );
}
