import React from 'react';
import { DollarSign, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './Ofertas.module.css';

const dataCostos = [
  { name: 'Alimentación', value: 45 },
  { name: 'Sanidad', value: 25 },
  { name: 'Esquila', value: 20 },
  { name: 'Otros', value: 10 },
];
const COLORS = ['#CD853F', '#5C715E', '#4A3320', '#DEB887'];

export default function Ofertas() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión Integral de Costos</h1>
          <p className={styles.subtitle}>Calcula el costo real de crianza y determina tu punto de equilibrio.</p>
        </div>
        <button className={styles.primaryBtn}><DollarSign size={18} /> Nuevo Gasto</button>
      </div>

      <div className={styles.grid}>
        <div className={styles.chartCard}>
          <h3>Distribución de Costos (Anual)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={dataCostos} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dataCostos.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartLegend}>
            {dataCostos.map((item, i) => (
              <div key={item.name} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: COLORS[i] }}></span>
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiItem}>
            <div className={styles.kpiIcon}><DollarSign size={24}/></div>
            <div>
              <p>Costo Total Anual</p>
              <h3>S/ 12,450.00</h3>
            </div>
          </div>
          <div className={styles.kpiItem}>
            <div className={styles.kpiIcon}><PieChartIcon size={24}/></div>
            <div>
              <p>Costo Promedio / Alpaca</p>
              <h3>S/ 87.67</h3>
            </div>
          </div>
          <div className={styles.kpiItem}>
            <div className={styles.kpiIcon}><FileText size={24}/></div>
            <div>
              <p>Precio Sugerido Venta</p>
              <h3 className={styles.highlight}>S/ 120.00 / kg</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
