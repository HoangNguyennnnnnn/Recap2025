import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FlowerRenderer, GARDEN_FLOWERS } from './SvgFlowers';

// ─── Particles ──────────────────────────────────────────────────────
const SPARKLE_COLORS = [
  '#FFD700', '#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB',
  '#FF85A2', '#FFDAB9', '#FFF0F5', '#FFE4E1', '#FFFACD',
];
const PETAL_COLORS = ['#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB', '#DB7093', '#FFD1DC'];

const makeSparkles = (n: number) => Array.from({ length: n }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 6 + 2, delay: Math.random() * 3,
  dur: Math.random() * 2 + 1.5,
  color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
}));

const makePetals = (n: number) => Array.from({ length: n }, (_, i) => ({
  id: i, x: Math.random() * 100, delay: Math.random() * 8,
  dur: Math.random() * 6 + 6, size: Math.random() * 18 + 10,
  rot: Math.random() * 360,
  color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
}));

// ─── Typewriter ─────────────────────────────────────────────────────
const TypewriterLine = ({ text, startDelay = 0, className = '' }: {
  text: string; startDelay?: number; className?: string;
}) => {
  const chars = useMemo(() => Array.from(text), [text]);
  return (
    <p className={`flex flex-wrap justify-center ${className}`}>
      {chars.map((c: string, i: number) => (
        <motion.span key={i} className="inline-block"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: startDelay + i * 0.04 }}
        >{c === ' ' ? '\u00A0' : c}</motion.span>
      ))}
    </p>
  );
};

