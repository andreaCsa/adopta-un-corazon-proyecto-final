import mongoose from 'mongoose';
import Animal from '../models/Animal.js';
import Solicitud from '../models/Solicitud.js';
import { HttpError } from '../utils/http.js';
function animalInput(body) {
  const fields = ['nombre', 'especie', 'raza', 'edad', 'descripcion', 'ciudad', 'tamano', 'imagen'];
  const data = Object.fromEntries(
    fields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]),
  );
  for (const [key, value] of Object.entries(data)) {
    if (key === 'edad') {
      if (typeof value !== 'number' || !Number.isFinite(value))
        throw new HttpError(400, 'La edad debe ser un número.');
    } else if (typeof value !== 'string') throw new HttpError(400, 'Revisa los datos del animal.');
  }
  if (
    data.imagen &&
    !/^https:\/\//.test(data.imagen) &&
    !/^\/media\/[a-zA-Z0-9._-]+$/.test(data.imagen)
  )
    throw new HttpError(400, 'La imagen debe ser una URL HTTPS.');
  return data;
}
export async function getAnimals(req, res) {
  res.json(await Animal.find().sort({ codigo: 1, createdAt: -1 }));
}
export async function getAnimalById(req, res) {
  const animal = await Animal.findById(req.params.id);
  if (!animal) throw new HttpError(404, 'No encontramos ese animal.');
  res.json(animal);
}
export async function createAnimal(req, res) {
  res.status(201).json(await Animal.create(animalInput(req.body)));
}
export async function updateAnimal(req, res) {
  const animal = await Animal.findByIdAndUpdate(req.params.id, animalInput(req.body), {
    new: true,
    runValidators: true,
  });
  if (!animal) throw new HttpError(404, 'No encontramos ese animal.');
  res.json(animal);
}
export async function deleteAnimal(req, res) {
  // La transacción impide dejar solicitudes apuntando a un animal eliminado.
  await mongoose.connection.transaction(async (session) => {
    if (await Solicitud.exists({ animal: req.params.id }).session(session))
      throw new HttpError(409, 'Este animal tiene solicitudes y debe conservarse en el historial.');
    const animal = await Animal.findByIdAndDelete(req.params.id, { session });
    if (!animal) throw new HttpError(404, 'No encontramos ese animal.');
  });
  res.status(204).end();
}
