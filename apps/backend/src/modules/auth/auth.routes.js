const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// POST /api/auth/register — Registro de productor
router.post('/register', authController.register);

// POST /api/auth/login — Inicio de sesión
router.post('/login', authController.login);

// POST /api/auth/google — Inicio de sesión o registro con Google
router.post('/google', authController.googleLogin);

// POST /api/auth/logout — Cerrar sesión
router.post('/logout', authController.logout);

// GET /api/auth/create-admin — Crear super admin (Temporal)
router.get('/create-admin', authController.createAdmin);

module.exports = router;
