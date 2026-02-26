import { Router } from 'express';
import { getRootController } from '../controllers/rootController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactRouter } from './contact.js';

export const router = Router();

router.get('/', ctrlWrapper(getRootController));
router.use('/contacts', contactRouter);
