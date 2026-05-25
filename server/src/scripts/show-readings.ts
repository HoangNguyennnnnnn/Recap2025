import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { FortuneReading } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  await connectDatabase();
  const reading = await FortuneReading.findOne().sort({ createdAt: -1 }).lean();
  if (reading) {
    fs.writeFileSync(path.resolve(__dirname, 'sample_reading.json'), JSON.stringify(reading.result?.detailedReading, null, 2));
    console.log('Saved to sample_reading.json');
  } else {
    console.log('No readings found');
  }
  await disconnectDatabase();
};

run().catch(console.error);
