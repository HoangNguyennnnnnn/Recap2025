import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../../services/api';

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

const PhotoLightbox = ({ photos, initialIndex, onClose }: PhotoLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const currentPhoto = photos[currentIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Prevents background scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black bg-opacity-95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Background Deep-Blue Glow */}
      <div className="absolute inset-0 bg-deep-blue opacity-40 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <p className="font-dancing text-soft-pink text-2xl drop-shadow-lg">
            {new Date(currentPhoto.createdAt).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className="text-stardust-gold text-xs tracking-widest uppercase opacity-80">
            Memory {currentIndex + 1} / {photos.length}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="pointer-events-auto bg-white bg-opacity-10 hover:bg-opacity-20 p-3 rounded-full transition-all group"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Photo Container */}
      <div 
        className="relative w-full h-full max-w-5xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPhoto.publicId}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
              }
            }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <motion.img
              layoutId={`photo-${currentPhoto.publicId}`}
              src={currentPhoto.large}
              alt="Memory"
              className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
              style={{
                backgroundImage: `url(${currentPhoto.placeholder})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Photo Caption Overlay */}
            {currentPhoto.caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[80%] pointer-events-none"
              >
                <div className="bg-black bg-opacity-40 backdrop-blur-md border border-white border-opacity-10 px-6 py-3 rounded-2xl shadow-2xl text-center">
                  <p className="font-dancing text-soft-pink text-xl md:text-2xl drop-shadow-md">
                    {currentPhoto.caption}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute left-0 md:-left-16 text-white text-4xl opacity-50 hover:opacity-100 transition-opacity p-4 hidden md:block"
        >
          ‹
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute right-0 md:-right-16 text-white text-4xl opacity-50 hover:opacity-100 transition-opacity p-4 hidden md:block"
        >
          ›
        </button>
      </div>

      {/* Download Button (Subtle) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a 
          href={currentPhoto.large} 
          download 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 px-4 py-2 rounded-full backdrop-blur-md transition-all group scale-90"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4 text-stardust-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12 a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="text-[10px] tracking-widest text-white uppercase font-bold">Save Memory</span>
        </a>
      </div>
    </motion.div>
  );
};

export default PhotoLightbox;
