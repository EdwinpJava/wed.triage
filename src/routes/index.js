import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
  }

  const demoUser = {
    id: 'user-001',
    email,
    name: 'Administrador demo',
    role: 'admin',
  };

  res.cookie('session', 'tramed-demo-session', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });

  return res.json({
    ok: true,
    message: 'Inicio de sesión exitoso.',
    user: demoUser,
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('session');
  return res.json({ ok: true, message: 'Sesión cerrada.' });
});

router.get('/me', (req, res) => {
  const sessionCookie = req.cookies?.session;

  if (sessionCookie !== 'tramed-demo-session') {
    return res.status(401).json({ message: 'No autenticado.' });
  }

  return res.json({
    ok: true,
    user: {
      id: 'user-001',
      email: 'admin@tramed.local',
      name: 'Administrador demo',
      role: 'admin',
    },
  });
});

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
