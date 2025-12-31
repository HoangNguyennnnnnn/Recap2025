import express, { Request, Response } from 'express';
import multer from 'multer';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import { PhotoMetadata, HnaGallery, SecretMedia } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  getVideoStreamingUrl,
  getVideoThumbnail,
  getPhotoResponsiveSizes,
  getPhotoPlaceholder,
  getPhotoUrl,
} from '../utils/cloudinary-transforms.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
});

/**
 * POST /api/media/upload
 * Upload image or video to Cloudinary
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!isCloudinaryConfigured()) {
        return res.status(503).json({
          error: 'Cloudinary not configured',
          message: 'Please set CLOUDINARY credentials in environment variables',
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const isVideo = req.file.mimetype.startsWith('video/');
      const folder = isVideo ? 'uploads/videos' : 'uploads/photos';
      const resourceType = isVideo ? 'video' : 'image';

      // Convert buffer to base64 data URI
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: resourceType,
        transformation: isVideo ? undefined : [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
      });

      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        resourceType: result.resource_type,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Upload failed',
        message: error.message || 'Unknown error',
      });
    }
  }
);

/**
 * GET /api/media/videos
 * List all videos with adaptive streaming URLs
 */
router.get('/videos', async (_req: Request, res: Response) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary not configured',
        message: 'Please set CLOUDINARY credentials in environment variables',
      });
    }

    // Parse query parameters for pagination
    const limit = parseInt(_req.query.limit as string) || 50;
    const offset = parseInt(_req.query.offset as string) || 0;

    // Fetch videos from Cloudinary /videos/ folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      prefix: 'videos/', // Videos folder
      max_results: limit,
      next_cursor: offset > 0 ? String(offset) : undefined,
    });

    // Transform video data with streaming URLs
    const videos = result.resources.map((video: any) => ({
      publicId: video.public_id,
      url: getVideoStreamingUrl(video.public_id),
      thumbnail: getVideoThumbnail(video.public_id),
      duration: video.duration || 0,
      format: video.format,
      width: video.width,
      height: video.height,
      createdAt: video.created_at,
    }));

    return res.json({
      videos,
      total: result.total_count || videos.length,
      nextCursor: result.next_cursor || null,
    });
  } catch (error: any) {
    console.error('Error fetching videos from Cloudinary:', error);
    return res.status(500).json({
      error: 'Failed to fetch videos',
      message: error.message || 'Unknown error',
    });
  }
});

/**
 * GET /api/media/photos
 * List all photos from the main uploads folder with pagination
 */
router.get('/photos', async (req: Request, res: Response) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary not configured',
        message: 'Please set CLOUDINARY credentials in environment variables',
      });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const nextCursor = req.query.nextCursor as string;

    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'uploads/photos/',
      max_results: limit,
      next_cursor: nextCursor || undefined,
    });

    // Fetch metadata from MongoDB
    const publicIds = result.resources.map((r: any) => r.public_id);
    const metadataList = await PhotoMetadata.find({ publicId: { $in: publicIds } });

    const photos = result.resources.map((photo: any) => {
      const responsiveSizes = getPhotoResponsiveSizes(photo.public_id);
      const metadata = metadataList.find((m) => m.publicId === photo.public_id);

      return {
        publicId: photo.public_id,
        url: getPhotoUrl(photo.public_id),
        thumbnail: responsiveSizes.thumbnail,
        medium: responsiveSizes.medium,
        large: responsiveSizes.large,
        placeholder: getPhotoPlaceholder(photo.public_id),
        width: photo.width,
        height: photo.height,
        createdAt: photo.created_at,
        caption: metadata?.caption || '',
        tags: metadata?.tags || [],
        batchId: metadata?.batchId,
      };
    });

    return res.json({
      photos,
      total: result.total_count || photos.length,
      nextCursor: result.next_cursor || null,
    });
  } catch (error: any) {
    console.error('Error fetching general photos:', error);
    return res.status(500).json({
      error: 'Failed to fetch photos',
      message: error.message || 'Unknown error',
    });
  }
});

/**
 * GET /api/media/photos/:album
 * List photos by album folder
 */
