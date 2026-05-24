import React from 'react';
import './PremiumProductCard.css';

export default function PremiumProductCard({ product, onViewTraceability, onBuy }) {
  return (
    <div className="premium-card">
      <div className="card-image-container">
        <img src={product.image} alt={product.title} className="card-image" />
        <div className="card-badge">{product.grade}</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-producer">Productor: {product.producer}</p>
        
        <div className="card-stats">
          <div className="stat-item">
            <span className="stat-value">{product.microns}µ</span>
            <span className="stat-label">Micrones</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{product.origin.split(',')[0]}</span>
            <span className="stat-label">Origen</span>
          </div>
        </div>

        <div className="card-certifications">
          {product.certifications.map(cert => (
            <span key={cert} className="cert-tag">{cert}</span>
          ))}
        </div>

        <div className="card-footer">
          <span className="card-price">{product.price}</span>
          <div className="card-actions">
            <button className="btn-traceability" onClick={onViewTraceability}>
              Historia
            </button>
            <button className="btn-buy" onClick={onBuy}>
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
