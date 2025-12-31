import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UniverseBackground from '../../universe/UniverseBackground';
import { fetchLetterById, ILetter } from '../../../services/api';

const LetterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [letter, setLetter] = useState<ILetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!id) return;

    const loadLetter = async () => {
      try {
        setLoading(true);
        const data = await fetchLetterById(id);
        setLetter(data);
      } catch (err: any) {
        console.error('Error loading letter:', err);
        alert('Có lỗi xảy ra khi tải thư. Vui lòng thử lại sau!');
      } finally {
        setLoading(false);
      }
    };

    loadLetter();
  }, [id]);

  useEffect(() => {
    if (!letter || !letter.isLocked) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const unlock = new Date(letter.unlockDate);
      
      if (isNaN(unlock.getTime())) {
        setTimeLeft('Invalid Date');
        return;
      }

      const diff = unlock.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Ready to Unlock');
        window.location.reload();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [letter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-blue flex items-center justify-center">
        <UniverseBackground />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-dancing text-4xl text-stardust-gold"
        >
          Unsealing the message...
        </motion.div>
      </div>
    );
  }

  const isLocked = letter?.isLocked;

  return (
    <div className="min-h-screen bg-deep-blue text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      <UniverseBackground />

      {/* Back Button */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6">
        <button
          onClick={() => navigate('/vault')}
          className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 hover:border-soft-pink/50 transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-dancing text-lg text-soft-pink">Vault</span>
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="z-10 text-center space-y-8 max-w-lg"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                ✨🔒✨
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-4 border-dashed border-pink-400/40 rounded-full"
              />
            </div>

            <h2 className="font-dancing text-5xl bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
              A Secret in Time 💕
            </h2>

            <p className="font-inter text-pink-300 text-lg italic px-4">
              "This secret is still maturing... some things are worth the wait! 💝"
            </p>

            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-400/30 rounded-2xl p-6 backdrop-blur-md shadow-lg">
              <div className="text-xs uppercase tracking-[0.3em] text-pink-300 mb-2 font-bold">
                ⏳ Unlocks in
              </div>
              <div className="font-mono text-3xl md:text-4xl bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent tracking-wider font-bold mb-4">
                {timeLeft || '---'}
              </div>
              
              {letter?.unlockDate && (
                <div className="pt-4 border-t border-pink-400/20 text-xs text-pink-400/60 font-inter">
                  Mở khóa vào: {new Date(letter.unlockDate).toLocaleString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>

            <div className="text-sm text-pink-400 font-inter py-4">
              🌟 Có những điều tuyệt vời luôn xứng đáng để chờ đợi 🌟
            </div>
          </motion.div>
        ) : (
          letter && (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.9, rotateX: 45 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="z-10 relative max-w-2xl w-full perspective-2000"
            >
              {/* Parchment Container */}
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 text-deep-blue p-8 md:p-16 rounded-2xl shadow-[0_20px_50px_rgba(236,72,153,0.3)] relative overflow-hidden border-2 border-pink-200">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')]" />

                {/* Decorative Border */}
                <div className="absolute inset-4 border-2 border-pink-300/30 rounded-xl pointer-events-none" />

                {/* Hand-written Content */}
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start mb-12">
                    <div className="font-dancing text-xl text-rose-500 italic font-bold">
                      ✨{' '}
                      {new Date(letter.createdAt).toLocaleDateString('vi-VN', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl shadow-lg">
                      💌
                    </div>
                  </div>

                  <div className="font-dancing text-2xl md:text-3xl leading-[1.8] text-rose-800">
                    {letter.content?.split('\n').map((line, i) => (
                      <p key={i} className="mb-4">
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="mt-16 text-right">
                    <p className="font-dancing text-2xl text-rose-500">Forever Yours 💕</p>
                    <p className="font-dancing text-4xl mt-2 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-bold">
                      {letter.sender || 'nthz'}
                    </p>
                  </div>
                </div>

                {/* Decorative sparkles */}
                <div className="absolute top-4 right-4 text-2xl animate-pulse">✨</div>
                <div className="absolute bottom-4 left-4 text-2xl animate-pulse delay-500">💖</div>
              </div>

              {/* Floating Hearts Animation Background */}
              <div className="absolute -inset-20 z-[-1] pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                      opacity: [0, 0.3, 0],
                      y: [-100, -500],
                      x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                    }}
                    transition={{
                      duration: 5 + Math.random() * 5,
                      repeat: Infinity,
                      delay: i * 2,
                    }}
                    className="absolute bottom-0 text-soft-pink/40 text-2xl"
                    style={{ left: `${15 * i}%` }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default LetterDetail;
