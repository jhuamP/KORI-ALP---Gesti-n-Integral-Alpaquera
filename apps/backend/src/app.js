require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const authRoutes = require('./modules/auth/auth.routes');
const alpacasRoutes = require('./modules/alpacas/alpacas.routes');
const costosRoutes = require('./modules/costos/costos.routes');
const mercadoRoutes = require('./modules/mercado/mercado.routes');
const formalRoutes = require('./modules/formal/formal.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ───────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ─── Rutas de la API ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/alpacas', alpacasRoutes);
app.use('/api/costos', costosRoutes);
app.use('/api/mercado', mercadoRoutes);
app.use('/api/formal', formalRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'KORI ALP API',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Manejo de rutas no encontradas ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── Manejador global de errores ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// ─── Iniciar servidor ───────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🦙 KORI ALP API corriendo en http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
