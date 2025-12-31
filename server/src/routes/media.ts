import express, { Request, Response } from 'express';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import {
  getVideoStreamingUrl,
  getVideoThumbnail,
  getPhotoResponsiveSizes,
  getPhotoPlaceholder,
  getPhotoUrl,
} from '../utils/cloudinary-transforms.js';

const router = express.Router();

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

    res.json({
      videos,
      total: result.total_count || videos.length,
      nextCursor: result.next_cursor || null,
    });
  } catch (error: any) {
    console.error('Error fetching videos from Cloudinary:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
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

      // Transform photo data with responsive URLs
      const photos = result.resources.map((photo: any) => {
        const responsiveSizes = getPhotoResponsiveSizes(photo.public_id);
        
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
        };
      });

      res.json({
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
    res.status(500).json({
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

    res.json({
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

    res.status(500).json({
      error: 'Failed to fetch folders',
      message: error.message || 'Unknown error',
    });
  }
});

export default router;
