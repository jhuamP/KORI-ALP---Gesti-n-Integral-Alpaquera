// TODO: Integrar con Prisma
// const prisma = require('../../config/database');

/**
 * Calculadora de costos integral por alpaca
 * Líneas de valor: Fibra | Carne | Cuero & Piel
 *
 * Categorías de costo:
 * - CRIANZA: pastos, sanidad (vacunas), mano de obra, agua
 * - ESQUILA: mano de obra esquila, clasificación fibra, embalaje
 * - FAENADO: transporte, faenado, empaque
 * - COMERCIALIZACIÓN: transporte a mercado, ferias, comisiones
 */

/**
 * GET /api/costos
 */
const listar = async (req, res, next) => {
  try {
    // TODO: const costos = await prisma.registroCosto.findMany({ where: { productorId: req.user.id } });
    res.json({ message: 'Costos — listar registros', data: [] });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/costos/calcular
 * Calcula el costo real y sugiere precio justo por línea de valor
 */
const calcular = async (req, res, next) => {
  try {
    const {
      numAnimales = 1,
      costoPastos = 0,
      costoSanidad = 0,         // vacunas, desparasitación
      costoManoObra = 0,        // pastoreo, esquila
      costoEsquila = 0,
      costoFaenado = 0,
      costoTransporte = 0,
      pesoFibraKg = 0,          // kg de fibra por animal
      pesoCarneLote = 0,        // kg de carne total del lote
    } = req.body;

    const costoTotal = costoSanidad + costoPastos + costoManoObra +
                       costoEsquila + costoFaenado + costoTransporte;
    const costoPorAnimal = costoTotal / numAnimales;

    // Margen mínimo sugerido del 30%
    const MARGEN_MINIMO = 0.30;

    const precioSugerido = {
      porAnimal: +(costoPorAnimal * (1 + MARGEN_MINIMO)).toFixed(2),
      fibraPorKg: pesoFibraKg > 0
        ? +((costoPorAnimal * 0.6) / pesoFibraKg * (1 + MARGEN_MINIMO)).toFixed(2)
        : null,
      carnePorKg: pesoCarneLote > 0
        ? +((costoPorAnimal * 0.35 * numAnimales) / pesoCarneLote * (1 + MARGEN_MINIMO)).toFixed(2)
        : null,
    };

    res.json({
      message: 'Cálculo de costo integral',
      resultado: {
        costoTotal: +costoTotal.toFixed(2),
        costoPorAnimal: +costoPorAnimal.toFixed(2),
        precioSugerido,
        margenAplicado: `${MARGEN_MINIMO * 100}%`,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/costos
 */
const crear = async (req, res, next) => {
  try {
    const datos = req.body;
    // TODO: await prisma.registroCosto.create({ data: { ...datos, productorId: req.user.id } });
    res.status(201).json({ message: 'Registro de costo guardado', data: datos });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/costos/resumen
 */
const resumen = async (req, res, next) => {
  try {
    // TODO: Agregar costos históricos del productor por periodo
    res.json({
      message: 'Resumen de costos',
      data: {
        periodo: null,
        totalGastado: 0,
        promedioporAnimal: 0,
        comparativaAnterior: null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/costos/:id
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO: await prisma.registroCosto.delete({ where: { id } });
    res.json({ message: `Registro ${id} eliminado` });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, calcular, crear, resumen, eliminar };
