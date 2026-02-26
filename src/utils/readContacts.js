import { readFile } from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const readContacts = async () => {
  const contactsData = await readFile(PATH_DB, 'utf-8');

  if (!contactsData.trim()) {
    return [];
  }

  return JSON.parse(contactsData);
};
