import { Router } from 'express';
import { getRootController } from '../controllers/rootController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactRouter } from './contact.js';
import { authRouter } from './auth.js';

export const router = Router();

router.get('/', ctrlWrapper(getRootController));
router.use('/auth', authRouter);
router.use('/contacts', contactRouter);
