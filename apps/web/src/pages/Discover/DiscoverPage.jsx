import React from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumProductCard from '../../components/PremiumProductCard/PremiumProductCard';
import PublicNavbar from '../../components/PublicNavbar/PublicNavbar';
import './DiscoverPage.css';

export default function DiscoverPage() {
  const navigate = useNavigate();

  // Mock data for the Jury demonstration
  const premiumProducts = [
    {
      id: 'alp-001',
      title: 'Fibra Baby Alpaca - Lote Blanco Premium',
      producer: 'Asociación Kori Alp - Don Teófilo',
      microns: '19.5',
      grade: 'Baby Alpaca',
      origin: 'Macusani, Puno (4,300 msnm)',
      certifications: ['SENASA', 'Fibra Orgánica'],
      image: 'https://images.unsplash.com/photo-1589136777351-fdc9c9cb1669?q=80&w=1000&auto=format&fit=crop',
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
      image: 'https://images.unsplash.com/photo-1596781285272-9720562e316a?q=80&w=1000&auto=format&fit=crop',
      price: '$22.50 / kg'
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
              onBuy={() => navigate('/login')}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
