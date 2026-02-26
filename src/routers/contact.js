import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactsController));
contactRouter.get('/:contactId', ctrlWrapper(getContactByIdController));
contactRouter.post('/', ctrlWrapper(createContactController));
contactRouter.patch('/:contactId', ctrlWrapper(patchContactController));
contactRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
