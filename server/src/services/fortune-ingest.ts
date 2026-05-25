import { FortuneProfile, FortuneChunk } from '../models/index.js';
import type { IFortuneProfile, IFortuneSource } from '../models/index.js';
import {
  extractPdfText,
  normalizeText,
  cleanPdfTextWithAi,
  splitTextIntoChunks,
  embedText,
  extractProfileInfo,
  generateFortuneResult,
} from './fortune-rag.js';

export const normalizeSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
};

export const ensureProfile = async (
  profileSlug: string,
  displayName?: string
): Promise<IFortuneProfile> => {
  const safeSlug = normalizeSlug(profileSlug);
  const safeName = displayName?.trim() || safeSlug.toUpperCase();

  const setOnInsert: Record<string, string> = { slug: safeSlug };
  if (!displayName) {
    setOnInsert.displayName = safeName;
  }

  const profile = await FortuneProfile.findOneAndUpdate(
    { slug: safeSlug },
    {
      $setOnInsert: setOnInsert,
      $set: displayName ? { displayName: safeName } : {},
    },
    {
      upsert: true,
      new: true,
    }
  );

  if (!profile) {
    throw new Error('Failed to create profile');
  }

  return profile;
};

const applyProfileInfo = (profile: IFortuneProfile, info: any): void => {
  if (!info) return;

  if (typeof info.displayName === 'string' && info.displayName.trim()) {
    profile.displayName = info.displayName.trim();
  }

  if (typeof info.birthDate === 'string' && info.birthDate.trim()) {
    profile.birthDate = info.birthDate.trim();
  }

  if (typeof info.birthTime === 'string' && info.birthTime.trim()) {
    profile.birthTime = info.birthTime.trim();
  }

  if (typeof info.gender === 'string' && info.gender.trim()) {
    profile.gender = info.gender.trim();
  }
};

export const ingestPdfBuffer = async (
  buffer: Buffer,
  source: IFortuneSource,
  profile: IFortuneProfile
): Promise<{ chunkCount: number; textLength: number }> => {
  // Step 1: Extract raw text from PDF
  const rawText = await extractPdfText(buffer);

  // Step 2: AI cleans + restores Vietnamese diacritics
  const textCleaned = await cleanPdfTextWithAi(rawText);
  const text = normalizeText(textCleaned);

  // Step 3: Store full cleaned text on profile for Q&A context
  profile.fullText = text;

  // Step 4: Extract profile info (name, birthdate, etc.)
  try {
    const profileInfo = await extractProfileInfo(text);
    applyProfileInfo(profile, profileInfo);
  } catch (error) {
    console.warn('⚠️  Profile extraction failed, continuing without updates.', error);
  }

  // Step 5: AI full analysis — parse entire PDF into structured FortuneResult and store in DB
  console.log('🔮 Running full AI analysis on PDF text...');
  try {
    const parsedResult = await generateFortuneResult({
      displayName: profile.displayName,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      gender: profile.gender,
      question: '',
      context: text, // pass full cleaned text, not chunks
    });
    profile.parsedResult = parsedResult as any;
    console.log('✅ Full AI analysis complete and stored in profile.parsedResult');
  } catch (error) {
    console.warn('⚠️  Full AI analysis failed during ingest:', error);
    // Don't throw — still save chunks for fallback RAG
  }

  // Step 6: Also chunk + embed for Q&A fallback (optional but kept for question answering)
  const chunks = splitTextIntoChunks(text, 1500, 200);
  await FortuneChunk.deleteMany({ sourceId: source._id });

  const chunkDocs: Array<{
    profileSlug: string;
    sourceId: IFortuneSource['_id'];
    order: number;
    text: string;
    embedding: number[];
  }> = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const embedding = await embedText(chunks[i]);
    chunkDocs.push({
      profileSlug: profile.slug,
      sourceId: source._id,
      order: i,
      text: chunks[i],
      embedding,
    });
  }

  if (chunkDocs.length > 0) {
    await FortuneChunk.insertMany(chunkDocs);
  }

  if (!profile.sourceIds.some((id) => id.equals(source._id))) {
    profile.sourceIds.push(source._id);
  }

  profile.lastIngestAt = new Date();
  await profile.save();

  return { chunkCount: chunkDocs.length, textLength: text.length };
};
