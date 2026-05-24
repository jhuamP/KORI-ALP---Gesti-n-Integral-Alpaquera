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
            Conectamos la fibra de alpaca de más alta calidad directamente desde las comunidades productoras hasta el mercado global. Transparencia total, trazabilidad garantizada.
          </p>
          <button className="hero-cta" onClick={() => document.getElementById('marketplace').scrollIntoView({ behavior: 'smooth' })}>
            Explorar Catálogo
          </button>
        </div>
      </header>

      {/* Marketplace Section */}
      <section id="marketplace" className="marketplace-section">
        <div className="section-header">
          <h2>Lotes de Fibra Disponibles</h2>
          <p>Seleccionados bajo los más altos estándares de calidad alpaquera.</p>
        </div>
        
        <div className="products-grid">
          {premiumProducts.map(product => (
            <PremiumProductCard 
              key={product.id} 
              product={product} 
              onViewTraceability={() => navigate(`/trazabilidad/${product.id}`)}
              onBuy={() => {
                const mensaje = encodeURIComponent(`Hola Kori Alp 🦙, estoy interesado en adquirir el lote de fibra: ${product.title} (${product.id}) publicado a ${product.price}. ¿Podemos coordinar el pago y envío?`);
                window.open(`https://wa.me/51999999999?text=${mensaje}`, '_blank');
              }}
            />
          ))}
        </div>
      </section>

      {/* Nosotros Section */}
      <section id="nosotros" className="nosotros-section">
        <div className="section-header">
          <h2>Nuestra Historia y Misión</h2>
          <p>Preservando la tradición alpaquera y el comercio justo.</p>
        </div>
        <div className="nosotros-content">
          <div className="nosotros-card">
            <h3>Orígenes Ancestrales</h3>
            <p>
              Trabajamos de la mano con comunidades de Puno, Cusco y Arequipa, donde la crianza y esquila de alpacas es un arte heredado por generaciones. Preservamos las técnicas ancestrales respetando al animal y al medio ambiente.
            </p>
          </div>
          <div className="nosotros-card">
            <h3>Certificación de Origen</h3>
            <p>
              Cada lote de fibra está respaldado por tecnología que garantiza su procedencia exacta, altitud de pastoreo, micraje preciso y el bienestar de los productores altoandinos.
            </p>
          </div>
        </div>
      </section>

      {/* Impacto Social Section */}
      <section id="impacto" className="impacto-section">
        <div className="section-header">
          <h2>Impacto Social y Sostenible</h2>
          <p>Cada compra apoya directamente a las familias de los criadores.</p>
        </div>
        <div className="impacto-grid">
          <div className="impacto-item">
            <div className="impacto-num">100%</div>
            <h4>Trato Directo</h4>
            <p>Sin intermediarios comerciales. El 100% de la venta va directo a las asociaciones.</p>
          </div>
          <div className="impacto-item">
            <div className="impacto-num">+45%</div>
            <h4>Ingresos Justos</h4>
            <p>Garantizamos precios superiores al mercado local gracias a la certificación de calidad.</p>
          </div>
          <div className="impacto-item">
            <div className="impacto-num">Eco</div>
            <h4>Huella Cero</h4>
            <p>Procesos ecológicos y pastoreo natural que respeta los bofedales altoandinos.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Kori Alp. Tecnología que nace en los Andes y llega al mundo.</p>
      </footer>
    </div>
  );
}
