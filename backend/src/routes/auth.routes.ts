import { Router } from 'express';
import AuthController, { profilePhotoUpload } from '../controllers/AuthController';
// Profile photo upload endpoint (move after router declaration)

import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';
const router = Router();

router.post('/upload-profile-photo', profilePhotoUpload.single('photo'), AuthController.uploadProfilePhoto);

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Geçerli bir email giriniz'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
  ],
  validateRequest,
  AuthController.register
);
router.post('/login', AuthController.login);
router.get('/me', AuthController.me);
router.post('/logout', AuthController.logout);

export default router;
