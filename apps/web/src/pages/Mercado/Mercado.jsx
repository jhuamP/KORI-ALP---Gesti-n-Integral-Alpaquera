import React from 'react';

export default function Mercado() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, marginBottom: 8 }}>
        🛒 Mercado Directo
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
        Conecta directamente con compradores de fibra, carne y cuero. Sin intermediarios.
      </p>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 48,
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
        <h3 style={{ marginBottom: 8 }}>Módulo en construcción</h3>
        <p style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
          Aquí podrás publicar tu fibra (Baby Alpaca, Fleece, Suri), carne (charqui, cortes frescos)
          y cuero para conectar con compradores textiles, restaurantes gourmet e industrias.
        </p>
      </div>
    </div>
  );
}
