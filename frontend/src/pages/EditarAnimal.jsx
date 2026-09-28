import { Link, useParams } from 'react-router-dom';
import AnimalForm from '../components/AnimalForm';
import { useResource } from '../hooks/useResource';
import { ResourceState } from '../components/Feedback';
export default function EditarAnimal() {
  const { id } = useParams();
  const resource = useResource(`/animales/${id}`);
  return (
    <div className="page narrow">
      <Link className="back-link" to="/admin">
        ← Gestión de animales
      </Link>
      <h1>
        Editar <em>su ficha.</em>
      </h1>
      <ResourceState resource={resource}>
        {resource.data && <AnimalForm key={id} animal={resource.data} />}
      </ResourceState>
    </div>
  );
}
