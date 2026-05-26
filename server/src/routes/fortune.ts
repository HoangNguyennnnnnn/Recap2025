import express, { Request, Response } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { FortuneProfile, FortuneSource, FortuneChunk, FortuneReading } from '../models/index.js';
import {
  downloadFileToBuffer,
  normalizeText,
  embedText,
  cosineSimilarity,
  lexicalSimilarity,
  generateFortuneResult,
} from '../services/fortune-rag.js';
import { ensureProfile, ingestPdfBuffer, normalizeSlug } from '../services/fortune-ingest.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

const geminiReady = (): boolean =>
  !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

// ─── GET /profiles ────────────────────────────────────────────────────────────
router.get('/profiles', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const profiles = await FortuneProfile.find().sort({ updatedAt: -1 });
    return res.json({ profiles });
  } catch (error: any) {
    console.error('Fortune profiles error:', error);
    return res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// ─── DELETE /purge/:slug ───────────────────────────────────────────────────────
// Xóa toàn bộ data cũ (chunks, readings, parsedResult, fullText) để re-ingest
router.delete('/purge/:slug', authMiddleware, async (req: Request, res: Response) => {
  try {
    const slug = normalizeSlug(req.params.slug);
    const profile = await FortuneProfile.findOne({ slug });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    await FortuneChunk.deleteMany({ profileSlug: slug });
    await FortuneReading.deleteMany({ profileSlug: slug });
    await FortuneSource.deleteMany({ profileSlug: slug });

    profile.parsedResult = undefined;
    profile.fullText = undefined;
    profile.lastIngestAt = undefined;
    profile.sourceIds = [];
    await profile.save();

    console.log(`🗑️  Purged all data for profile: ${slug}`);
    return res.json({ success: true, message: `Purged all data for ${slug}` });
  } catch (error: any) {
    console.error('Fortune purge error:', error);
    return res.status(500).json({ error: 'Purge failed', message: error.message });
  }
});

// ─── POST /reingest/:slug ──────────────────────────────────────────────────────
// Tải lại PDF từ source đã lưu và re-ingest toàn bộ
router.post('/reingest/:slug', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!geminiReady())
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });

    const slug = normalizeSlug(req.params.slug);
    const profile = await FortuneProfile.findOne({ slug });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Find the most recent ready source
    const source = await FortuneSource.findOne({ profileSlug: slug, status: 'ready' })
      .sort({ createdAt: -1 });

    if (!source) {
      return res.status(400).json({
        error: 'No PDF source found. Please upload the PDF first.',
        needsUpload: true,
      });
    }

    console.log(`🔄 Re-ingesting PDF for ${slug} from: ${source.fileUrl}`);

    // Download PDF from stored URL
    const buffer = await downloadFileToBuffer(source.fileUrl);

    // Clear old chunks
    await FortuneChunk.deleteMany({ profileSlug: slug });
    profile.parsedResult = undefined;
    profile.fullText = undefined;

    // Re-ingest
    const ingestResult = await ingestPdfBuffer(buffer, source, profile);
    source.chunkCount = ingestResult.chunkCount;
    source.extractedTextLength = ingestResult.textLength;
    source.ingestedAt = new Date();
    source.status = 'ready';
    await source.save();

    return res.json({
      success: true,
      message: `Re-ingested ${ingestResult.chunkCount} chunks for ${slug}`,
      chunkCount: ingestResult.chunkCount,
      hasParsedResult: !!profile.parsedResult,
    });
  } catch (error: any) {
    console.error('Fortune reingest error:', error);
    return res.status(500).json({ error: 'Re-ingest failed', message: error.message });
  }
});


