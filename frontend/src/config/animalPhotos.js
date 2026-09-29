import photos from '../data/animalPhotos.json';

// Las fotos de referencia se reservan para las fichas ficticias del Excel.
// Una imagen añadida desde administración siempre tiene prioridad.
export function referencePhoto(animal) {
  if (!/^ANI-\d{3}$/.test(animal.codigo || '')) return null;
  return photos.find((photo) => photo.breed === animal.raza && photo.species === animal.especie);
}
