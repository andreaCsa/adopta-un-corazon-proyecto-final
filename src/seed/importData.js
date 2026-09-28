import 'dotenv/config';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Animal from '../models/Animal.js';
import Solicitud from '../models/Solicitud.js';
import { connectDB } from '../config/db.js';
const dataDirectory = new URL('../../data/csv/', import.meta.url);
async function readCsv(name) {
  const rows = [];
  const stream = fs
    .createReadStream(new URL(`${name}.csv`, dataDirectory))
    .pipe(csv({ separator: ';' }));
  for await (const row of stream) rows.push(row);
  return rows;
}
export async function readDataset() {
  const [animals, users, requests] = await Promise.all(
    ['animales', 'usuarios', 'solicitudes'].map(readCsv),
  );
  const data = {
    animals: animals.map((a) => ({
      ...a,
      edad: a.edad.trim() === '' ? NaN : Number(a.edad),
      disponible: a.disponible.toLowerCase() === 'true',
    })),
    users,
    requests,
  };
  for (const [name, rows] of Object.entries(data)) {
    if (!rows.length) throw new Error(`El CSV de ${name} está vacío.`);
    const codes = rows.map((r) => r.codigo);
    if (codes.some((c) => !c) || new Set(codes).size !== codes.length)
      throw new Error(`Códigos ausentes o repetidos en ${name}.`);
  }
  if (animals.length < 100)
    throw new Error('Se necesitan al menos 100 animales para esta entrega.');
  const animalCodes = new Set(animals.map((a) => a.codigo)),
    userCodes = new Set(users.map((u) => u.codigo));
  for (const a of data.animals) {
    const issue = new Animal(a).validateSync();
    if (issue) throw new Error(`Revisa el animal ${a.codigo}: ${issue.message}`);
  }
  if (animals.some((a) => !['true', 'false'].includes(a.disponible.toLowerCase())))
    throw new Error('disponible debe ser true o false.');
  const emails = users.map((u) => u.email.toLowerCase().trim());
  if (new Set(emails).size !== emails.length) throw new Error('Hay emails repetidos.');
  for (const u of users) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email))
      throw new Error(`Email inválido: ${u.codigo}.`);
    const issue = new User({ ...u, password: 'validacion-sin-login', role: 'user' }).validateSync();
    if (issue) throw new Error(`Revisa el usuario ${u.codigo}.`);
  }
  const pairs = new Set();
  for (const r of requests) {
    if (!animalCodes.has(r.animal_codigo) || !userCodes.has(r.usuario_codigo))
      throw new Error(`Referencia inexistente en ${r.codigo}.`);
    if (r.estado !== 'pendiente' || r.mensaje.length < 20 || r.mensaje.length > 1500)
      throw new Error(
        `Revisa el estado o mensaje de ${r.codigo}. La semilla usa solicitudes pendientes.`,
      );
    const pair = `${r.usuario_codigo}/${r.animal_codigo}`;
    if (pairs.has(pair)) throw new Error(`Solicitud duplicada: ${pair}.`);
    pairs.add(pair);
  }
  return data;
}
export async function seedDatabase(password) {
  const data = await readDataset();
  if (!password || password.length < 8 || Buffer.byteLength(password) > 72)
    throw new Error('Configura SEED_PASSWORD: entre 8 caracteres y 72 bytes.');
  await Promise.all([User.init(), Animal.init(), Solicitud.init()]);
  const hash = await bcrypt.hash(password, 12);
  // Una única transacción: si falla una referencia no queda una importación a medias.
  await mongoose.connection.transaction(async (session) => {
    for (const a of data.animals)
      await Animal.updateOne({ codigo: a.codigo }, { $setOnInsert: a }, { upsert: true, session });
    for (const u of data.users)
      await User.updateOne(
        { codigo: u.codigo },
        { $setOnInsert: { ...u, password: hash, role: 'user' } },
        { upsert: true, session },
      );
    const animals = new Map(
      (
        await Animal.find({ codigo: { $in: data.animals.map((a) => a.codigo) } }).session(session)
      ).map((a) => [a.codigo, a._id]),
    );
    const users = new Map(
      (await User.find({ codigo: { $in: data.users.map((u) => u.codigo) } }).session(session)).map(
        (u) => [u.codigo, u._id],
      ),
    );
    for (const r of data.requests)
      await Solicitud.updateOne(
        { codigo: r.codigo },
        {
          $setOnInsert: {
            codigo: r.codigo,
            usuario: users.get(r.usuario_codigo),
            animal: animals.get(r.animal_codigo),
            estado: r.estado,
            mensaje: r.mensaje,
          },
        },
        { upsert: true, session },
      );
  });
  return {
    animales: data.animals.length,
    usuarios: data.users.length,
    solicitudes: data.requests.length,
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.includes('--check')) {
      const d = await readDataset();
      console.log(
        'CSV válidos:',
        Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.length])),
      );
    } else {
      await connectDB();
      console.log('Importación completada:', await seedDatabase(process.env.SEED_PASSWORD));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
