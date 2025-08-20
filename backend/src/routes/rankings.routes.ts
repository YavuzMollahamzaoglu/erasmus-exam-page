import { Router } from 'express';
import RankingsController from '../controllers/RankingsController';
import { authenticateJWT } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', RankingsController.getAll);
router.post('/', authenticateJWT, RankingsController.create);

export default router;
