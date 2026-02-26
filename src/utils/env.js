import dotenv from 'dotenv';

dotenv.config();

export const env = (name, defaultValue) => {
  const value = process.env[name];

  if (!value) {
    if (defaultValue === undefined) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return defaultValue;
  }

  return value;
};
