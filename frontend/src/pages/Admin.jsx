import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../hooks/useAuth';
import { ResourceState, ErrorMessage } from '../components/Feedback';
import { api } from '../config/api';
export default function Admin() {
  const { token } = useAuth();
  const resource = useResource('/animales');
  const [query, setQuery] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState('');
  async function remove(animal) {
    if (
      !window.confirm(`¿Eliminar la ficha de ${animal.nombre}? Esta acción no se puede deshacer.`)
    )
      return;
    setBusy(animal._id);
    setError('');
    try {
      await api(`/animales/${animal._id}`, { method: 'DELETE', token });
      resource.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }
  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">ADMINISTRACIÓN</p>
        <h1>
          Cuidamos cada <em>historia.</em>
        </h1>
        <Link className="button" to="/crear-animal">
          Añadir animal
        </Link>{' '}
        <Link className="button button-outline" to="/solicitudes">
          Revisar solicitudes
        </Link>
      </div>
      <label className="admin-search">
        Buscar un animal
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre"
        />
      </label>
      <ErrorMessage>{error}</ErrorMessage>
      <ResourceState resource={resource}>
        <div className="admin-list">
          {resource.data
            ?.filter((a) => a.nombre.toLowerCase().includes(query.toLowerCase()))
            .map((a) => (
              <article className="admin-row" key={a._id}>
                <div>
                  <h2>{a.nombre}</h2>
                  <p>
                    {a.especie} · {a.disponible ? 'Disponible' : 'Adopción aprobada'}
                  </p>
                </div>
                <div className="row-actions">
                  <Link className="text-link" to={`/editar-animal/${a._id}`}>
                    Editar
                  </Link>
                  <button className="text-button" disabled={!!busy} onClick={() => remove(a)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
        </div>
      </ResourceState>
    </div>
  );
}
