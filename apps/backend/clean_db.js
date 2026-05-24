const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧼 Iniciando limpieza de categorías de CARNE en la base de datos...');
  
  // 1. Eliminar publicaciones de tipo CARNE
  const deletedPubs = await prisma.publicacion.deleteMany({
    where: { categoria: 'CARNE' }
  });
  console.log(`Deleted ${deletedPubs.count} publicaciones de CARNE.`);

  // 2. Eliminar precios de referencia de CARNE
  const deletedPrecios = await prisma.precioReferencia.deleteMany({
    where: { tipo: 'CARNE' }
  });
  console.log(`Deleted ${deletedPrecios.count} precios de referencia de CARNE.`);

  // 3. Crear el lote secundario de fibra en caso no exista
  const productor = await prisma.productor.findFirst();
  if (productor) {
    const fiberSec = await prisma.publicacion.findFirst({
      where: { titulo: 'Lote Secundario: Fibra Suri Canela Orgánica' }
    });
    if (!fiberSec) {
      await prisma.publicacion.create({
        data: {
          productorId: productor.id,
          titulo: 'Lote Secundario: Fibra Suri Canela Orgánica',
          descripcion: 'Fibra de alpaca Suri de color canela natural, ideal para hilado artesanal.',
          categoria: 'FIBRA',
          cantidad: 10,
          unidad: 'kg',
          precioSolicitado: 25.0,
          estado: 'PAUSADA',
          aceptaOferta: true
        }
      });
      console.log('Created Lote Secundario de Fibra.');
    }
  }

  console.log('✨ Base de datos limpia de carne y actualizada con fibra.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