router.get('/photos/:album', async (req: Request, res: Response) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary not configured',
        message: 'Please set CLOUDINARY credentials in environment variables',
      });
    }

    const { album } = req.params;

    // Validate album name (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9-_]+$/.test(album)) {
      return res.status(400).json({
        error: 'Invalid album name',
        message: 'Album name must contain only letters, numbers, hyphens, and underscores',
      });
    }

    // Parse query parameters for pagination
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      // Fetch photos from Cloudinary /photos/{album}/ folder
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix: `photos/${album}/`, // Album folder
        max_results: limit,
        next_cursor: offset > 0 ? String(offset) : undefined,
      });

      // Check if album exists (no resources found)
      if (!result.resources || result.resources.length === 0) {
        return res.status(404).json({
          error: 'Album not found',
          message: `No photos found in album '${album}'`,
        });
      }

      // Fetch metadata from MongoDB for these photos
      const publicIds = result.resources.map((r: any) => r.public_id);
      const metadataList = await PhotoMetadata.find({ publicId: { $in: publicIds } });

      // Transform photo data with responsive URLs and metadata
      const photos = result.resources.map((photo: any) => {
        const responsiveSizes = getPhotoResponsiveSizes(photo.public_id);
        const metadata = metadataList.find((m) => m.publicId === photo.public_id);

        return {
          publicId: photo.public_id,
          url: getPhotoUrl(photo.public_id),
          thumbnail: responsiveSizes.thumbnail,
          medium: responsiveSizes.medium,
          large: responsiveSizes.large,
          placeholder: getPhotoPlaceholder(photo.public_id),
          width: photo.width,
          height: photo.height,
          createdAt: photo.created_at,
          caption: metadata?.caption || 'No caption yet ❤️',
          tags: metadata?.tags || [],
          batchId: metadata?.batchId,
          order: metadata?.order || 0,
        };
      });

      return res.json({
        album,
        photos,
        total: result.total_count || photos.length,
        nextCursor: result.next_cursor || null,
      });
    } catch (error: any) {
      // Handle album not found error
      if (error.error && error.error.http_code === 404) {
        return res.status(404).json({
          error: 'Album not found',
          message: `Album '${album}' does not exist`,
        });
      }
      throw error; // Re-throw for generic error handler
    }
  } catch (error: any) {
    console.error(`Error fetching photos from album '${req.params.album}':`, error);
    return res.status(500).json({
      error: 'Failed to fetch photos',
      message: error.message || 'Unknown error',
    });
  }
});

/**
 * GET /api/media/folders
 * List available photo albums
 */
router.get('/folders', async (_req: Request, res: Response) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary not configured',
        message: 'Please set CLOUDINARY credentials in environment variables',
      });
    }

    // Fetch folders from /photos/ directory
    const result = await cloudinary.api.sub_folders('photos');

    // Get photo count for each folder
    const foldersWithCount = await Promise.all(
      result.folders.map(async (folder: any) => {
        try {
          const resources = await cloudinary.api.resources({
            type: 'upload',
            resource_type: 'image',
            prefix: `photos/${folder.name}/`,
            max_results: 1, // Just get count
          });

          return {
            name: folder.name,
            path: folder.path,
            count: resources.total_count || 0,
          };
        } catch (error) {
          console.error(`Error counting photos in folder '${folder.name}':`, error);
          return {
            name: folder.name,
            path: folder.path,
            count: 0,
          };
        }
      })
    );

    return res.json({
      folders: foldersWithCount,
      total: foldersWithCount.length,
    });
  } catch (error: any) {
    console.error('Error fetching photo folders:', error);

    // Check if photos folder doesn't exist
    if (error.error && error.error.http_code === 404) {
      return res.json({
        folders: [],
        total: 0,
        message: 'No photo folders found. Upload photos to /photos/ folder in Cloudinary.',
      });
    }

    return res.status(500).json({
      error: 'Failed to fetch folders',
      message: error.message || 'Unknown error',
    });
  }
});

/**
 * GET /api/media/hna-gallery
 * Fetch all photo sets from the Hna Gallery
 */
router.get('/hna-gallery', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const sets = await HnaGallery.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await HnaGallery.countDocuments();

    return res.json({
      sets,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching Hna Gallery sets:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery sets' });
  }
});

/**
 * POST /api/media/hna-gallery
 * Create a new photo set
 */
router.post('/hna-gallery', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, description, photos, tags, date } = req.body;

    if (!photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    const newSet = new HnaGallery({
      title,
      description,
      photos,
      tags,
      date: date ? new Date(date) : new Date(),
    });

    await newSet.save();

    return res.status(201).json({
      success: true,
      message: 'Photo set created successfully',
      set: newSet,
    });
  } catch (error: any) {
    console.error('Error creating Hna Gallery set:', error);
    return res.status(500).json({ error: 'Failed to create gallery set' });
  }
});

/**
 * POST /api/media/photos/metadata
 * Update or create metadata for a photo
 */
router.post('/photos/metadata', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { publicId, caption, tags, album, order, batchId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'PublicID is required' });
    }

    const metadata = await PhotoMetadata.findOneAndUpdate(
      { publicId },
      {
        publicId,
        caption,
        tags,
        album,
        order,
        batchId,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message: 'Metadata updated successfully',
      metadata,
    });
  } catch (error: any) {
    console.error(`Error updating metadata for photo:`, error);
    return res.status(500).json({
      error: 'Failed to update metadata',
      message: error.message || 'Unknown error',
    });
  }
});

/**
 * GET /api/media/secret-room
 * Fetch all secrets from the Secret Room
 */
router.get('/secret-room', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const secrets = await SecretMedia.find().sort({ date: -1 });
    return res.json(secrets);
  } catch (error: any) {
    console.error('Error fetching secret media:', error);
    return res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

/**
 * POST /api/media/secret-room
 * Add a new secret (photo, video, or note)
 */
router.post('/secret-room', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type, title, content, url, publicId, date } = req.body;

    if (!type || !title) {
      return res.status(400).json({ error: 'Type and title are required' });
    }

    const newSecret = new SecretMedia({
      type,
      title,
      content,
      url,
      publicId,
      date: date ? new Date(date) : new Date(),
    });

    await newSecret.save();

    return res.status(201).json({
      success: true,
      message: 'Secret added successfully',
      secret: newSecret,
    });
  } catch (error: any) {
    console.error('Error adding secret:', error);
    return res.status(500).json({ error: 'Failed to add secret' });
  }
});

export default router;
