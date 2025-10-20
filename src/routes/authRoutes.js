import express from 'express';
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


router.post('/register', registerUserSchema, registerUser);

router.post('/login', loginUserSchema, loginUser);

router.post('/refresh', refreshUserSession);

router.post('/logout', logoutUser);

export default router;
