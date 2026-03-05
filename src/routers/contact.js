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
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

export const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactsController));
contactRouter.get('/:contactId', isValidID, ctrlWrapper(getContactByIdController));
contactRouter.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));
contactRouter.patch('/:contactId', isValidID, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContactController));
contactRouter.delete('/:contactId', isValidID, ctrlWrapper(deleteContactController));
