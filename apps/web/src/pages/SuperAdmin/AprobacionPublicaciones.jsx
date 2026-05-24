import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import styles from './AprobacionPublicaciones.module.css';

const API = '/api';

export default function AprobacionPublicaciones() {
  const { token } = useAuthStore();
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);
  const [motivoRechazos, setMotivoRechazos] = useState({}); // { [id]: string }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPendientes = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/mercado/pendientes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPendientes(data.data || []);
    } catch {
      showToast('Error al cargar publicaciones pendientes', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPendientes(); }, [fetchPendientes]);

  const handleAction = async (id, accion) => {
    try {
      const body = accion === 'rechazar' && motivoRechazos[id]
        ? JSON.stringify({ motivo: motivoRechazos[id] })
        : undefined;

      const res  = await fetch(`${API}/mercado/publicaciones/${id}/${accion}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(
        accion === 'aprobar'
          ? '✅ Publicación aprobada. Ya es visible en el catálogo.'
          : '❌ Publicación rechazada.'
      );
      fetchPendientes();
    } catch (err) {
      showToast(err.message || 'Error al procesar', 'error');
    }
  };

  // Evalúa si el precio del vendedor está dentro del rango de referencia
  const evaluarPrecio = (precioSolicitado, precioRef) => {
    if (!precioRef) return { estado: 'sin-referencia', label: 'Sin referencia', color: '#aaa' };
    const p   = parseFloat(precioSolicitado);
    const min = precioRef.precioMin;
    const max = precioRef.precioMax;
    if (p < min) return { estado: 'bajo',   label: 'Por debajo del rango', color: '#C62828', icon: <TrendingDown size={14}/> };
    if (p > max) return { estado: 'alto',   label: 'Por encima del rango', color: '#E65100', icon: <TrendingUp size={14}/> };
    return         { estado: 'ok',     label: 'Dentro del rango oficial', color: '#2E7D32', icon: <CheckCircle size={14}/> };
  };

  return (
    <div className={styles.page}>
      {toast && <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Aprobación de Publicaciones</h1>
          <p className={styles.subtitle}>
            Revisa las publicaciones. Al aprobar, el lote aparece en el catálogo de compradores.
            Los precios deben estar dentro del rango oficial de Kori Alp.
          </p>
        </div>
        <div className={styles.badge}>
          <Clock size={16} /> {pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner}></div>
          <p>Cargando publicaciones...</p>
        </div>
      ) : pendientes.length === 0 ? (
        <div className={styles.empty}>
          <CheckCircle size={48} color="#4CAF50" />
          <h3>¡Todo al día!</h3>
          <p>No hay publicaciones pendientes de revisión.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {pendientes.map(pub => {
            const evaluacion = evaluarPrecio(pub.precioSolicitado, pub.precioReferencia);
            const pRef       = pub.precioReferencia;

            return (
              <div key={pub.id} className={styles.card}>
                <div className={styles.cardMain}>
                  <div className={styles.cardInfo}>

                    {/* Vendedor */}
                    <div className={styles.vendedorTag}>
                      👤 <strong>{pub.productor?.usuario?.nombre || 'Vendedor'}</strong>
                      <span> · {pub.productor?.usuario?.email}</span>
                    </div>

                    {/* Título y descripción */}
                    <h3 className={styles.cardTitle}>{pub.titulo}</h3>
                    <p className={styles.cardDesc}>{pub.descripcion}</p>

                    {/* Detalles del lote */}
                    <div className={styles.detalles}>
                      <span><strong>Categoría:</strong> {pub.categoria}</span>
                      <span><strong>Cantidad:</strong> {pub.cantidad} {pub.unidad}</span>
                      {pub.ubicacion && <span><strong>Origen:</strong> {pub.ubicacion}</span>}
                      <span>
                        <strong>Enviado:</strong>{' '}
                        {new Date(pub.creadoEn).toLocaleDateString('es-PE', {
                          day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* ── COMPARATIVA DE PRECIOS ──────────────────────────── */}
                    <div className={styles.precioComparativa}>
                      {/* Precio del vendedor */}
                      <div className={styles.precioCard}>
                        <span className={styles.precioLabel}>Precio del Vendedor</span>
                        <span className={styles.precioValorGrande}>
                          S/ {parseFloat(pub.precioSolicitado).toFixed(2)}
                        </span>
                        <span className={styles.precioUnidad}>por {pub.unidad || 'unidad'}</span>
                      </div>

                      {/* Separador */}
                      <div className={styles.precioVs}>vs</div>

                      {/* Rango oficial Kori Alp */}
                      {pRef ? (
                        <div className={styles.precioCard}>
                          <span className={styles.precioLabel}>Precio Oficial Kori Alp</span>
                          <div className={styles.precioRango}>
                            <span>S/ {pRef.precioMin.toFixed(2)}</span>
                            <span className={styles.precioRangoCentro}>S/ {pRef.precioPromedio.toFixed(2)}</span>
                            <span>S/ {pRef.precioMax.toFixed(2)}</span>
                          </div>
                          <span className={styles.precioUnidad}>
                            mín · promedio · máx · por {pRef.unidad}
                          </span>
                          {pRef.fuente && (
                            <span className={styles.precioFuente}>{pRef.fuente}</span>
                          )}
                        </div>
                      ) : (
                        <div className={styles.precioCard}>
                          <span className={styles.precioLabel}>Sin referencia de precio</span>
                        </div>
                      )}
                    </div>

                    {/* Badge de evaluación */}
                    <div
                      className={styles.evaluacionBadge}
                      style={{ color: evaluacion.color, borderColor: evaluacion.color + '33', background: evaluacion.color + '11' }}
                    >
                      {evaluacion.icon || <Minus size={14}/>}
                      {evaluacion.label}
                    </div>

                    {/* Campo de motivo de rechazo */}
                    <div className={styles.motivoBox}>
                      <label className={styles.motivoLabel}>Motivo de rechazo (opcional)</label>
                      <input
                        type="text"
                        className={styles.motivoInput}
                        placeholder="Ej: Precio fuera de rango, información incompleta..."
                        value={motivoRechazos[pub.id] || ''}
                        onChange={e => setMotivoRechazos(prev => ({ ...prev, [pub.id]: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className={styles.actionsPanel}>
                    <button
                      className={styles.approveBtn}
                      onClick={() => handleAction(pub.id, 'aprobar')}
                    >
                      <CheckCircle size={18} /> Aprobar
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleAction(pub.id, 'rechazar')}
                    >
                      <XCircle size={18} /> Rechazar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
