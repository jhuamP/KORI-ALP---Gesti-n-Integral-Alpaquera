import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      background: 'var(--color-bg)',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🦙</div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 48, color: 'var(--color-gold-light)' }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
        Esta página se perdió en los Andes...
      </p>
      <Link to="/" style={{
        background: 'var(--color-gold)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        fontWeight: 700,
      }}>
        Volver al inicio
      </Link>
    </div>
  );
}
