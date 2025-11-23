import { Router } from 'express';
import { analisisController } from '../controllers/analisis.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/diario', analisisController.getAnalisisDiario);

export default router;
