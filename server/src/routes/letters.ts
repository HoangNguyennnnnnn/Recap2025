import express, { Request, Response } from 'express';
import { Letter } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/letters
 * Fetch all letters (header/meta only)
 * Security: Withholds content if the letter is still locked.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const letters = await Letter.find().sort({ unlockDate: 1 });
    const now = new Date();

    const sanitizedLetters = letters.map((letter) => {
      const isLocked = now < letter.unlockDate;

      return {
        _id: letter._id,
        unlockDate: letter.unlockDate,
        isOpened: letter.isOpened,
        createdAt: letter.createdAt,
        sender: letter.sender || 'nthz',
        // Only include content if unlocked
        content: isLocked ? null : letter.content,
        isLocked: isLocked,
      };
    });

    return res.json(sanitizedLetters);
  } catch (error: any) {
    console.error('Error fetching letters:', error);
    return res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

/**
 * GET /api/letters/:id
 * Fetch a specific letter with time-gating enforcement.
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const letter = await Letter.findById(id);

    if (!letter) {
      return res.status(404).json({ error: 'Letter not found' });
    }

    const now = new Date();
    const isLocked = now < letter.unlockDate;

    if (isLocked) {
      return res.json({
        _id: letter._id,
        unlockDate: letter.unlockDate,
        isOpened: letter.isOpened,
        sender: letter.sender || 'nthz',
        createdAt: letter.createdAt,
        isLocked: true,
        content: null,
      });
    }

    // Auto-Open: Mark as opened if first time viewing after unlock
    if (!letter.isOpened) {
      letter.isOpened = true;
      await letter.save();
    }

    return res.json(letter);
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid letter ID format' });
    }
    console.error('Error fetching letter detail:', error);
    return res.status(500).json({ error: 'Failed to fetch letter details' });
  }
});

/**
 * POST /api/letters
 * Create a new romantic letter (Protected)
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { content, unlockDate, sender } = req.body;

    if (!content || !unlockDate) {
      return res.status(400).json({ error: 'Content and unlock date are required' });
    }

    const newLetter = new Letter({
      content,
      unlockDate: new Date(unlockDate),
      isOpened: false,
      sender: sender || 'nthz',
    });

    await newLetter.save();

    return res.status(201).json({
      success: true,
      letter: newLetter,
    });
  } catch (error: any) {
    console.error('Error creating letter:', error);
    return res.status(500).json({ error: 'Failed to create letter' });
  }
});

/**
 * Seeding Example:
 * POST /api/letters
 * Body: { "content": "I love you more than all the stars...", "unlockDate": "2026-01-01T00:00:00Z" }
 */

export default router;
