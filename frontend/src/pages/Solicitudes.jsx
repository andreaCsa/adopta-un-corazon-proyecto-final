import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useResource } from '../hooks/useResource';
import { api } from '../config/api';
import { ResourceState, ErrorMessage } from '../components/Feedback';
export default function Solicitudes() {
  const { user, token } = useAuth();
  const resource = useResource('/solicitudes', token);
  const [busy, setBusy] = useState(''),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  async function update(id, estado) {
    setBusy(id);
    setError('');
    setSuccess('');
    try {
      await api(`/solicitudes/${id}`, { token, method: 'PATCH', body: { estado } });
      setSuccess('La solicitud se ha actualizado.');
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
        <p className="eyebrow">CADA HISTORIA, PASO A PASO</p>
        <h1>
          {user.role === 'admin' ? 'Solicitudes de' : 'Mis solicitudes de'} <em>adopción.</em>
        </h1>
        <p>
          {user.role === 'admin'
            ? 'Revisa cada mensaje antes de tomar una decisión. Aprobar una solicitud cerrará las demás del mismo animal.'
            : 'Aquí puedes consultar cómo avanza tu solicitud.'}
        </p>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {success && (
        <p className="notice success" role="status">
          {success}
        </p>
      )}
      <ResourceState resource={resource}>
        {resource.data?.length ? (
          <div className="request-list">
            {resource.data.map((item) => (
              <article key={item._id} className="request-card">
                <div className="request-heading">
                  <h2>{item.animal?.nombre || 'Animal no disponible'}</h2>
                  <span className={`status ${item.estado}`}>{item.estado}</span>
                </div>
                {user.role === 'admin' && (
                  <p>
                    <strong>{item.usuario?.name}</strong> · {item.usuario?.email}
                  </p>
                )}
                <p>{item.mensaje}</p>
                <small>
                  {new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(
                    new Date(item.createdAt),
                  )}
                </small>
                <div className="request-actions">
                  {item.animal && (
                    <Link className="text-link" to={`/animales/${item.animal._id}`}>
                      Ver ficha →
                    </Link>
                  )}
                  {user.role === 'admin' && item.estado === 'pendiente' && (
                    <>
                      <button
                        className="button button-small"
                        disabled={!!busy}
                        onClick={() => update(item._id, 'aprobada')}
                      >
                        Aprobar
                      </button>
                      <button
                        className="button button-outline button-small"
                        disabled={!!busy}
                        onClick={() => update(item._id, 'rechazada')}
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>Tu historia aún está por empezar.</h2>
            <p>Cuando envíes una solicitud, aparecerá aquí.</p>
            <Link className="button" to="/animales">
              Conocer a los animales
            </Link>
          </div>
        )}
      </ResourceState>
    </div>
  );
}
