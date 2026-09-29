import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/seed/importData.js';

// Las cuentas ficticias del Excel no usan una contraseña pública en producción.
// La semilla conserva los registros existentes cuando se vuelve a ejecutar.
try {
  await connectDB();
  console.log('Datos de ejemplo preparados:', await seedDatabase(randomBytes(32).toString('hex')));
} catch {
  console.error('No se han podido importar los datos. Comprueba la conexión y los CSV.');
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
