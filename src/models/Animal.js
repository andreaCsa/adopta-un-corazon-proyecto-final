import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, sparse: true },
    nombre: { type: String, required: true, trim: true, maxlength: 60 },
    especie: { type: String, required: true, enum: ['Perro', 'Gato'] },
    raza: { type: String, trim: true, maxlength: 80, default: 'Mestizo' },
    edad: { type: Number, required: true, min: 0, max: 30 },
    descripcion: { type: String, trim: true, maxlength: 2000, default: '' },
    ciudad: { type: String, trim: true, maxlength: 80, default: '' },
    tamano: { type: String, enum: ['Pequeño', 'Mediano', 'Grande'], default: 'Mediano' },
    imagen: { type: String, default: '' },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model('Animal', schema);
