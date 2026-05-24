import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mountain, CheckCircle, Scissors, TestTube } from 'lucide-react';
import './TrazabilidadPage.css';

export default function TrazabilidadPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const timelineEvents = [
    {
      date: '15 Mar 2024',
      title: 'Origen del Lote',
      description: 'Nacimiento y pastoreo en la Cordillera de Carabaya (4,300 msnm).',
      icon: <Mountain size={20} color="#8C6239" />
    },
    {
      date: '02 Oct 2024',
      title: 'Certificación Sanitaria',
      description: 'Control y vacunación completa aprobada por SENASA.',
      icon: <CheckCircle size={20} color="#5C715E" />
    },
    {
      date: '10 Nov 2024',
      title: 'Esquila Técnica Inka Inca',
      description: 'Proceso de esquila humanitaria sin estrés para el animal preservando la longitud de la mecha.',
      icon: <Scissors size={20} color="#4A3320" />
    },
    {
      date: '05 Dic 2024',
      title: 'Análisis de Laboratorio',
      description: 'Clasificación de fibra: 19.5 Micrones (Calidad Baby Alpaca).',
      icon: <TestTube size={20} color="#3D7AB5" />
    }
  ];

  const chartData = [
    { altitude: '3000m', micrones: 24.5 },
    { altitude: '3500m', micrones: 22.8 },
    { altitude: '3900m', micrones: 21.0 },
    { altitude: '4300m', micrones: 19.5 },
    { altitude: '4800m', micrones: 18.2 },
  ];

  return (
    <div className="traceability-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Volver al Catálogo
      </button>

      <div className="traceability-content">
        <div className="traceability-header">
          <h1>Historia del Producto</h1>
          <p className="subtitle">Lote ID: {id?.toUpperCase() || 'ALP-001'}</p>
        </div>

        <div className="traceability-body">
          <div className="timeline-container">
            <h2 className="section-title">Línea de Vida del Lote</h2>
            {timelineEvents.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">{event.icon}</div>
                <div className="timeline-content">
                  <span className="timeline-date">{event.date}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="value-added-container">
            <div className="chart-card">
              <h2 className="section-title">Impacto de Altitud en Calidad</h2>
              <p className="chart-desc">
                Las alpacas criadas a mayor altitud desarrollan fibra más fina (menos micrones) para protegerse del frío extremo. Este lote proviene de los <strong>4,300 msnm</strong>, garantizando su calificación <strong>Baby Alpaca (19.5µ)</strong>.
              </p>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0DCD1" />
                    <XAxis dataKey="altitude" tick={{fill: '#756B5D', fontSize: 12}} />
                    <YAxis tick={{fill: '#756B5D', fontSize: 12}} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}
                      formatter={(value) => [`${value} Micrones`, 'Finura']}
                    />
                    <Line type="monotone" dataKey="micrones" stroke="#CD853F" strokeWidth={3} dot={{r: 5, fill: '#4A3320'}} activeDot={{r: 8}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="producer-card">
              <img src="https://images.unsplash.com/photo-1542152862-243e8bb8ea07?q=80&w=600&auto=format&fit=crop" alt="Productor Andino" className="producer-img"/>
              <div className="producer-info">
                <h3>Impacto Social</h3>
                <p>Al adquirir este lote, apoyas directamente a la economía de <strong>12 familias</strong> de la asociación Kori Alp en la región de Puno, promoviendo el comercio justo.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="traceability-footer">
          <button className="btn-buy-large" onClick={() => navigate('/login')}>
            Contactar al Productor / Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
