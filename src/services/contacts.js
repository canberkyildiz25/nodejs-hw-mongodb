import { Contact } from '../db/contact.js';

export const getAllContacts = async ({ skip = 0, limit = 20, filter = {}, sort = {} } = {}) => {
  const parsedSkip = Number(skip) >= 0 ? Number(skip) : 0;
  const parsedLimit = Number(limit) > 0 ? Math.min(Number(limit), 100) : 20;

  const query = Contact.find(filter).sort(sort).skip(parsedSkip).limit(parsedLimit);

  const [total, data] = await Promise.all([
    Contact.countDocuments(filter),
    query,
  ]);

  return { total, skip: parsedSkip, limit: parsedLimit, data };
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
