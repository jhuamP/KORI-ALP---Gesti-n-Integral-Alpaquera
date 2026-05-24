const express = require('express');
const router = express.Router();
const mercadoController = require('./mercado.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// ─── Rutas PÚBLICAS (sin login) ───────────────────────────────────────────────

// Catálogo — solo publica publicaciones en estado ACTIVA (aprobadas por Admin)
router.get('/publicaciones', mercadoController.listarPublicaciones);
router.get('/publicaciones/:id', mercadoController.verPublicacion);

// Precio oficial de Kori Alp por categoría/subcategoría (el vendedor lo consulta al crear)
router.get('/precio-referencia', mercadoController.getPrecioReferencia);

// Subcategorías disponibles por categoría (para poblar el formulario del vendedor)
router.get('/subcategorias', mercadoController.getSubCategorias);

// Solicitud de compra del comprador (no requiere login)
router.post('/publicaciones/:id/solicitar-compra', mercadoController.solicitarCompra);

// ─── Rutas PROTEGIDAS (requieren JWT) ────────────────────────────────────────
router.use(authMiddleware);

// Comprador: ver sus solicitudes de compra
router.get('/mis-compras', mercadoController.misCompras);

// Admin: ver pendientes y aprobar/rechazar
router.get('/pendientes', mercadoController.pendientes);
router.patch('/publicaciones/:id/aprobar', mercadoController.aprobar);
router.patch('/publicaciones/:id/rechazar', mercadoController.rechazar);

// Vendedor: gestionar sus propias publicaciones
router.get('/mis-publicaciones', mercadoController.misPublicaciones);
router.get('/solicitudes-recibidas', mercadoController.solicitudesRecibidas);
router.post('/publicaciones', mercadoController.crear);
router.put('/publicaciones/:id', mercadoController.actualizar);
router.delete('/publicaciones/:id', mercadoController.eliminar);

module.exports = router;
