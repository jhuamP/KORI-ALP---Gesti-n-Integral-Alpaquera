import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Phone, User, CreditCard, MessageSquare } from 'lucide-react';

const API = '/api';

const METODOS_PAGO = [
  { value: 'YAPE',          label: '🟣 Yape' },
  { value: 'PLIN',          label: '🟢 Plin' },
  { value: 'TRANSFERENCIA', label: '🏦 Transferencia Bancaria' },
  { value: 'EFECTIVO',      label: '💵 Efectivo' },
];

export default function ModalCompra({ producto, onClose }) {
  const [form, setForm] = useState({
    nombreComprador: '',
    telefono: '',
    email: '',
    metodoPago: 'YAPE',
    cantidadSolicitada: '',
    notas: '',
  });
  const [enviando, setEnviando]   = useState(false);
  const [exito, setExito]         = useState(false);
  const [error, setError]         = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const res  = await fetch(`${API}/mercado/publicaciones/${producto.id}/solicitar-compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar solicitud');
      setExito(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const precioTotal = form.cantidadSolicitada
    ? (parseFloat(form.cantidadSolicitada) * parseFloat(producto.precioSolicitado)).toFixed(2)
    : null;

  return (
    <div style={estilos.overlay} onClick={onClose}>
      <div style={estilos.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={estilos.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="#4A3320" />
            <h2 style={estilos.modalTitle}>Solicitar compra</h2>
          </div>
          <button style={estilos.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Resumen del producto */}
        <div style={estilos.productResumen}>
          <div style={estilos.productResumenInfo}>
            <div style={estilos.productCategoria}>{producto.categoria}</div>
            <div style={estilos.productTitulo}>{producto.titulo}</div>
            <div style={estilos.productVendedor}>
              👤 {producto.productor?.usuario?.nombre || 'Productor Kori Alp'}
            </div>
          </div>
          <div style={estilos.productPrecioBox}>
            <div style={estilos.productPrecioLabel}>Precio oficial</div>
            <div style={estilos.productPrecio}>
              S/ {parseFloat(producto.precioSolicitado).toFixed(2)}
            </div>
            <div style={estilos.productUnidad}>por {producto.unidad}</div>
          </div>
        </div>

        {exito ? (
          /* ── Pantalla de éxito ─────────────────────────────────────────── */
          <div style={estilos.exitoContainer}>
            <div style={estilos.exitoIcono}>
              <CheckCircle size={56} color="#2E7D32" />
            </div>
            <h3 style={estilos.exitoTitulo}>¡Solicitud enviada!</h3>
            <p style={estilos.exitoDesc}>
              El equipo de <strong>Kori Alp</strong> revisará tu solicitud y se pondrá en contacto
              contigo al <strong>{form.telefono}</strong> para coordinar el pago y la entrega.
            </p>
            <div style={estilos.exitoDetalle}>
              <span>📦 {producto.titulo}</span>
              <span>💳 {METODOS_PAGO.find(m => m.value === form.metodoPago)?.label}</span>
              {precioTotal && <span>💰 Total estimado: S/ {precioTotal}</span>}
            </div>
            <button style={estilos.btnPrimary} onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          /* ── Formulario de compra ─────────────────────────────────────── */
          <form onSubmit={handleSubmit} style={estilos.form}>

            {error && (
              <div style={estilos.errorBox}>{error}</div>
            )}

            {/* Nombre */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                <User size={14} /> Nombre completo *
              </label>
              <input
                type="text"
                placeholder="Ej: María García Quispe"
                value={form.nombreComprador}
                onChange={e => handleChange('nombreComprador', e.target.value)}
                required
                style={estilos.input}
              />
            </div>

            {/* Teléfono */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                <Phone size={14} /> Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="Ej: 987 654 321"
                value={form.telefono}
                onChange={e => handleChange('telefono', e.target.value)}
                required
                style={estilos.input}
              />
            </div>

            {/* Email (opcional) */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                📧 Correo electrónico (opcional)
              </label>
              <input
                type="email"
                placeholder="Ej: maria@empresa.com"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                style={estilos.input}
              />
            </div>

            {/* Cantidad deseada */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                📦 Cantidad que deseas comprar ({producto.unidad})
              </label>
              <input
                type="number"
                placeholder={`Disponible: ${producto.cantidad} ${producto.unidad}`}
                min="0.01"
                max={producto.cantidad}
                step="0.01"
                value={form.cantidadSolicitada}
                onChange={e => handleChange('cantidadSolicitada', e.target.value)}
                style={estilos.input}
              />
              {precioTotal && (
                <div style={estilos.totalEstimado}>
                  💰 Total estimado: <strong>S/ {precioTotal}</strong>
                </div>
              )}
            </div>

            {/* Método de pago */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                <CreditCard size={14} /> Método de pago preferido *
              </label>
              <div style={estilos.metodosGrid}>
                {METODOS_PAGO.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => handleChange('metodoPago', m.value)}
                    style={{
                      ...estilos.metodoBtnBase,
                      ...(form.metodoPago === m.value ? estilos.metodoBtnActivo : {}),
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                <MessageSquare size={14} /> Notas adicionales
              </label>
              <textarea
                placeholder="Ej: Necesito la entrega en Juliaca, disponible lunes a viernes..."
                value={form.notas}
                onChange={e => handleChange('notas', e.target.value)}
                rows={3}
                style={{ ...estilos.input, resize: 'vertical' }}
              />
            </div>

            {/* Acciones */}
            <div style={estilos.modalActions}>
              <button type="button" style={estilos.btnSecundario} onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                style={{ ...estilos.btnPrimary, ...(enviando ? { opacity: 0.6 } : {}) }}
                disabled={enviando}
              >
                {enviando ? '⏳ Enviando...' : '🛒 Confirmar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Estilos inline ────────────────────────────────────────────────────────────
const estilos = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 3000, padding: '1rem',
  },
  modal: {
    background: 'white', borderRadius: '20px',
    width: '100%', maxWidth: '520px',
    maxHeight: '92vh', overflowY: 'auto',
    boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
    animation: 'fadeUp 0.25s ease',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.5rem 1.5rem 0',
  },
  modalTitle: { fontSize: '1.3rem', color: '#4A3320', margin: 0, fontWeight: 800 },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#aaa', display: 'flex', alignItems: 'center',
    borderRadius: '8px', padding: '0.3rem',
    transition: 'background 0.2s',
  },
  productResumen: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    margin: '1.2rem 1.5rem 0',
    padding: '1rem 1.2rem',
    background: 'linear-gradient(135deg, #FFF8E1, #FFFDE7)',
    borderRadius: '12px',
    border: '1.5px solid #FFD54F',
    gap: '1rem',
  },
  productResumenInfo: { flex: 1 },
  productCategoria: {
    fontSize: '0.72rem', color: '#E65100', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px',
  },
  productTitulo: { fontSize: '1rem', fontWeight: 700, color: '#4A3320', marginBottom: '3px' },
  productVendedor: { fontSize: '0.82rem', color: '#888' },
  productPrecioBox: { textAlign: 'right', flexShrink: 0 },
  productPrecioLabel: { fontSize: '0.7rem', color: '#999', marginBottom: '2px' },
  productPrecio: { fontSize: '1.5rem', fontWeight: 800, color: '#4A3320' },
  productUnidad: { fontSize: '0.75rem', color: '#aaa' },
  form: { padding: '1.2rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: {
    fontSize: '0.83rem', fontWeight: 600, color: '#555',
    display: 'flex', alignItems: 'center', gap: '0.3rem',
  },
  input: {
    padding: '0.8rem 1rem', border: '1.5px solid #e0e0e0', borderRadius: '10px',
    fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border-color 0.2s',
  },
  totalEstimado: {
    fontSize: '0.9rem', color: '#2E7D32', fontWeight: 600,
    marginTop: '0.4rem',
  },
  metodosGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' },
  metodoBtnBase: {
    padding: '0.65rem 0.8rem', border: '1.5px solid #e0e0e0', borderRadius: '10px',
    background: 'white', cursor: 'pointer', fontSize: '0.88rem',
    fontFamily: 'inherit', fontWeight: 600, color: '#666',
    transition: 'all 0.2s', textAlign: 'center',
  },
  metodoBtnActivo: {
    border: '2px solid #4A3320', background: '#4A3320', color: 'white',
  },
  modalActions: { display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', paddingTop: '0.5rem' },
  btnSecundario: {
    padding: '0.8rem 1.3rem', border: '1.5px solid #ddd', background: 'white',
    borderRadius: '10px', fontWeight: 600, cursor: 'pointer', color: '#777',
    fontSize: '0.93rem', fontFamily: 'inherit',
  },
  btnPrimary: {
    padding: '0.85rem 1.5rem',
    background: 'linear-gradient(135deg, #5D4037, #4A3320)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
    fontFamily: 'inherit', transition: 'opacity 0.2s',
  },
  exitoContainer: {
    padding: '2rem 1.5rem', textAlign: 'center', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '1rem',
  },
  exitoIcono: {
    width: '80px', height: '80px', background: '#E8F5E9',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  exitoTitulo: { fontSize: '1.5rem', color: '#2E7D32', margin: 0, fontWeight: 800 },
  exitoDesc: { fontSize: '0.95rem', color: '#666', lineHeight: 1.6, maxWidth: '380px' },
  exitoDetalle: {
    display: 'flex', flexDirection: 'column', gap: '0.4rem',
    background: '#F9FBE7', padding: '1rem 1.5rem', borderRadius: '12px',
    border: '1px solid #DCE775', fontSize: '0.9rem', color: '#555', width: '100%',
    alignItems: 'flex-start',
  },
  errorBox: {
    background: '#FFEBEE', color: '#C62828', padding: '0.8rem 1rem',
    borderRadius: '10px', fontSize: '0.88rem', fontWeight: 600,
  },
};
