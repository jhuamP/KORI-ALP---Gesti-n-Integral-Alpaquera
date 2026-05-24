const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body; // rol = 'PRODUCTOR', 'COMPRADOR' o 'ADMIN'

    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Permitir los 3 roles válidos
    const validRoles = ['PRODUCTOR', 'COMPRADOR', 'ADMIN'];
    const dbRol = validRoles.includes(rol) ? rol : 'COMPRADOR';

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        nombre,
        passwordHash,
        rol: dbRol,
        ...(dbRol === 'PRODUCTOR' ? {
          productor: {
            create: {
              region: 'Puno',
              comunidad: 'Comunidad Kori',
              dni: '',
              totalAlpacas: 0
            }
          }
        } : {}),
        ...(dbRol === 'COMPRADOR' ? {
          comprador: {
            create: {
              nombre: nombre,
              tipo: 'TEXTIL',
              region: 'Arequipa',
              isVerificado: true
            }
          }
        } : {})
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

/**
 * GET /api/auth/create-admin
 * Ruta temporal para crear al super administrador
 */
const createAdmin = async (req, res, next) => {
  try {
    const email = 'admin@korialp.com';
    const password = 'admin';
    const passwordHash = await bcrypt.hash(password, 10);

    let admin = await prisma.usuario.findUnique({ where: { email } });
    if (admin) {
      admin = await prisma.usuario.update({
        where: { email },
        data: { passwordHash, rol: 'ADMIN' }
      });
      return res.json({ message: 'Admin actualizado exitosamente', email });
    }

    admin = await prisma.usuario.create({
      data: {
        email,
        nombre: 'Super Administrador',
        passwordHash,
        rol: 'ADMIN'
      }
    });
    return res.json({ message: 'Admin creado exitosamente', email });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, createAdmin };
