import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.session;

  if (!token) {
    return res.status(401).json({ message: 'Debe iniciar sesión para acceder.' });
  }

  try {
    const decoded = jwt.verify(token, env.sessionSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Sesión inválida o expirada.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const currentRole = req.user?.role;

    if (!currentRole) {
      return res.status(401).json({ message: 'No autenticado.' });
    }

    if (currentRole === 'admin' || allowedRoles.includes(currentRole)) {
      return next();
    }

    return res.status(403).json({ message: 'No tiene permisos para esta acción.' });
  };
}
