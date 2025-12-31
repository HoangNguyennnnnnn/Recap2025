# Cloudinary Setup Guide

This document explains how to configure and use Cloudinary for media storage and delivery in the Love Universe 2025 application.

## Overview

Cloudinary is used for:
- **Video Storage**: 33 videos with adaptive streaming
- **Photo Albums**: Organized photos by theme (winter, autumn, Huế, beach, nature, sweater)
- **Optimized Delivery**: Automatic quality, format selection, and responsive images
- **Lazy Loading**: Blur placeholders for better performance

## Getting Cloudinary Credentials

### 1. Create Cloudinary Account

1. Visit [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. The free tier includes:
   - 25 GB storage
   - 25 GB bandwidth per month
   - Sufficient for this application

### 2. Get Your Credentials

1. After logging in, go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. You'll see your **Account Details** section with:
   - **Cloud Name**: Your unique cloud identifier
   - **API Key**: Your API key for authentication
   - **API Secret**: Your secret key (click "reveal" to see it)

### 3. Add Credentials to Environment

1. Copy `server/.env.example` to `server/.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

## Folder Structure in Cloudinary

All media must be organized in the following folder structure:

```
/videos/                    # All 33 video files
  ├── video1.mp4
  ├── video2.mp4
  └── ...

/photos/                    # Root folder for all photo albums
  ├── winter/               # Winter album
  │   ├── photo1.jpg
  │   ├── photo2.jpg
  │   └── ...
  ├── autumn/               # Autumn album
  │   ├── photo1.jpg
  │   └── ...
  ├── hue/                  # Huế trip album
  │   ├── photo1.jpg
  │   └── ...
  ├── beach/                # Beach album
  │   ├── photo1.jpg
  │   └── ...
  ├── nature/               # Nature album
  │   ├── photo1.jpg
  │   └── ...
  └── sweater/              # Sweater album
      ├── photo1.jpg
      └── ...
```

## Uploading Media to Cloudinary

### Option 1: Cloudinary Dashboard (Recommended for Bulk Upload)

1. **Upload Videos:**
   - Go to [Media Library](https://cloudinary.com/console/media_library)
   - Click "Upload" button
   - Select your video files
   - Set the folder to `videos/` (type it in the folder field)
   - Upload all 33 videos

2. **Upload Photos:**
   - For each album (e.g., winter):
     - Click "Upload" button
     - Select photos for that album
     - Set folder to `photos/winter/`
     - Repeat for all albums: `photos/autumn/`, `photos/hue/`, etc.

### Option 2: Cloudinary Upload API (Programmatic)

For bulk uploads or automation, you can use the Cloudinary Upload API:

```javascript
// Example: Upload a video to /videos/ folder
cloudinary.uploader.upload('path/to/video.mp4', {
  resource_type: 'video',
  folder: 'videos',
  public_id: 'my-video-name'
});

// Example: Upload photos to /photos/winter/ folder
cloudinary.uploader.upload('path/to/photo.jpg', {
  folder: 'photos/winter',
  public_id: 'winter-photo-1'
});
```

### Option 3: Cloudinary CLI

Install the Cloudinary CLI and use it for bulk operations:

```bash
npm install -g cloudinary-cli
cld config
cld uploader upload video.mp4 folder=videos resource_type=video
```

## Naming Conventions

### Videos
- Use descriptive names: `romantic-sunset.mp4`, `beach-walk.mp4`
- Supported formats: MP4, MOV, AVI, WEBM
- The API will automatically apply adaptive streaming transformations

### Photos
- Use descriptive names: `winter-2023-01.jpg`, `hue-sunset.jpg`
- Supported formats: JPG, PNG, WEBP, HEIC
- The API will generate responsive sizes automatically

## Folder Organization Best Practices

1. **Consistent Naming**: Use lowercase with hyphens for readability
2. **Logical Grouping**: Keep related photos in the same album
3. **Album Names**: Use simple, URL-friendly names (letters, numbers, hyphens only)

## API Endpoints

Once media is uploaded, the following endpoints are available:

### Get All Videos
```bash
GET /api/media/videos?limit=50&offset=0
```

Returns videos with:
- Adaptive streaming URLs (automatic quality/format)
- Thumbnail images
- Duration, dimensions, format

### Get Photos by Album
```bash
GET /api/media/photos/:album?limit=50&offset=0
```

Example albums: `winter`, `autumn`, `hue`, `beach`, `nature`, `sweater`

Returns photos with:
- Responsive URLs (thumbnail, medium, large)
- Blur placeholder for lazy loading
- Dimensions, creation date

### Get Available Folders
```bash
GET /api/media/folders
```

Returns list of all photo albums with photo counts.

## Image Transformations Applied

### Videos
- **Quality**: `q_auto` - Automatic quality based on device
- **Format**: `f_auto` - Best format for browser (MP4, WebM, etc.)
- **Thumbnail**: 400x300 fill crop

### Photos
- **Thumbnail**: 300x300 fill crop
- **Medium**: 800x600 limit crop (maintains aspect ratio)
- **Large**: 1920x1080 limit crop (maintains aspect ratio)
- **Placeholder**: 50x50 with blur:1000 at quality:1 (for lazy loading)
- **All**: `q_auto` and `f_auto` applied

## Verifying Your Setup

After uploading media and configuring credentials:

1. Start the server:
   ```bash
   npm run dev
   ```

2. Test the endpoints:
   ```bash
   # Get videos
   curl http://localhost:3000/api/media/videos

   # Get folders
   curl http://localhost:3000/api/media/folders

   # Get photos from winter album
   curl http://localhost:3000/api/media/photos/winter
   ```

3. Check console for Cloudinary initialization:
   ```
   ✅ Cloudinary initialized successfully
   ☁️  Cloud name: your_cloud_name
   ```

## Troubleshooting

### Error: "Cloudinary not configured"
- Ensure `.env` file exists in `server/` directory
- Verify all three credentials are set: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Restart the server after adding credentials

### Error: "Album not found"
- Check folder structure in Cloudinary Media Library
- Ensure photos are in `/photos/{album}/` format
- Album names are case-sensitive

### Error: "Failed to fetch videos"
- Verify videos are uploaded to `/videos/` folder (not root)
- Check API credentials are correct
- Ensure API usage limits haven't been exceeded

### Empty Response
- Upload media to Cloudinary first
- Check folder names match expected structure
- Verify media is marked as "upload" type (not "fetch" or "private")

## Performance Optimization

The API automatically applies:
- **Lazy Loading**: Blur placeholders load instantly, full images load on demand
- **Responsive Images**: Multiple sizes served based on device screen size
- **Adaptive Quality**: Lower quality on slower networks, higher on fast connections
- **Modern Formats**: WebP on supported browsers, fallback to JPG/PNG

## Security Notes

- **Never commit `.env`**: The `.env` file is gitignored
- **Secure HTTPS**: All transformations use `secure: true` for HTTPS URLs
- **API Secret**: Keep your API secret private; it has full account access

## Next Steps

After setting up Cloudinary:
1. Upload your 33 videos to `/videos/` folder
2. Upload photos to respective album folders under `/photos/`
3. Test API endpoints to verify everything works
4. Integrate with frontend for video gallery and photo albums

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations Reference](https://cloudinary.com/documentation/image_transformations)
- [Video Transformations Reference](https://cloudinary.com/documentation/video_manipulation_and_delivery)
