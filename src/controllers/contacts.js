import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { calculatePaginationData } from '../utils/pagination.js';
import { parseSort } from '../utils/sort.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { Contact } from '../db/contact.js';
import { Types } from 'mongoose';

export const getContactsController = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 100) : 20;
  const skip = (parsedPage - 1) * parsedLimit;

  // build filter from query params (DB-side filtering)
  const filter = {};
  if (typeof req.query.isFavourite !== 'undefined') {
    filter.isFavourite = String(req.query.isFavourite) === 'true';
  }
  if (req.query.contactType) {
    filter.contactType = req.query.contactType;
  }
  if (req.query.name) {
    // case-insensitive partial match
    filter.name = { $regex: req.query.name, $options: 'i' };
  }

  const allowedFields = Object.keys(Contact.schema.paths || []);
  const sort = parseSort(req.query, allowedFields);

  // support cursor-based pagination via `after` (use ObjectId ordering)
  if (req.query.after) {
    try {
      const afterId = Types.ObjectId(req.query.after);
      filter._id = { $gt: afterId };
    } catch (err) {
      // invalid after id -> ignore cursor
    }

    const { total, data } = await getAllContacts({ skip: 0, limit: parsedLimit, sort, filter });

    // provide next cursor (last item's id) if any
    const nextAfter = data.length ? String(data[data.length - 1]._id) : null;

    return res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      total,
      limit: parsedLimit,
      sort,
      nextAfter,
      data,
    });
  }

  const { total, data } = await getAllContacts({ skip, limit: parsedLimit, sort, filter });

  const pagination = calculatePaginationData({ page: parsedPage, skip, limit: parsedLimit }, total);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    total: pagination.total,
    page: pagination.page,
    pages: pagination.pages,
    limit: pagination.limit,
    sort,
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

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
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
 
  const contact = await updateContact(contactId, req.body);

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
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
