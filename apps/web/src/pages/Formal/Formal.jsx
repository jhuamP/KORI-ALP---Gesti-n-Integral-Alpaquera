import React from 'react';

export default function Formal() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, marginBottom: 8 }}>
        📄 Formalizar
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
        Genera boletas, guías de remisión SUNAT y documentos SENASA. Guía paso a paso para exportar.
      </p>

      {/* Guía de exportación (estática por ahora) */}
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
        🗺️ Ruta para exportar tu fibra
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
        {[
          { paso: 1, titulo: 'Obtener RUC', entidad: 'SUNAT', desc: 'Regístrate en SUNAT como persona natural o jurídica.' },
          { paso: 2, titulo: 'Certificado Sanitario', entidad: 'SENASA', desc: 'Certifica la sanidad de tu fibra para exportación.' },
          { paso: 3, titulo: 'Registro de Exportador', entidad: 'MINCETUR', desc: 'Inscríbete en el registro nacional de exportadores.' },
          { paso: 4, titulo: 'Encontrar Comprador', entidad: 'KORI ALP', desc: 'Usa el módulo Mercado para conectar con importadores.' },
          { paso: 5, titulo: 'Declaración Aduanera', entidad: 'Aduanas', desc: 'Tramita tu DAM (Declaración Aduanera de Mercancías).' },
        ].map(({ paso, titulo, entidad, desc }) => (
          <div key={paso} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}>
            <div style={{
              minWidth: 32, height: 32,
              borderRadius: '50%',
              background: 'rgba(200,150,42,0.15)',
              color: 'var(--color-gold-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14,
            }}>
              {paso}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <strong style={{ fontSize: 15 }}>{titulo}</strong>
                <span style={{
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text-muted)',
                  borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 600,
                }}>{entidad}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
