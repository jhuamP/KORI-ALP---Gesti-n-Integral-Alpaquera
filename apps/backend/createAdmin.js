const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@korialp.com';
  const password = 'admin'; // Contraseña sencilla requerida por el usuario
  const passwordHash = await bcrypt.hash(password, 10);

  // Check if admin exists
  let admin = await prisma.usuario.findUnique({ where: { email } });
  
  if (admin) {
    // update password
    admin = await prisma.usuario.update({
      where: { email },
      data: { passwordHash, rol: 'ADMIN' }
    });
    console.log('Admin user updated:', admin.email);
  } else {
    // create admin
    admin = await prisma.usuario.create({
      data: {
        email,
        nombre: 'Super Administrador',
        passwordHash,
        rol: 'ADMIN'
      }
    });
    console.log('Admin user created:', admin.email);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
