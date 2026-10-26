import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import apiRoutes from './routes/index.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = env.corsOrigin.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.sessionSecret));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas solicitudes. Intente más tarde.' },
});

app.use('/api', apiLimiter);
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'TRAMED API',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicDir, 'dashboard.html'));
});

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: 'Endpoint no encontrado.' });
    return;
  }

  res.status(404).send('Página no encontrada.');
});

export { app };
