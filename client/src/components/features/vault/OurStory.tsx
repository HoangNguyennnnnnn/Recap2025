import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface StoryMemory {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
}

// 7 kỷ niệm y hệt website cũ
const STORY_MEMORIES: StoryMemory[] = [
  {
    id: 1,
    title: 'Lần đầu gặp lại',
    subtitle: 'Kỷ niệm 1',
    description: 'Buổi gặp đầu tiên sau thời gian xa cách — cảm xúc khó tả',
    emoji: '💫',
    color: 'from-pink-400 to-rose-500',
  },
  {
    id: 2,
    title: 'Đi xem phim với nhau',
    subtitle: 'Kỷ niệm 2',
    description: 'Ngồi cạnh nhau xem phim, ăn bỏng ngô và hiểu nhau hơn',
    emoji: '🎬',
    color: 'from-purple-400 to-indigo-500',
  },
  {
    id: 3,
    title: 'PTB cùng nhóm',
    subtitle: 'Kỷ niệm 3',
    description: 'Zụng trộm không thể giấu :>',
    emoji: '👫',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 4,
    title: 'Homestay & Sinh nhật',
    subtitle: 'Kỷ niệm 4',
    description: 'Lần homestay đầu tiên - tui thích bất ngờ roàiii :3',
    emoji: '🎂',
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: 5,
    title: 'Đi cà phê Hàng Buồm nè',
    subtitle: 'Kỷ niệm 5',
    description: 'Buổi dạo phố và ghé quán cà phê xinh — chill cùng nhau.',
    emoji: '☕',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 6,
    title: 'PTB ngày 2/9',
    subtitle: 'Kỷ niệm 6',
    description: 'Kỷ niệm ngày lễ 2/9 cùng bé',
    emoji: '🎆',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 7,
    title: 'Ra sân bay tiễn người yêu',
    subtitle: 'Kỷ niệm 7',
    description: 'Khoảnh khắc tiễn biệt, ôm chặt và lời chúc ấm áp trước khi xa nhau',
    emoji: '✈️',
    color: 'from-red-400 to-rose-500',
  },
];

interface OurStoryProps {
  onBack: () => void;
}

const OurStory = ({ onBack }: OurStoryProps) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleCardClick = (memoryId: number) => {
    navigate(`/memory/${memoryId}`);
  };

  return (
    <div className="relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-dancing text-4xl md:text-5xl bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 bg-clip-text text-transparent mb-3">
            💞 Những kỷ niệm của chúng mình
          </h2>
          <p className="text-pink-300/80 text-sm">
            Nhấn vào ảnh để xem chi tiết — mỗi trang là một kỷ niệm đặc biệt ❤️
          </p>
        </motion.div>
      </div>

      {/* Memory Grid - Giống website cũ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {STORY_MEMORIES.map((memory, index) => (
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onHoverStart={() => setHoveredId(memory.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => handleCardClick(memory.id)}
            className="cursor-pointer group"
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-pink-400/50 transition-all"
              style={{
                boxShadow:
                  hoveredId === memory.id
                    ? '0 20px 40px -12px rgba(236, 72, 153, 0.4)'
                    : '0 10px 30px -12px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Gradient background with emoji */}
              <div className="relative h-40 md:h-48 overflow-hidden">
                <div
                  className={`w-full h-full bg-gradient-to-br ${memory.color} flex items-center justify-center`}
                >
                  <motion.span
                    animate={
                      hoveredId === memory.id ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}
                    }
                    transition={{ duration: 0.5 }}
                    className="text-6xl"
                  >
                    {memory.emoji}
                  </motion.span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <motion.div
                    animate={hoveredId === memory.id ? { rotate: [0, 10, -10, 0] } : {}}
                    className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-lg`}
                  >
                    {memory.emoji}
                  </motion.div>
                </div>

                {/* Subtitle badge */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white bg-gradient-to-r ${memory.color} shadow-lg`}
                  >
                    {memory.subtitle}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-dancing text-xl md:text-2xl text-white mb-1 group-hover:text-pink-300 transition-colors">
                  {memory.title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm line-clamp-2">
                  {memory.description}
                </p>
                <div className="mt-3 flex items-center justify-end">
                  <motion.span
                    animate={hoveredId === memory.id ? { x: [0, 5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-pink-400 text-xs flex items-center gap-1"
                  >
                    Xem chi tiết
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Back to Vault button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={onBack}
          className="cursor-pointer group"
        >
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border-2 border-dashed border-pink-400/30 hover:border-pink-400/60 transition-all h-full min-h-[200px] flex flex-col items-center justify-center p-6"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl mb-3"
            >
              ✨
            </motion.div>
            <h3 className="font-dancing text-xl text-pink-300 mb-2 text-center">
              Còn nhiều kỷ niệm nữa...
            </h3>
            <p className="text-pink-400/60 text-xs text-center">Nhấn vào để xem / thêm kỷ niệm</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-10"
      >
        <p className="font-dancing text-lg text-pink-400/60">Love Journey • Created with ❤️</p>
      </motion.div>
    </div>
  );
};

export default OurStory;
