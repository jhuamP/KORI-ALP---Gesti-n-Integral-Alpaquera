// TODO: Integrar con Prisma
// const prisma = require('../../config/database');

/**
 * Módulo Mercado Directo
 * Conecta productores con compradores (textil, gastronómico, industrial)
 * Categorías: FIBRA | CARNE | CUERO
 */

const listarPublicaciones = async (req, res, next) => {
  try {
    const { categoria, region, page = 1, limit = 20 } = req.query;
    // TODO: const publicaciones = await prisma.publicacion.findMany({ where: { categoria, activa: true } });
    res.json({
      message: 'Mercado — publicaciones disponibles',
      filtros: { categoria, region },
      data: [],
      pagination: { page: +page, limit: +limit, total: 0 },
    });
  } catch (error) {
    next(error);
  }
};

const verPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: const pub = await prisma.publicacion.findUnique({ where: { id }, include: { productor: true } });
    res.json({ message: `Publicación ${id}`, data: null });
  } catch (error) {
    next(error);
  }
};

const crear = async (req, res, next) => {
  try {
    const datos = req.body;
    // Campos esperados: titulo, descripcion, categoria (FIBRA/CARNE/CUERO),
    // cantidad, unidad, precioSolicitado, ubicacion, contacto
    // TODO: await prisma.publicacion.create({ data: { ...datos, productorId: req.user.id } });
    res.status(201).json({ message: 'Publicación creada en el mercado', data: datos });
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: await prisma.publicacion.update({ where: { id }, data: req.body });
    res.json({ message: `Publicación ${id} actualizada` });
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: await prisma.publicacion.update({ where: { id }, data: { activa: false } });
    res.json({ message: `Publicación ${id} desactivada` });
  } catch (error) {
    next(error);
  }
};

const misPublicaciones = async (req, res, next) => {
  try {
    // TODO: const mias = await prisma.publicacion.findMany({ where: { productorId: req.user.id } });
    res.json({ message: 'Mis publicaciones', data: [] });
  } catch (error) {
    next(error);
  }
};

const contactar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mensaje, compradorEmail } = req.body;
    // TODO: Enviar notificación al productor (email/WhatsApp)
    res.json({ message: `Solicitud de contacto enviada al productor de publicación ${id}` });
  } catch (error) {
    next(error);
  }
};

module.exports = { listarPublicaciones, verPublicacion, crear, actualizar, eliminar, misPublicaciones, contactar };
