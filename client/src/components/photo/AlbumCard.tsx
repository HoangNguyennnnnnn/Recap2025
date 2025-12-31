import { motion } from 'framer-motion';
import { Album } from '../../services/api';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
  index: number;
}

const AlbumCard = ({ album, onClick, index }: AlbumCardProps) => {
  // Use a nice gradient for background or a placeholder if we had thumbnails for albums
  const colorSchemes = [
    'from-soft-pink to-romantic-red',
    'from-stardust-gold to-deep-blue',
    'from-purple-500 to-indigo-600',
    'from-cyan-400 to-blue-500',
    'from-rose-400 to-pink-600',
    'from-amber-400 to-orange-500',
  ];

  const colorClass = colorSchemes[index % colorSchemes.length];

  return (
    <motion.div
      layoutId={`album-${album.name}`}
      onClick={onClick}
      className="relative cursor-pointer group w-64 h-80 md:w-72 md:h-96"
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Glassmorphism Card */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-opacity`} />
      
      <div className="relative h-full w-full bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 border-glow">
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            className="text-6xl md:text-7xl opacity-80 group-hover:scale-110 transition-transform"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            📸
          </motion.div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-dancing text-soft-pink group-hover:text-white transition-colors capitalize">
            {album.name}
          </h3>
          <p className="text-stardust-gold text-xs font-inter tracking-widest uppercase opacity-60">
            {album.count} Moments
          </p>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-[10px] tracking-widest font-bold bg-romantic-red px-2 py-1 rounded-full shadow-lg">
            VIEW
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .border-glow:hover {
          box-shadow: 0 0 20px rgba(255, 182, 193, 0.3);
          border-color: rgba(255, 182, 193, 0.5);
        }
      `}} />
    </motion.div>
  );
};

export default AlbumCard;
