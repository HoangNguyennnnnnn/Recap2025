import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SpecialMemory {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  thumbnail?: string; // Ảnh đại diện
}

// 7 kỷ niệm đặc biệt mặc định - KHÔNG THỂ XÓA
// Thumbnail lấy từ ảnh đầu tiên trong StoryMemoryDetail.tsx
export const SPECIAL_MEMORIES: SpecialMemory[] = [
  {
    id: 1,
    title: 'Lần đầu gặp lại',
    subtitle: 'Kỷ niệm 1',
    description: 'Buổi gặp đầu tiên sau thời gian xa cách — cảm xúc khó tả',
    emoji: '💫',
    color: 'from-pink-400 to-rose-500',
    thumbnail:
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194114/301925bc-d6a1-4813-baf1-467ee20682b6.png',
  },
  {
    id: 2,
    title: 'Đi xem phim với nhau',
    subtitle: 'Kỷ niệm 2',
    description: 'Ngồi cạnh nhau xem phim, ăn bỏng ngô và hiểu nhau hơn',
    emoji: '🎬',
    color: 'from-purple-400 to-indigo-500',
    thumbnail:
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194328/2deacd50-f253-4cf3-a9a6-f05a011a0bd6.png',
  },
  {
    id: 3,
    title: 'PTB cùng nhóm',
    subtitle: 'Kỷ niệm 3',
    description: 'Zụng trộm không thể giấu :>',
    emoji: '👫',
    color: 'from-amber-400 to-orange-500',
    thumbnail:
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194606/7520f2de-aee4-48c5-b51a-0ca555d2ba69.png',
  },
  {
    id: 4,
    title: 'Homestay & Sinh nhật',
    subtitle: 'Kỷ niệm 4',
    description: 'Lần homestay đầu tiên - tui thích bất ngờ roàiii :3',
    emoji: '🎂',
    color: 'from-rose-400 to-pink-500',
    thumbnail:
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195016/8cae7462-f166-4947-af01-e89463ab82d0.png',
  },
  {
    id: 5,
    title: 'Đi cà phê Hàng Buồm nè',
    subtitle: 'Kỷ niệm 5',
    description: 'Buổi dạo phố và ghé quán cà phê xinh — chill cùng nhau.',
    emoji: '☕',
    color: 'from-amber-500 to-yellow-500',
    thumbnail:
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195166/86a8d9ae-ca90-450a-844e-2bebb070d918.png',
  },
  {
    id: 6,
    title: 'PTB ngày 2/9',
    subtitle: 'Kỷ niệm 6',
    description: 'Kỷ niệm ngày lễ 2/9 cùng bé',
    emoji: '🎆',
    color: 'from-blue-400 to-cyan-500',
    thumbnail: 'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_5.jpg',
  },
  {
    id: 7,
    title: 'Ra sân bay tiễn người yêu',
    subtitle: 'Kỷ niệm 7',
    description: 'Khoảnh khắc tiễn biệt, ôm chặt và lời chúc ấm áp',
    emoji: '✈️',
    color: 'from-red-400 to-rose-500',
    thumbnail: 'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb12.png',
  },
];

interface SpecialMemoryCardProps {
  memory: SpecialMemory;
  index: number;
}

const SpecialMemoryCard = ({ memory, index }: SpecialMemoryCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/memory/${memory.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-pink-400/40 hover:border-pink-400 transition-all shadow-lg hover:shadow-pink-500/20">
        {/* Ảnh đại diện hoặc gradient với emoji */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {memory.thumbnail ? (
            <img
              src={memory.thumbnail}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${memory.color} flex items-center justify-center`}
            >
              <span className="text-5xl md:text-6xl">{memory.emoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Emoji overlay khi có ảnh */}
          {memory.thumbnail && (
            <div className="absolute top-2 right-2 text-2xl drop-shadow-lg">{memory.emoji}</div>
          )}

          {/* Special badge - đặc biệt */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded-full text-[8px] md:text-[10px] font-bold text-white bg-amber-500/90 shadow-md">
              ⭐ Đặc biệt
            </span>
          </div>

          {/* Subtitle badge */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white bg-gradient-to-r ${memory.color} shadow-md`}
            >
              {memory.subtitle}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          <h3 className="font-dancing text-lg md:text-xl text-white mb-1 group-hover:text-pink-300 transition-colors truncate">
            {memory.title}
          </h3>
          <p className="text-white/60 text-[10px] md:text-xs line-clamp-2">{memory.description}</p>

          {/* View indicator - giảm animation */}
          <div className="mt-2 flex items-center justify-end">
            <span className="text-pink-400 text-[10px] md:text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Xem chi tiết
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpecialMemoryCard;
