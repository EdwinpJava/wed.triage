export function requireAuth(req, res, next) {
  const sessionCookie = req.cookies?.session;

  if (sessionCookie !== 'tramed-demo-session') {
    return res.status(401).json({ message: 'Debe iniciar sesión para acceder.' });
  }

  req.user = {
    id: 'user-001',
    email: 'admin@tramed.local',
    name: 'Administrador demo',
    role: 'admin',
  };

  return next();
}

export function requireRole(role) {
  return (req, res, next) => {
    const currentRole = req.user?.role;

    if (currentRole === 'admin' || currentRole === role) {
      return next();
    }

    return res.status(403).json({ message: 'No tiene permisos para esta acción.' });
  };
}
