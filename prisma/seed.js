import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'admin', description: 'Administrador del sistema' },
    { name: 'enfermeria', description: 'Personal de enfermería' },
    { name: 'medico', description: 'Médico' },
    { name: 'observador', description: 'Observador autorizado' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  const adminPassword = await bcrypt.hash('Tramed123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tramed.local' },
    update: {},
    create: {
      email: 'admin@tramed.local',
      name: 'Administrador TRAMED',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });

  const enfermera = await prisma.user.upsert({
    where: { email: 'enfermeria@tramed.local' },
    update: {},
    create: {
      email: 'enfermeria@tramed.local',
      name: 'Enfermera Demo',
      passwordHash: await bcrypt.hash('Tramed123!', 10),
      role: 'enfermeria',
    },
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const enfermeriaRole = await prisma.role.findUnique({ where: { name: 'enfermeria' } });

  if (adminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: admin.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    });
  }

  if (enfermeriaRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: enfermera.id,
          roleId: enfermeriaRole.id,
        },
      },
      update: {},
      create: {
        userId: enfermera.id,
        roleId: enfermeriaRole.id,
      },
    });
  }

  await prisma.patient.upsert({
    where: { internalCode: 'TRM-1001' },
    update: {},
    create: {
      internalCode: 'TRM-1001',
      firstName: 'Ana',
      lastName: 'López',
      documentType: 'CC',
      documentNumber: '1001234567',
      phone: '3001234567',
      emergencyType: 'Urgente',
      reason: 'Dolor abdominal intenso y náuseas',
      status: 'pending',
      priority: 'urgent',
    },
  });

  await prisma.patient.upsert({
    where: { internalCode: 'TRM-1002' },
    update: {},
    create: {
      internalCode: 'TRM-1002',
      firstName: 'Carlos',
      lastName: 'Pérez',
      documentType: 'TI',
      documentNumber: '1098765432',
      phone: '3017654321',
      emergencyType: 'No urgente',
      reason: 'Dolor de cabeza leve',
      status: 'in_review',
      priority: 'normal',
    },
  });

  console.log('Seed ejecutado con roles y usuarios demo.');
}

main()
  .catch((error) => {
    console.error('Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
