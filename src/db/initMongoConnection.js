import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const mongodbUser = env('MONGODB_USER');
    const mongodbPassword = env('MONGODB_PASSWORD');
    const mongodbUrl = env('MONGODB_URL');
    const mongodbDb = env('MONGODB_DB');

    const normalizedMongoUrl = mongodbUrl
      .replace(/^mongodb\+srv:\/\//, '')
      .replace(/\/$/, '');

    const mongoUrl = `mongodb+srv://${encodeURIComponent(mongodbUser)}:${encodeURIComponent(mongodbPassword)}@${normalizedMongoUrl}/${mongodbDb}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoUrl);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    throw error;
  }
};