router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!geminiReady())
        return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
      if (!isCloudinaryConfigured())
        return res.status(503).json({ error: 'Cloudinary not configured' });

      const profileSlug = req.body.profileSlug as string;
      const displayName = req.body.displayName as string | undefined;

      if (!profileSlug) return res.status(400).json({ error: 'profileSlug is required' });
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const profile = await ensureProfile(profileSlug, displayName);

      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'fortune/pdfs',
        resource_type: 'raw',
      });

      const source = await FortuneSource.create({
        profileSlug: profile.slug,
        fileUrl: uploadResult.secure_url,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        storageProvider: 'cloudinary',
        status: 'pending',
      });

      try {
        const ingestResult = await ingestPdfBuffer(req.file.buffer, source, profile);
        source.status = 'ready';
        source.chunkCount = ingestResult.chunkCount;
        source.extractedTextLength = ingestResult.textLength;
        source.ingestedAt = new Date();
        source.error = undefined;
        await source.save();

        return res.json({ success: true, source, profile, chunkCount: ingestResult.chunkCount });
      } catch (error: any) {
        source.status = 'failed';
        source.error = error.message || 'Ingest failed';
        await source.save();
        throw error;
      }
    } catch (error: any) {
      console.error('Fortune upload error:', error);
      return res.status(500).json({ error: 'Upload failed', message: error.message });
    }
  }
);

// ─── POST /ingest (from URL) ───────────────────────────────────────────────────
router.post('/ingest', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!geminiReady())
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });

    const { fileUrl, profileSlug, displayName } = req.body as {
      fileUrl?: string;
      profileSlug?: string;
      displayName?: string;
    };

    if (!fileUrl || !profileSlug)
      return res.status(400).json({ error: 'fileUrl and profileSlug are required' });

    const profile = await ensureProfile(profileSlug, displayName);
    const buffer = await downloadFileToBuffer(fileUrl);

    const source = await FortuneSource.create({
      profileSlug: profile.slug,
      fileUrl,
      fileName: fileUrl.split('/').pop() || 'fortune.pdf',
      mimeType: 'application/pdf',
      sizeBytes: buffer.length,
      storageProvider: 'external',
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

      return res.json({ success: true, source, profile, chunkCount: ingestResult.chunkCount });
    } catch (error: any) {
      source.status = 'failed';
      source.error = error.message || 'Ingest failed';
      await source.save();
      throw error;
    }
  } catch (error: any) {
    console.error('Fortune ingest error:', error);
    return res.status(500).json({ error: 'Ingest failed', message: error.message });
  }
});

