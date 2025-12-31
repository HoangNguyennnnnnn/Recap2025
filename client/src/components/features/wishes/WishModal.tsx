import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UniverseBackground from '../../universe/UniverseBackground';

const StarParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{ 
      opacity: [1, 0], 
      scale: [0, 1.5, 0],
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200
    }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
    className="absolute top-1/2 left-1/2 w-2 h-2 bg-stardust-gold rounded-full shadow-[0_0_10px_gold]"
  />
);

const WishModal = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate();
  const [wish, setWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  // Handling the submission
  const handleSubmit = async () => {
    if (!wish.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay / "Woven into stars" processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('✨ Twinkle Sound Triggered ✨');
    setIsSubmitting(false);
    setIsSent(true);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-deep-blue overflow-hidden">
      <UniverseBackground />

      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div
            key="input-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50, filter: "blur(10px)" }}
            className="relative z-10 w-full max-w-lg"
          >
            {/* Glassmorphism Card */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-soft-pink/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-4xl mb-4 animate-pulse">🌠</div>
                <h2 className="font-dancing text-4xl text-stardust-gold drop-shadow-md mb-2">
                  Make a Wish
                </h2>
                <p className="font-inter text-soft-pink/60 text-xs uppercase tracking-widest">
                  Cast your dreams into the universe
                </p>
              </div>

              {/* Input Area */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-soft-pink/30 to-stardust-gold/30 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="I wish for..."
                  className="relative w-full bg-black/20 border border-white/10 rounded-xl p-6 text-xl md:text-2xl font-dancing text-white placeholder:text-white/20 focus:outline-none focus:border-soft-pink/40 min-h-[150px] resize-none transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!wish.trim() || isSubmitting}
                className="w-full relative group overflow-hidden rounded-full py-4 bg-gradient-to-r from-soft-pink/10 to-stardust-gold/10 border border-soft-pink/30 hover:border-soft-pink/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-soft-pink/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative font-inter text-sm font-bold uppercase tracking-widest text-stardust-gold group-hover:text-white transition-colors flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Weaving Stardust...
                    </>
                  ) : (
                    <>
                      Release Wish ✨
                    </>
                  )}
                </span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-20 flex flex-col items-center justify-center text-center"
          >
            {/* Flying Star Animation */}
            <motion.div
              initial={{ y: 0, scale: 1, filter: "blur(0px)" }}
              animate={{ 
                y: -500, 
                scale: 0,
                opacity: 0
              }}
              transition={{ duration: 2, ease: "easeIn" }}
              className="text-6xl mb-8 relative"
            >
              🌟
              {/* Particle Trail */}
              {[...Array(12)].map((_, i) => (
                <StarParticle key={i} delay={i * 0.1} />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6 max-w-md p-6"
            >
              <h2 className="font-dancing text-3xl md:text-5xl text-stardust-gold leading-tight">
                Your wish has been woven into the stars.
              </h2>
              <p className="font-inter text-soft-pink/60 text-sm">
                The universe is listening.
              </p>
              
              <button 
                onClick={handleClose}
                className="mt-8 px-8 py-3 rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest"
              >
                Back to Earth
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishModal;
