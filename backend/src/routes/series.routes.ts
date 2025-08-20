import { Router } from 'express';
import SeriesController from '../controllers/SeriesController';
const router = Router();

router.get('/', SeriesController.getAll);
router.get('/:id/next', SeriesController.getNext);
router.post('/:id/answer', SeriesController.answer);
router.post('/', SeriesController.create);
router.put('/:id', SeriesController.update);
router.delete('/:id', SeriesController.delete);

export default router;
