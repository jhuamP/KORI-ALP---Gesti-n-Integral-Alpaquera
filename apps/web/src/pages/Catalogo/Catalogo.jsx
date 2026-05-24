import React, { useState, useEffect } from 'react';
import ModalCompra from './ModalCompra';

const API = 'http://localhost:3000/api';

const CATEGORIAS = ['TODOS', 'FIBRA', 'CARNE', 'CUERO', 'ABONO'];

const BADGE_COLORES = {
  FIBRA:  { bg: '#E8F5E9', color: '#2E7D32' },
  CARNE:  { bg: '#FBE9E7', color: '#BF360C' },
  CUERO:  { bg: '#F3E5F5', color: '#6A1B9A' },
  ABONO:  { bg: '#F9FBE7', color: '#558B2F' },
  OTRO:   { bg: '#E3F2FD', color: '#1565C0' },
};

const fallbackImages = [
  '/images/alpaca-1.jpeg',
  '/images/alpaca-2.jpeg',
  '/images/alpaca-3.jpeg',
  '/images/alpaca-4.jpeg',
];

export default function Catalogo() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filtro, setFiltro]         = useState('TODOS');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const cat = filtro === 'TODOS' ? '' : filtro;
        const res  = await fetch(`${API}/mercado/publicaciones?categoria=${cat}`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error('Error cargando catálogo', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [filtro]);

  return (
    <div style={{ padding: '2rem' }}>

      {/* Modal de compra */}
      {productoSeleccionado && (
        <ModalCompra
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
        />
      )}

      {/* Encabezado */}
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2.5rem', color: 'var(--color-earth)',
        marginBottom: '0.4rem',
      }}>
        Catálogo Exclusivo
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.8rem', fontSize: '1rem' }}>
        Lotes certificados y aprobados por Kori Alp, listos para adquirir a precio justo.
      </p>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              border: '1.5px solid',
              borderColor: filtro === cat ? 'var(--color-earth)' : '#ddd',
              background: filtro === cat ? 'var(--color-earth)' : 'white',
              color: filtro === cat ? 'white' : '#555',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            {cat === 'TODOS' ? '🦙 Todos los lotes' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Estado: cargando */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
          <div style={{
            width: '36px', height: '36px', border: '3px solid #f0f0f0',
            borderTopColor: '#4A3320', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
          }}></div>
          <p>Cargando catálogo...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : products.length === 0 ? (
        /* Estado: vacío */
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'white', borderRadius: '16px',
          border: '2px dashed #e0e0e0',
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>🦙</p>
          <h3 style={{ color: '#888', margin: '0 0 0.5rem' }}>No hay lotes disponibles aún</h3>
          <p style={{ color: '#bbb' }}>
            Los vendedores están preparando sus ofertas. ¡Vuelve pronto!
          </p>
        </div>
      ) : (
        /* Grid de productos */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {products.map((product, idx) => {
            const colores = BADGE_COLORES[product.categoria] || BADGE_COLORES.OTRO;
            return (
              <div
                key={product.id}
                style={{
                  background: 'white', borderRadius: '18px', overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.09)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  display: 'flex', flexDirection: 'column',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform  = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow  = '0 12px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform  = 'translateY(0)';
                  e.currentTarget.style.boxShadow  = '0 4px 20px rgba(0,0,0,0.09)';
                }}
              >
                {/* Imagen */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  <img
                    src={fallbackImages[idx % fallbackImages.length]}
                    alt={product.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Badge de categoría */}
                  <div style={{
                    position: 'absolute', top: '0.8rem', left: '0.8rem',
                    background: colores.bg, color: colores.color,
                    padding: '0.3rem 0.8rem', borderRadius: '20px',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {product.categoria}
                  </div>
                  {/* Badge verificado */}
                  <div style={{
                    position: 'absolute', top: '0.8rem', right: '0.8rem',
                    background: '#2E7D32', color: 'white',
                    padding: '0.3rem 0.7rem', borderRadius: '20px',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    ✅ Aprobado
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding: '1.3rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.78rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    {product.productor?.usuario?.nombre || 'Productor'}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 700 }}>
                    {product.titulo}
                  </h3>
                  <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
                    {product.descripcion?.slice(0, 100)}{product.descripcion?.length > 100 ? '...' : ''}
                  </p>

                  {/* Precio y cantidad */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '1px' }}>Precio oficial Kori Alp</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4A3320', lineHeight: 1 }}>
                        S/ {parseFloat(product.precioSolicitado).toFixed(2)}
                        <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#aaa' }}> /{product.unidad}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: '#aaa' }}>Disponible</div>
                      <div style={{ fontWeight: 700, color: '#333', fontSize: '1.05rem' }}>
                        {product.cantidad} {product.unidad}
                      </div>
                    </div>
                  </div>

                  {product.ubicacion && (
                    <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem' }}>
                      📍 {product.ubicacion}
                    </div>
                  )}

                  {/* Botón de compra */}
                  <button
                    onClick={() => setProductoSeleccionado(product)}
                    style={{
                      width: '100%', padding: '0.9rem',
                      background: 'linear-gradient(135deg, #5D4037, #4A3320)',
                      color: 'white', border: 'none',
                      borderRadius: '12px', fontWeight: 700,
                      cursor: 'pointer', fontSize: '1rem',
                      transition: 'opacity 0.2s, transform 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    🛒 Comprar este lote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
