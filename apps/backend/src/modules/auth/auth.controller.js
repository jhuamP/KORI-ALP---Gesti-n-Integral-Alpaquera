const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

// TODO: Reemplazar con Prisma cuando la BD esté configurada
// const prisma = require('../../config/database');

/**
 * POST /api/auth/register
 * Registro de nuevo productor alpaquero
 */
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, comunidad, region } = req.body;

    // TODO: Verificar si el email ya existe en la BD
    // const existing = await prisma.productor.findUnique({ where: { email } });
    // if (existing) return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: Guardar en la BD
    // const productor = await prisma.productor.create({ data: { ... } });

    const token = jwt.sign(
      { id: 'temp-id', email, nombre },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      message: 'Productor registrado exitosamente',
      token,
      user: { nombre, email, comunidad, region },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Inicio de sesión
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // TODO: Buscar en la BD
    // const productor = await prisma.productor.findUnique({ where: { email } });
    // if (!productor) return res.status(401).json({ error: 'Credenciales inválidas' });
    // const valid = await bcrypt.compare(password, productor.password);
    // if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: 'temp-id', email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ message: 'Inicio de sesión exitoso', token });
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
