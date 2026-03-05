import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, requestResetPasswordSchema, resetPasswordSchema } from '../validation/authValidation.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  requestResetPasswordController,
  resetPasswordController,
} from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
authRouter.post('/logout', ctrlWrapper(logoutController));
authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/forgot-password', validateBody(requestResetPasswordSchema), ctrlWrapper(requestResetPasswordController));
authRouter.post('/reset-password', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
