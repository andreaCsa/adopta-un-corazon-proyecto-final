import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/http.js';
export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
const session = (user) => ({
  token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '8h',
  }),
  user: publicUser(user),
});
function credentials(body) {
  if (typeof body.email !== 'string' || typeof body.password !== 'string')
    throw new HttpError(400, 'Introduce tu email y contraseña.');
  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    throw new HttpError(400, 'Introduce un email válido.');
  if (Buffer.byteLength(body.password, 'utf8') > 72)
    throw new HttpError(400, 'La contraseña es demasiado larga (máximo 72 bytes).');
  return { email, password: body.password };
}
export async function registerUser(req, res) {
  const { email, password } = credentials(req.body);
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (name.length < 2 || name.length > 80)
    throw new HttpError(400, 'El nombre debe tener entre 2 y 80 caracteres.');
  if (password.length < 8)
    throw new HttpError(400, 'La contraseña debe tener al menos 8 caracteres.');
  if (await User.exists({ email }))
    throw new HttpError(409, 'Ya existe una cuenta con ese email. Puedes iniciar sesión.');
  // El rol nunca se toma del formulario de registro.
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'user',
  });
  res.status(201).json(session(user));
}
export async function loginUser(req, res) {
  const { email, password } = credentials(req.body);
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new HttpError(401, 'El email o la contraseña no coinciden.');
  res.json(session(user));
}
