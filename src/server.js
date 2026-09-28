import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres aleatorios.');
await connectDB();
const server = createApp().listen(process.env.PORT || 3001, () => console.log('API preparada.'));
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () =>
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    }),
  );
