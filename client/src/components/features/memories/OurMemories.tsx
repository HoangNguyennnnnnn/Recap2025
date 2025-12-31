import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface Memory {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  image: string;
  emoji: string;
  color: string;
  bgGradient: string;
  specialEffect: 'hearts' | 'stars' | 'confetti' | 'sparkles' | 'flowers' | 'fireworks' | 'love';
}

const MEMORIES: Memory[] = [
  {
    id: 1,
    title: 'Lần đầu gặp nhau',
    subtitle: 'Kỷ niệm 1',
    description:
      'Buổi gặp đầu tiên — cảm xúc khó tả, tim đập nhanh và những ánh nhìn ngại ngùng. Khoảnh khắc định mệnh đã đưa chúng mình đến bên nhau 💕',
    date: '26/07/2025',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600',
    emoji: '💫',
    color: 'from-pink-400 to-rose-500',
    bgGradient: 'from-pink-100 via-rose-50 to-pink-100',
    specialEffect: 'hearts',
  },
  {
    id: 2,
    title: 'Đi xem phim cùng nhau',
    subtitle: 'Kỷ niệm 2',
    description:
      'Ngồi cạnh nhau trong rạp tối, chia sẻ bắp rang và những khoảnh khắc ngọt ngào. Tay vô tình chạm tay, tim bỗng loạn nhịp 🎬',
    date: '02/08/2025',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
    emoji: '🎬',
    color: 'from-purple-400 to-indigo-500',
    bgGradient: 'from-purple-100 via-indigo-50 to-purple-100',
    specialEffect: 'stars',
  },
  {
    id: 3,
    title: 'Cùng đi chơi với nhóm',
    subtitle: 'Kỷ niệm 3',
    description:
      'Đi chơi cùng bạn bè nhưng mắt chỉ tìm nhau. Những cái liếc trộm, nụ cười che giấu — ai cũng thấy trừ chúng mình 🤭',
    date: '15/08/2025',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600',
    emoji: '👫',
    color: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-100 via-orange-50 to-amber-100',
    specialEffect: 'confetti',
  },
  {
    id: 4,
    title: 'Homestay & Sinh nhật',
    subtitle: 'Kỷ niệm 4',
    description:
      'Lần homestay đầu tiên cùng nhau, tổ chức sinh nhật bất ngờ. Em thích bất ngờ mà — và anh thích thấy em cười 🎂',
    date: '01/09/2025',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600',
    emoji: '🎂',
    color: 'from-rose-400 to-pink-500',
    bgGradient: 'from-rose-100 via-pink-50 to-rose-100',
    specialEffect: 'fireworks',
  },
  {
    id: 5,
    title: 'Đi cà phê cùng nhau',
    subtitle: 'Kỷ niệm 5',
    description:
      'Buổi chiều lãng mạn ở quán cà phê xinh. Ngồi bên nhau, nhâm nhi ly trà và kể cho nhau nghe mọi điều ☕',
    date: '10/09/2025',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600',
    emoji: '☕',
    color: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-50 via-yellow-50 to-amber-50',
    specialEffect: 'sparkles',
  },
  {
    id: 6,
    title: 'Kỷ niệm ngày lễ',
    subtitle: 'Kỷ niệm 6',
    description:
      'Ngày lễ đặc biệt bên nhau, tay trong tay dạo phố và tạo thêm nhiều kỷ niệm đẹp. Mỗi khoảnh khắc đều đáng nhớ 🎆',
    date: '02/10/2025',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600',
    emoji: '🎆',
    color: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-100 via-cyan-50 to-blue-100',
    specialEffect: 'flowers',
  },
  {
    id: 7,
    title: 'Những lời yêu thương',
    subtitle: 'Kỷ niệm 7',
    description:
      'Những khoảnh khắc bên nhau, ôm chặt và lời yêu thương ấm áp. Dù có xa cách, tình yêu vẫn mãi bền chặt 💕',
    date: '15/10/2025',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600',
    emoji: '💕',
    color: 'from-red-400 to-rose-500',
    bgGradient: 'from-red-100 via-rose-50 to-red-100',
    specialEffect: 'love',
  },
];

