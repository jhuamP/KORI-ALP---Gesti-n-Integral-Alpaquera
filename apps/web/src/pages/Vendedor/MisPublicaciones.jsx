import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Package, Clock, CheckCircle, XCircle, Edit2, Trash2,
  Tag, AlertCircle, Info, User, ShoppingBag, Phone
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import styles from './MisPublicaciones.module.css';

const API = 'http://localhost:3000/api';

const ESTADO_CONFIG = {
  ACTIVA:    { label: 'Activa (Visible)',  icon: <CheckCircle size={14} />, cls: 'activa' },
  PAUSADA:   { label: 'En Revisión',       icon: <Clock size={14} />,        cls: 'pausada' },
  CANCELADA: { label: 'Rechazada',         icon: <XCircle size={14} />,      cls: 'cancelada' },
  VENDIDA:   { label: 'Vendida',           icon: <CheckCircle size={14} />,  cls: 'vendida' },
};

// Sub-categorías por categoría
const SUB_CAT = {
  FIBRA:  ['Baby Alpaca', 'Fleece', 'Medium Fleece', 'Huarizo', 'Gruesa'],
  CARNE:  ['Fresco', 'Charqui', 'Embutido'],
  CUERO:  ['Piel entera', 'Curtido'],
  ABONO:  ['Estiercol fresco', 'Compostado'],
};

const CALIDAD_POR_CAT = {
  FIBRA: ['PREMIUM', 'A', 'B', 'C', 'DESCARTE'],
  CARNE: ['A', 'B', 'C'],
  CUERO: ['A', 'B'],
  ABONO: [],
};

const FORM_INICIAL = {
  titulo: '', descripcion: '', categoria: 'FIBRA', subCategoria: 'Baby Alpaca',
  calidadGrado: 'A', cantidad: '', unidad: 'kg', ubicacion: '',
  precioSolicitado: '', aceptaPrecioOficial: false,
};

