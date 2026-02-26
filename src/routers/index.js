import { Router } from 'express';
import { getRootController } from '../controllers/rootController.js';
import {
	getContactByIdController,
	getContactsController,
} from '../controllers/contacts.js';

export const router = Router();

router.get('/', getRootController);
router.get('/contacts', getContactsController);
router.get('/contacts/:contactId', getContactByIdController);
