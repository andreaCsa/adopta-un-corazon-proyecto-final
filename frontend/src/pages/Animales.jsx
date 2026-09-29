import { useMemo, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../hooks/useAuth';
import AnimalCard from '../components/AnimalCard';
import { ResourceState } from '../components/Feedback';
const initial = { q: '', especie: '', edad: '', disponibles: true, page: 1 };
function reducer(state, action) {
  if (action.type === 'reset') return initial;
  return {
    ...state,
    [action.field]: action.value,
    page: action.field === 'page' ? action.value : 1,
  };
}
export default function Animales() {
  const resource = useResource('/animales');
  const { user } = useAuth();
  const [filters, dispatch] = useReducer(reducer, initial);
  const set = (field, value) => dispatch({ field, value });
  const filtered = useMemo(
    () =>
      (resource.data || []).filter((animal) => {
        const matchesText = `${animal.nombre} ${animal.raza} ${animal.ciudad}`
          .toLocaleLowerCase('es')
          .includes(filters.q.toLocaleLowerCase('es'));
        return (
          matchesText &&
          (!filters.especie || animal.especie === filters.especie) &&
          (!filters.disponibles || animal.disponible) &&
          (!filters.edad ||
            (filters.edad === 'joven'
              ? animal.edad < 2
              : filters.edad === 'adulto'
                ? animal.edad >= 2 && animal.edad < 8
                : animal.edad >= 8))
        );
      }),
    [resource.data, filters],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">EL COMIENZO DE ALGO BONITO</p>
        <h1>
          Tu compañero <em>te espera.</em>
        </h1>
        <p>Cada uno tiene su historia. Encuentra a quien encaje contigo.</p>
        {user?.role === 'admin' && (
          <Link className="text-link" to="/crear-animal">
            Añadir un animal →
          </Link>
        )}
      </div>
      <div className="filters">
        <label>
          Buscar
          <input
            type="search"
            placeholder="Nombre, raza o ciudad"
            value={filters.q}
            onChange={(e) => set('q', e.target.value)}
          />
        </label>
        <label>
          Compañero
          <select value={filters.especie} onChange={(e) => set('especie', e.target.value)}>
            <option value="">Todos</option>
            <option>Perro</option>
            <option>Gato</option>
          </select>
        </label>
        <label>
          Edad
          <select value={filters.edad} onChange={(e) => set('edad', e.target.value)}>
            <option value="">Todas las edades</option>
            <option value="joven">Menos de 2 años</option>
            <option value="adulto">De 2 a 7 años</option>
            <option value="senior">8 años o más</option>
          </select>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filters.disponibles}
            onChange={(e) => set('disponibles', e.target.checked)}
          />{' '}
          Solo disponibles
        </label>
      </div>
      <p className="demo-note">
        Fichas de ejemplo con fotografías de referencia.{' '}
        <Link to="/creditos-fotos">Créditos de las fotos</Link>
      </p>
      <ResourceState resource={resource}>
        <p className="results-count" role="status">
          {filtered.length} {filtered.length === 1 ? 'compañero' : 'compañeros'}
        </p>
        {filtered.length ? (
          <>
            <div className="animal-grid">
              {filtered.slice((filters.page - 1) * 12, filters.page * 12).map((animal) => (
                <AnimalCard key={animal._id} animal={animal} />
              ))}
            </div>
            <nav className="pagination" aria-label="Páginas del catálogo">
              <button
                className="button button-outline"
                disabled={filters.page === 1}
                onClick={() => set('page', filters.page - 1)}
              >
                Anterior
              </button>
              <span>
                Página {filters.page} de {pages}
              </span>
              <button
                className="button button-outline"
                disabled={filters.page >= pages}
                onClick={() => set('page', filters.page + 1)}
              >
                Siguiente
              </button>
            </nav>
          </>
        ) : (
          <div className="empty">
            <h2>No hemos encontrado coincidencias.</h2>
            <p>Prueba con otra edad, especie o nombre.</p>
            <button className="button" onClick={() => dispatch({ type: 'reset' })}>
              Quitar filtros
            </button>
          </div>
        )}
      </ResourceState>
    </div>
  );
}
