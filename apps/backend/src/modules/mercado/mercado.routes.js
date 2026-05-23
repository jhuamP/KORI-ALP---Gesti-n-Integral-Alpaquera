const express = require('express');
const router = express.Router();
const mercadoController = require('./mercado.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Listado público (sin auth) para que compradores puedan explorar
router.get('/publicaciones', mercadoController.listarPublicaciones);
router.get('/publicaciones/:id', mercadoController.verPublicacion);

// Rutas protegidas para productores
router.use(authMiddleware);
router.post('/publicaciones', mercadoController.crear);
router.put('/publicaciones/:id', mercadoController.actualizar);
router.delete('/publicaciones/:id', mercadoController.eliminar);
router.get('/mis-publicaciones', mercadoController.misPublicaciones);

// Contacto entre comprador y productor
router.post('/publicaciones/:id/contactar', mercadoController.contactar);

module.exports = router;
