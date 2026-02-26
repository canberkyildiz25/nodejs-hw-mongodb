import { createFakeContact } from '../utils/createFakeContact.js';
import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

export const generateContacts = async (number) => {
  const contacts = await readContacts();
  const newContacts = Array.from({ length: number }, () => createFakeContact());

  await writeContacts([...contacts, ...newContacts]);
};

generateContacts(5);
