import { Link } from 'react-router-dom';
import photos from '../data/animalPhotos.json';

export default function PhotoCredits() {
  return (
    <div className="page">
      <Link className="back-link" to="/animales">
        ← Volver a los animales
      </Link>
      <div className="page-heading">
        <p className="eyebrow">LAS FOTOS DEL CATÁLOGO</p>
        <h1>
          Detrás de cada <em>mirada.</em>
        </h1>
        <p>
          Las fichas son ficticias. Estas fotografías representan cada raza y se reutilizan en las
          fichas de ejemplo; no identifican animales disponibles para adoptar.
        </p>
        <p>
          Proceden de Wikimedia Commons. Se muestran a tamaño reducido y encuadradas por la
          interfaz. Cada fotografía conserva la licencia indicada, también en sus versiones
          redimensionadas. La foto de portada la ha aportado Andrea.
        </p>
      </div>
      <div className="animal-grid photo-credits">
        {photos.map((photo) => (
          <article className="animal-card" key={photo.src}>
            <img className="animal-image" src={photo.src} alt={photo.breed} loading="lazy" />
            <div className="card-body">
              <h2>{photo.breed}</h2>
              <p>{photo.author}</p>
              <p>
                <a href={photo.source}>Fotografía original y autoría</a>
              </p>
              <a href={photo.licenseUrl}>{photo.license}</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
