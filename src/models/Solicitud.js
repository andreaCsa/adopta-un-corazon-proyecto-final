import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, sparse: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
    mensaje: { type: String, required: true, minlength: 20, maxlength: 1500 },
    estado: { type: String, enum: ['pendiente', 'aprobada', 'rechazada'], default: 'pendiente' },
  },
  { timestamps: true },
);
// Una persona no puede duplicar su solicitud para el mismo animal.
schema.index({ usuario: 1, animal: 1 }, { unique: true });
export default mongoose.model('Solicitud', schema);
