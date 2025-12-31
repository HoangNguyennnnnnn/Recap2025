import express, { Request, Response } from 'express';
import { VoiceNote } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/voice
 * Fetch all voice notes sorted by date descending
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const voiceNotes = await VoiceNote.find().sort({ date: -1 });
    return res.json(voiceNotes);
  } catch (error: any) {
    console.error('Error fetching voice notes:', error);
    return res.status(500).json({ error: 'Failed to fetch voice notes' });
  }
});

/**
 * GET /api/voice/nearby
 * Query voice notes within a certain lat/lng radius
 */
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 0.1; // Default radius

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng query parameters are required' });
    }

    const voiceNotes = await VoiceNote.find({
      'coordinates.lat': { $gte: lat - radius, $lte: lat + radius },
      'coordinates.lng': { $gte: lng - radius, $lte: lng + radius }
    }).sort({ date: -1 });

    return res.json(voiceNotes);
  } catch (error: any) {
    console.error('Error fetching nearby voice notes:', error);
    return res.status(500).json({ error: 'Failed to fetch nearby voice notes' });
  }
});

/**
 * POST /api/voice
 * Upload a new voice note (Protected)
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { location, coordinates, audioUrl, transcript, date } = req.body;

    if (!location || !coordinates || !audioUrl || !date) {
      return res.status(400).json({ error: 'Location, coordinates, audioUrl, and date are required' });
    }

    if (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      return res.status(400).json({ error: 'Coordinates must contain numeric lat and lng' });
    }

    const newVoiceNote = new VoiceNote({
      location,
      coordinates,
      audioUrl,
      transcript,
      date: new Date(date)
    });

    await newVoiceNote.save();

    return res.status(201).json({
      success: true,
      voiceNote: newVoiceNote
    });
  } catch (error: any) {
    console.error('Error creating voice note:', error);
    return res.status(500).json({ error: 'Failed to create voice note' });
  }
});

export default router;
