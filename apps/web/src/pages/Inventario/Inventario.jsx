import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Edit2, Trash2, X, ChevronDown,
  Activity, Weight, Ruler, FileText, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import styles from './Inventario.module.css';

const API = 'http://localhost:3000/api';

// ── Configuración de calidad de fibra ────────────────────────────────────────
const CALIDAD_CONFIG = {
  BABY_ALPACA:    { label: 'Baby Alpaca',    color: '#4CAF50', bg: '#E8F5E9', micronMax: 22.5 },
  FLEECE:         { label: 'Fleece',         color: '#2196F3', bg: '#E3F2FD', micronMax: 26.5 },
  MEDIUM_FLEECE:  { label: 'Medium Fleece',  color: '#FF9800', bg: '#FFF3E0', micronMax: 29 },
  HUARIZO:        { label: 'Huarizo',        color: '#9C27B0', bg: '#F3E5F5', micronMax: 32 },
  GRUESA:         { label: 'Gruesa',         color: '#795548', bg: '#EFEBE9', micronMax: 99 },
};

const ESTADO_CONFIG = {
  ACTIVO:    { label: 'Activo',    color: '#2E7D32', bg: '#E8F5E9' },
  SACA:      { label: 'Saca',      color: '#E65100', bg: '#FFF3E0' },
  FAENADO:   { label: 'Faenado',   color: '#B71C1C', bg: '#FFEBEE' },
  FALLECIDO: { label: 'Fallecido', color: '#616161', bg: '#F5F5F5' },
  BAJA:      { label: 'De Baja',   color: '#9E9E9E', bg: '#FAFAFA' },
};

const FORM_VACIO = {
  arete: '', raza: 'HUACAYA', sexo: 'HEMBRA',
  edadMeses: '', pesoVivoKg: '', calidadFibra: 'BABY_ALPACA',
  micrones: '', notas: '', estado: 'ACTIVO',
};

const IMAGENES_ALPACA = [
  '/images/alpaca-1.jpeg', '/images/alpaca-2.jpeg',
  '/images/alpaca-3.jpeg', '/images/alpaca-4.jpeg',
];

