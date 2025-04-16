import * as dotenv from 'dotenv';
dotenv.config();

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is missing from environment variables`);
  }
  return value;
};
