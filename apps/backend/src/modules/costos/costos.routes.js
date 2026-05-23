const express = require('express');
const router = express.Router();
const costosController = require('./costos.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

// GET  /api/costos                  — Listar registros de costos
router.get('/', costosController.listar);

// POST /api/costos/calcular         — Calcular costo integral por animal/lote
router.post('/calcular', costosController.calcular);

// POST /api/costos                  — Guardar registro de costos
router.post('/', costosController.crear);

// GET  /api/costos/resumen          — Resumen y precio justo sugerido
router.get('/resumen', costosController.resumen);

// DELETE /api/costos/:id
router.delete('/:id', costosController.eliminar);

module.exports = router;
