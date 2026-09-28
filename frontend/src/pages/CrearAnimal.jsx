import { Link } from 'react-router-dom';
import AnimalForm from '../components/AnimalForm';
export default function CrearAnimal() {
  return (
    <div className="page narrow">
      <Link className="back-link" to="/admin">
        ← Gestión de animales
      </Link>
      <h1>
        Una nueva <em>historia.</em>
      </h1>
      <AnimalForm />
    </div>
  );
}
