import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';
try {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Andrea' } = process.env;
  if (
    !ADMIN_EMAIL ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL) ||
    !ADMIN_PASSWORD ||
    ADMIN_PASSWORD.length < 8 ||
    Buffer.byteLength(ADMIN_PASSWORD) > 72
  )
    throw new Error('Configura ADMIN_EMAIL y ADMIN_PASSWORD válidos en .env.');
  await connectDB();
  if (await User.exists({ email: ADMIN_EMAIL.trim().toLowerCase() }))
    throw new Error(
      'La cuenta ya existe. Este comando no cambia contraseñas ni roles de cuentas existentes.',
    );
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: 'admin',
  });
  console.log('Cuenta de administración creada.');
} catch (error) {
  console.error(error.code === 11000 ? 'La cuenta ya existe.' : error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
