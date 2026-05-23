const express = require('express');
const router = express.Router();
const alpacasController = require('./alpacas.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Todas las rutas de alpacas requieren autenticación
router.use(authMiddleware);

// GET    /api/alpacas          — Listar hato del productor
router.get('/', alpacasController.listar);

// GET    /api/alpacas/:id      — Detalle de una alpaca
router.get('/:id', alpacasController.obtener);

// POST   /api/alpacas          — Registrar nueva alpaca
router.post('/', alpacasController.crear);

// PUT    /api/alpacas/:id      — Actualizar datos de alpaca
router.put('/:id', alpacasController.actualizar);

// DELETE /api/alpacas/:id      — Dar de baja alpaca
router.delete('/:id', alpacasController.eliminar);

module.exports = router;
