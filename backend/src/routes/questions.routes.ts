import { Router } from 'express';
import QuestionsController from '../controllers/QuestionsController';
const router = Router();

router.get('/', QuestionsController.getAll);
router.get('/:id', QuestionsController.getById);
router.post('/answer', QuestionsController.answer);
router.post('/', QuestionsController.create);
router.put('/:id', QuestionsController.update);
router.delete('/:id', QuestionsController.delete);

export default router;
