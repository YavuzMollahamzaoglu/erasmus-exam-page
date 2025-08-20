import { Router } from 'express';
import CategoriesController from '../controllers/CategoriesController';
const router = Router();

router.get('/', CategoriesController.getAll);
router.get('/questions/by-category-series', CategoriesController.getQuestionsByCategoryAndSeries);
router.post('/', CategoriesController.create);
router.put('/:id', CategoriesController.update);
router.delete('/:id', CategoriesController.delete);

export default router;
