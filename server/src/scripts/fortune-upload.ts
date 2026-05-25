import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { cloudinary, initializeCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { FortuneSource } from '../models/index.js';
import { ensureProfile, ingestPdfBuffer } from '../services/fortune-ingest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getArg = (name: string): string | undefined => {
  const args = process.argv.slice(2);
  const index = args.indexOf(`--${name}`);
  if (index === -1) return undefined;
  return args[index + 1];
};

const profileSlug = getArg('profile') || getArg('slug');
const displayName = getArg('name');
const filePath = getArg('file');

if (!profileSlug || !filePath) {
  console.error(
    'Usage: npm run fortune:upload -- --profile hna --name "Nguyen Hong Anh" --file "./path/to/file.pdf"'
  );
  process.exit(1);
}

const run = async () => {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  await connectDatabase();
  initializeCloudinary();

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary not configured');
  }

  const buffer = await fs.readFile(filePath);
  const profile = await ensureProfile(profileSlug, displayName);

  const base64 = buffer.toString('base64');
  const dataUri = `data:application/pdf;base64,${base64}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: 'fortune/pdfs',
    resource_type: 'raw',
  });

  const source = await FortuneSource.create({
    profileSlug: profile.slug,
    fileUrl: uploadResult.secure_url,
    fileName: path.basename(filePath),
    mimeType: 'application/pdf',
    sizeBytes: buffer.length,
    storageProvider: 'cloudinary',
    status: 'pending',
  });

  try {
    const ingestResult = await ingestPdfBuffer(buffer, source, profile);
    source.status = 'ready';
    source.chunkCount = ingestResult.chunkCount;
    source.extractedTextLength = ingestResult.textLength;
    source.ingestedAt = new Date();
    source.error = undefined;
    await source.save();

    console.log(`✅ Upload ok: ${uploadResult.secure_url}`);
    console.log(`✅ Ingested ${ingestResult.chunkCount} chunks for ${profile.slug}`);
  } catch (error: any) {
    source.status = 'failed';
    source.error = error.message || 'Ingest failed';
    await source.save();
    throw error;
  } finally {
    await disconnectDatabase();
  }
};

run().catch((error) => {
  console.error('Fortune upload failed:', error);
  process.exit(1);
});
