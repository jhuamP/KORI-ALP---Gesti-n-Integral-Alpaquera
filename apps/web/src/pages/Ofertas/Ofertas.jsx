import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, PieChart as PieChartIcon, TrendingUp, Settings, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import styles from './Ofertas.module.css';

const API = 'http://localhost:3000/api';
const COLORS = ['#CD853F', '#5C715E', '#4A3320', '#DEB887', '#9C27B0', '#607D8B'];

export default function Ofertas() {
  const navigate = useNavigate();
  
  // Estado para los inputs del formulario
  const [params, setParams] = useState({
    numAnimales: 100,
    costoPastos: 2500,
    costoSanidad: 800,
    costoManoObra: 4000,
    costoEsquila: 500,
    costoFaenado: 0,
    costoTransporte: 300,
    pesoFibraKg: 2.5,
    pesoCarneLote: 0,
  });

  // Estado para los resultados
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calcula automáticamente cuando cambian los inputs
  useEffect(() => {
    const calcularCostos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/costos/calcular`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const data = await res.json();
        if (res.ok) {
          setResultado(data.resultado);
        }
      } catch (error) {
        console.error("Error al calcular costos", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Pequeño debounce para no saturar si tipea rápido
    const delay = setTimeout(calcularCostos, 500);
    return () => clearTimeout(delay);
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Datos para el gráfico de torta
  const chartData = [
    { name: 'Pastos', value: params.costoPastos },
    { name: 'Sanidad', value: params.costoSanidad },
    { name: 'Mano de Obra', value: params.costoManoObra },
    { name: 'Esquila', value: params.costoEsquila },
    { name: 'Faenado', value: params.costoFaenado },
    { name: 'Transporte', value: params.costoTransporte },
  ].filter(d => d.value > 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calculadora de Costos y Precio Justo</h1>
          <p className={styles.subtitle}>Ingresa los datos de tu campaña para obtener el precio sugerido de venta.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* PANEL IZQUIERDO - INPUTS */}
        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <Settings size={20} className={styles.iconH} />
            <h3>Variables de Producción</h3>
          </div>
          
          <div className={styles.formScroll}>
            <div className={styles.formSection}>
              <h4>Datos Generales</h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Número de Alpacas</label>
                  <input type="number" name="numAnimales" value={params.numAnimales} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Fibra por Animal (kg)</label>
                  <input type="number" name="pesoFibraKg" value={params.pesoFibraKg} onChange={handleChange} className={styles.input} step="0.1" />
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h4>Gastos Operativos Anuales (S/)</h4>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Alimentación / Pastos</label>
                  <input type="number" name="costoPastos" value={params.costoPastos} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Sanidad / Vacunas</label>
                  <input type="number" name="costoSanidad" value={params.costoSanidad} onChange={handleChange} className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Mano de Obra</label>
                  <input type="number" name="costoManoObra" value={params.costoManoObra} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Costo de Esquila</label>
                  <input type="number" name="costoEsquila" value={params.costoEsquila} onChange={handleChange} className={styles.input} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Transporte</label>
                  <input type="number" name="costoTransporte" value={params.costoTransporte} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Costo Faenado (Opcional)</label>
                  <input type="number" name="costoFaenado" value={params.costoFaenado} onChange={handleChange} className={styles.input} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL DERECHO - RESULTADOS */}
        <div className={styles.resultsPanel}>
          
          <div className={styles.chartCard}>
            <h3>Distribución de Costos</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `S/ ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.chartLegend}>
              {chartData.map((item, i) => (
                <div key={item.name} className={styles.legendItem}>
                  <span className={styles.legendColor} style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  <span>{item.name} ({((item.value / (resultado?.costoTotal || 1)) * 100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiRow}>
              <div className={styles.kpiItem}>
                <p>Costo Total Anual</p>
                <h3>S/ {resultado?.costoTotal?.toFixed(2) || '0.00'}</h3>
              </div>
              <div className={styles.kpiItem}>
                <p>Costo por Alpaca</p>
                <h3>S/ {resultado?.costoPorAnimal?.toFixed(2) || '0.00'}</h3>
              </div>
            </div>

            <div className={styles.highlightBox}>
              <div className={styles.highlightHeader}>
                <TrendingUp size={20} color="#2E7D32" />
                <span>Precio Sugerido Kori Alp (Margen {resultado?.margenAplicado || '30%'})</span>
              </div>
              <div className={styles.highlightValue}>
                S/ {resultado?.precioSugerido?.fibraPorKg?.toFixed(2) || '0.00'} <span>/ kg de fibra</span>
              </div>
              <p className={styles.highlightDesc}>
                Este precio asegura recuperar tu inversión operativa y generar una ganancia justa para mejorar la genética de tu hato.
              </p>
              
              <button 
                className={styles.actionBtn}
                onClick={() => navigate('/app/publicaciones')}
              >
                Usar este precio para Publicar <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
