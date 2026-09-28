import { Router } from 'express';
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitudEstado,
} from '../controllers/solicitudController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { asyncRoute } from '../utils/http.js';
const router = Router();
router.use(protect);
router.get('/', asyncRoute(getSolicitudes));
router.post('/', asyncRoute(createSolicitud));
router.patch('/:id', adminOnly, asyncRoute(updateSolicitudEstado));
export default router;
