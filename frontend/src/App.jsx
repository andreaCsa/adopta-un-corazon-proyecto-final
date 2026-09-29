import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Animales from './pages/Animales';
import AnimalDetail from './pages/AnimalDetail';
import CrearAnimal from './pages/CrearAnimal';
import EditarAnimal from './pages/EditarAnimal';
import Solicitudes from './pages/Solicitudes';
import Admin from './pages/Admin';
import PhotoCredits from './pages/PhotoCredits';
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<AuthPage key="login" />} />
        <Route path="register" element={<AuthPage key="register" register />} />
        <Route path="animales" element={<Animales />} />
        <Route path="animales/:id" element={<AnimalDetail />} />
        <Route path="creditos-fotos" element={<PhotoCredits />} />
        <Route element={<ProtectedRoute />}>
          <Route path="solicitudes" element={<Solicitudes />} />
        </Route>
        <Route element={<ProtectedRoute admin />}>
          <Route path="admin" element={<Admin />} />
          <Route path="crear-animal" element={<CrearAnimal />} />
          <Route path="editar-animal/:id" element={<EditarAnimal />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="page empty">
              <h1>Este camino no lleva a casa.</h1>
              <Link className="button" to="/">
                Volver al inicio
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
