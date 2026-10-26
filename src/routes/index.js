import express from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    await prisma.$connect();
    next();
  } catch (error) {
    return res.status(503).json({ message: 'La base de datos no está disponible.' });
  }
});

router.get('/dashboard', requireAuth, requireRole('admin', 'medico', 'enfermeria'), async (req, res) => {
  try {
    const [totalPatients, pending, urgent, alerts] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.count({ where: { status: 'pending' } }),
      prisma.patient.count({ where: { priority: 'urgent' } }),
      prisma.alert.count(),
    ]);

    return res.json({
      ok: true,
      service: 'dashboard',
      stats: {
        totalPatients,
        pending,
        urgent,
        alerts,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Dashboard query error:', error);
    return res.status(500).json({ message: 'No se pudo cargar el dashboard.' });
  }
});

router.get('/patients', requireAuth, requireRole('admin', 'medico', 'enfermeria'), async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { arrivalAt: 'desc' },
      take: 20,
      select: {
        id: true,
        internalCode: true,
        firstName: true,
        lastName: true,
        emergencyType: true,
        reason: true,
        status: true,
        priority: true,
        arrivalAt: true,
      },
    });

    return res.json({
      ok: true,
      data: patients,
      pagination: {
        page: 1,
        pageSize: 20,
        total: patients.length,
      },
    });
  } catch (error) {
    console.error('Patients query error:', error);
    return res.status(500).json({ message: 'No se pudo consultar la lista de pacientes.' });
  }
});

export default router;
