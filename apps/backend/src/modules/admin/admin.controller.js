const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/admin/usuarios
 * Lista todos los usuarios del sistema (solo ADMIN)
 */
const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id:           true,
        nombre:       true,
        email:        true,
        rol:          true,
        activo:       true,
        creadoEn:     true,
      },
      orderBy: { creadoEn: 'desc' },
    });

    res.json({ data: usuarios });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/usuarios/:id/toggle-activo
 * Activa o desactiva un usuario
 */
const toggleActivo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const actualizado = await prisma.usuario.update({
      where: { id },
      data: { activo: !usuario.activo },
    });

    res.json({
      message: `Usuario ${actualizado.activo ? 'activado' : 'desactivado'} correctamente.`,
      data: { id: actualizado.id, activo: actualizado.activo },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stats
 * Obtiene métricas globales para el dashboard de administración
 */
const getStats = async (req, res, next) => {
  try {
    const totalUsuarios = await prisma.usuario.count();
    const productores = await prisma.usuario.count({ where: { rol: 'PRODUCTOR' } });
    const compradores = await prisma.usuario.count({ where: { rol: 'COMPRADOR' } });
    
    const alpacas = await prisma.alpaca.count({ where: { estado: 'ACTIVO' } });
    
    const publicacionesPendientes = await prisma.publicacion.count({ where: { estado: 'PAUSADA' } });
    const publicacionesActivas = await prisma.publicacion.count({ where: { estado: 'ACTIVA' } });
    
    const solicitudesPendientes = await prisma.solicitudCompra.count({ where: { estado: 'PENDIENTE' } });

    res.json({
      data: {
        usuarios: { total: totalUsuarios, productores, compradores },
        alpacas: { activas: alpacas },
        publicaciones: { pendientes: publicacionesPendientes, activas: publicacionesActivas },
        solicitudes: { pendientes: solicitudesPendientes }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsuarios, toggleActivo, getStats };
