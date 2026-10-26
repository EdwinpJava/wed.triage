import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().trim().email('Debe ingresar un correo válido.'),
  password: z.string().min(6, 'La contraseña es obligatoria.'),
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body ?? {});
    const email = parsed.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const validPassword = await bcrypt.compare(parsed.password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      env.sessionSecret,
      { expiresIn: '8h' },
    );

    res.cookie('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.nodeEnv === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      message: 'Inicio de sesión exitoso.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Datos inválidos.' });
    }

    console.error('Login error:', error);
    return res.status(500).json({ message: 'No se pudo iniciar sesión en este momento.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
  });

  return res.json({ ok: true, message: 'Sesión cerrada.' });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.json({ ok: true, user });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'No se pudo obtener la sesión.' });
  }
});

export default router;
