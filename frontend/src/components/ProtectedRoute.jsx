import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ErrorMessage, Loading } from './Feedback';
export default function ProtectedRoute({ admin = false }) {
  const { user, loading, error, logout } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="page">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="page">
        <ErrorMessage>{error}</ErrorMessage>
        <button className="button" onClick={logout}>
          Volver a iniciar sesión
        </button>
      </div>
    );
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/animales" replace />;
  return <Outlet />;
}