const OurMemories = () => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const triggerEffect = (effect: Memory['specialEffect']) => {
    switch (effect) {
      case 'hearts':
        // Heart rain effect
        const heartInterval = setInterval(() => {
          confetti({
            particleCount: 3,
            angle: 90,
            spread: 60,
            origin: { x: Math.random(), y: 0 },
            colors: ['#ff6b81', '#ff4757', '#ff6b6b'],
            shapes: ['circle'],
            gravity: 0.5,
            scalar: 1.5,
            drift: 0,
          });
        }, 100);
        setTimeout(() => clearInterval(heartInterval), 2000);
        break;

      case 'stars':
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ffec8b', '#fff8dc', '#fffacd'],
        });
        break;

      case 'confetti':
        confetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0.5 },
          colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
        });
        break;

      case 'sparkles':
        const sparkleColors = ['#ffd700', '#ffb347', '#ff6b6b', '#ff69b4'];
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 30,
              angle: 60 + Math.random() * 60,
              spread: 50,
              origin: { x: Math.random(), y: Math.random() * 0.5 + 0.25 },
              colors: sparkleColors,
            });
          }, i * 200);
        }
        break;

      case 'flowers':
        confetti({
          particleCount: 80,
          spread: 120,
          origin: { y: 0.7 },
          colors: ['#ffb7c5', '#ffc0cb', '#ff69b4', '#ff1493', '#db7093'],
          shapes: ['circle'],
          scalar: 1.2,
        });
        break;

      case 'fireworks':
        const end = Date.now() + 2000;
        const fireworkColors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#ff00ff'];
        (function frame() {
          confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: fireworkColors,
          });
          confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: fireworkColors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
        break;

      case 'love':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b81', '#ff4757', '#ff6b6b', '#ee5a70', '#f8a5b8'],
        });
        break;
    }
  };

  const handleCardClick = (memory: Memory) => {
    setSelectedMemory(memory);
    triggerEffect(memory.specialEffect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/30"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${14 + Math.random() * 14}px`,
            }}
            initial={{ y: -30, opacity: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              opacity: [0, 0.4, 0.4, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          >
            {['💕', '✨', '🌸', '💖', '🦋', '💗', '🌷'][i % 7]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-pink-500 hover:text-pink-600 transition-colors text-sm mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-dancing text-5xl md:text-7xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-4">
              💞 Những kỷ niệm của chúng mình
            </h1>
            <p className="text-pink-400 text-lg">
              Nhấn vào ảnh để xem chi tiết — mỗi trang là một kỷ niệm đặc biệt ❤️
            </p>
          </motion.div>
        </header>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {MEMORIES.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onHoverStart={() => setHoveredId(memory.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => handleCardClick(memory)}
              className="cursor-pointer group"
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300`}
                style={{
                  boxShadow:
                    hoveredId === memory.id
                      ? `0 25px 50px -12px rgba(236, 72, 153, 0.3)`
                      : undefined,
                }}
              >
                {/* Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Emoji badge */}
                  <motion.div
                    animate={
                      hoveredId === memory.id ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}
                    }
                    transition={{ duration: 0.5 }}
                    className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${memory.color} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {memory.emoji}
                  </motion.div>

                  {/* Subtitle badge */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${memory.color}`}
                    >
                      {memory.subtitle}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-dancing text-2xl text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {memory.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{memory.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-pink-400">{memory.date}</span>
                    <motion.span
                      animate={hoveredId === memory.id ? { x: [0, 5, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-pink-400 text-sm"
                    >
                      Xem chi tiết →
                    </motion.span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === memory.id ? 1 : 0 }}
                  className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${memory.color} opacity-10`}
                />
              </motion.div>
            </motion.div>
          ))}

          {/* "More memories" card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="cursor-pointer group"
          >
            <Link to="/vault">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full min-h-[300px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-pink-300 hover:border-pink-500"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  ✨
                </motion.div>
                <h3 className="font-dancing text-2xl text-pink-600 mb-2 text-center">
                  Còn nhiều kỷ niệm nữa...
                </h3>
                <p className="text-pink-400 text-sm text-center">Nhấn vào để xem thêm kỷ niệm</p>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <p className="font-dancing text-xl text-pink-400">Love Journey • Created with ❤️</p>
        </motion.div>
      </div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-gradient-to-br ${selectedMemory.bgGradient} rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900 hover:bg-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                {/* Floating emoji */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br ${selectedMemory.color} flex items-center justify-center text-4xl shadow-2xl`}
                >
                  {selectedMemory.emoji}
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-block px-4 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${selectedMemory.color} mb-4`}
                >
                  {selectedMemory.subtitle}
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-dancing text-4xl md:text-5xl text-gray-800 mb-4"
                >
                  {selectedMemory.title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-lg leading-relaxed mb-6"
                >
                  {selectedMemory.description}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-pink-400 text-sm"
                >
                  📅 {selectedMemory.date}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => triggerEffect(selectedMemory.specialEffect)}
                  className={`mt-8 px-8 py-3 bg-gradient-to-r ${selectedMemory.color} text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all`}
                >
                  ✨ Xem hiệu ứng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OurMemories;