export default function Inventario() {
  const { token } = useAuthStore();
  const [alpacas, setAlpacas]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [busqueda, setBusqueda]     = useState('');
  const [filtroRaza, setFiltroRaza] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('ACTIVO');
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(FORM_VACIO);
  const [enviando, setEnviando]     = useState(false);
  const [toast, setToast]           = useState(null);

  // ── Toasts ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Cargar alpacas de la BD ───────────────────────────────────────────────
  const fetchAlpacas = useCallback(async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/alpacas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAlpacas(data.data || []);
    } catch {
      showToast('Error al cargar el hato', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAlpacas(); }, [fetchAlpacas]);

  // ── Filtrado en frontend ──────────────────────────────────────────────────
  const alpacasFiltradas = alpacas.filter(a => {
    const matchBusqueda = !busqueda ||
      a.arete?.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.notas?.toLowerCase().includes(busqueda.toLowerCase());
    const matchRaza   = filtroRaza   === 'TODOS' || a.raza   === filtroRaza;
    const matchEstado = filtroEstado === 'TODOS' || a.estado === filtroEstado;
    return matchBusqueda && matchRaza && matchEstado;
  });

  // ── Estadísticas del hato ─────────────────────────────────────────────────
  const stats = {
    total:     alpacas.filter(a => a.estado === 'ACTIVO').length,
    huacaya:   alpacas.filter(a => a.raza === 'HUACAYA' && a.estado === 'ACTIVO').length,
    suri:      alpacas.filter(a => a.raza === 'SURI'    && a.estado === 'ACTIVO').length,
    babyAlpaca: alpacas.filter(a => a.calidadFibra === 'BABY_ALPACA' && a.estado === 'ACTIVO').length,
    microProm: alpacas.filter(a => a.micrones && a.estado === 'ACTIVO').length > 0
      ? (alpacas.filter(a => a.micrones && a.estado === 'ACTIVO')
          .reduce((s, a) => s + parseFloat(a.micrones), 0) /
         alpacas.filter(a => a.micrones && a.estado === 'ACTIVO').length).toFixed(1)
      : '—',
  };

  // ── Submit CRUD ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const url    = editItem ? `${API}/alpacas/${editItem.id}` : `${API}/alpacas`;
    const method = editItem ? 'PUT' : 'POST';

    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      showToast(editItem ? '✏️ Alpaca actualizada.' : '🦙 Alpaca registrada en tu hato.');
      setShowModal(false);
      setEditItem(null);
      setForm(FORM_VACIO);
      fetchAlpacas();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  };

  // ── Dar de baja ───────────────────────────────────────────────────────────
  const handleBaja = async (id, arete) => {
    if (!confirm(`¿Dar de baja a la alpaca ${arete || id}?`)) return;
    try {
      await fetch(`${API}/alpacas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Alpaca dada de baja correctamente.');
      fetchAlpacas();
    } catch {
      showToast('Error al dar de baja', 'error');
    }
  };

  const openEdit = (a) => {
    setEditItem(a);
    setForm({
      arete:        a.arete || '',
      raza:         a.raza || 'HUACAYA',
      sexo:         a.sexo || 'HEMBRA',
      edadMeses:    a.edadMeses || '',
      pesoVivoKg:   a.pesoVivoKg || '',
      calidadFibra: a.calidadFibra || 'BABY_ALPACA',
      micrones:     a.micrones || '',
      notas:        a.notas || '',
      estado:       a.estado || 'ACTIVO',
    });
    setShowModal(true);
  };

  const openNew = () => {
    setEditItem(null);
    setForm(FORM_VACIO);
    setShowModal(true);
  };

  // ── Inferir calidad por micrones ──────────────────────────────────────────
  const inferirCalidad = (micrones) => {
    const m = parseFloat(micrones);
    if (!m) return null;
    if (m <= 22.5) return 'BABY_ALPACA';
    if (m <= 26.5) return 'FLEECE';
    if (m <= 29)   return 'MEDIUM_FLEECE';
    if (m <= 32)   return 'HUARIZO';
    return 'GRUESA';
  };

  const handleMicronesChange = (val) => {
    const calidad = inferirCalidad(val);
    setForm(prev => ({
      ...prev,
      micrones: val,
      ...(calidad ? { calidadFibra: calidad } : {}),
    }));
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mi Hato Alpaquero</h1>
          <p className={styles.subtitle}>
            Registro genético y control de calidad de fibra. {alpacas.filter(a=>a.estado==='ACTIVO').length} animales activos.
          </p>
        </div>
        <button className={styles.primaryBtn} onClick={openNew}>
          <Plus size={18} /> Registrar Alpaca
        </button>
      </div>

      {/* Stats del hato */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{stats.total}</span>
          <span className={styles.statLabel}>Hato Activo</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{stats.huacaya}</span>
          <span className={styles.statLabel}>Huacaya</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{stats.suri}</span>
          <span className={styles.statLabel}>Suri</span>
        </div>
        <div className={styles.statBox} style={{ background: '#E8F5E9', borderColor: '#A5D6A7' }}>
          <span className={styles.statNum} style={{ color: '#2E7D32' }}>{stats.babyAlpaca}</span>
          <span className={styles.statLabel}>Baby Alpaca 🏆</span>
        </div>
        <div className={styles.statBox} style={{ background: '#FFF8E1', borderColor: '#FFD54F' }}>
          <span className={styles.statNum} style={{ color: '#E65100' }}>{stats.microProm}µ</span>
          <span className={styles.statLabel}>Micrones Prom.</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}><Search size={18} /></span>
          <input
            type="text"
            placeholder="Buscar por arete o notas..."
            className={styles.searchInput}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={filtroRaza}
          onChange={e => setFiltroRaza(e.target.value)}
        >
          <option value="TODOS">Todas las razas</option>
          <option value="HUACAYA">Huacaya</option>
          <option value="SURI">Suri</option>
        </select>
        <select
          className={styles.filterSelect}
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
        >
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="SACA">Saca</option>
          <option value="FAENADO">Faenado</option>
          <option value="BAJA">De Baja</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner}></div>
          <p>Cargando tu hato...</p>
        </div>
      ) : alpacasFiltradas.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: '3rem' }}>🦙</span>
          <h3>
            {alpacas.length === 0
              ? 'Aún no tienes alpacas registradas'
              : 'Ninguna alpaca coincide con el filtro'}
          </h3>
          <p>
            {alpacas.length === 0
              ? 'Empieza registrando tu primer animal para gestionar tu hato.'
              : 'Prueba cambiando los filtros de búsqueda.'}
          </p>
          {alpacas.length === 0 && (
            <button className={styles.primaryBtn} onClick={openNew}>
              <Plus size={16} /> Registrar primera alpaca
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {alpacasFiltradas.map((alpaca, idx) => {
            const calidad  = CALIDAD_CONFIG[alpaca.calidadFibra] || CALIDAD_CONFIG.FLEECE;
            const estadoCfg = ESTADO_CONFIG[alpaca.estado] || ESTADO_CONFIG.ACTIVO;
            return (
              <div key={alpaca.id} className={styles.card}>
                {/* Imagen */}
                <div className={styles.cardImageWrapper}>
                  <img
                    src={IMAGENES_ALPACA[idx % IMAGENES_ALPACA.length]}
                    alt={alpaca.arete || 'Alpaca'}
                    className={styles.cardImage}
                  />
                  {/* Badge estado */}
                  <div
                    className={styles.statusBadge}
                    style={{ color: estadoCfg.color, background: estadoCfg.bg }}
                  >
                    {estadoCfg.label}
                  </div>
                  {/* Badge raza */}
                  <div className={styles.razaBadge}>
                    {alpaca.raza === 'HUACAYA' ? '🟤 Huacaya' : '🟡 Suri'}
                  </div>
                </div>

                {/* Contenido */}
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3>{alpaca.arete || 'Sin arete'}</h3>
                    <span className={styles.tagId}>{alpaca.sexo === 'HEMBRA' ? '♀' : '♂'}</span>
                  </div>

                  <div className={styles.cardStats}>
                    <div className={styles.stat}>
                      <span>Edad</span>
                      <strong>{alpaca.edadMeses ? `${alpaca.edadMeses} m.` : '—'}</strong>
                    </div>
                    <div className={styles.stat}>
                      <span>Peso</span>
                      <strong>{alpaca.pesoVivoKg ? `${alpaca.pesoVivoKg} kg` : '—'}</strong>
                    </div>
                    <div className={styles.stat}>
                      <span>Micrones</span>
                      <strong className={styles.highlight}>
                        {alpaca.micrones ? `${alpaca.micrones}µ` : '—'}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <span
                      className={styles.gradeBadge}
                      style={{ color: calidad.color, background: calidad.bg }}
                    >
                      {calidad.label}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => openEdit(alpaca)}
                        title="Editar"
                      >
                        <Edit2 size={15} />
                      </button>
                      {alpaca.estado === 'ACTIVO' && (
                        <button
                          className={`${styles.iconBtn} ${styles.dangerBtn}`}
                          onClick={() => handleBaja(alpaca.id, alpaca.arete)}
                          title="Dar de baja"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {alpaca.notas && (
                    <p className={styles.notaTexto}>
                      <FileText size={12} /> {alpaca.notas}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL CRUD ─────────────────────────────────────────────────────── */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editItem ? '✏️ Editar Alpaca' : '🦙 Registrar Nueva Alpaca'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>

              {/* Fila: Arete + Raza */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Arete / Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej: ALP-025 o Inti"
                    value={form.arete}
                    onChange={e => setForm(p => ({ ...p, arete: e.target.value }))}
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Raza *</label>
                  <select
                    value={form.raza}
                    onChange={e => setForm(p => ({ ...p, raza: e.target.value }))}
                    className={styles.formInput}
                  >
                    <option value="HUACAYA">🟤 Huacaya</option>
                    <option value="SURI">🟡 Suri</option>
                  </select>
                </div>
              </div>

              {/* Fila: Sexo + Estado */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Sexo *</label>
                  <div className={styles.toggleRow}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${form.sexo === 'HEMBRA' ? styles.toggleActive : ''}`}
                      onClick={() => setForm(p => ({ ...p, sexo: 'HEMBRA' }))}
                    >
                      ♀ Hembra
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${form.sexo === 'MACHO' ? styles.toggleActive : ''}`}
                      onClick={() => setForm(p => ({ ...p, sexo: 'MACHO' }))}
                    >
                      ♂ Macho
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select
                    value={form.estado}
                    onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}
                    className={styles.formInput}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="SACA">Saca</option>
                    <option value="FAENADO">Faenado</option>
                    <option value="FALLECIDO">Fallecido</option>
                  </select>
                </div>
              </div>

              {/* Fila: Edad + Peso */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><Activity size={13}/> Edad (meses)</label>
                  <input
                    type="number" min="0" max="300"
                    placeholder="Ej: 24"
                    value={form.edadMeses}
                    onChange={e => setForm(p => ({ ...p, edadMeses: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label><Weight size={13}/> Peso vivo (kg)</label>
                  <input
                    type="number" min="0" step="0.1"
                    placeholder="Ej: 65.5"
                    value={form.pesoVivoKg}
                    onChange={e => setForm(p => ({ ...p, pesoVivoKg: e.target.value }))}
                    className={styles.formInput}
                  />
                </div>
              </div>

              {/* Fila: Micrones (autodetecta calidad) + Calidad */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><Ruler size={13}/> Micrones (µ)</label>
                  <input
                    type="number" min="10" max="50" step="0.1"
                    placeholder="Ej: 19.5"
                    value={form.micrones}
                    onChange={e => handleMicronesChange(e.target.value)}
                    className={styles.formInput}
                  />
                  {form.micrones && (
                    <span className={styles.microHint}>
                      → Se detecta: <strong>{CALIDAD_CONFIG[inferirCalidad(form.micrones)]?.label}</strong>
                    </span>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Calidad de fibra</label>
                  <select
                    value={form.calidadFibra}
                    onChange={e => setForm(p => ({ ...p, calidadFibra: e.target.value }))}
                    className={styles.formInput}
                  >
                    {Object.entries(CALIDAD_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div className={styles.formGroup}>
                <label>Notas / Observaciones</label>
                <textarea
                  placeholder="Historial de salud, características especiales, etc."
                  value={form.notas}
                  onChange={e => setForm(p => ({ ...p, notas: e.target.value }))}
                  rows={2}
                  className={styles.formInput}
                />
              </div>

              {/* Acciones */}
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={enviando}>
                  {enviando ? '⏳ Guardando...' : editItem ? '💾 Actualizar' : '🦙 Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
