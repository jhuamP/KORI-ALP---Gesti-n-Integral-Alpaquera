import React from 'react';

// TODO: Conectar con el servicio de alpacas (api.js)
// import api from '@services/api';

export default function Alpacas() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, marginBottom: 8 }}>
        🦙 Mi Hato
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
        Registra y gestiona todas tus alpacas — raza, edad, calidad de fibra y estado.
      </p>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 48,
        textAlign: 'center',
        color: 'var(--color-text-muted)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🦙</div>
        <h3 style={{ marginBottom: 8 }}>Módulo en construcción</h3>
        <p style={{ fontSize: 14 }}>
          Aquí podrás registrar cada alpaca con su arete, raza (Huacaya/Suri),
          calidad de fibra (Baby Alpaca, Fleece, etc.) y estado.
        </p>
      </div>
    </div>
  );
}
