import { writeFile } from 'node:fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const writeContacts = async (updatedContacts) => {
	const stringifiedContacts = JSON.stringify(updatedContacts, null, 2);

	await writeFile(PATH_DB, stringifiedContacts, 'utf-8');
};
