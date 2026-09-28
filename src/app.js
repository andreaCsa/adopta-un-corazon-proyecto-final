import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import animalRoutes from './routes/animalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import { errorHandler, HttpError } from './utils/http.js';
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  const origins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((v) => v.trim());
  app.use(cors({ origin: (origin, cb) => cb(null, !origin || origins.includes(origin)) }));
  app.use(express.json({ limit: '32kb' }));
  app.use((req, res, next) => {
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) &&
      (!req.body || typeof req.body !== 'object' || Array.isArray(req.body))
    )
      return next(new HttpError(400, 'Envía un objeto JSON válido.'));
    next();
  });
  app.get('/api/health', (req, res) =>
    res
      .status(mongoose.connection.readyState === 1 ? 200 : 503)
      .json({ ok: mongoose.connection.readyState === 1 }),
  );
  app.use('/api/users', userRoutes);
  app.use('/api/animales', animalRoutes);
  app.use('/api/solicitudes', solicitudRoutes);
  app.use((req, res, next) => next(new HttpError(404, 'Esta ruta no existe.')));
  app.use(errorHandler);
  return app;
}
