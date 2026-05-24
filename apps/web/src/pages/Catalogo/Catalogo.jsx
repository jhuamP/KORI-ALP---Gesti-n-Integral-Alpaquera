import React from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumProductCard from '../../components/PremiumProductCard/PremiumProductCard';

export default function Catalogo() {
  const navigate = useNavigate();

  const premiumProducts = [
    {
      id: 'alp-001',
      title: 'Lote Premium Huacaya',
      producer: 'Asociación Kori Alp',
      microns: '19.5',
      grade: 'Baby Alpaca',
      origin: 'Comunidad de Carabaya, Puno',
      certifications: ['SENASA', 'Orgánica'],
      price: '$3,250',
      image: 'https://images.unsplash.com/photo-1589136777351-fdc9c9cb1669?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'suri-005',
      title: 'Fibra Suri Seleccionada',
      producer: 'Cooperativa Macusani',
      microns: '18.2',
      grade: 'Royal Alpaca',
      origin: 'Macusani, Capital Alpaquera',
      certifications: ['Comercio Justo'],
      price: '$4,500',
      image: 'https://images.unsplash.com/photo-1596781285272-9720562e316a?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'alp-003',
      title: 'Fibra Fleece - Lote Negro Intenso',
      producer: 'Cooperativa San Juan',
      microns: '24.5',
      grade: 'Fleece',
      origin: 'Arequipa (4,000 msnm)',
      certifications: ['SENASA'],
      price: '$1,800',
      image: 'https://images.unsplash.com/photo-1542152862-243e8bb8ea07?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 'alp-004',
      title: 'Fibra Royal Alpaca - Edición Limitada',
      producer: 'Asociación Kori Alp',
      microns: '18.2',
      grade: 'Royal Alpaca',
      origin: 'Macusani, Puno (4,500 msnm)',
      certifications: ['Comercio Justo', 'Orgánica'],
      price: '$5,400',
      image: 'https://images.unsplash.com/photo-1589136777351-fdc9c9cb1669?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2.5rem', color: 'var(--color-earth)', marginBottom: '1rem' }}>Catálogo Exclusivo</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem' }}>Lotes de fibra certificados y seleccionados bajo altos estándares de calidad genética.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
        {premiumProducts.map(product => (
          <PremiumProductCard 
            key={product.id}
            product={product}
            onViewTraceability={() => navigate(`/trazabilidad/${product.id}`)}
            onBuy={() => {
              const mensaje = encodeURIComponent(`Hola Kori Alp 🦙, estoy interesado en adquirir el lote de Inversión Premium: ${product.title} (${product.id}) publicado a ${product.price}. ¿Podemos coordinar el pago seguro?`);
              window.open(`https://wa.me/51999999999?text=${mensaje}`, '_blank');
            }}
          />
        ))}
      </div>
    </div>
  );
}
