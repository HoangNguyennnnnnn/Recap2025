import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is not set');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    console.log('Listing available models...');
    const response = await ai.models.list();
    console.log('Available models response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('❌ Failed to list models:', error);
  }
};

run();
