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
  body('name').notEmpty().withMessage('Ad Soyad zorunludur'),
  body('name').isLength({ min: 2 }).withMessage('Ad Soyad en az 2 karakter olmalı'),
  ],
  validateRequest,
  AuthController.register
);
router.post('/login', AuthController.login);
router.get('/me', AuthController.me);
router.post('/logout', AuthController.logout);

// Update profile (name, email, password) for authenticated user
router.put(
  '/update-profile',
  [
    // currentPassword is only required if name, email, or newPassword is present
    body('name').optional().isLength({ min: 2 }).withMessage('Ad Soyad en az 2 karakter olmalı'),
    body('email').optional().isEmail().withMessage('Geçerli bir email giriniz'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalı'),
    // custom validator for currentPassword
    body().custom((value, { req }) => {
      if (
        (req.body.name && req.body.name.length >= 2) ||
        (req.body.email && req.body.email.length > 0) ||
        (req.body.newPassword && req.body.newPassword.length >= 6)
      ) {
        if (!req.body.currentPassword) {
          throw new Error('Mevcut şifre zorunludur');
        }
      }
      return true;
    }),
  ],
  validateRequest,
  AuthController.updateProfile
);

export default router;
