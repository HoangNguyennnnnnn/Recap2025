import { cloudinary } from '../config/cloudinary.js';

/**
 * Cloudinary transformation utilities for optimized media delivery
 */

/**
 * Generate adaptive streaming URL for videos
 * @param publicId - Cloudinary public ID of the video
 * @returns Optimized video URL with adaptive quality and format
 */
export const getVideoStreamingUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { quality: 'auto' }, // Automatic quality based on network conditions
      { fetch_format: 'auto' }, // Automatic format (mp4, webm, etc.)
    ],
    secure: true,
  });
};

/**
 * Generate video thumbnail URL
 * @param publicId - Cloudinary public ID of the video
 * @returns Thumbnail image URL for the video
 */
export const getVideoThumbnail = (publicId: string): string => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width: 400, height: 300, crop: 'fill' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
    secure: true,
  });
};

/**
 * Generate responsive image URLs in multiple sizes
 * @param publicId - Cloudinary public ID of the photo
 * @returns Object with thumbnail, medium, and large URLs
 */
export const getPhotoResponsiveSizes = (publicId: string) => {
  const baseTransformation = {
    quality: 'auto',
    fetch_format: 'auto',
  };

  return {
    thumbnail: cloudinary.url(publicId, {
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        baseTransformation,
      ],
      secure: true,
    }),
    medium: cloudinary.url(publicId, {
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        baseTransformation,
      ],
      secure: true,
    }),
    large: cloudinary.url(publicId, {
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        baseTransformation,
      ],
      secure: true,
    }),
  };
};

/**
 * Generate blur placeholder for lazy loading
 * @param publicId - Cloudinary public ID of the photo
 * @returns Low-quality blurred placeholder URL for lazy loading
 */
export const getPhotoPlaceholder = (publicId: string): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 50, height: 50, crop: 'fill' },
      { effect: 'blur:1000' }, // Heavy blur
      { quality: 1 }, // Minimum quality for smallest file size
      { fetch_format: 'auto' },
    ],
    secure: true,
  });
};

/**
 * Generate full-quality photo URL
 * @param publicId - Cloudinary public ID of the photo
 * @returns Optimized full-quality photo URL
 */
export const getPhotoUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
    secure: true,
  });
};
