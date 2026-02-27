import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidID from '../middlewares/isValidID.js';
import { createContactSchema, updateContactSchema } from '../validation/contactValidation.js';

export const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getContactsController));
contactRouter.get('/:contactId', isValidID, ctrlWrapper(getContactByIdController));
contactRouter.post('/', validateBody(createContactSchema), ctrlWrapper(createContactController));
contactRouter.patch('/:contactId', isValidID, validateBody(updateContactSchema), ctrlWrapper(patchContactController));
contactRouter.delete('/:contactId', isValidID, ctrlWrapper(deleteContactController));
