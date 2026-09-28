import { Router } from 'express';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} from '../controllers/animalController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { asyncRoute } from '../utils/http.js';
const router = Router();
router.get('/', asyncRoute(getAnimals));
router.get('/:id', asyncRoute(getAnimalById));
router.post('/', protect, adminOnly, asyncRoute(createAnimal));
router.put('/:id', protect, adminOnly, asyncRoute(updateAnimal));
router.delete('/:id', protect, adminOnly, asyncRoute(deleteAnimal));
export default router;
