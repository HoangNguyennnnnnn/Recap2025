import { motion } from 'framer-motion';
import { Photo } from '../../services/api';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
  albumName: string;
}

const PhotoGrid = ({ photos, onPhotoClick, albumName }: PhotoGridProps) => {
  return (
    <div className="w-full h-full pb-24 px-4 overflow-y-auto hide-scrollbar">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex flex-col space-y-2">
          <h2 className="text-4xl md:text-5xl font-dancing text-soft-pink capitalize">
            {albumName}
          </h2>
          <p className="text-stardust-gold text-sm tracking-[0.2em] uppercase font-inter opacity-60">
            {photos.length} Captured Memories
          </p>
        </div>

        {/* Masonry-style Masonry Grid (CSS Column based for simplicity) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.publicId}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 1) }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onPhotoClick(photo, index)}
              className="relative cursor-pointer group break-inside-avoid rounded-2xl overflow-hidden shadow-xl border border-white border-opacity-5 hover:border-opacity-30 transition-all"
            >
              <motion.img 
                layoutId={`photo-${photo.publicId}`}
                src={photo.medium} 
                alt={`Photo ${index}`}
                loading="lazy"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-blue to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
              
              {/* Date tag on hover */}
              <div className="absolute bottom-4 left-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-[10px] tracking-widest uppercase font-bold bg-black bg-opacity-40 backdrop-blur-sm px-2 py-1 rounded">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoGrid;
