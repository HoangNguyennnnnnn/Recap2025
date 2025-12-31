import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { User } from '../models/index.js';

const router = express.Router();

// Rate limiter for auth endpoint - 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many attempts, please try again later',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * POST /api/auth/verify
 * Verify passcode and generate JWT token
 */
router.post('/verify', authLimiter, async (req: Request, res: Response) => {
  try {
    const { passcode } = req.body;

    // Validate passcode presence
    if (!passcode) {
      return res.status(400).json({
        success: false,
        message: 'Passcode required',
      });
    }

    // Get AUTH_PASSCODE from environment
    const AUTH_PASSCODE = process.env.AUTH_PASSCODE;

    if (!AUTH_PASSCODE) {
      console.error('AUTH_PASSCODE is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Authentication not configured',
      });
    }

    // Verify passcode
    if (passcode !== AUTH_PASSCODE) {
      return res.status(401).json({
        success: false,
        message: 'Invalid passcode',
      });
    }

    // Generate session ID
    const sessionId = uuidv4();

    // Generate JWT token
    const token = generateToken({
      sessionId,
      timestamp: Date.now(),
    });

    // Create or update User document with sessionToken
    const user = await User.findOneAndUpdate(
      { sessionToken: sessionId }, // Try to find by sessionToken
      {
        sessionToken: sessionId,
        lastVisit: new Date(),
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return updated document
        setDefaultsOnInsert: true, // Set default values on insert
      }
    );

    console.log(`✅ User authenticated successfully: ${user._id}`);

    return res.json({
      success: true,
      token,
      message: 'Authenticated successfully',
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
});

/**
 * GET /api/auth/validate
 * Validate JWT token and return user info
 */
router.get('/validate', async (req: Request, res: Response) => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'No token provided',
      });
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.sessionId) {
      return res.status(401).json({
        valid: false,
        message: 'Invalid or expired token',
      });
    }

    // Check if sessionToken exists in User model
    const user = await User.findOne({ sessionToken: decoded.sessionId });

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: 'Session not found',
      });
    }

    return res.json({
      valid: true,
      user: {
        lastVisit: user.lastVisit,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Auth validate error:', error);
    return res.status(500).json({
      valid: false,
      message: 'Validation error',
    });
  }
});

export default router;
