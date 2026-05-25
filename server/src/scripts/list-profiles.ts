import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { FortuneProfile, FortuneSource } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  await connectDatabase();
  const profiles = await FortuneProfile.find().lean();
  console.log('Profiles:', JSON.stringify(profiles, null, 2));
  const sources = await FortuneSource.find().lean();
  console.log('Sources:', JSON.stringify(sources, null, 2));
  await disconnectDatabase();
};

run().catch(console.error);
