import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IMemory } from '../../../services/api';

interface MemoryCardProps {
  memory: IMemory;
  index: number;
}

const MemoryCard = ({ memory, index }: MemoryCardProps) => {
  const navigate = useNavigate();

  // Simple Cloudinary medium transform helper
  const getMediumUrl = (url: string) => {
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/c_fill,w_600,h_800,g_auto/q_auto,f_auto/');
    }
    return url;
  };

  const formattedDate = new Date(memory.date).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        rotateY: 5,
        rotateX: -5,
        z: 10,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/vault/${memory._id}`)}
      className="group cursor-pointer perspective-1000"
    >
      <div className="bg-white p-2 md:p-4 pb-5 md:pb-8 shadow-xl transform-gpu transition-all duration-300 group-hover:shadow-stardust-gold/30 rounded-sm md:rounded-md">
        {/* Memory Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-2 md:mb-4 rounded-sm">
          <motion.img
            layoutId={`memory-image-${memory._id}`}
            src={
              memory.photos.length > 0
                ? getMediumUrl(memory.photos[0])
                : 'https://via.placeholder.com/600x800?text=Our+Memory'
            }
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-dancing text-lg md:text-2xl text-deep-blue font-bold truncate flex-1">
              {memory.title}
            </h3>
            {/* Sender Badge */}
            <span
              className={`ml-2 px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                memory.sender === 'hna'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                  : 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white'
              }`}
            >
              💕 {memory.sender || 'nthz'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] md:text-xs font-inter text-gray-500 font-medium">
              {formattedDate}
            </span>
            {memory.location && (
              <span className="flex items-center text-[8px] md:text-[10px] text-soft-pink font-semibold truncate max-w-[80px] md:max-w-none">
                <svg
                  className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{memory.location}</span>
              </span>
            )}
          </div>

          {/* Tags - Hide on mobile to save space */}
          <div className="hidden md:flex flex-wrap gap-1.5 pt-2">
            {memory.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-rose-600 text-[9px] rounded-full font-bold uppercase tracking-wider shadow-sm"
              >
                ✨ {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Reflection Highlight */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default MemoryCard;
