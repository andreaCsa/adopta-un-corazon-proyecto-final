import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncRoute, HttpError } from '../utils/http.js';
export const protect = asyncRoute(async (req, res, next) => {
  const match = req.headers.authorization?.match(/^Bearer ([^ ]+)$/);
  if (!match) throw new HttpError(401, 'Inicia sesión para continuar.');
  let payload;
  try {
    payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    throw new HttpError(401, 'Tu sesión ha caducado. Vuelve a entrar.');
  }
  req.user = await User.findById(payload.id);
  if (!req.user) throw new HttpError(401, 'Esta cuenta ya no está disponible.');
  next();
});
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return next(new HttpError(403, 'Esta acción requiere una cuenta de administración.'));
  next();
};
