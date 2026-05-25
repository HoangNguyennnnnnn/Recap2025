import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { FortuneProfile } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  await connectDatabase();
  const profiles = await FortuneProfile.find().lean();
  console.log('PROFILES_DATA:');
  console.log(JSON.stringify(profiles, null, 2));
  await disconnectDatabase();
};

run().catch(console.error);
