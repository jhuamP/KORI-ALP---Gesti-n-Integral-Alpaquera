import React, { useState } from 'react';
import { X, ShoppingBag, CheckCircle, Phone, User, CreditCard, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

const API = '/api';

const METODOS_PAGO = [
  { value: 'WAZA',          label: '💬 Waza (918927944)' },
  { value: 'YAPE',          label: '🟣 Yape' },
  { value: 'PLIN',          label: '🟢 Plin' },
  { value: 'TARJETA',       label: '💳 Tarjeta de Crédito/Débito' },
  { value: 'TRANSFERENCIA', label: '🏦 Transferencia Bancaria' },
];

export default function ModalCompra({ producto, onClose }) {
  const [step, setStep] = useState(1); // 1 = Formulario de contacto, 2 = Pasarela de pago, 3 = Éxito
  const [form, setForm] = useState({
    nombreComprador: '',
    telefono: '',
    email: '',
    metodoPago: 'WAZA',
    cantidadSolicitada: '',
    notas: '',
  });

  // Datos para la pasarela simulada
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [transferRef, setTransferRef] = useState('');

  const [enviando, setEnviando]   = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pagoMensaje, setPagoMensaje] = useState('');
  const [error, setError]         = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleCardChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const precioTotal = form.cantidadSolicitada
    ? (parseFloat(form.cantidadSolicitada) * parseFloat(producto.precioSolicitado)).toFixed(2)
    : null;

  // Paso 1 -> Paso 2
  const handleNextStep = (e) => {
    e.preventDefault();
    if (!form.nombreComprador || !form.telefono || !form.cantidadSolicitada) {
      setError('Por favor completa todos los campos obligatorios (*).');
      return;
    }
    setError('');
    setStep(2);
  };

  // Crear la solicitud en la base de datos y abrir WhatsApp
  const handleWazaRedirect = async () => {
    setEnviando(true);
    try {
      // Registrar la solicitud en la base de datos
      const res = await fetch(`${API}/mercado/publicaciones/${producto.id}/solicitar-compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          notas: `${form.notas || ''} (Pago coordinado por WhatsApp)`.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar la solicitud');
      }

      // Redirigir a WhatsApp
      const text = `Hola, vengo de Kori Alp. Quiero comprar ${form.cantidadSolicitada} ${producto.unidad} de "${producto.titulo}" (Total: S/ ${precioTotal}). Mi nombre es ${form.nombreComprador} y mi teléfono es ${form.telefono}.`;
      const url = `https://wa.me/51918927944?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // Confirmar y simular pago para los otros métodos
  const handleSimularPago = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setProcesandoPago(true);

    // Animación de la pasarela simulada
    const mensajes = {
      TARJETA: ['Conectando con la pasarela segura Visa/Mastercard...', 'Validando fondos...', 'Procesando pago...'],
      YAPE: ['Generando transacción de Yape...', 'Verificando recepción del pago...', 'Pago recibido con éxito.'],
      PLIN: ['Generando transacción de Plin...', 'Verificando recepción del pago...', 'Pago recibido con éxito.'],
      TRANSFERENCIA: ['Verificando código de operación...', 'Consultando con el banco...', 'Transferencia confirmada.'],
    };

    const pasos = mensajes[form.metodoPago] || ['Procesando solicitud...'];

    try {
      // Mensaje 1
      setPagoMensaje(pasos[0]);
      await new Promise(r => setTimeout(r, 1000));

      // Mensaje 2
      setPagoMensaje(pasos[1]);
      await new Promise(r => setTimeout(r, 1000));

      // Guardar solicitud en BD
      const notesWithRef = form.metodoPago === 'TRANSFERENCIA' 
        ? `${form.notas || ''} (Ref BCP: ${transferRef})`.trim()
        : form.notas;

      const res = await fetch(`${API}/mercado/publicaciones/${producto.id}/solicitar-compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          notas: notesWithRef,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al registrar la compra');
      }

      // Mensaje 3
      setPagoMensaje(pasos[2]);
      await new Promise(r => setTimeout(r, 800));

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesandoPago(false);
      setPagoMensaje('');
    }
  };

  return (
    <div style={estilos.overlay} onClick={onClose}>
      <div style={estilos.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={estilos.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="#4A3320" />
            <h2 style={estilos.modalTitle}>
              {step === 1 && 'Solicitar compra'}
              {step === 2 && 'Pasarela de pago'}
              {step === 3 && '¡Compra confirmada!'}
            </h2>
          </div>
          <button style={estilos.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Resumen del producto (siempre visible en paso 1 y 2) */}
        {step < 3 && (
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
        )}

        {/* PASO 1: Formulario de contacto y cantidad */}
        {step === 1 && (
          <form onSubmit={handleNextStep} style={estilos.form}>
            {error && <div style={estilos.errorBox}>{error}</div>}

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

            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                📦 Cantidad que deseas comprar ({producto.unidad}) *
              </label>
              <input
                type="number"
                placeholder={`Disponible: ${producto.cantidad} ${producto.unidad}`}
                min="0.01"
                max={producto.cantidad}
                step="0.01"
                value={form.cantidadSolicitada}
                onChange={e => handleChange('cantidadSolicitada', e.target.value)}
                required
                style={estilos.input}
              />
              {precioTotal && (
                <div style={estilos.totalEstimado}>
                  💰 Total estimado: <strong>S/ {precioTotal}</strong>
                </div>
              )}
            </div>

            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                <CreditCard size={14} /> Método de pago *
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

            <div style={estilos.formGroup}>
              <label style={estilos.label}>
                <MessageSquare size={14} /> Notas adicionales
              </label>
              <textarea
                placeholder="Ej: Detalles de la entrega..."
                value={form.notes}
                onChange={e => handleChange('notas', e.target.value)}
                rows={2}
                style={{ ...estilos.input, resize: 'none' }}
              />
            </div>

            <div style={estilos.modalActions}>
              <button type="button" style={estilos.btnSecundario} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" style={estilos.btnPrimary}>
                Continuar <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* PASO 2: Pasarela de Pago Simulada */}
        {step === 2 && (
          <div style={estilos.form}>
            {error && <div style={estilos.errorBox}>{error}</div>}

            {procesandoPago ? (
              <div style={estilos.loadingPasarela}>
                <div className="spinner-pago" style={estilos.spinner}></div>
                <p style={estilos.loadingTexto}>{pagoMensaje}</p>
                <span style={{ fontSize: '0.82rem', color: '#888' }}>Por favor no cierre esta ventana...</span>
              </div>
            ) : (
              <>
                {/* ── METODO: WAZA ── */}
                {form.metodoPago === 'WAZA' && (
                  <div style={estilos.wazaBox}>
                    <div style={estilos.wazaHeader}>
                      <span style={{ fontSize: '3rem' }}>💬</span>
                      <h4 style={{ margin: '0.5rem 0', color: '#2E7D32', fontWeight: 800 }}>Pago directo por WhatsApp</h4>
                      <p style={{ fontSize: '0.9rem', color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
                        Se enviará un mensaje directo al número <strong>918927944</strong> con todos los detalles de tu pedido para que coordines el pago y la entrega directamente.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleWazaRedirect}
                      disabled={enviando}
                      style={{
                        ...estilos.btnPrimary,
                        background: '#2E7D32',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        padding: '1rem'
                      }}
                    >
                      {enviando ? '⏳ Guardando...' : '💬 Enviar pedido por WhatsApp'}
                    </button>
                  </div>
                )}

                {/* ── METODO: TARJETA ── */}
                {form.metodoPago === 'TARJETA' && (
                  <form onSubmit={handleSimularPago} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Tarjeta Visual */}
                    <div style={estilos.tarjetaVisual}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontStyle: 'italic', opacity: 0.9 }}>KORI CARD</span>
                        <div style={{ width: '38px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ fontSize: '1.2rem', letterSpacing: '2px', margin: '1.2rem 0 0.5rem' }}>
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8 }}>
                        <span>{cardData.name.toUpperCase() || 'TITULAR DE TARJETA'}</span>
                        <span>{cardData.expiry || 'MM/AA'}</span>
                      </div>
                    </div>

                    <div style={estilos.formGroup}>
                      <label style={estilos.label}>Número de Tarjeta</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        maxLength="19"
                        value={cardData.number}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          handleCardChange('number', val);
                        }}
                        required
                        style={estilos.input}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={estilos.formGroup}>
                        <label style={estilos.label}>Vencimiento</label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength="5"
                          value={cardData.expiry}
                          onChange={e => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                            handleCardChange('expiry', val);
                          }}
                          required
                          style={estilos.input}
                        />
                      </div>
                      <div style={estilos.formGroup}>
                        <label style={estilos.label}>CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength="3"
                          value={cardData.cvv}
                          onChange={e => handleCardChange('cvv', e.target.value.replace(/\D/g, ''))}
                          required
                          style={estilos.input}
                        />
                      </div>
                    </div>

                    <div style={estilos.formGroup}>
                      <label style={estilos.label}>Nombre en la Tarjeta</label>
                      <input
                        type="text"
                        placeholder="Ej: MARÍA G QUISPE"
                        value={cardData.name}
                        onChange={e => handleCardChange('name', e.target.value)}
                        required
                        style={estilos.input}
                      />
                    </div>

                    <button type="submit" style={estilos.btnPrimary}>
                      💳 Pagar S/ {precioTotal}
                    </button>
                  </form>
                )}

                {/* ── METODO: YAPE / PLIN ── */}
                {(form.metodoPago === 'YAPE' || form.metodoPago === 'PLIN') && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                    <div style={{
                      padding: '1.2rem',
                      background: form.metodoPago === 'YAPE' ? '#7B1FA2' : '#00E676',
                      borderRadius: '16px',
                      color: 'white',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <h4 style={{ margin: 0, fontWeight: 800 }}>Escanea el código QR para pagar</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                        Monto exacto: <strong>S/ {precioTotal}</strong>
                      </p>
                    </div>

                    {/* QR Code SVG */}
                    <svg width="160" height="160" viewBox="0 0 29 29" style={{ border: '4px solid #fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                      <path d="M0 0h7v7H0zm1 1v5h5V1zm8 0h1v1H9zm1 1h1v1h-1zm-2 1h1v1H8zm3 0h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1zm-2 2h1v1h-1zm3 0h1v1h-1zm-7 1h7v7H8zm1 1v5h5v-5zm-8 1h1v1H1zm2 1h1v1H3zm-2 2h1v1H1zm1 1h1v1H2zm13-13h7v7h-7zm1 1v5h5V15zm-15 8h7v7H0zm1 1v5h5v-5zm18-7h1v1h-1zm-2 1h1v1h-1zm3 0h1v1h-1zm1 1h1v1h-1zm-4 1h1v1h-1zm1 1h1v1h-1zm-3 1h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1zm1 1h1v1h-1zm3-3h1v1h-1zm-1 1h1v1h-1zm2 1h1v1h-1z" fill="#000" />
                    </svg>

                    <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                      Número de contacto asociado: <strong>918927944</strong>
                    </p>

                    <button type="button" onClick={() => handleSimularPago()} style={{ ...estilos.btnPrimary, width: '100%' }}>
                      📱 Confirmar Pago Realizado
                    </button>
                  </div>
                )}

                {/* ── METODO: TRANSFERENCIA ── */}
                {form.metodoPago === 'TRANSFERENCIA' && (
                  <form onSubmit={handleSimularPago} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={estilos.bancoBox}>
                      <h5 style={{ margin: '0 0 6px', color: '#4A3320', fontWeight: 800 }}>Cuentas de Kori Alp:</h5>
                      <div style={{ fontSize: '0.88rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>🏦 <strong>BCP Soles:</strong> 191-91892794-0-44</span>
                        <span>🏦 <strong>CCI:</strong> 002-19119189279404456</span>
                        <span>👤 <strong>Titular:</strong> Kori Alp Gestión Andina</span>
                      </div>
                    </div>

                    <div style={estilos.formGroup}>
                      <label style={estilos.label}>Código / N° de Operación (8 dígitos)</label>
                      <input
                        type="text"
                        placeholder="Ej: 84729104"
                        maxLength="8"
                        value={transferRef}
                        onChange={e => setTransferRef(e.target.value.replace(/\D/g, ''))}
                        required
                        style={estilos.input}
                      />
                    </div>

                    <button type="submit" style={estilos.btnPrimary}>
                      Confirmar y Validar Operación
                    </button>
                  </form>
                )}

                {/* Volver */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={estilos.btnVolver}
                >
                  <ArrowLeft size={14} /> Volver a datos de contacto
                </button>
              </>
            )}
          </div>
        )}

        {/* PASO 3: Éxito */}
        {step === 3 && (
          <div style={estilos.exitoContainer}>
            <div style={estilos.exitoIcono}>
              <CheckCircle size={56} color="#2E7D32" />
            </div>
            <h3 style={estilos.exitoTitulo}>
              {form.metodoPago === 'WAZA' ? '¡Pedido Enviado!' : '¡Pago Exitoso!'}
            </h3>
            <p style={estilos.exitoDesc}>
              {form.metodoPago === 'WAZA' 
                ? 'Hemos registrado tu solicitud de compra. Se abrirá WhatsApp para que continúes la coordinación directa.'
                : 'Tu pago ha sido procesado correctamente por la pasarela simulada de Kori Alp. Nos pondremos en contacto a la brevedad.'
              }
            </p>
            <div style={estilos.exitoDetalle}>
              <span>📦 <strong>Producto:</strong> {producto.titulo}</span>
              <span>💳 <strong>Método:</strong> {METODOS_PAGO.find(m => m.value === form.metodoPago)?.label}</span>
              <span>🔢 <strong>Cantidad:</strong> {form.cantidadSolicitada} {producto.unidad}</span>
              {precioTotal && <span>💰 <strong>Total:</strong> S/ {precioTotal}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
              <button
                style={{
                  ...estilos.btnPrimary,
                  background: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={() => {
                  const text = `Hola! Quiero coordinar el envío de mi pedido de Kori Alp: ${form.cantidadSolicitada} ${producto.unidad} de "${producto.titulo}" (Total: S/ ${precioTotal}).`;
                  window.open(`https://wa.me/51918927944?text=${encodeURIComponent(text)}`, '_blank');
                }}
              >
                💬 Abrir chat de WhatsApp para coordinar entrega
              </button>

              <button style={estilos.btnSecundario} onClick={onClose}>
                Finalizar
              </button>
            </div>
          </div>
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
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
  },
  btnVolver: {
    background: 'none', border: 'none', color: '#888', cursor: 'pointer',
    fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
    marginTop: '0.5rem', alignSelf: 'center', textDecoration: 'underline',
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
  loadingPasarela: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '2rem 0', gap: '1rem',
  },
  spinner: {
    width: '40px', height: '40px', border: '4px solid #f3f3f3',
    borderTop: '4px solid #4A3320', borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingTexto: { fontSize: '1.05rem', color: '#4A3320', fontWeight: 700, margin: 0 },
  wazaBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem',
    padding: '0.5rem 0',
  },
  wazaHeader: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  tarjetaVisual: {
    background: 'linear-gradient(135deg, #1f1f1f, #3a3a3a)',
    color: 'white', borderRadius: '14px', padding: '1.2rem',
    fontFamily: 'monospace', boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  },
  bancoBox: {
    background: '#F5F5F5', padding: '1rem', borderRadius: '12px',
    border: '1px dashed #ccc',
  },
};
