import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../config/api';
import { ErrorMessage } from '../components/Feedback';
import Icon from '../components/Icon';
export default function AuthPage({ register = false }) {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const from =
    location.state?.from?.startsWith('/') && !location.state.from.startsWith('//')
      ? location.state.from
      : '/animales';
  if (user) return <Navigate to={from} replace />;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const body = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const session = await api(`/users/${register ? 'register' : 'login'}`, {
        method: 'POST',
        body,
      });
      login(session);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-page">
      <div className="auth-image">
        <img src="/media/portada.jpg" alt="Un perro pug mira a la cámara" />
        <div>
          <Icon />
          <p>
            Su lealtad es eterna.
            <br />
            <em>
              Que tu compromiso
              <br />
              también lo sea.
            </em>
          </p>
        </div>
      </div>
      <div className="auth-panel">
        <p className="eyebrow">ADOPTA UN CORAZÓN</p>
        <h1>
          {register ? 'Haz sitio a una' : 'Qué alegría'}
          <br />
          <em>{register ? 'nueva historia.' : 'verte de nuevo.'}</em>
        </h1>
        <p>
          {register
            ? 'Crea tu cuenta para solicitar una adopción y seguir cada paso.'
            : 'Entra para consultar tus solicitudes y continuar tu historia.'}
        </p>
        <form onSubmit={submit} className="stack-form">
          {register && (
            <label htmlFor="name">
              Tu nombre
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
              />
            </label>
          )}
          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label htmlFor="password">
            Contraseña
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={visible ? 'text' : 'password'}
                autoComplete={register ? 'new-password' : 'current-password'}
                minLength={register ? 8 : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {visible ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {register && <small>Al menos 8 caracteres.</small>}
          </label>
          <ErrorMessage>{error}</ErrorMessage>
          <button className="button" disabled={busy}>
            {busy ? 'Un momento…' : register ? 'Crear mi cuenta' : 'Entrar'}
            <Icon name="arrow" />
          </button>
        </form>
        <p className="auth-switch">
          {register ? '¿Ya tienes cuenta?' : '¿Es tu primera visita?'}{' '}
          <Link to={register ? '/login' : '/register'} state={{ from }}>
            {register ? 'Inicia sesión' : 'Crea tu cuenta'}
          </Link>
        </p>
        <Link className="quiet-link" to="/animales">
          Seguir viendo animales sin entrar →
        </Link>
      </div>
    </section>
  );
}
