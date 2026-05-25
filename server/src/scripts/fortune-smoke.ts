import fs from 'fs/promises';
import { extractPdfText, normalizeText, splitTextIntoChunks } from '../services/fortune-rag.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npm run fortune:smoke -- <path-to-pdf>');
  process.exit(1);
}

const run = async () => {
  const buffer = await fs.readFile(filePath);
  const text = normalizeText(await extractPdfText(buffer));
  const chunks = splitTextIntoChunks(text, 1200, 200);

  console.log(`Extracted ${text.length} chars in ${chunks.length} chunks`);
};

run().catch((error) => {
  console.error('Smoke test failed:', error);
  process.exit(1);
});
