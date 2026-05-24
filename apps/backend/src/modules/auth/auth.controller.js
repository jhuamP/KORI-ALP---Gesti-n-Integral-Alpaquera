const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body; // rol = 'ADMIN' o 'COMPRADOR'

    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const dbRol = rol === 'ADMIN' ? 'ADMIN' : 'COMPRADOR';

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        nombre,
        passwordHash,
        rol: dbRol,
      }
    });

    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, usuario.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ 
      message: 'Inicio de sesión exitoso', 
      token,
      user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  // Con JWT stateless, el logout lo maneja el cliente eliminando el token
  res.json({ message: 'Sesión cerrada exitosamente' });
};

module.exports = { register, login, logout };
