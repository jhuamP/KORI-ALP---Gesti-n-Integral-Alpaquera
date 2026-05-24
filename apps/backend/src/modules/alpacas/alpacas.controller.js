const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/alpacas
 * Lista alpacas del productor autenticado
 */
const listar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productor = await prisma.productor.findUnique({ where: { usuarioId: userId } });
    if (!productor) return res.json({ data: [] });

    const alpacas = await prisma.alpaca.findMany({
      where: { productorId: productor.id },
      orderBy: { creadoEn: 'desc' }
    });

    res.json({ data: alpacas });
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
    const alpaca = await prisma.alpaca.findUnique({ where: { id } });
    if (!alpaca) return res.status(404).json({ error: 'Alpaca no encontrada' });
    res.json(alpaca);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/alpacas
 * Registrar una nueva alpaca
 */
const crear = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let productor = await prisma.productor.findUnique({ where: { usuarioId: userId } });

    // Auto-crear perfil de productor si no existe
    if (!productor) {
      productor = await prisma.productor.create({
        data: {
          usuarioId: userId,
          region: 'Sin especificar',
          comunidad: 'Sin especificar',
        }
      });
    }

    const { arete, raza, sexo, edadMeses, pesoVivoKg, calidadFibra, micrones, notas } = req.body;

    const alpaca = await prisma.alpaca.create({
      data: {
        productorId: productor.id,
        arete,
        raza: raza || 'HUACAYA',
        sexo,
        edadMeses: edadMeses ? parseInt(edadMeses) : null,
        pesoVivoKg: pesoVivoKg ? parseFloat(pesoVivoKg) : null,
        calidadFibra: calidadFibra || null,
        micrones: micrones ? parseFloat(micrones) : null,
        notas,
        estado: 'ACTIVO'
      }
    });

    res.status(201).json({ message: 'Alpaca registrada exitosamente', data: alpaca });
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
    const alpaca = await prisma.alpaca.update({ where: { id }, data: req.body });
    res.json({ message: 'Alpaca actualizada', data: alpaca });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/alpacas/:id  → da de baja
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.alpaca.update({ where: { id }, data: { estado: 'BAJA' } });
    res.json({ message: 'Alpaca dada de baja' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, obtener, crear, actualizar, eliminar };
