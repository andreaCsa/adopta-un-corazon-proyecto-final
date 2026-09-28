import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../config/api';
import { ErrorMessage } from './Feedback';
export default function AnimalForm({ animal }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    body.edad = Number(body.edad);
    try {
      const saved = await api(`/animales${animal ? `/${animal._id}` : ''}`, {
        token,
        method: animal ? 'PUT' : 'POST',
        body,
      });
      navigate(`/animales/${saved._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="stack-form form-surface" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Nombre
          <input name="nombre" required maxLength={60} defaultValue={animal?.nombre || ''} />
        </label>
        <label>
          Especie
          <select name="especie" defaultValue={animal?.especie || 'Perro'}>
            <option>Perro</option>
            <option>Gato</option>
          </select>
        </label>
        <label>
          Edad (años)
          <input
            name="edad"
            type="number"
            required
            min={0}
            max={30}
            step="0.1"
            defaultValue={animal?.edad ?? ''}
          />
        </label>
        <label>
          Raza
          <input name="raza" maxLength={80} defaultValue={animal?.raza || 'Mestizo'} />
        </label>
        <label>
          Tamaño
          <select name="tamano" defaultValue={animal?.tamano || 'Mediano'}>
            <option>Pequeño</option>
            <option>Mediano</option>
            <option>Grande</option>
          </select>
        </label>
        <label>
          Ciudad
          <input name="ciudad" maxLength={80} defaultValue={animal?.ciudad || ''} />
        </label>
      </div>
      <label>
        Su historia
        <textarea
          name="descripcion"
          rows={5}
          maxLength={2000}
          defaultValue={animal?.descripcion || ''}
        />
      </label>
      <label>
        Enlace HTTPS a su fotografía (opcional)
        <input
          name="imagen"
          type="text"
          defaultValue={animal?.imagen || ''}
          placeholder="https://…"
        />
        <small>Si todavía no hay fotografía, la ficha lo indicará.</small>
      </label>
      <ErrorMessage>{error}</ErrorMessage>
      <button className="button" disabled={busy}>
        {busy ? 'Guardando…' : 'Guardar ficha'}
      </button>
    </form>
  );
}
