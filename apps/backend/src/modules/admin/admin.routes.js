const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

// GET /api/admin/usuarios
router.get('/usuarios', adminController.getUsuarios);

// GET /api/admin/stats
router.get('/stats', adminController.getStats);

module.exports = router;