// ─── Gift Box ───────────────────────────────────────────────────────
const GiftBox = ({ onOpen }: { onOpen: () => void }) => (
  <motion.div className="relative cursor-pointer"
    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onOpen}
  >
    <motion.div className="absolute inset-0 rounded-3xl" style={{
      background: 'radial-gradient(circle, rgba(255,105,180,0.4) 0%, transparent 70%)',
      filter: 'blur(30px)', transform: 'scale(1.5)',
    }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />

    <motion.div className="relative w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 50%, #C71585 100%)',
        boxShadow: '0 20px 60px rgba(255,20,147,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 w-8 h-full"
        style={{ background: 'linear-gradient(90deg, #FFD700, #FFC800, #FFD700)' }} />
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-8"
        style={{ background: 'linear-gradient(180deg, #FFD700, #FFC800, #FFD700)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
        <div className="relative">
          <div className="absolute -left-7 -top-3 w-10 h-8 rounded-full"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', transform: 'rotate(-30deg)' }} />
          <div className="absolute -right-7 -top-3 w-10 h-8 rounded-full"
            style={{ background: 'linear-gradient(225deg, #FFD700, #FFA500)', transform: 'rotate(30deg)' }} />
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-5 h-5 rounded-full"
            style={{ background: 'radial-gradient(circle, #FFD700, #FFA500)' }} />
        </div>
      </div>
      <motion.div className="absolute inset-0" style={{
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, transparent 50%)',
      }} animate={{ x: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} />
    </motion.div>

    <motion.p className="text-center mt-6 text-lg md:text-xl font-bold" style={{
      background: 'linear-gradient(135deg, #FFD700, #FF69B4)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    }} animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.5 }}>
      ✨ Ấn để mở quà ✨
    </motion.p>
  </motion.div>
);

// ─── Main Page ──────────────────────────────────────────────────────
const WomensDayPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'opening' | 'garden' | 'message'>('intro');
  const [showFlowers, setShowFlowers] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sparkles = useMemo(() => makeSparkles(60), []);
  const petals = useMemo(() => makePetals(35), []);

  const startMusic = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/audio/2024/11/29/audio_d06fcaf0f5.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    audioRef.current.play().catch(() => {});
  }, []);

  useEffect(() => () => { audioRef.current?.pause(); audioRef.current = null; }, []);

  const handleOpenGift = useCallback(() => {
    startMusic();
    setPhase('opening');
    setTimeout(() => { setPhase('garden'); setShowFlowers(true); }, 1500);
    setTimeout(() => { setPhase('message'); setShowMessage(true); }, 6000);
  }, [startMusic]);

  const bg = phase === 'intro'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)'
    : 'linear-gradient(180deg, #0a0a15 0%, #150820 25%, #1f0a30 50%, #2d1040 75%, #150820 100%)';

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bg, transition: 'background 2s ease' }}>
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div key={`s${i}`} className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`,
              backgroundColor: i % 5 === 0 ? '#FFD700' : '#FFF',
            }}
            animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <AnimatePresence>
        {phase !== 'intro' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {sparkles.map(s => (
              <motion.div key={s.id} className="absolute rounded-full" style={{
                left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
                backgroundColor: s.color,
                boxShadow: `0 0 ${s.size * 3}px ${s.color}, 0 0 ${s.size * 6}px ${s.color}44`,
              }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -40, -80] }}
                transition={{ repeat: Infinity, duration: s.dur, delay: s.delay, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Falling Petals */}
      <AnimatePresence>
        {showFlowers && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            {petals.map(p => (
              <motion.div key={`p${p.id}`} className="absolute" style={{
                left: `${p.x}%`, width: p.size, height: p.size * 0.6,
                background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`,
                borderRadius: '50% 0 50% 0', opacity: 0.6,
              }}
                initial={{ top: '-5%', rotate: p.rot }}
                animate={{ top: '105%', rotate: p.rot + 720, x: [0, 40, -40, 30, -20, 0] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Intro */}
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div key="intro" className="flex flex-col items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }} transition={{ duration: 0.8 }}
            >
              <motion.div className="mb-8 text-center"
                initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.p className="text-4xl md:text-6xl mb-3"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>🌸</motion.p>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 font-dancing" style={{
                  background: 'linear-gradient(135deg, #FF69B4, #FFD700, #FF1493)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Happy Women's Day</h1>
                <p className="text-pink-300/80 text-lg md:text-xl italic">
                  Ngày 8 tháng 3 — Dành tặng em yêu 💕
                </p>
              </motion.div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}>
                <GiftBox onOpen={handleOpenGift} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opening explosion */}
        <AnimatePresence>
          {phase === 'opening' && (
            <motion.div key="opening" className="flex flex-col items-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: 40 }).map((_, i) => {
                const a = (360 / 40) * i, d = 100 + Math.random() * 150;
                return (
                  <motion.div key={i} className="absolute rounded-full" style={{
                    width: Math.random() * 14 + 4, height: Math.random() * 14 + 4,
                    background: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
                    boxShadow: `0 0 20px ${SPARKLE_COLORS[i % SPARKLE_COLORS.length]}`,
                  }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(a * Math.PI / 180) * d,
                      y: Math.sin(a * Math.PI / 180) * d, opacity: 0, scale: 0,
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                );
              })}
              <motion.p className="text-6xl" initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }} transition={{ duration: 0.8 }}>🎉</motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Garden + Message */}
        <AnimatePresence>
          {(phase === 'garden' || phase === 'message') && (
            <motion.div key="garden" className="w-full min-h-screen flex flex-col relative"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              <motion.div className="text-center pt-8 pb-4"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}>
                <h2 className="text-3xl md:text-5xl font-bold font-dancing" style={{
                  background: 'linear-gradient(135deg, #FF69B4, #FFD700, #FF1493)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(255,105,180,0.3))',
                }}>Vườn hoa dành tặng em 🌸</h2>
              </motion.div>

              {/* Flower garden */}
              <div className="flex-grow relative w-full" style={{ minHeight: '45vh' }}>
                <div className="absolute bottom-0 left-0 right-0" style={{
                  height: '15%',
                  background: 'linear-gradient(to top, rgba(30,70,30,0.3) 0%, transparent 100%)',
                  borderRadius: '50% 50% 0 0',
                }} />
                {showFlowers && GARDEN_FLOWERS.map((cfg, i) => (
                  <FlowerRenderer key={i} {...cfg} />
                ))}
              </div>

              {/* Message */}
              <AnimatePresence>
                {showMessage && (
                  <motion.div key="msg" className="w-full flex justify-center pb-8 px-4"
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}>
                    <div className="w-full max-w-2xl rounded-3xl p-6 md:p-10 backdrop-blur-xl relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,105,180,0.15) 0%, rgba(255,20,147,0.1) 50%, rgba(199,21,133,0.15) 100%)',
                        border: '1px solid rgba(255,105,180,0.3)',
                        boxShadow: '0 20px 60px rgba(255,20,147,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                      }}>
                      <div className="absolute top-3 left-4 text-2xl">🌹</div>
                      <div className="absolute top-3 right-4 text-2xl">🌷</div>

                      <div className="mt-6 space-y-4 text-center font-inter">
                        <TypewriterLine text="Bé yêu à," startDelay={0.8}
                          className="text-xl md:text-2xl font-bold text-pink-300" />
                        <TypewriterLine text="Nhân ngày 8/3, anh muốn gửi tới em" startDelay={2.0}
                          className="text-base md:text-lg text-pink-200/90" />
                        <TypewriterLine text="những lời yêu thương nhất. Em là điều tuyệt vời" startDelay={4.0}
                          className="text-base md:text-lg text-pink-200/90" />
                        <TypewriterLine text="nhất đến với cuộc đời anh. 💕" startDelay={6.5}
                          className="text-base md:text-lg text-pink-200/90" />
                        <TypewriterLine text="Cảm ơn em vì luôn ở bên, luôn làm cuộc sống" startDelay={8.5}
                          className="text-base md:text-lg text-pink-200/90" />
                        <TypewriterLine text="của anh trở nên ý nghĩa và đáng trân trọng hơn." startDelay={11.0}
                          className="text-base md:text-lg text-pink-200/90" />
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 14 }}>
                          <TypewriterLine text="Yêu em nhiều lắm! 🌸💖🌸" startDelay={14.5}
                            className="text-xl md:text-2xl font-bold text-pink-300 mt-4" />
                        </motion.div>
                      </div>

                      <motion.div className="flex justify-center gap-4 mt-8"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 17 }}>
                        <button onClick={() => { setPhase('intro'); setShowFlowers(false); setShowMessage(false); }}
                          className="px-6 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #FF69B4, #FF1493)', boxShadow: '0 8px 30px rgba(255,20,147,0.4)' }}>
                          <span>🎁</span> Xem lại
                        </button>
                        <button onClick={() => navigate('/')}
                          className="px-6 py-3 rounded-2xl font-bold text-pink-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                          style={{ border: '2px solid rgba(255,105,180,0.4)', background: 'rgba(255,105,180,0.1)' }}>
                          <span>💌</span> Về trang chủ
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient glow orbs */}
      {phase !== 'intro' && (<>
        <motion.div className="absolute w-64 h-64 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(255,105,180,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)', left: '10%', top: '20%',
        }} animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} />
        <motion.div className="absolute w-96 h-96 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)', right: '5%', top: '40%',
        }} animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }} />
        <motion.div className="absolute w-72 h-72 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(233,30,99,0.15) 0%, transparent 70%)',
          filter: 'blur(45px)', left: '40%', bottom: '10%',
        }} animate={{ x: [-20, 20, -20], y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }} />
      </>)}
    </div>
  );
};

export default WomensDayPage;
