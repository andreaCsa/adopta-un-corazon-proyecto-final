import mongoose from 'mongoose';
import Solicitud from '../models/Solicitud.js';
import Animal from '../models/Animal.js';
import { HttpError } from '../utils/http.js';
export async function getSolicitudes(req, res) {
  const filter = req.user.role === 'admin' ? {} : { usuario: req.user._id };
  res.json(
    await Solicitud.find(filter)
      .populate('usuario', 'name email')
      .populate('animal')
      .sort({ createdAt: -1 }),
  );
}
export async function createSolicitud(req, res) {
  if (typeof req.body.animal !== 'string' || !mongoose.isObjectIdOrHexString(req.body.animal))
    throw new HttpError(400, 'El animal indicado no es válido.');
  const mensaje = typeof req.body.mensaje === 'string' ? req.body.mensaje.trim() : '';
  if (mensaje.length < 20 || mensaje.length > 1500 || req.body.compromiso !== true)
    throw new HttpError(400, 'Cuéntanos sobre ti (20–1500 caracteres) y confirma tu compromiso.');
  let request;
  await mongoose.connection.transaction(async (session) => {
    // Se escribe el animal para serializar una solicitud con su posible adopción o eliminación.
    const animal = await Animal.findOneAndUpdate(
      { _id: req.body.animal, disponible: true },
      { $set: { updatedAt: new Date() } },
      { session, new: true },
    );
    if (!animal) throw new HttpError(409, 'Este animal ya no está disponible.');
    [request] = await Solicitud.create([{ usuario: req.user._id, animal: animal._id, mensaje }], {
      session,
    });
  });
  res.status(201).json(request);
}
export async function updateSolicitudEstado(req, res) {
  const { estado } = req.body;
  if (!['aprobada', 'rechazada'].includes(estado))
    throw new HttpError(400, 'Elige aprobar o rechazar la solicitud.');
  await mongoose.connection.transaction(async (session) => {
    const request = await Solicitud.findOne({ _id: req.params.id, estado: 'pendiente' }).session(
      session,
    );
    if (!request) throw new HttpError(409, 'La solicitud ya se ha resuelto o no existe.');
    if (estado === 'aprobada') {
      const animal = await Animal.findOneAndUpdate(
        { _id: request.animal, disponible: true },
        { disponible: false },
        { session, new: true },
      );
      if (!animal) throw new HttpError(409, 'Este animal ya tiene una adopción aprobada.');
      await Solicitud.updateMany(
        { animal: request.animal, _id: { $ne: request._id }, estado: 'pendiente' },
        { estado: 'rechazada' },
        { session },
      );
    }
    request.estado = estado;
    await request.save({ session });
  });
  res.json({ message: 'Solicitud actualizada.' });
}
