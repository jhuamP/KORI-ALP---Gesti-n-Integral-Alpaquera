const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// POST /api/auth/register — Registro de productor
router.post('/register', authController.register);

// POST /api/auth/login — Inicio de sesión
router.post('/login', authController.login);

// POST /api/auth/logout — Cerrar sesión
router.post('/logout', authController.logout);

module.exports = router;
