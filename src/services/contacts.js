import { Contact } from '../db/contact.js';

export const getAllContacts = async ({ skip = 0, limit = 20, filter = {}, sort = {}, userId } = {}) => {
  const query = { ...filter, userId };
  const [total, data] = await Promise.all([
    Contact.countDocuments(query),
    Contact.find(query).sort(sort).skip(skip).limit(limit),
  ]);

  return { total, data };
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
