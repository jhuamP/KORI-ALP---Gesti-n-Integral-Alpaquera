const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando la inyección de datos de prueba para Kori Alp...');

  const passwordHash = await bcrypt.hash('123456', 10);

  // ==========================================
  // 1. USUARIOS Y PERFILES
  // ==========================================
  console.log('Creando Vendedor (Productor)...');
  let vendedorUser = await prisma.usuario.findUnique({ where: { email: 'vendedor@korialp.com' }});
  if (!vendedorUser) {
    vendedorUser = await prisma.usuario.create({
      data: {
        email: 'vendedor@korialp.com',
        passwordHash,
        nombre: 'Juan Mamani (Comunidad Puno)',
        rol: 'PRODUCTOR'
      }
    });
  }

  let productor = await prisma.productor.findUnique({ where: { usuarioId: vendedorUser.id }});
  if (!productor) {
    productor = await prisma.productor.create({
      data: {
        usuarioId: vendedorUser.id,
        region: 'Puno',
        comunidad: 'Comunidad Kori',
        dni: '87654321',
        totalAlpacas: 3
      }
    });
  }

  console.log('Creando Comprador...');
  let compradorUser = await prisma.usuario.findUnique({ where: { email: 'comprador@korialp.com' }});
  if (!compradorUser) {
    compradorUser = await prisma.usuario.create({
      data: {
        email: 'comprador@korialp.com',
        passwordHash,
        nombre: 'Textiles del Sur S.A.C.',
        rol: 'COMPRADOR'
      }
    });
  }

  let comprador = await prisma.comprador.findFirst({ where: { usuarioId: compradorUser.id }});
  if (!comprador) {
    comprador = await prisma.comprador.create({
      data: {
        usuarioId: compradorUser.id,
        nombre: 'Textiles del Sur S.A.C.',
        tipo: 'TEXTIL',
        region: 'Arequipa',
        isVerificado: true
      }
    });
  }

  // ==========================================
  // 2. INVENTARIO (ALPACAS)
  // ==========================================
  console.log('Generando Inventario (Alpacas)...');
  const alpacasCount = await prisma.alpaca.count({ where: { productorId: productor.id }});
  let alpaca1, alpaca2;
  if (alpacasCount === 0) {
    alpaca1 = await prisma.alpaca.create({
      data: {
        productorId: productor.id,
        arete: 'KORI-001',
        raza: 'HUACAYA',
        sexo: 'MACHO',
        edadMeses: 24,
        pesoVivoKg: 65.5,
        calidadFibra: 'BABY_ALPACA',
        micrones: 20.5,
        estado: 'ACTIVO',
        notas: 'Alpaca campeona regional 2023.'
      }
    });

    alpaca2 = await prisma.alpaca.create({
      data: {
        productorId: productor.id,
        arete: 'KORI-002',
        raza: 'SURI',
        sexo: 'HEMBRA',
        edadMeses: 36,
        pesoVivoKg: 55.0,
        calidadFibra: 'FLEECE',
        micrones: 24.0,
        estado: 'ACTIVO',
        notas: 'Excelente madre, fibra sedosa.'
      }
    });
  } else {
    alpaca1 = await prisma.alpaca.findFirst({ where: { productorId: productor.id } });
    alpaca2 = alpaca1; // Fallback
  }

  // ==========================================
  // 3. PRECIOS DE REFERENCIA OFICIALES
  // ==========================================
  console.log('Verificando Precios de Referencia...');
  const precioCount = await prisma.precioReferencia.count();
  if (precioCount === 0) {
    await prisma.precioReferencia.createMany({
      data: [
        { tipo: 'FIBRA', subCategoria: 'Baby Alpaca', precioMin: 45, precioMax: 55, precioPromedio: 50, unidad: 'kg' },
        { tipo: 'FIBRA', subCategoria: 'Fleece', precioMin: 30, precioMax: 40, precioPromedio: 35, unidad: 'kg' },
        { tipo: 'FIBRA', subCategoria: 'Huarizo', precioMin: 20, precioMax: 30, precioPromedio: 25, unidad: 'kg' }
      ]
    });
  }

  // ==========================================
  // 4. PUBLICACIONES (LOTES DE VENTA)
  // ==========================================
  console.log('Generando Lotes (Publicaciones)...');
  const pubCount = await prisma.publicacion.count({ where: { productorId: productor.id }});
  let pubActiva1;
  if (pubCount === 0) {
    pubActiva1 = await prisma.publicacion.create({
      data: {
        productorId: productor.id,
        titulo: 'Lote Premium: Baby Alpaca Huacaya Blanca',
        descripcion: 'Fibra de primera esquila, extra suave. Ideal para alta costura.',
        categoria: 'FIBRA',
        cantidad: 15.5,
        unidad: 'kg',
        precioSolicitado: 50.0,
        estado: 'ACTIVA',
        aceptaOferta: true,
        vistas: 45
      }
    });

    await prisma.publicacion.create({
      data: {
        productorId: productor.id,
        titulo: 'Lote Secundario: Fibra Suri Canela Orgánica',
        descripcion: 'Fibra de alpaca Suri de color canela natural, ideal para hilado artesanal.',
        categoria: 'FIBRA',
        cantidad: 10,
        unidad: 'kg',
        precioSolicitado: 25.0,
        estado: 'PAUSADA', // Pendiente de revisión por Admin
        aceptaOferta: true
      }
    });
  } else {
    pubActiva1 = await prisma.publicacion.findFirst({ where: { productorId: productor.id, estado: 'ACTIVA' }});
  }

  // ==========================================
  // 5. SOLICITUDES DE COMPRA Y TRANSACCIONES
  // ==========================================
  if (pubActiva1) {
    console.log('Generando Solicitudes de Compra y Transacciones...');
    const solCount = await prisma.solicitudCompra.count({ where: { publicacionId: pubActiva1.id }});
    if (solCount === 0) {
      // Solicitud en curso
      await prisma.solicitudCompra.create({
        data: {
          publicacionId: pubActiva1.id,
          nombreComprador: comprador.nombre,
          telefono: '987654321',
          email: compradorUser.email,
          metodoPago: 'Transferencia',
          cantidadSolicitada: 5,
          notas: 'Estoy muy interesado en este lote. ¿Es posible enviar una muestra?',
          estado: 'PENDIENTE'
        }
      });
      
      // Historial (Transacción Cerrada)
      await prisma.solicitudCompra.create({
        data: {
          publicacionId: pubActiva1.id,
          nombreComprador: 'Inversiones Gastronómicas EIRL',
          telefono: '999888777',
          email: 'contacto@gastro.com',
          metodoPago: 'Efectivo',
          cantidadSolicitada: 10,
          notas: 'Compra concretada con éxito.',
          estado: 'APROBADA' // Simula venta completada
        }
      });
    }
  }

  console.log('✅ ¡Base de datos poblada con éxito!');
  console.log('====================================');
  console.log('Credenciales generadas:');
  console.log('VENDEDOR: vendedor@korialp.com / 123456');
  console.log('COMPRADOR: comprador@korialp.com / 123456');
  console.log('ADMIN: admin@korialp.com / admin (ya existía)');
  console.log('====================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
