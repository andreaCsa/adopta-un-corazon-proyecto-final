import mongoose from 'mongoose';
export async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) throw new Error('Falta MONGO_URI. Consulta .env.example.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Base de datos conectada.');
}
