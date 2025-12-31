import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ILetter } from '../../../services/api';

interface LetterCardProps {
  letter: ILetter;
  index: number;
}

const LetterCard = ({ letter, index }: LetterCardProps) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isFullyUnlocked, setIsFullyUnlocked] = useState(!letter.isLocked);

  useEffect(() => {
    if (!letter.isLocked) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const unlock = new Date(letter.unlockDate);
      
      if (isNaN(unlock.getTime())) {
        setTimeLeft('Date Error');
        return;
      }

      const diff = unlock.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Unlocked');
        setIsFullyUnlocked(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(' '));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [letter.unlockDate, letter.isLocked]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/vault/letter/${letter._id}`)}
      className="group cursor-pointer relative"
    >
      {/* Envelope Container */}
      <div
        className={`relative aspect-video rounded-xl md:rounded-2xl transition-all duration-500 overflow-hidden border-2 ${
          isFullyUnlocked
            ? 'bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 border-pink-300 shadow-xl group-hover:shadow-pink-300/40'
            : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 group-hover:border-pink-300'
        }`}
      >
        {/* Envelope Flap Design */}
        <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
          <div className="text-center space-y-1.5 md:space-y-3">
            <div
              className={`text-3xl md:text-5xl transition-transform duration-500 ${
                isFullyUnlocked ? 'group-hover:scale-110 group-hover:rotate-6' : 'opacity-60'
              }`}
            >
              {isFullyUnlocked ? '✨💌✨' : '🔒'}
            </div>

            <h3 className="font-dancing text-xl md:text-2xl text-rose-600 font-bold">
              Secret Letter
            </h3>

            {/* Sender Badge */}
            <span
              className={`px-3 py-1 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider shadow-sm ${
                letter.sender === 'hna'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                  : 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white'
              }`}
            >
              💕 from {letter.sender || 'nthz'}
            </span>

            <div className="font-inter text-[9px] md:text-xs text-rose-400 font-medium">
              {new Date(letter.createdAt).toLocaleDateString('vi-VN')}
            </div>

            {/* Countdown / Status */}
            <div className="pt-1 md:pt-2">
              <span
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                  isFullyUnlocked
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse'
                    : 'bg-white/80 text-slate-500 border border-slate-300'
                }`}
              >
                {isFullyUnlocked ? '✨ Open Secret ✨' : `⏳ ${timeLeft}`}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Wax Seal */}
        {!isFullyUnlocked && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center text-white text-sm font-bold"
          >
            ⏳
          </motion.div>
        )}

        {/* Sparkle Effect for unlocked */}
        {isFullyUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/20 via-transparent to-yellow-200/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Label indicating it's special */}
      {isFullyUnlocked && !letter.isOpened && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soft-pink opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-soft-pink"></span>
        </span>
      )}
    </motion.div>
  );
};

export default LetterCard;
