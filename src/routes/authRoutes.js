import express from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema
} from '../validations/authValidation.js';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser
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

export default router;
