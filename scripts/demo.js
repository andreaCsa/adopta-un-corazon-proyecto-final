import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { seedDatabase } from '../src/seed/importData.js';
import User from '../src/models/User.js';
// Base aislada y temporal: no lee MONGO_URI ni modifica la base de datos remota.
const db = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
process.env.JWT_SECRET = randomBytes(48).toString('hex');
process.env.FRONTEND_URL = 'http://127.0.0.1:5173,http://localhost:5173';
process.env.TRUST_PROXY = '0';
await mongoose.connect(db.getUri());
await seedDatabase('DemoCorazon2026!');
await User.create({
  name: 'Andrea · Demo',
  email: 'admin@example.org',
  password: await bcrypt.hash('DemoCorazon2026!', 12),
  role: 'admin',
});
const server = createApp().listen(3001, '127.0.0.1', () => {
  console.log('Demo local en http://127.0.0.1:3001');
  console.log('Administración: admin@example.org / DemoCorazon2026!');
  console.log('Usuario: adoptante1@example.org / DemoCorazon2026!');
  console.log('Los datos se pierden al cerrar este proceso. Ejecuta el frontend en otra terminal.');
});
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () =>
    server.close(async () => {
      await mongoose.disconnect();
      await db.stop();
      process.exit(0);
    }),
  );
