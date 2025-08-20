import { Router } from 'express';
import TokenController from '../controllers/TokenController';
const router = Router();

router.get('/', TokenController.getToken);
router.post('/refresh', TokenController.refreshToken);

export default router;
