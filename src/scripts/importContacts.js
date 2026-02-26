import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import { initMongoConnection } from '../db/initMongoConnection.js';
import { Contact } from '../db/contact.js';

const importContacts = async () => {
  await initMongoConnection();

  const rawFile = await readFile(new URL('../db/data/contacts.json', import.meta.url), 'utf-8');
  const contacts = JSON.parse(rawFile);

  if (!Array.isArray(contacts)) {
    throw new Error('contacts.json must contain an array of contacts');
  }

  await Contact.insertMany(contacts);
  console.log(`${contacts.length} contacts were imported successfully.`);

  await mongoose.disconnect();
};

importContacts().catch(async (error) => {
  console.error('Import failed:', error.message);
  await mongoose.disconnect();
  process.exit(1);
});
