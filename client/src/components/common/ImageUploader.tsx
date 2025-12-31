import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '../../utils/auth';

export interface UploadedFile {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  images: string[] | UploadedFile[];
  onChange: (images: any[]) => void;
  maxImages?: number;
  label?: string;
  acceptVideo?: boolean;
}

const ImageUploader = ({
  images,
  onChange,
  maxImages = 10,
  label = 'Ảnh & Video',
  acceptVideo = true,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const uploadToServer = async (file: File): Promise<UploadedFile | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get token from auth utils
      const token = getToken();

      const response = await fetch(`${API_URL}/api/media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      return { url: data.url, publicId: data.publicId };
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = acceptVideo && file.type.startsWith('video/');
        return isImage || isVideo;
      });

      if (validFiles.length === 0) return;
      if (images.length + validFiles.length > maxImages) {
        alert(`Chỉ được upload tối đa ${maxImages} ảnh/video`);
        return;
      }

      setUploading(true);

      const uploadPromises = validFiles.map((file) => uploadToServer(file));
      const results = await Promise.all(uploadPromises);
      const successItems = results.filter((item): item is UploadedFile => item !== null);

      if (successItems.length > 0) {
        // If the initial images are strings, we might need to be careful.
        // But we'll assume the client handles the transition or we pass consistent types.
        onChange([...images, ...successItems]);
      } else if (validFiles.length > 0) {
        alert('Upload thất bại. Vui lòng thử lại!');
      }
      setUploading(false);
    },
    [images, maxImages, acceptVideo, onChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Handle paste
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of items) {
        if (item.type.startsWith('image/') || (acceptVideo && item.type.startsWith('video/'))) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        handleFiles(files);
      }
    },
    [acceptVideo, handleFiles]
  );

  // Add paste listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const isVideo = (item: string | UploadedFile) => {
    const url = typeof item === 'string' ? item : item.url;
    return url.includes('/video/') || url.match(/\.(mp4|webm|mov|avi)$/i);
  };

  return (
    <div ref={containerRef}>
      <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
        {label}{' '}
        <span className="text-slate-500">
          ({images.length}/{maxImages})
        </span>
      </label>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-pink-400 bg-pink-500/10'
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptVideo ? 'image/*,video/*' : 'image/*'}
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-3 border-pink-400 border-t-transparent rounded-full"
            />
            <span className="text-pink-300 text-sm">Đang upload...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">📸</div>
            <p className="text-slate-400 text-sm">
              <span className="text-pink-400 font-medium">Click để chọn</span> hoặc kéo thả ảnh vào
              đây
            </p>
            <p className="text-slate-500 text-xs">
              Hoặc <span className="text-pink-400">Ctrl+V</span> để paste ảnh từ clipboard
            </p>
            {acceptVideo && (
              <p className="text-slate-500 text-xs">Hỗ trợ: JPG, PNG, GIF, MP4, WebM</p>
            )}
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((item, index) => {
              const url = typeof item === 'string' ? item : item.url;
              const key = typeof item === 'string' ? item : item.publicId;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                {isVideo(item) ? (
                  <video src={url} className="w-full h-full object-cover" muted />
                ) : (
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Video badge */}
                {isVideo(item) && (
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white">
                    🎬 Video
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>

                {/* Index badge */}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white">
                  {index + 1}
                </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
