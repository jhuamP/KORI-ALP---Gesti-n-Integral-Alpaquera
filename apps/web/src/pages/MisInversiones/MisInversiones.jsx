import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { useAuthStore } from '@store/authStore';

const API = '/api';

export default function MisInversiones() {
  const { token } = useAuthStore();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch(`${API}/mercado/mis-compras`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCompras(data.data || []);
      } catch (error) {
        console.error('Error fetching mis compras:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCompras();
  }, [token]);

  const getStatusDisplay = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return { color: '#E65100', bg: '#FFF3E0', icon: <Clock size={16} />, text: 'En evaluación por Kori Alp' };
      case 'ACEPTADA':
      case 'VENDIDA':
        return { color: '#2E7D32', bg: '#E8F5E9', icon: <CheckCircle size={16} />, text: 'Compra Aprobada - En proceso de envío' };
      case 'RECHAZADA':
        return { color: '#C62828', bg: '#FFEBEE', icon: <XCircle size={16} />, text: 'Solicitud Rechazada' };
      default:
        return { color: '#666', bg: '#eee', icon: <Clock size={16} />, text: estado };
    }
  };

  const handleDownload = (id) => {
    alert(`Descargando Certificado de Origen para el lote ${id}. (Simulación)`);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--color-earth)', marginBottom: '0.5rem' }}>Mis Inversiones y Trazabilidad</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
        Historial de lotes que has solicitado adquirir. Aquí puedes descargar tus certificados de origen para los lotes aprobados.
      </p>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Cargando tus solicitudes...</div>
      ) : compras.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px', border: '1px dashed #ccc' }}>
          <Search size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#666', margin: 0 }}>Aún no tienes solicitudes de compra</h3>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Explora el Catálogo Premium para encontrar lotes de fibra.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {compras.map(compra => {
            const pub = compra.publicacion;
            const status = getStatusDisplay(compra.estado);
            const totalEstimado = compra.cantidadSolicitada && pub?.precioSolicitado 
              ? (compra.cantidadSolicitada * pub.precioSolicitado).toFixed(2)
              : null;
            const isAprobado = compra.estado === 'ACEPTADA' || compra.estado === 'VENDIDA';

            return (
              <div key={compra.id} style={{
                background: '#fff',
                padding: '1.5rem 2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'transform 0.2s',
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '60px', height: '60px', 
                    background: 'var(--color-surface-2)', 
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-earth)'
                  }}>
                    <FileText size={28}/>
                  </div>
                  
                  <div>
                    <h3 style={{ color: 'var(--color-text)', fontSize: '1.2rem', marginBottom: '4px' }}>
                      {pub?.titulo || 'Lote no disponible'}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                      Solicitado el: {new Date(compra.creadoEn).toLocaleDateString('es-PE')} 
                      {totalEstimado && ` | Total Estimado: S/ ${totalEstimado}`}
                    </p>
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      background: status.bg, color: status.color, 
                      padding: '0.3rem 0.8rem', borderRadius: '20px',
                      fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {status.icon} {status.text}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDownload(compra.id)}
                  disabled={!isAprobado}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: isAprobado ? 'var(--color-earth)' : '#e0e0e0',
                    color: isAprobado ? '#fff' : '#999',
                    border: 'none', padding: '0.8rem 1.2rem',
                    borderRadius: '8px', fontWeight: 600, 
                    cursor: isAprobado ? 'pointer' : 'not-allowed',
                    transition: 'opacity 0.2s'
                  }}
                  title={isAprobado ? "Descargar Certificado de Origen" : "Disponible cuando la compra sea aprobada"}
                >
                  <Download size={18}/> Certificado
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
