import express, { Request, Response } from 'express';
import { Memory, Comment, Reaction } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/memories
 * List all memories sorted by date descending
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const memories = await Memory.find().sort({ date: -1 }).skip(skip).limit(limit);

    const total = await Memory.countDocuments();

    return res.json({
      memories,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching memories:', error);
    return res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

/**
 * GET /api/memories/:id
 * Fetch a single memory with its comments and reactions
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const memory = await Memory.findById(id);
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    // Fetch related comments and reactions
    const [comments, reactions] = await Promise.all([
      Comment.find({ memoryId: id }).sort({ timestamp: -1 }),
      Reaction.find({ targetType: 'memory', targetId: id }),
    ]);

    return res.json({
      memory,
      comments,
      reactions,
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid memory ID format' });
    }
    console.error('Error fetching memory details:', error);
    return res.status(500).json({ error: 'Failed to fetch memory details' });
  }
});

/**
 * POST /api/memories
 * Create a new memory milestone (Protected)
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, date, photos, story, tags, location, sender } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const newMemory = new Memory({
      title,
      description,
      date,
      photos,
      story,
      tags,
      location,
      sender: sender || 'nthz',
    });

    await newMemory.save();

    return res.status(201).json({
      success: true,
      memory: newMemory,
    });
  } catch (error: any) {
    console.error('Error creating memory:', error);
    return res.status(500).json({ error: 'Failed to create memory' });
  }
});

/**
 * PUT /api/memories/:id
 * Update an existing memory (Protected)
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove immutable fields if present
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const memory = await Memory.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    return res.json({
      success: true,
      memory,
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid memory ID format' });
    }
    console.error('Error updating memory:', error);
    return res.status(500).json({ error: 'Failed to update memory' });
  }
});

/**
 * DELETE /api/memories/:id
 * Delete a memory (Protected)
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const memory = await Memory.findByIdAndDelete(id);
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    // Optionally cleanup related content
    await Promise.all([
      Comment.deleteMany({ memoryId: id }),
      Reaction.deleteMany({ targetType: 'memory', targetId: id }),
    ]);

    return res.json({
      success: true,
      message: 'Memory and related data deleted successfully',
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid memory ID format' });
    }
    console.error('Error deleting memory:', error);
    return res.status(500).json({ error: 'Failed to delete memory' });
  }
});

export default router;
