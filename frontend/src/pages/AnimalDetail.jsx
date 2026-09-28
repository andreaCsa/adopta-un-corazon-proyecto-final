import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../hooks/useAuth';
import { api } from '../config/api';
import { AnimalImage } from '../components/AnimalCard';
import { ErrorMessage, ResourceState } from '../components/Feedback';
export default function AnimalDetail() {
  const { id } = useParams();
  const resource = useResource(`/animales/${id}`);
  const { user, token } = useAuth();
  const [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState('');
  const animal = resource.data;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      await api('/solicitudes', {
        token,
        method: 'POST',
        body: {
          animal: id,
          mensaje: form.get('mensaje'),
          compromiso: form.get('compromiso') === 'on',
        },
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page">
      <Link className="back-link" to="/animales">
        ← Volver a los animales
      </Link>
      <ResourceState resource={resource}>
        {animal && (
          <div className="detail-grid">
            <div className="detail-image">
              <AnimalImage key={animal.imagen} animal={animal} />
            </div>
            <div>
              <p className="eyebrow">
                {animal.disponible ? 'HAY UNA VIDA POR COMPARTIR' : 'ADOPCIÓN APROBADA'}
              </p>
              <h1>
                Soy <em>{animal.nombre}.</em>
              </h1>
              <div className="facts">
                <span>{animal.especie}</span>
                <span>{animal.edad} años</span>
                <span>{animal.tamano}</span>
                <span>{animal.ciudad || 'Ubicación por confirmar'}</span>
              </div>
              <p className="detail-description">
                {animal.descripcion ||
                  'Estamos preparando su historia. Puedes enviar una solicitud para conocerlo mejor.'}
              </p>
              <p className="muted">Raza: {animal.raza}. Ficha de demostración.</p>
              {user?.role === 'admin' ? (
                <Link className="button" to={`/editar-animal/${id}`}>
                  Editar ficha
                </Link>
              ) : !animal.disponible ? (
                <p className="notice">
                  Este compañero ya tiene una adopción aprobada. Puedes conocer a otros en el
                  catálogo.
                </p>
              ) : sent ? (
                <div className="notice success" role="status">
                  <h2>Ya hemos recibido tu solicitud.</h2>
                  <p>Podrás seguir su estado desde tu cuenta.</p>
                  <Link to="/solicitudes">Ver mis solicitudes →</Link>
                </div>
              ) : !user ? (
                <div className="adoption-box">
                  <h2>¿Os imagináis juntos?</h2>
                  <p>Entra o crea una cuenta para contarnos sobre ti.</p>
                  <Link className="button" to="/login" state={{ from: `/animales/${id}` }}>
                    Quiero conocer a {animal.nombre}
                  </Link>
                </div>
              ) : (
                <form className="stack-form adoption-box" onSubmit={submit}>
                  <h2>Cuéntanos sobre ti</h2>
                  <label htmlFor="mensaje">
                    ¿Cómo sería su vida contigo?
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={4}
                      minLength={20}
                      maxLength={1500}
                      required
                      placeholder="Tu experiencia, el tiempo que puedes dedicarle y cómo es tu hogar…"
                    />
                  </label>
                  <label className="checkbox">
                    <input name="compromiso" type="checkbox" required />
                    Entiendo que adoptar implica cuidados y un compromiso para toda su vida.
                  </label>
                  <ErrorMessage>{error}</ErrorMessage>
                  <button className="button" disabled={busy}>
                    {busy ? 'Enviando…' : 'Enviar solicitud'}
                  </button>
                  <small>Enviar una solicitud no confirma la adopción.</small>
                </form>
              )}
            </div>
          </div>
        )}
      </ResourceState>
    </div>
  );
}
