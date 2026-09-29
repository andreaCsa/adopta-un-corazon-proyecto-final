import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { referencePhoto } from '../config/animalPhotos';
export function AnimalImage({ animal }) {
  const [failedSource, setFailedSource] = useState('');
  const reference = !animal.imagen && referencePhoto(animal);
  const source = animal.imagen || reference?.src;
  return source && failedSource !== source ? (
    <img
      className="animal-image"
      src={source}
      alt={
        reference ? `${animal.nombre}: fotografía de referencia de ${animal.raza}` : animal.nombre
      }
      loading="lazy"
      decoding="async"
      onError={() => setFailedSource(source)}
    />
  ) : (
    <div className={`animal-placeholder ${animal.especie === 'Gato' ? 'cat' : ''}`}>
      <span className="animal-letter">{animal.nombre.slice(0, 1)}</span>
      <Icon />
      <small>Fotografía pendiente</small>
    </div>
  );
}
export default function AnimalCard({ animal }) {
  return (
    <article className="animal-card">
      <Link
        to={`/animales/${animal._id}`}
        className="card-image-link"
        aria-label={`Conocer a ${animal.nombre}`}
      >
        <AnimalImage animal={animal} />
        <span className="availability">
          {animal.disponible ? 'Busco un hogar' : 'Adopción aprobada'}
        </span>
      </Link>
      <div className="card-body">
        <div className="card-title">
          <h3>{animal.nombre}</h3>
          <span>{animal.especie}</span>
        </div>
        <p>
          {animal.raza} ·{' '}
          {animal.edad < 1
            ? 'Menos de 1 año'
            : `${animal.edad} ${animal.edad === 1 ? 'año' : 'años'}`}
        </p>
        <p className="location">
          <Icon name="pin" />
          {animal.ciudad || 'Ubicación por confirmar'}
        </p>
        <Link className="text-link" to={`/animales/${animal._id}`}>
          Quiero conocerte <Icon name="arrow" />
        </Link>
      </div>
    </article>
  );
}
