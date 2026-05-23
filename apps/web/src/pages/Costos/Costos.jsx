import React, { useState } from 'react';
import styles from './Costos.module.css';

// TODO: Conectar con /api/costos/calcular
// import api from '@services/api';

const initialForm = {
  numAnimales: 1,
  costoPastos: 0,
  costoSanidad: 0,
  costoManoObra: 0,
  costoEsquila: 0,
  costoFaenado: 0,
  costoTransporte: 0,
  pesoFibraKg: 0,
  pesoCarneLote: 0,
};

export default function Costos() {
  const [form, setForm] = useState(initialForm);
  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const calcular = (e) => {
    e.preventDefault();
    const costoTotal = form.costoPastos + form.costoSanidad + form.costoManoObra +
                       form.costoEsquila + form.costoFaenado + form.costoTransporte;
    const costoPorAnimal = costoTotal / form.numAnimales;
    const MARGEN = 0.30;

    setResultado({
      costoTotal: costoTotal.toFixed(2),
      costoPorAnimal: costoPorAnimal.toFixed(2),
      precioSugeridoAnimal: (costoPorAnimal * (1 + MARGEN)).toFixed(2),
      precioFibraKg: form.pesoFibraKg > 0
        ? ((costoPorAnimal * 0.6) / form.pesoFibraKg * (1 + MARGEN)).toFixed(2)
        : null,
      precioCarneKg: form.pesoCarneLote > 0
        ? ((costoPorAnimal * 0.35 * form.numAnimales) / form.pesoCarneLote * (1 + MARGEN)).toFixed(2)
        : null,
    });
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, marginBottom: 8 }}>
        💰 Calculadora de Costos
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
        Calcula el costo real de crianza y obtén el precio justo sugerido para tu fibra y carne.
      </p>

      <div className={styles.grid}>
        {/* Formulario */}
        <form onSubmit={calcular} className={styles.card}>
          <h2 className={styles.cardTitle}>Ingresar Costos (S/.)</h2>

          <div className={styles.field}>
            <label>N° de animales</label>
            <input type="number" name="numAnimales" value={form.numAnimales} onChange={handleChange} min={1} />
          </div>
          {[
            ['costoPastos', '🌿 Pastos / Forraje'],
            ['costoSanidad', '💉 Sanidad (vacunas, desparasitación)'],
            ['costoManoObra', '👷 Mano de Obra (pastoreo)'],
            ['costoEsquila', '✂️ Esquila y Clasificación'],
            ['costoFaenado', '🥩 Faenado'],
            ['costoTransporte', '🚚 Transporte'],
          ].map(([name, label]) => (
            <div key={name} className={styles.field}>
              <label>{label}</label>
              <input type="number" name={name} value={form[name]} onChange={handleChange} min={0} step="0.01" />
            </div>
          ))}

          <hr style={{ borderColor: 'var(--color-border)', margin: '16px 0' }} />
          <h3 style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12 }}>Producción (opcional)</h3>

          <div className={styles.field}>
            <label>🧶 Kg de fibra total del lote</label>
            <input type="number" name="pesoFibraKg" value={form.pesoFibraKg} onChange={handleChange} min={0} step="0.1" />
          </div>
          <div className={styles.field}>
            <label>🥩 Kg de carne total del lote</label>
            <input type="number" name="pesoCarneLote" value={form.pesoCarneLote} onChange={handleChange} min={0} step="0.1" />
          </div>

          <button type="submit" className={styles.btn}>Calcular →</button>
        </form>

        {/* Resultado */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Resultado</h2>
          {resultado ? (
            <div className={styles.resultado}>
              <div className={styles.metrica}>
                <span>Costo Total del Lote</span>
                <strong>S/. {resultado.costoTotal}</strong>
              </div>
              <div className={styles.metrica}>
                <span>Costo por Animal</span>
                <strong>S/. {resultado.costoPorAnimal}</strong>
              </div>
              <div className={`${styles.metrica} ${styles.destacado}`}>
                <span>💡 Precio Justo Sugerido / Animal</span>
                <strong className={styles.precioJusto}>S/. {resultado.precioSugeridoAnimal}</strong>
              </div>
              {resultado.precioFibraKg && (
                <div className={styles.metrica}>
                  <span>🧶 Precio Fibra / Kg</span>
                  <strong>S/. {resultado.precioFibraKg}</strong>
                </div>
              )}
              {resultado.precioCarneKg && (
                <div className={styles.metrica}>
                  <span>🥩 Precio Carne / Kg</span>
                  <strong>S/. {resultado.precioCarneKg}</strong>
                </div>
              )}
              <p className={styles.nota}>* Incluye margen mínimo del 30%</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
              <p>Ingresa tus costos y presiona <strong>Calcular</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
