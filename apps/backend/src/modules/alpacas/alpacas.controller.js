// TODO: Integrar con Prisma
// const prisma = require('../../config/database');

/**
 * GET /api/alpacas
 * Lista todas las alpacas del productor autenticado
 */
const listar = async (req, res, next) => {
  try {
    // TODO: const alpacas = await prisma.alpaca.findMany({ where: { productorId: req.user.id } });
    res.json({
      message: 'Módulo Alpacas — Listar hato',
      data: [],
      // Campos esperados: id, arete, raza (Huacaya/Suri), edad, sexo, pesoVivo,
      // calidad_fibra (BabyAlpaca/Fleece), estado (activo/saca/fallecido)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/alpacas/:id
 */
const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: const alpaca = await prisma.alpaca.findUnique({ where: { id } });
    res.json({ message: `Alpaca ${id} — detalle`, data: null });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/alpacas
 */
const crear = async (req, res, next) => {
  try {
    const datos = req.body;
    // TODO: const alpaca = await prisma.alpaca.create({ data: { ...datos, productorId: req.user.id } });
    res.status(201).json({ message: 'Alpaca registrada', data: datos });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/alpacas/:id
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    // TODO: const alpaca = await prisma.alpaca.update({ where: { id }, data: datos });
    res.json({ message: `Alpaca ${id} actualizada`, data: datos });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/alpacas/:id
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: await prisma.alpaca.update({ where: { id }, data: { estado: 'baja' } });
    res.json({ message: `Alpaca ${id} dada de baja` });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