// ─── POST /generate ────────────────────────────────────────────────────────────
// Luồng mới:
//   - Không có question → trả thẳng parsedResult từ DB (đã phân tích lúc ingest)
//   - Có question → RAG trên fullText để trả lời câu hỏi cụ thể
router.post('/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { profileSlug, birthDate, birthTime, gender, question } = req.body as {
      profileSlug?: string;
      birthDate?: string;
      birthTime?: string;
      gender?: string;
      question?: string;
    };

    if (!profileSlug) return res.status(400).json({ error: 'profileSlug is required' });

    const slug = normalizeSlug(profileSlug);
    const profile = await FortuneProfile.findOne({ slug });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (!profile.lastIngestAt) return res.status(400).json({ error: 'No data ingested for this profile' });

    const finalBirthDate = birthDate || profile.birthDate;
    const finalBirthTime = birthTime || profile.birthTime;
    const finalGender = gender || profile.gender;

    // ── Case 1: No question → serve cached parsedResult ─────
    if (!question?.trim()) {
      if (profile.parsedResult) {
        console.log(`✅ Serving cached parsedResult for ${slug}`);
        return res.json({ success: true, result: profile.parsedResult });
      }
      // No parsedResult (old profile) → try latest reading as fallback
      const lastReading = await FortuneReading.findOne({ profileSlug: slug }).sort({ createdAt: -1 });
      if (lastReading?.result) {
        console.log(`📦 Serving cached reading result for ${slug} (backward compat)`);
        profile.parsedResult = lastReading.result as any;
        await profile.save();
        return res.json({ success: true, result: lastReading.result });
      }
      // No cached data at all — can't proceed without Gemini
      if (!geminiReady())
        return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
      console.log(`⚠️  No parsedResult for ${slug}, falling back to RAG generation`);
    }

    // ── Case 2: Has question (or no parsedResult) → RAG on stored chunks ─────
    if (!geminiReady())
      return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
    const chunks = await FortuneChunk.find({ profileSlug: slug }).lean();

    let context: string;

    if (chunks.length > 0) {
      // Use embedding/lexical search to find relevant chunks
      const queryText = normalizeText(
        `${profile.displayName}; ${finalBirthDate || ''}; ${finalBirthTime || ''}; ${finalGender || ''}; ${question || ''}`
      );
      const queryEmbedding = await embedText(queryText);
      const useLexical = queryEmbedding.length === 0;

      const scored = chunks
        .map((chunk: any) => ({
          text: chunk.text,
          score: useLexical
            ? lexicalSimilarity(queryText, chunk.text)
            : cosineSimilarity(queryEmbedding, chunk.embedding || []),
        }))
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 12);

      context = scored.map((item: any) => item.text).join('\n---\n');
    } else if (profile.fullText) {
      // Fallback: use stored full text directly
      context = profile.fullText.slice(0, 30000);
    } else {
      // No chunks and no fullText — try to auto re-ingest from stored source
      const source = await FortuneSource.findOne({ profileSlug: slug, status: 'ready' })
        .sort({ createdAt: -1 });

      if (source?.fileUrl) {
        console.log(`🔄 Auto re-ingesting PDF for ${slug} (no chunks/fullText found)`);
        try {
          const buffer = await downloadFileToBuffer(source.fileUrl);
          await FortuneChunk.deleteMany({ profileSlug: slug });
          const ingestResult = await ingestPdfBuffer(buffer, source, profile);
          console.log(`✅ Auto re-ingest done: ${ingestResult.chunkCount} chunks`);

          // If parsedResult was generated during ingest, return it directly
          const refreshed = await FortuneProfile.findOne({ slug });
          if (refreshed?.parsedResult) {
            return res.json({ success: true, result: refreshed.parsedResult });
          }

          // Otherwise use fullText for context
          context = (refreshed?.fullText || '').slice(0, 30000);
          if (!context) {
            return res.status(400).json({ error: 'Re-ingest completed but no text extracted from PDF' });
          }
        } catch (reingestErr: any) {
          console.error('Auto re-ingest failed:', reingestErr);
          return res.status(400).json({
            error: 'PDF data missing and auto re-ingest failed',
            message: reingestErr.message,
            needsReupload: true,
          });
        }
      } else {
        return res.status(400).json({
          error: 'No PDF data found for this profile. Please upload the PDF again.',
          needsReupload: true,
        });
      }
    }

    // Re-generate with question context, merging with cached base result
    const freshResult = await generateFortuneResult({
      displayName: profile.displayName,
      birthDate: finalBirthDate,
      birthTime: finalBirthTime,
      gender: finalGender,
      question,
      context,
    });

    // Merge: keep cached detailed reading, overlay with fresh Q&A result
    const mergedResult = profile.parsedResult
      ? {
          ...profile.parsedResult,
          ...freshResult,
          // Keep the rich detailedReading from the original ingest
          detailedReading: {
            ...(profile.parsedResult as any).detailedReading,
            ...freshResult.detailedReading,
          },
        }
      : freshResult;

    // Cache the result for next time (backward compat: old profiles had no parsedResult)
    if (!profile.parsedResult) {
      profile.parsedResult = mergedResult as any;
      await profile.save();
      console.log(`💾 Cached parsedResult for ${slug} (backward compat)`);
    }

    await FortuneReading.create({
      profileSlug: slug,
      input: { birthDate: finalBirthDate, birthTime: finalBirthTime, gender: finalGender, question },
      result: mergedResult,
    });

    return res.json({ success: true, result: mergedResult });
  } catch (error: any) {
    console.error('Fortune generate error:', error);
    return res.status(500).json({ error: 'Failed to generate fortune', message: error.message });
  }
});

// ─── GET /history ──────────────────────────────────────────────────────────────
router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const profileSlug = req.query.profileSlug as string | undefined;
    const filter = profileSlug ? { profileSlug: normalizeSlug(profileSlug) } : {};
    const readings = await FortuneReading.find(filter).sort({ createdAt: -1 }).limit(50);
    return res.json({ readings });
  } catch (error: any) {
    console.error('Fortune history error:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
