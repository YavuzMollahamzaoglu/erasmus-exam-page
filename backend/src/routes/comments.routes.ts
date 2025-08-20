import { Router } from 'express';
import { getComments, createComment, deleteComment, updateComment } from '../controllers/CommentsController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { errorHandler } from '../middlewares/error.middleware';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await getComments(req, res);
  } catch (err) {
    next(err);
  }
});
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    await createComment(req, res);
  } catch (err) {
    next(err);
  }
});
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await deleteComment(req, res);
  } catch (err) {
    next(err);
  }
});
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    await updateComment(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
