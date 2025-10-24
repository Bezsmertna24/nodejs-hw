import express from 'express';
import { celebrate, Segments } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema
} from '../validations/authValidation.js';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();


router.post(
  '/register',
  celebrate({ [Segments.BODY]: registerUserSchema }),
  registerUser
);

router.post(
  '/login',
  celebrate({ [Segments.BODY]: loginUserSchema }),
  loginUser
);

router.post('/refresh', refreshUserSession);

router.post('/logout', logoutUser);

router.post(
  '/request-reset-email',
  celebrate({ [Segments.BODY]: requestResetEmailSchema }),
  requestResetEmail
);

router.post(
  '/reset-password',
  celebrate({ [Segments.BODY]: resetPasswordSchema }),
  resetPassword
);

export default router;
