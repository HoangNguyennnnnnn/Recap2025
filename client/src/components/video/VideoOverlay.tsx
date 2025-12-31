import { motion } from 'framer-motion';
import { useState } from 'react';

interface VideoOverlayProps {
  title: string;
  date: string;
  description: string;
  likes: number;
  comments: number;
}

const VideoOverlay = ({ title, date, description, likes: initialLikes, comments }: VideoOverlayProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  return (
    <div className="absolute inset-0 flex items-end justify-between p-6 pb-24 md:pb-12 pointer-events-none">
      {/* Bottom Info Section */}
      <div className="flex-1 max-w-[80%] pointer-events-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-dancing text-2xl md:text-3xl text-stardust-gold mb-2 drop-shadow-md"
        >
          {title}
        </motion.h2>
        <p className="text-soft-pink text-sm opacity-80 mb-2 font-inter">{date}</p>
        <p className="text-white text-sm md:text-base line-clamp-3 font-inter drop-shadow-sm leading-relaxed">
          {description}
        </p>
        
        {/* Animated Music Disk / Pulse */}
        <div className="mt-4 flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border-4 border-gray-800 bg-gradient-to-tr from-gray-700 to-black flex items-center justify-center overflow-hidden"
          >
            <span className="text-lg">💿</span>
          </motion.div>
          <div className="overflow-hidden w-40">
            <motion.p 
              animate={{ x: [160, -160] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-xs text-soft-pink whitespace-nowrap opacity-60 italic"
            >
              Our Special Song - Forever Together
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right Interaction Sidebar */}
      <div className="flex flex-col items-center space-y-6 pointer-events-auto">
        {/* Love Button */}
        <div className="flex flex-col items-center">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleLike}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${liked ? 'bg-red-500 bg-opacity-40' : 'bg-black bg-opacity-30'}`}
          >
            <motion.span
              animate={liked ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              ❤️
            </motion.span>
          </motion.button>
          <span className="text-white text-xs mt-1 font-semibold">{likes}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-12 h-12 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-2xl"
          >
            💬
          </motion.button>
          <span className="text-white text-xs mt-1 font-semibold">{comments}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to our universe! ✨');
            }}
            className="w-12 h-12 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-2xl"
          >
            🔗
          </motion.button>
          <span className="text-white text-xs mt-1 font-semibold">Share</span>
        </div>
      </div>
    </div>
  );
};

export default VideoOverlay;
