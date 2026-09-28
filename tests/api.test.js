import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import User from '../src/models/User.js';
import Animal from '../src/models/Animal.js';
import Solicitud from '../src/models/Solicitud.js';
import { seedDatabase } from '../src/seed/importData.js';
let db, server, base, adminToken, userToken, userId;
const password = 'PruebaCorazon2026!';
async function request(path, method = 'GET', body, token) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, data: response.status === 204 ? null : await response.json() };
}
before(
  async () => {
    process.env.JWT_SECRET = randomBytes(48).toString('hex');
    db = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
    await mongoose.connect(db.getUri());
    await Promise.all([User.init(), Animal.init(), Solicitud.init()]);
    server = createApp().listen(0, '127.0.0.1');
    await once(server, 'listening');
    base = `http://127.0.0.1:${server.address().port}/api`;
    const admin = await User.create({
      name: 'Administradora',
      email: 'admin@example.org',
      password: await bcrypt.hash(password, 10),
      role: 'admin',
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  },
  { timeout: 180000 },
);
after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (db) await db.stop();
});
test('Registro normaliza email, cifra contraseña y no permite asignarse rol admin', async () => {
  const r = await request('/users/register', 'POST', {
    name: 'Andrea prueba',
    email: '  ANDREA@EXAMPLE.ORG ',
    password,
    role: 'admin',
  });
  assert.equal(r.status, 201);
  assert.equal(r.data.user.role, 'user');
  assert.equal(r.data.user.email, 'andrea@example.org');
  assert.ok(!r.data.user.password);
  userToken = r.data.token;
  userId = r.data.user.id;
  const saved = await User.findById(userId).select('+password');
  assert.notEqual(saved.password, password);
  assert.ok(await bcrypt.compare(password, saved.password));
  assert.equal(
    (
      await request('/users/register', 'POST', {
        name: 'Otra cuenta',
        email: 'andrea@example.org',
        password,
      })
    ).status,
    409,
  );
});
test('Login, validación y sesión caducada devuelven errores correctos', async () => {
  assert.equal(
    (await request('/users/login', 'POST', { email: 'ANDREA@example.org', password })).status,
    200,
  );
  assert.equal(
    (await request('/users/login', 'POST', { email: 'andrea@example.org', password: 'incorrecta' }))
      .status,
    401,
  );
  assert.equal(
    (await request('/users/register', 'POST', { name: 'A', email: 'sin-email', password: '123' }))
      .status,
    400,
  );
  assert.equal(
    (await request('/users/login', 'POST', { email: { $ne: null }, password })).status,
    400,
  );
  const expired = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: -1 });
  assert.equal((await request('/users/me', 'GET', null, expired)).status, 401);
  assert.equal((await request('/users/me', 'GET', null, userToken)).data.name, 'Andrea prueba');
});
test('Catálogo público y CRUD protegido por rol con validación', async () => {
  assert.equal((await request('/animales')).status, 200);
  assert.equal(
    (await request('/animales', 'POST', { nombre: 'Sol', especie: 'Perro', edad: 2 })).status,
    401,
  );
  assert.equal(
    (await request('/animales', 'POST', { nombre: 'Sol', especie: 'Perro', edad: 2 }, userToken))
      .status,
    403,
  );
  const r = await request(
    '/animales',
    'POST',
    { nombre: 'Sol', especie: 'Perro', edad: 2 },
    adminToken,
  );
  assert.equal(r.status, 201);
  assert.equal(
    (await request(`/animales/${r.data._id}`, 'PUT', { edad: -2 }, adminToken)).status,
    400,
  );
  assert.equal(
    (
      await request(
        `/animales/${r.data._id}`,
        'PUT',
        { descripcion: 'Le encantan los paseos.' },
        adminToken,
      )
    ).data.descripcion,
    'Le encantan los paseos.',
  );
  assert.equal((await request(`/animales/${r.data._id}`, 'DELETE', null, adminToken)).status, 204);
  assert.equal((await request('/animales/no-es-un-id')).status, 400);
});
test('Solicitudes privadas, referencias válidas, duplicados y aprobación coherente', async () => {
  const animal = await Animal.create({ nombre: 'Nube', especie: 'Gato', edad: 2 });
  const body = {
    animal: String(animal._id),
    mensaje: 'Tengo tiempo para sus cuidados diarios y quiero conocerlo.',
    compromiso: true,
  };
  assert.equal(
    (await request('/solicitudes', 'POST', { ...body, compromiso: false }, userToken)).status,
    400,
  );
  assert.equal(
    (
      await request(
        '/solicitudes',
        'POST',
        { ...body, animal: String(new mongoose.Types.ObjectId()) },
        userToken,
      )
    ).status,
    409,
  );
  assert.equal(
    (await request('/solicitudes', 'POST', { ...body, animal: { $ne: null } }, userToken)).status,
    400,
  );
  const a = await request('/solicitudes', 'POST', body, userToken);
  assert.equal(a.status, 201);
  assert.equal((await request('/solicitudes', 'POST', body, userToken)).status, 409);
  const other = await request('/users/register', 'POST', {
    name: 'Otro usuario',
    email: 'other@example.org',
    password,
  });
  assert.equal((await request('/solicitudes', 'GET', null, other.data.token)).data.length, 0);
  const b = await request('/solicitudes', 'POST', body, other.data.token);
  assert.equal(b.status, 201);
  assert.equal(
    (await request(`/solicitudes/${a.data._id}`, 'PATCH', { estado: 'aprobada' }, userToken))
      .status,
    403,
  );
  assert.equal(
    (await request(`/solicitudes/${a.data._id}`, 'PATCH', { estado: 'inventado' }, adminToken))
      .status,
    400,
  );
  assert.equal((await request(`/animales/${animal._id}`, 'DELETE', null, adminToken)).status, 409);
  assert.equal(
    (await request(`/solicitudes/${a.data._id}`, 'PATCH', { estado: 'aprobada' }, adminToken))
      .status,
    200,
  );
  assert.equal((await Animal.findById(animal._id)).disponible, false);
  assert.equal((await Solicitud.findById(b.data._id)).estado, 'rechazada');
  assert.equal(
    (await request(`/solicitudes/${b.data._id}`, 'PATCH', { estado: 'aprobada' }, adminToken))
      .status,
    409,
  );
});
test('Dos aprobaciones simultáneas no pueden adoptar dos veces al mismo animal', async () => {
  const animal = await Animal.create({ nombre: 'Mora', especie: 'Perro', edad: 4 });
  const another = await User.findOne({ email: 'other@example.org' });
  const requests = await Solicitud.create([
    { usuario: userId, animal: animal._id, mensaje: 'Primera solicitud de ejemplo válida.' },
    { usuario: another._id, animal: animal._id, mensaje: 'Segunda solicitud de ejemplo válida.' },
  ]);
  const outcomes = await Promise.all(
    requests.map((s) =>
      request(`/solicitudes/${s._id}`, 'PATCH', { estado: 'aprobada' }, adminToken),
    ),
  );
  assert.deepEqual(outcomes.map((r) => r.status).sort(), [200, 409]);
  assert.equal(await Solicitud.countDocuments({ animal: animal._id, estado: 'aprobada' }), 1);
});
test('La semilla importa las tres colecciones y repetirla conserva datos y estados', async () => {
  assert.deepEqual(await seedDatabase(password), { animales: 100, usuarios: 30, solicitudes: 40 });
  const animal = await Animal.findOne({ codigo: 'ANI-001' });
  animal.descripcion = 'Texto editado después de importar';
  await animal.save();
  const counts = await Promise.all([
    Animal.countDocuments(),
    User.countDocuments(),
    Solicitud.countDocuments(),
  ]);
  await seedDatabase(password);
  assert.deepEqual(
    await Promise.all([Animal.countDocuments(), User.countDocuments(), Solicitud.countDocuments()]),
    counts,
  );
  assert.equal(
    (await Animal.findOne({ codigo: 'ANI-001' })).descripcion,
    'Texto editado después de importar',
  );
  const populated = await Solicitud.findOne({ codigo: 'SOL-001' }).populate('usuario animal');
  assert.equal(populated.usuario.codigo, 'USR-001');
  assert.equal(populated.animal.codigo, 'ANI-001');
});
