import express from 'express';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use(authRoutes);
router.use('/auth', authRoutes);

router.get('/dashboard', (req, res) => {
  res.json({
    ok: true,
    service: 'dashboard',
    stats: {
      totalPatients: 24,
      pending: 8,
      urgent: 3,
      alerts: 2,
    },
    generatedAt: new Date().toISOString(),
  });
});

router.get('/patients', (req, res) => {
  res.json({
    ok: true,
    data: [],
    pagination: { page: 1, pageSize: 20, total: 0 },
  });
});

export default router;
