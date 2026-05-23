/**
 * Constantes compartidas entre todos los módulos de KORI ALP
 */

// Categorías de producto
const CATEGORIAS = {
  FIBRA: 'FIBRA',
  CARNE: 'CARNE',
  CUERO: 'CUERO',
  ABONO: 'ABONO',
};

// Calidades de fibra de alpaca (por micras)
const CALIDAD_FIBRA = {
  BABY_ALPACA: { label: 'Baby Alpaca', micras: '< 22μ', precioReferencia: 'S/. 35-50/kg' },
  FLEECE: { label: 'Fleece', micras: '22-25μ', precioReferencia: 'S/. 20-35/kg' },
  MEDIUM_FLEECE: { label: 'Medium Fleece', micras: '25-28μ', precioReferencia: 'S/. 12-20/kg' },
  HUARIZO: { label: 'Huarizo', micras: '28-31μ', precioReferencia: 'S/. 8-12/kg' },
  GRUESA: { label: 'Gruesa', micras: '> 31μ', precioReferencia: 'S/. 5-8/kg' },
};

// Razas de alpaca
const RAZAS = {
  HUACAYA: 'Huacaya',
  SURI: 'Suri',
};

// Regiones alpaqueras del Perú
const REGIONES_ALPAQUERAS = [
  'Puno', 'Macusani', 'Carabaya', 'Mazocruz',
  'Arequipa', 'Cusco', 'Junín', 'Huancavelica',
  'Ayacucho', 'Apurímac',
];

// Margen mínimo sugerido para el precio justo
const MARGEN_MINIMO = 0.30;

module.exports = {
  CATEGORIAS,
  CALIDAD_FIBRA,
  RAZAS,
  REGIONES_ALPAQUERAS,
  MARGEN_MINIMO,
};
