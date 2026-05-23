// TODO: Integrar con Prisma + librería de generación PDF (pdfkit o puppeteer)
// const prisma = require('../../config/database');

/**
 * Módulo Formal Simplificado
 * Genera documentos para SUNAT, SENASA y guías de exportación
 * Ayuda al productor a formalizarse paso a paso
 */

const listar = async (req, res, next) => {
  try {
    // TODO: const docs = await prisma.documento.findMany({ where: { productorId: req.user.id } });
    res.json({ message: 'Documentos generados', data: [] });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/formal/boleta
 * Genera borrador de boleta de venta para el productor
 */
const generarBoleta = async (req, res, next) => {
  try {
    const {
      comprador,
      productos,     // [{ descripcion, cantidad, precioUnitario }]
      fecha,
    } = req.body;

    const total = productos?.reduce(
      (acc, p) => acc + (p.cantidad * p.precioUnitario), 0
    ) || 0;

    // TODO: Generar PDF con pdfkit y guardar en S3 / disco local
    res.json({
      message: 'Borrador de boleta generado',
      documento: {
        tipo: 'BOLETA',
        comprador,
        productos,
        total: +total.toFixed(2),
        fecha: fecha || new Date().toISOString(),
        estado: 'BORRADOR',
        // url: 'https://...' (cuando se integre generación de PDF)
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/formal/guia-remision
 */
const generarGuiaRemision = async (req, res, next) => {
  try {
    const { destino, productos, transportista, ruc } = req.body;
    // TODO: Integrar con API SUNAT para validación
    res.json({
      message: 'Guía de remisión generada',
      documento: {
        tipo: 'GUIA_REMISION',
        destino,
        productos,
        transportista,
        ruc,
        estado: 'BORRADOR',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/formal/guia-exportacion
 * Retorna la guía paso a paso para exportar fibra de alpaca
 */
const guiaExportacion = (req, res) => {
  res.json({
    message: 'Guía de exportación de fibra de alpaca',
    pasos: [
      { paso: 1, titulo: 'Obtener RUC', descripcion: 'Registrarte en SUNAT como persona natural o jurídica', entidad: 'SUNAT' },
      { paso: 2, titulo: 'Certificación SENASA', descripcion: 'Obtener certificado sanitario de tu fibra/carne', entidad: 'SENASA' },
      { paso: 3, titulo: 'Registro en MINCETUR', descripcion: 'Inscribirse en el registro de exportadores', entidad: 'MINCETUR' },
      { paso: 4, titulo: 'Encontrar comprador', descripcion: 'Conectarte con importadores a través del módulo Mercado', entidad: 'KORI ALP' },
      { paso: 5, titulo: 'Declaración Aduanera', descripcion: 'Tramitar DAM (Declaración Aduanera de Mercancías)', entidad: 'SUNAT/Aduanas' },
    ],
  });
};

/**
 * POST /api/formal/registro-asociacion
 */
const registroAsociacion = async (req, res, next) => {
  try {
    const { nombreAsociacion, ruc, socios, comunidad, region } = req.body;
    // TODO: Guardar solicitud y enviar guía personalizada
    res.json({
      message: 'Solicitud de registro de asociación recibida',
      data: { nombreAsociacion, ruc, socios, comunidad, region },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, generarBoleta, generarGuiaRemision, guiaExportacion, registroAsociacion };