export default function MisPublicaciones() {
  const { token } = useAuthStore();
  const [publicaciones, setPublicaciones]   = useState([]);
  const [solicitudes, setSolicitudes]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showModal, setShowModal]           = useState(false);
  const [editItem, setEditItem]             = useState(null);
  const [toast, setToast]                   = useState(null);
  const [form, setForm]                     = useState(FORM_INICIAL);
  const [precioRef, setPrecioRef]           = useState(null);
  const [loadingPrecio, setLoadingPrecio]   = useState(false);
  const [enviando, setEnviando]             = useState(false);

  // ── Toasts ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Cargar publicaciones del vendedor ─────────────────────────────────────
  const fetchPublicaciones = useCallback(async () => {
    try {
      setLoading(true);
      const [resPubs, resSols] = await Promise.all([
        fetch(`${API}/mercado/mis-publicaciones`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/mercado/solicitudes-recibidas`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const dataPubs = await resPubs.json();
      const dataSols = await resSols.json();
      setPublicaciones(dataPubs.data || []);
      setSolicitudes(dataSols.data || []);
    } catch {
      showToast('Error al cargar publicaciones', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPublicaciones(); }, [fetchPublicaciones]);

  // ── Consultar precio oficial cuando cambia categoría/subCat/calidad ───────
  const fetchPrecioReferencia = useCallback(async (categoria, subCategoria, calidadGrado) => {
    if (!categoria || !subCategoria) return;
    setLoadingPrecio(true);
    setPrecioRef(null);
    try {
      const params = new URLSearchParams({ categoria, subCategoria });
      if (calidadGrado) params.set('calidadGrado', calidadGrado);
      const res  = await fetch(`${API}/mercado/precio-referencia?${params}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setPrecioRef(data.data);
        // Precargar precio con el promedio oficial
        setForm(prev => ({
          ...prev,
          precioSolicitado: String(data.data.precioPromedio),
          aceptaPrecioOficial: false, // resetear aceptación al cambiar precio
        }));
      } else {
        setPrecioRef(null);
      }
    } catch {
      setPrecioRef(null);
    } finally {
      setLoadingPrecio(false);
    }
  }, []);

  // Cuando cambia categoría, subcategoría o calidad → consultar precio
  useEffect(() => {
    if (showModal && !editItem) {
      fetchPrecioReferencia(form.categoria, form.subCategoria, form.calidadGrado);
    }
  }, [form.categoria, form.subCategoria, form.calidadGrado, showModal, editItem, fetchPrecioReferencia]);

  // ── Manejar cambios en el formulario ─────────────────────────────────────
  const handleChange = (field, value) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      // Al cambiar categoría, resetear subcategoría y calidad a sus primeros valores
      if (field === 'categoria') {
        next.subCategoria      = SUB_CAT[value]?.[0] || '';
        next.calidadGrado      = CALIDAD_POR_CAT[value]?.[0] || '';
        next.aceptaPrecioOficial = false;
      }
      if (field === 'subCategoria' || field === 'calidadGrado') {
        next.aceptaPrecioOficial = false;
      }
      return next;
    });
  };

  // ── Submit del formulario ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Para publicaciones nuevas, exigir aceptación del precio oficial
    if (!editItem && !form.aceptaPrecioOficial) {
      showToast('Debes aceptar el precio oficial de Kori Alp para continuar.', 'error');
      return;
    }

    setEnviando(true);
    const url    = editItem
      ? `${API}/mercado/publicaciones/${editItem.id}`
      : `${API}/mercado/publicaciones`;
    const method = editItem ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(
        editItem
          ? '✏️ Publicación actualizada y enviada a revisión.'
          : '📤 Publicación creada. El administrador la aprobará pronto.'
      );
      setShowModal(false);
      setEditItem(null);
      setForm(FORM_INICIAL);
      setPrecioRef(null);
      fetchPublicaciones();
    } catch (err) {
      showToast(err.message || 'Error al guardar', 'error');
    } finally {
      setEnviando(false);
    }
  };

  // ── Eliminar publicación ──────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('¿Deseas cancelar esta publicación?')) return;
    try {
      await fetch(`${API}/mercado/publicaciones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Publicación cancelada.');
      fetchPublicaciones();
    } catch {
      showToast('Error al cancelar', 'error');
    }
  };

  // ── Editar publicación ────────────────────────────────────────────────────
  const handleEdit = (pub) => {
    setEditItem(pub);
    setForm({
      titulo:       pub.titulo || '',
      descripcion:  pub.descripcion || '',
      categoria:    pub.categoria || 'FIBRA',
      subCategoria: pub.subCategoria || SUB_CAT[pub.categoria]?.[0] || '',
      calidadGrado: pub.calidadGrado || '',
      cantidad:     pub.cantidad || '',
      unidad:       pub.unidad || 'kg',
      ubicacion:    pub.ubicacion || '',
      precioSolicitado: pub.precioSolicitado || '',
      aceptaPrecioOficial: true, // ya fue aceptado antes
    });
    setPrecioRef(null);
    setShowModal(true);
  };

  const openNew = () => {
    setEditItem(null);
    setForm(FORM_INICIAL);
    setPrecioRef(null);
    setShowModal(true);
  };

  // ── Calcular si precio está en rango ─────────────────────────────────────
  const precioEsValido = () => {
    if (!precioRef || !form.precioSolicitado) return true;
    const p = parseFloat(form.precioSolicitado);
    return p >= precioRef.precioMin && p <= precioRef.precioMax;
  };

  const calidades = CALIDAD_POR_CAT[form.categoria] || [];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Publicaciones</h1>
          <p className={styles.subtitle}>
            Gestiona los lotes que ofreces al mercado. Los precios son fijados por Kori Alp según calidad y tipo.
          </p>
        </div>
        <button className={styles.primaryBtn} onClick={openNew}>
          <Plus size={18} /> Nueva Publicación
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className={styles.statsRow}>
        {Object.entries(ESTADO_CONFIG).map(([estado, cfg]) => {
          const count = publicaciones.filter(p => p.estado === estado).length;
          return (
            <div key={estado} className={`${styles.statChip} ${styles[cfg.cls]}`}>
              {cfg.icon} <span>{count}</span> {cfg.label}
            </div>
          );
        })}
      </div>

      {/* Lista de publicaciones */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner}></div>
          <p>Cargando tus publicaciones...</p>
        </div>
      ) : publicaciones.length === 0 ? (
        <div className={styles.empty}>
          <Package size={48} />
          <h3>Sin publicaciones aún</h3>
          <p>Crea tu primera oferta y conéctate con compradores.</p>
          <button className={styles.primaryBtn} onClick={openNew}>
            <Plus size={16} /> Crear Publicación
          </button>
        </div>
      ) : (
        <div className={styles.cards}>
          {publicaciones.map(pub => {
            const cfg = ESTADO_CONFIG[pub.estado] || ESTADO_CONFIG.PAUSADA;
            return (
              <div key={pub.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.cardTitle}>{pub.titulo}</h3>
                    <p className={styles.cardDesc}>{pub.descripcion}</p>
                  </div>
                  <span className={`${styles.estadoBadge} ${styles[cfg.cls]}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.infoItem}>
                    <span>Categoría</span>
                    <strong>{pub.categoria}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Cantidad</span>
                    <strong>{pub.cantidad} {pub.unidad}</strong>
                  </div>
                  <div className={styles.infoItem}>
                    <span>Precio Oficial</span>
                    <strong className={styles.price}>
                      S/ {parseFloat(pub.precioSolicitado).toFixed(2)}
                    </strong>
                  </div>
                  {pub.ubicacion && (
                    <div className={styles.infoItem}>
                      <span>Ubicación</span>
                      <strong>{pub.ubicacion}</strong>
                    </div>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    Enviado el {new Date(pub.creadoEn).toLocaleDateString('es-PE')}
                  </span>
                  <div className={styles.actions}>
                    {pub.estado !== 'ACTIVA' && pub.estado !== 'VENDIDA' && (
                      <>
                        <button className={styles.iconBtn} onClick={() => handleEdit(pub)} title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.danger}`}
                          onClick={() => handleDelete(pub.id)}
                          title="Cancelar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    {pub.estado === 'ACTIVA' && (
                      <span className={styles.visibleTag}>✅ Visible en catálogo</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SECCIÓN: SOLICITUDES DE COMPRA RECIBIDAS ── */}
      <div style={{ marginTop: '3rem', borderTop: '2px solid #E8E0D8', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <ShoppingBag size={24} color="#4A3320" />
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#4A3320', margin: 0 }}>
            Solicitudes de Compra Recibidas
          </h2>
        </div>
        
        {loading ? (
          <p style={{ color: '#aaa' }}>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <div style={{ padding: '2rem', background: '#fff', borderRadius: '12px', border: '1px dashed #ccc', textAlign: 'center', color: '#888' }}>
            No tienes solicitudes de compra por el momento.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {solicitudes.map(sol => (
              <div key={sol.id} style={{
                background: '#fff', padding: '1.5rem', borderRadius: '12px',
                border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#4A3320', fontSize: '1.1rem' }}>Lote: {sol.publicacion?.titulo}</h4>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#555', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14}/> {sol.nombreComprador}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> {sol.telefono}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><strong>Pago:</strong> {sol.metodoPago}</span>
                    {sol.cantidadSolicitada && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <strong>Cantidad:</strong> {sol.cantidadSolicitada} {sol.publicacion?.unidad}
                      </span>
                    )}
                  </div>
                  {sol.notas && <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>"{sol.notas}"</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    background: sol.estado === 'PENDIENTE' ? '#FFF3E0' : '#E8F5E9',
                    color: sol.estado === 'PENDIENTE' ? '#E65100' : '#2E7D32',
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600
                  }}>
                    {sol.estado}
                  </span>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#aaa' }}>
                    Recibida: {new Date(sol.creadoEn).toLocaleDateString('es-PE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal: Crear / Editar ─────────────────────────────────────────── */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editItem ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>

              {/* Título */}
              <div className={styles.formGroup}>
                <label>Título del Lote *</label>
                <input
                  type="text"
                  placeholder="Ej: Fibra Baby Alpaca Huacaya - Lote 2025"
                  value={form.titulo}
                  onChange={e => handleChange('titulo', e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              {/* Descripción */}
              <div className={styles.formGroup}>
                <label>Descripción *</label>
                <textarea
                  placeholder="Describe la calidad, origen, condiciones de entrega..."
                  value={form.descripcion}
                  onChange={e => handleChange('descripcion', e.target.value)}
                  required
                  rows={3}
                  className={styles.input}
                />
              </div>

              {/* Categoría + Subcategoría */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Categoría *</label>
                  <select
                    value={form.categoria}
                    onChange={e => handleChange('categoria', e.target.value)}
                    className={styles.input}
                  >
                    <option value="FIBRA">Fibra de Alpaca</option>
                    <option value="CARNE">Carne</option>
                    <option value="CUERO">Cuero</option>
                    <option value="ABONO">Abono</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Tipo / Subcategoría *</label>
                  <select
                    value={form.subCategoria}
                    onChange={e => handleChange('subCategoria', e.target.value)}
                    className={styles.input}
                  >
                    {(SUB_CAT[form.categoria] || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calidad + Cantidad */}
              <div className={styles.formRow}>
                {calidades.length > 0 && (
                  <div className={styles.formGroup}>
                    <label>Grado de Calidad</label>
                    <select
                      value={form.calidadGrado}
                      onChange={e => handleChange('calidadGrado', e.target.value)}
                      className={styles.input}
                    >
                      {calidades.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label>Cantidad *</label>
                  <div className={styles.inputUnit}>
                    <input
                      type="number" min="0" step="0.01"
                      placeholder="Ej: 50"
                      value={form.cantidad}
                      onChange={e => handleChange('cantidad', e.target.value)}
                      required
                      className={styles.input}
                    />
                    <select
                      value={form.unidad}
                      onChange={e => handleChange('unidad', e.target.value)}
                      className={styles.unitSelect}
                    >
                      <option>kg</option>
                      <option>g</option>
                      <option>unidad</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── BLOQUE DE PRECIO OFICIAL ─────────────────────────────── */}
              {!editItem && (
                <div className={styles.precioOficialBox}>
                  <div className={styles.precioOficialHeader}>
                    <Tag size={16} />
                    <strong>Precio Oficial Kori Alp</strong>
                    {loadingPrecio && <span className={styles.spinnerSmall}></span>}
                  </div>

                  {precioRef ? (
                    <>
                      <div className={styles.precioRangoRow}>
                        <div className={styles.precioRangoItem}>
                          <span>Mínimo</span>
                          <strong>S/ {precioRef.precioMin.toFixed(2)}</strong>
                        </div>
                        <div className={`${styles.precioRangoItem} ${styles.precioDestacado}`}>
                          <span>Precio oficial</span>
                          <strong>S/ {precioRef.precioPromedio.toFixed(2)}</strong>
                        </div>
                        <div className={styles.precioRangoItem}>
                          <span>Máximo</span>
                          <strong>S/ {precioRef.precioMax.toFixed(2)}</strong>
                        </div>
                      </div>
                      <p className={styles.precioFuente}>
                        <Info size={12} /> Fuente: {precioRef.fuente || 'Kori Alp'} · Por {precioRef.unidad}
                      </p>

                      {/* Campo precio (precompletado, dentro del rango) */}
                      <div className={styles.formGroup} style={{ marginTop: '0.8rem' }}>
                        <label>Tu precio de publicación (S/) *</label>
                        <input
                          type="number"
                          min={precioRef.precioMin}
                          max={precioRef.precioMax}
                          step="0.01"
                          value={form.precioSolicitado}
                          onChange={e => {
                            handleChange('precioSolicitado', e.target.value);
                            handleChange('aceptaPrecioOficial', false);
                          }}
                          required
                          className={`${styles.input} ${!precioEsValido() ? styles.inputError : ''}`}
                        />
                        {!precioEsValido() && (
                          <p className={styles.errorMsg}>
                            <AlertCircle size={13} /> El precio debe estar entre S/ {precioRef.precioMin.toFixed(2)} y S/ {precioRef.precioMax.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* Checkbox de aceptación obligatorio */}
                      <label className={styles.checkRow}>
                        <input
                          type="checkbox"
                          checked={form.aceptaPrecioOficial}
                          onChange={e => handleChange('aceptaPrecioOficial', e.target.checked)}
                          disabled={!precioEsValido()}
                        />
                        <span>
                          ✅ Acepto publicar mi producto al precio oficial de Kori Alp
                          <strong> (S/ {parseFloat(form.precioSolicitado || 0).toFixed(2)} por {precioRef.unidad})</strong>.
                          Entiendo que este precio es justo según el mercado.
                        </span>
                      </label>
                    </>
                  ) : !loadingPrecio ? (
                    <p className={styles.precioNoDisponible}>
                      Selecciona categoría y tipo para ver el precio oficial.
                    </p>
                  ) : null}
                </div>
              )}

              {/* Ubicación */}
              <div className={styles.formGroup}>
                <label>Ubicación del lote</label>
                <input
                  type="text"
                  placeholder="Ej: Comunidad de Carabaya, Puno"
                  value={form.ubicacion}
                  onChange={e => handleChange('ubicacion', e.target.value)}
                  className={styles.input}
                />
              </div>

              {/* Acciones del modal */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={enviando || (!editItem && (!form.aceptaPrecioOficial || !precioEsValido()))}
                >
                  {enviando
                    ? '⏳ Enviando...'
                    : editItem
                      ? '💾 Guardar cambios'
                      : '📤 Publicar y enviar a revisión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
