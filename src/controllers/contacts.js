import createHttpError from 'http-errors';
import fs from 'fs/promises';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parseSort } from '../utils/sort.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { Contact } from '../db/contact.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getContactsController = async (req, res) => {
  const parsedPage = Math.max(Number(req.query.page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = parseFilterParams(req.query);
  const sort = parseSort(req.query, Object.keys(Contact.schema.paths));

  const { total, data } = await getAllContacts({ skip, limit: parsedLimit, sort, filter, userId: req.user._id });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    total,
    page: parsedPage,
    pages: Math.max(Math.ceil(total / parsedLimit), 1),
    limit: parsedLimit,
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let photoUrl = null;
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.path);
      photoUrl = result.secure_url;
    } finally {
      await fs.unlink(req.file.path).catch(() => {});
    }
  }

  const contact = await createContact({ ...req.body, userId: req.user._id, photo: photoUrl });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;

  let photoUrl;
  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.path);
      photoUrl = result.secure_url;
    } finally {
      await fs.unlink(req.file.path).catch(() => {});
    }
  }

  const payload = photoUrl ? { ...req.body, photo: photoUrl } : req.body;
  const contact = await updateContact(contactId, req.user._id, payload);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
