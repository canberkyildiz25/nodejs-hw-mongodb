import { Contact } from '../db/contact.js';

export const getAllContacts = async ({ skip = 0, limit = 20, filter = {}, sort = {} } = {}) => {
  const [total, data] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter).sort(sort).skip(skip).limit(limit),
  ]);

  return { total, data };
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
