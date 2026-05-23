const express = require('express');
const router = express.Router();
const formalController = require('./formal.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

// GET  /api/formal/documentos           — Listar documentos generados
router.get('/documentos', formalController.listar);

// POST /api/formal/boleta               — Generar boleta de venta
router.post('/boleta', formalController.generarBoleta);

// POST /api/formal/guia-remision        — Generar guía de remisión SUNAT
router.post('/guia-remision', formalController.generarGuiaRemision);

// GET  /api/formal/guia-exportacion     — Pasos para exportación
router.get('/guia-exportacion', formalController.guiaExportacion);

// POST /api/formal/registro-asociacion  — Iniciar registro de asociación
router.post('/registro-asociacion', formalController.registroAsociacion);

module.exports = router;
