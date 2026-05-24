const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── MAPA de subcategorías por categoría para el frontend ────────────────────
const SUB_CATEGORIAS = {
  FIBRA:  ['Baby Alpaca', 'Fleece', 'Medium Fleece', 'Huarizo', 'Gruesa'],
  CARNE:  ['Fresco', 'Charqui', 'Embutido'],
  CUERO:  ['Piel entera', 'Curtido'],
  ABONO:  ['Estiercol fresco', 'Compostado'],
};

/**
 * GET /api/mercado/precio-referencia
 * Devuelve el precio oficial de Kori Alp para una categoría/subcategoría/calidad.
 * El vendedor DEBE aceptar este precio para publicar.
 *
 * Query params: categoria, subCategoria, calidadGrado (opcional)
 */
const getPrecioReferencia = async (req, res, next) => {
  try {
    const { categoria, subCategoria, calidadGrado } = req.query;

    if (!categoria || !subCategoria) {
      return res.status(400).json({ error: 'Debes indicar categoría y subcategoría.' });
    }

    // Buscar el precio más relevante: primero con calidadGrado, luego sin él
    const where = {
      tipo: categoria,
      subCategoria,
      ...(calidadGrado ? { calidadGrado } : {}),
    };

    const precio = await prisma.precioReferencia.findFirst({
      where,
      orderBy: { vigenteDesde: 'desc' }, // más reciente primero
    });

    if (!precio) {
      return res.status(404).json({
        error: 'No hay precio de referencia disponible para esta categoría.',
        disponibles: SUB_CATEGORIAS[categoria] || [],
      });
    }

    res.json({
      data: {
        tipo: precio.tipo,
        subCategoria: precio.subCategoria,
        calidadGrado: precio.calidadGrado,
        precioMin: parseFloat(precio.precioMin),
        precioMax: parseFloat(precio.precioMax),
        precioPromedio: parseFloat(precio.precioPromedio),
        unidad: precio.unidad,
        fuente: precio.fuente,
        vigenteDesde: precio.vigenteDesde,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mercado/subcategorias
 * Devuelve el mapa de subcategorías por categoría para poblar los selects del formulario.
 */
const getSubCategorias = async (req, res) => {
  res.json({ data: SUB_CATEGORIAS });
};

/**
 * GET /api/mercado/publicaciones
 * Listado PÚBLICO — solo muestra publicaciones ACTIVAS (aprobadas por Admin)
 */
const listarPublicaciones = async (req, res, next) => {
  try {
    const { categoria, region, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      estado: 'ACTIVA', // Solo las que Admin aprobó
      ...(categoria && { categoria }),
    };

    const [publicaciones, total] = await Promise.all([
      prisma.publicacion.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { creadoEn: 'desc' },
        include: {
          productor: {
            include: { usuario: { select: { nombre: true } } }
          }
        }
      }),
      prisma.publicacion.count({ where })
    ]);

    res.json({
      data: publicaciones,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mercado/publicaciones/:id
 * Ver detalle de una publicación
 */
const verPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pub = await prisma.publicacion.findUnique({
      where: { id },
      include: {
        productor: {
          include: { usuario: { select: { nombre: true, email: true } } }
        }
      }
    });
    if (!pub) return res.status(404).json({ error: 'Publicación no encontrada' });
    res.json(pub);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/mercado/publicaciones
 * Vendedor crea una nueva publicación.
 *
 * NUEVA LÓGICA: El precio enviado DEBE estar dentro del rango oficial (precio_min – precio_max).
 * Si el vendedor no acepta el precio oficial, el backend rechaza con 400.
 */
const crear = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Buscar el perfil de Productor ligado a este usuario
    const productor = await prisma.productor.findUnique({ where: { usuarioId: userId } });
    if (!productor) {
      return res.status(400).json({ error: 'Debes completar tu perfil de productor antes de publicar.' });
    }

    const {
      titulo, descripcion, categoria, subCategoria, calidadGrado,
      cantidad, unidad, precioSolicitado, ubicacion,
      aceptaPrecioOficial  // checkbox del vendedor — REQUERIDO
    } = req.body;

    // ── Validar que el vendedor aceptó el precio oficial ────────────────────
    if (!aceptaPrecioOficial) {
      return res.status(400).json({
        error: 'Debes aceptar el precio oficial de Kori Alp para publicar tu producto.'
      });
    }

    // ── Consultar precio de referencia ──────────────────────────────────────
    const precioRef = await prisma.precioReferencia.findFirst({
      where: {
        tipo: categoria,
        ...(subCategoria ? { subCategoria } : {}),
        ...(calidadGrado  ? { calidadGrado  } : {}),
      },
      orderBy: { vigenteDesde: 'desc' },
    });

    // ── Validar que el precio esté en el rango oficial ──────────────────────
    if (precioRef) {
      const precio = parseFloat(precioSolicitado);
      const min    = parseFloat(precioRef.precioMin);
      const max    = parseFloat(precioRef.precioMax);

      if (precio < min || precio > max) {
        return res.status(400).json({
          error: `El precio S/ ${precio.toFixed(2)} está fuera del rango oficial de Kori Alp (S/ ${min.toFixed(2)} – S/ ${max.toFixed(2)} por ${precioRef.unidad}).`,
          precioReferencia: {
            precioMin: min,
            precioMax: max,
            precioPromedio: parseFloat(precioRef.precioPromedio),
            unidad: precioRef.unidad,
          }
        });
      }
    }

    const publicacion = await prisma.publicacion.create({
      data: {
        productorId: productor.id,
        titulo,
        descripcion,
        categoria: categoria || 'FIBRA',
        cantidad: parseFloat(cantidad),
        unidad: unidad || 'kg',
        precioSolicitado: parseFloat(precioSolicitado),
        ubicacion,
        aceptaOferta: false, // precio es fijo (oficial Kori Alp)
        estado: 'PAUSADA', // Empieza PAUSADA — espera aprobación del admin
      }
    });

    res.status(201).json({
      message: '✅ Publicación enviada. El administrador la revisará y aprobará pronto.',
      data: publicacion,
      precioReferencia: precioRef ? {
        precioMin: parseFloat(precioRef.precioMin),
        precioMax: parseFloat(precioRef.precioMax),
        precioPromedio: parseFloat(precioRef.precioPromedio),
      } : null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mercado/mis-publicaciones
 * Vendedor ve SUS propias publicaciones (cualquier estado)
 */
const misPublicaciones = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productor = await prisma.productor.findUnique({ where: { usuarioId: userId } });
    if (!productor) return res.json({ data: [] });

    const publicaciones = await prisma.publicacion.findMany({
      where: { productorId: productor.id },
      orderBy: { creadoEn: 'desc' }
    });

    res.json({ data: publicaciones });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/mercado/publicaciones/:id
 * Vendedor actualiza su publicación (solo si está PAUSADA o CANCELADA)
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const productor = await prisma.productor.findUnique({ where: { usuarioId: userId } });

    const pub = await prisma.publicacion.findUnique({ where: { id } });
    if (!pub || pub.productorId !== productor?.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta publicación.' });
    }

    // Extraer solo los campos editables (sin precioSolicitado ya que es oficial)
    const { titulo, descripcion, cantidad, ubicacion } = req.body;

    const updated = await prisma.publicacion.update({
      where: { id },
      data: {
        titulo,
        descripcion,
        cantidad: cantidad ? parseFloat(cantidad) : undefined,
        ubicacion,
        estado: 'PAUSADA' // Vuelve a PAUSADA para nueva revisión del admin
      }
    });

    res.json({ message: 'Publicación actualizada y enviada a revisión nuevamente.', data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/mercado/publicaciones/:id
 * Vendedor cancela su publicación
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.publicacion.update({ where: { id }, data: { estado: 'CANCELADA' } });
    res.json({ message: 'Publicación cancelada exitosamente.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/mercado/publicaciones/:id/aprobar   [Solo ADMIN]
 * Admin aprueba una publicación → pasa a ACTIVA (visible para compradores)
 * Incluye en la respuesta el precio de referencia para que el admin vea contexto.
 */
const aprobar = async (req, res, next) => {
  try {
    if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'Solo el administrador puede aprobar publicaciones.' });
    }
    const { id } = req.params;
    const pub = await prisma.publicacion.update({
      where: { id },
      data: { estado: 'ACTIVA' }
    });
    res.json({ message: '✅ Publicación aprobada. Ahora es visible en el catálogo para compradores.', data: pub });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/mercado/publicaciones/:id/rechazar   [Solo ADMIN]
 * Admin rechaza una publicación (puede incluir motivo)
 */
const rechazar = async (req, res, next) => {
  try {
    if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'Solo el administrador puede rechazar publicaciones.' });
    }
    const { id } = req.params;
    const { motivo } = req.body;
    const pub = await prisma.publicacion.update({
      where: { id },
      data: { estado: 'CANCELADA' }
    });
    res.json({
      message: `Publicación rechazada.${motivo ? ' Motivo: ' + motivo : ''}`,
      data: pub
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mercado/pendientes   [Solo ADMIN]
 * Admin ve todas las publicaciones PAUSADAS esperando aprobación.
 * Incluye el precio de referencia para facilitar la decisión del admin.
 */
const pendientes = async (req, res, next) => {
  try {
    if (req.user.rol !== 'ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    const pubs = await prisma.publicacion.findMany({
      where: { estado: 'PAUSADA' },
      orderBy: { creadoEn: 'asc' },
      include: {
        productor: {
          include: { usuario: { select: { nombre: true, email: true } } }
        }
      }
    });

    // Para cada publicación, adjuntar el precio de referencia oficial
    const pubsConPrecio = await Promise.all(
      pubs.map(async (pub) => {
        const precioRef = await prisma.precioReferencia.findFirst({
          where: { tipo: pub.categoria },
          orderBy: { vigenteDesde: 'desc' },
        });
        return {
          ...pub,
          precioReferencia: precioRef ? {
            precioMin: parseFloat(precioRef.precioMin),
            precioMax: parseFloat(precioRef.precioMax),
            precioPromedio: parseFloat(precioRef.precioPromedio),
            subCategoria: precioRef.subCategoria,
            calidadGrado: precioRef.calidadGrado,
            unidad: precioRef.unidad,
            fuente: precioRef.fuente,
          } : null,
        };
      })
    );

    res.json({ data: pubsConPrecio });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/mercado/publicaciones/:id/solicitar-compra
 * Comprador registra su intención de compra desde el catálogo.
 * No requiere login. Solo deja nombre, teléfono y método de pago preferido.
 */
const solicitarCompra = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombreComprador, telefono, email, metodoPago, cantidadSolicitada, notas } = req.body;

    // Validar que la publicación exista y esté activa
    const pub = await prisma.publicacion.findUnique({ where: { id } });
    if (!pub) return res.status(404).json({ error: 'Publicación no encontrada.' });
    if (pub.estado !== 'ACTIVA') {
      return res.status(400).json({ error: 'Esta publicación ya no está disponible.' });
    }

    if (!nombreComprador || !telefono || !metodoPago) {
      return res.status(400).json({ error: 'Nombre, teléfono y método de pago son obligatorios.' });
    }

    const solicitud = await prisma.solicitudCompra.create({
      data: {
        publicacionId: id,
        nombreComprador,
        telefono,
        email: email || null,
        metodoPago,
        cantidadSolicitada: cantidadSolicitada ? parseFloat(cantidadSolicitada) : null,
        notas: notas || null,
        estado: 'PENDIENTE',
      }
    });

    res.status(201).json({
      message: '🎉 ¡Solicitud de compra enviada! El equipo de Kori Alp se contactará contigo pronto.',
      data: solicitud,
      publicacion: {
        titulo: pub.titulo,
        precio: parseFloat(pub.precioSolicitado),
        unidad: pub.unidad,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mercado/mis-compras
 * Comprador ve sus compras basándose en su email
 */
const misCompras = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) return res.json({ data: [] });

    const solicitudes = await prisma.solicitudCompra.findMany({
      where: { email: userEmail },
      include: {
        publicacion: {
          include: {
            productor: {
              include: { usuario: true }
            }
          }
        }
      },
      orderBy: { creadoEn: 'desc' }
    });

    res.json({ data: solicitudes });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mercado/solicitudes-recibidas
 * Vendedor ve las solicitudes de compra hechas a sus publicaciones
 */
const solicitudesRecibidas = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productor = await prisma.productor.findUnique({ where: { usuarioId: userId } });
    if (!productor) return res.json({ data: [] });

    const solicitudes = await prisma.solicitudCompra.findMany({
      where: {
        publicacion: {
          productorId: productor.id
        }
      },
      include: {
        publicacion: true
      },
      orderBy: { creadoEn: 'desc' }
    });

    res.json({ data: solicitudes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrecioReferencia,
  getSubCategorias,
  listarPublicaciones,
  verPublicacion,
  crear,
  misPublicaciones,
  actualizar,
  eliminar,
  aprobar,
  rechazar,
  pendientes,
  solicitarCompra,
  misCompras,
  solicitudesRecibidas,
};
