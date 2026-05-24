import React from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumProductCard from '../../components/PremiumProductCard/PremiumProductCard';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const premiumProducts = [
    {
      id: 'alp-001',
      title: 'Fibra Baby Alpaca - Lote Blanco Premium',
      producer: 'Asociación Kori Alp - Don Teófilo',
      microns: '19.5',
      grade: 'Baby Alpaca',
      origin: 'Macusani, Puno (4,300 msnm)',
      certifications: ['SENASA', 'Fibra Orgánica'],
      image: '/images/alpaca-1.jpeg',
      price: '$28.00 / kg'
    },
    {
      id: 'alp-002',
      title: 'Fibra Suri Sedosa - Lote Canela',
      producer: 'Comunidad Andina Alta',
      microns: '22.1',
      grade: 'Suri Fina',
      origin: 'Cusco (3,900 msnm)',
      certifications: ['Fair Trade'],
      image: '/images/alpaca-2.jpeg',
      price: '$22.50 / kg'
    },
    {
      id: 'alp-003',
      title: 'Fibra Fleece - Lote Negro Intenso',
      producer: 'Cooperativa San Juan',
      microns: '24.5',
      grade: 'Fleece',
      origin: 'Arequipa (4,000 msnm)',
      certifications: ['SENASA'],
      image: '/images/alpaca-3.jpeg',
      price: '$18.00 / kg'
    },
    {
      id: 'alp-004',
      title: 'Fibra Royal Alpaca - Edición Limitada',
      producer: 'Asociación Kori Alp',
      microns: '18.2',
      grade: 'Royal Alpaca',
      origin: 'Macusani, Puno (4,500 msnm)',
      certifications: ['Comercio Justo', 'Orgánica'],
      image: '/images/alpaca-4.jpeg',
      price: '$45.00 / kg'
    }
  ];

  return (
    <div className="discover-container">
      <PublicNavbar />
      
      {/* Hero Section */}
      <header className="discover-hero">
        <div className="hero-content">
          <h1 className="hero-title">El verdadero valor de los Andes</h1>
          <p className="hero-subtitle">
            Conectamos la fibra y carne de alpaca de más alta calidad directamente desde las comunidades productoras hasta el mercado global. Transparencia total, trazabilidad garantizada.
          </p>
          <button className="hero-cta" onClick={() => document.getElementById('marketplace').scrollIntoView()}>
            Explorar Catálogo
          </button>
        </div>
      </header>

      {/* Marketplace Section */}
      <section id="marketplace" className="marketplace-section">
        <div className="section-header">
          <h2>Lotes Disponibles para Exportación</h2>
          <p>Seleccionados bajo los más altos estándares de calidad.</p>
        </div>
        
        <div className="products-grid">
          {premiumProducts.map(product => (
            <PremiumProductCard 
              key={product.id} 
              product={product} 
              onViewTraceability={() => navigate(`/trazabilidad/${product.id}`)}
              onBuy={() => {
                const mensaje = encodeURIComponent(`Hola Kori Alp 🦙, estoy interesado en adquirir el lote: ${product.title} (${product.id}) publicado a ${product.price}. ¿Podemos coordinar el pago y envío?`);
                window.open(`https://wa.me/51999999999?text=${mensaje}`, '_blank');
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
