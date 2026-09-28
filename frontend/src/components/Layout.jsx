import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from './Icon';
function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Adopta un corazón. Inicio">
          <Icon />
          <span>
            adopta un
            <br />
            <strong>corazón</strong>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>
        <nav
          id="navigation"
          className={open ? 'navigation open' : 'navigation'}
          aria-label="Principal"
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/animales">Encuentra a tu compañero</NavLink>
          <Link to="/#como-adoptar">Cómo adoptar</Link>
          {user ? (
            <>
              <NavLink to="/solicitudes">
                {user.role === 'admin' ? 'Solicitudes' : 'Mis solicitudes'}
              </NavLink>
              {user.role === 'admin' && <NavLink to="/admin">Gestionar</NavLink>}
              <button className="nav-button" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Entrar</NavLink>
              <Link className="button button-small" to="/register">
                Crear cuenta <Icon name="arrow" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
export default function Layout() {
  const location = useLocation();
  const main = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (location.hash)
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
    if (!first.current && !location.hash) main.current?.focus({ preventScroll: true });
    first.current = false;
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header key={location.pathname} />
      <main id="contenido" tabIndex={-1} ref={main}>
        <Outlet />
      </main>
      <footer>
        <div className="footer-inner">
          <Link className="brand" to="/">
            <Icon />
            <span>
              adopta un
              <br />
              <strong>corazón</strong>
            </span>
          </Link>
          <p>
            Su lealtad es eterna.
            <br />
            Que tu compromiso también lo sea.
          </p>
          <div>
            <Link to="/animales">
              Conocer a los animales <Icon name="arrow" />
            </Link>
            <small>Proyecto educativo de Andrea · Datos de demostración</small>
          </div>
        </div>
      </footer>
    </>
  );
}
