import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import VideoOverlay from './VideoOverlay';

interface VideoCardProps {
  id: string;
  url: string;
  title: string;
  date: string;
  description: string;
  likes: number;
  comments: number;
  isActive: boolean;
}

const VideoCard = ({ id, url, title, date, description, likes, comments, isActive }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(e => console.log("Auto-play failed:", e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div id={id} className="relative h-screen min-h-screen w-full snap-start overflow-hidden bg-black flex items-center justify-center">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={url}
        className="h-full w-full object-cover md:max-w-[450px]"
        loop
        muted={isMuted}
        playsInline
        onClick={() => setIsMuted(!isMuted)}
      />

      {/* Mute Toggle Overlay (Briefly visible) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 0 : 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <span className="text-4xl">{isMuted ? '🔇' : '🔊'}</span>
      </motion.div>

      {/* Engagement Overlay */}
      <VideoOverlay 
        title={title}
        date={date}
        description={description}
        likes={likes}
        comments={comments}
      />
      
      {/* Mobile Swipe Hint (Only for first video or first few) */}
      {isActive && (
        <motion.div 
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-20, -40] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-xs font-inter pointer-events-none uppercase tracking-widest opacity-50"
        >
          Swipe Up ❤️
        </motion.div>
      )}
    </div>
  );
};

export default VideoCard;
