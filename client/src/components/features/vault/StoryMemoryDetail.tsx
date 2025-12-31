import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface StoryMemoryData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  // User sẽ thêm link ảnh và video vào đây
  images: string[];
  videos: string[];
  emoji: string;
  color: string;
  bgGradient: string;
  specialEffect: 'hearts' | 'stars' | 'confetti' | 'sparkles' | 'flowers' | 'fireworks' | 'love';
}

// 7 kỷ niệm y hệt website cũ - USER CHỈ CẦN THAY LINK ẢNH/VIDEO
const STORY_MEMORIES: StoryMemoryData[] = [
  {
    id: 1,
    title: 'Lần đầu gặp lại',
    subtitle: 'Kỷ niệm 1',
    description:
      'Buổi gặp đầu tiên sau thời gian xa cách — cảm xúc khó tả. Tim đập thình thịch, tay run run khi gặp lại sau bao ngày nhớ thương. Khoảnh khắc ấy mãi in sâu trong tim... 💕',
    date: '', // User điền ngày
    images: [
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194114/301925bc-d6a1-4813-baf1-467ee20682b6.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194128/162686da-d3cf-446e-9ae2-e7b61e51e221.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194100/f54fa3d7-c244-4808-84eb-6650db937b0f.png',
      // THÊM LINK ẢNH VÀO ĐÂY
      // 'https://example.com/image1.jpg',
      // 'https://example.com/image2.jpg',
    ],
    videos: [
      // THÊM LINK VIDEO VÀO ĐÂY
      // 'https://example.com/video1.mp4',
    ],
    emoji: '💫',
    color: 'from-pink-400 to-rose-500',
    bgGradient: 'from-pink-900/50 via-rose-900/30 to-pink-900/50',
    specialEffect: 'hearts',
  },
  {
    id: 2,
    title: 'Đi xem phim với nhau',
    subtitle: 'Kỷ niệm 2',
    description:
      'Ngồi cạnh nhau xem phim, ăn bỏng ngô và hiểu nhau hơn. Ánh sáng màn hình phản chiếu trên gương mặt em, anh chẳng còn nhớ phim gì, chỉ nhớ có em bên cạnh... 🎬',
    date: '',
    images: [
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194328/2deacd50-f253-4cf3-a9a6-f05a011a0bd6.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194269/67810f5d-0472-4e0d-b9cf-f926de3f5799.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194246/0a38c9be-def2-47ea-a9c2-a68eeb60690b.png',
    ],
    videos: [],
    emoji: '🎬',
    color: 'from-purple-400 to-indigo-500',
    bgGradient: 'from-purple-900/50 via-indigo-900/30 to-purple-900/50',
    specialEffect: 'stars',
  },
  {
    id: 3,
    title: 'PTB cùng nhóm',
    subtitle: 'Kỷ niệm 3',
    description:
      'Zụng trộm không thể giấu :> Đi cùng nhóm mà mắt chỉ tìm nhau, ai cũng nhận ra chỉ mình chúng ta là không biết. Những cái liếc trộm, nụ cười ngại ngùng... 🤭',
    date: '',
    images: [
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194606/7520f2de-aee4-48c5-b51a-0ca555d2ba69.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194520/8610d109-bfd0-4df0-9180-c2c54ee900f9.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194500/eb90447a-4559-47ac-b327-8c15532fdab3.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194615/a7abc4c0-c1eb-47b2-a8b3-20a7fb948b65.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194571/02dfe02a-2b0e-4be5-9b27-1905d4379f14.png',
    ],
    videos: [
      'https://res.cloudinary.com/dn7xu3u3m/video/upload/v1767194649/ptb_video_vertical_diwyfz.mp4',
    ],
    emoji: '👫',
    color: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-900/50 via-orange-900/30 to-amber-900/50',
    specialEffect: 'confetti',
  },
  {
    id: 4,
    title: 'Homestay & Sinh nhật',
    subtitle: 'Kỷ niệm 4',
    description:
      'Lần homestay đầu tiên - tui thích bất ngờ roàiii :3 Anh chuẩn bị mọi thứ trong bí mật, chỉ để thấy nụ cười rạng rỡ của em khi mở cửa phòng... 🎂',
    date: '',
    images: [
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195016/8cae7462-f166-4947-af01-e89463ab82d0.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194827/9733900a-8fe8-4d23-b43f-a5a4dd9d5a41.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194846/addb2757-6574-4457-b66b-1ac43d4190aa.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194857/414a9bf5-a5ca-4c46-98ff-d20687b1df68.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194886/88945cb6-e10a-4b1a-805a-93903e8d7d91.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194875/607ca20c-c9c8-4cda-8089-22de46101283.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767194892/f5e0bff4-1e93-450c-9858-f920a6a36f4a.png',
    ],
    videos: [],
    emoji: '🎂',
    color: 'from-rose-400 to-pink-500',
    bgGradient: 'from-rose-900/50 via-pink-900/30 to-rose-900/50',
    specialEffect: 'fireworks',
  },
  {
    id: 5,
    title: 'Đi cà phê Hàng Buồm nè',
    subtitle: 'Kỷ niệm 5',
    description:
      'Buổi dạo phố và ghé quán cà phê xinh — chill cùng nhau. Ngồi bên cửa sổ, nhìn ra phố cổ, tay trong tay nói chuyện hàng giờ không biết chán... ☕',
    date: '',
    images: [
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195166/86a8d9ae-ca90-450a-844e-2bebb070d918.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195136/298881f8-48ec-4a07-a756-abe84461488d.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195130/b8ea94af-0d04-4984-a7d1-a5fdbd99df1e.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195113/ff138f5c-7e52-490f-ace8-aa68719fab11.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195352/2149fddf-78ad-4884-a268-a1c89ed2db74.png',
      'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767195189/428ea569-cbf8-4454-8299-b170a3af1bef.png',
    ],
    videos: ['https://res.cloudinary.com/dn7xu3u3m/video/upload/v1767195441/cf_sszkrb.mp4'],
    emoji: '☕',
    color: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-900/50 via-yellow-900/30 to-amber-900/50',
    specialEffect: 'sparkles',
  },
  {
    id: 6,
    title: 'PTB ngày 2/9',
    subtitle: 'Kỷ niệm 6',
    description:
      'Kỷ niệm ngày lễ 2/9 cùng bé. Phố phường đông đúc, pháo hoa rực rỡ, nhưng đẹp nhất vẫn là ánh mắt em lung linh dưới ánh đèn... 🎆',
    date: '02/09',
    images: [
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_5.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_1.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_2.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_3.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_4.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_6.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_7.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_8.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_9.jpg',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/ptb2_9_10.jpg',
    ],
    videos: [],
    emoji: '🎆',
    color: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-900/50 via-cyan-900/30 to-blue-900/50',
    specialEffect: 'flowers',
  },
  {
    id: 7,
    title: 'Ra sân bay tiễn người yêu',
    subtitle: 'Kỷ niệm 7',
    description:
      'Khoảnh khắc tiễn biệt, ôm chặt và lời chúc ấm áp trước khi xa nhau. Mắt cay cay, không muốn buông tay, nhưng biết rằng yêu thương sẽ kéo chúng mình gần lại... ✈️💕',
    date: '',
    images: [
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb1.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb2.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb3.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb4.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb5.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb6.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb7.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb8.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb9.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb10.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb11.png',
      'https://hoangnguyennnnnnn.github.io/Happy-Birthday/memory/public/img/sb12.png',
    ],
    videos: [
      'https://res.cloudinary.com/dn7xu3u3m/video/upload/v1767194649/ptb_video_vertical_diwyfz.mp4',
    ],
    emoji: '✈️',
    color: 'from-red-400 to-rose-500',
    bgGradient: 'from-red-900/50 via-rose-900/30 to-red-900/50',
    specialEffect: 'love',
  },
];

const StoryMemoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const memoryId = parseInt(id || '1');
  const memory = STORY_MEMORIES.find((m) => m.id === memoryId);

  // Trigger effect on page load
  useEffect(() => {
    if (memory) {
      setTimeout(() => {
        triggerEffect(memory.specialEffect);
      }, 500);
    }
  }, [memory]);

  const triggerEffect = (effect: StoryMemoryData['specialEffect']) => {
    switch (effect) {
      case 'hearts':
        // Nhẹ nhàng - vài trái tim bay lên (gặp lại nhau)
        confetti({
          particleCount: 20,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ff6b81', '#ff4757', '#f8a5b8'],
          shapes: ['circle'],
          gravity: 0.5,
          scalar: 1.2,
        });
        break;

      case 'stars':
        // Vài ngôi sao lấp lánh (xem phim - như trong rạp tối)
        confetti({
          particleCount: 25,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ffec8b', '#fff8dc'],
          scalar: 1.2,
        });
        break;

      case 'confetti':
        // Confetti vui vẻ nhẹ (PTB với nhóm bạn)
        confetti({
          particleCount: 40,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'],
        });
        break;

      case 'sparkles':
        // Sparkle nhẹ như khói cà phê (đi cafe)
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#d4a574', '#c19a6b', '#fff'],
          scalar: 1,
          gravity: 0.6,
        });
        break;

      case 'flowers':
        // Hoa nhẹ (ngày lễ 2/9)
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff1493', '#ff69b4', '#ffb7c5'],
          shapes: ['circle'],
          scalar: 1.1,
        });
        break;

      case 'fireworks':
        // Pháo hoa sinh nhật - giữ 1 burst thôi
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#ffa500', '#ffff00', '#ff00ff'],
        });
        break;

      case 'love':
        // Tim bay lên khi tiễn (buồn nhẹ nhàng)
        confetti({
          particleCount: 15,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#ff6b81', '#ff4757', '#f8a5b8'],
          gravity: 0.4,
          scalar: 1.3,
        });
        break;
    }
  };

  if (!memory) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Không tìm thấy kỷ niệm này</p>
          <Link
            to="/vault"
            className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Quay lại Vault
          </Link>
        </div>
      </div>
    );
  }

  const allMedia = [
    ...memory.images.map((url) => ({ type: 'image' as const, url })),
    ...memory.videos.map((url) => ({ type: 'video' as const, url })),
  ];

  const hasMedia = allMedia.length > 0;

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${memory.bgGradient} bg-slate-900 relative overflow-hidden`}
    >
      {/* Animated background particles - giảm nhẹ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 14}px`,
            }}
            initial={{ y: -30, opacity: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              opacity: [0, 0.15, 0.15, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          >
            {['✨', '💕', '🌟', '💖', '🦋', '🌸'][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/vault"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-inter text-sm">Quay lại Vault</span>
          </Link>

          {/* Navigation between memories */}
          <div className="flex items-center gap-2">
            {memoryId > 1 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/memory/${memoryId - 1}`)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </motion.button>
            )}
            <span className="text-white/60 text-sm font-inter">{memoryId} / 7</span>
            {memoryId < 7 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/memory/${memoryId + 1}`)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Emoji with animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`inline-flex w-24 h-24 rounded-full bg-gradient-to-br ${memory.color} items-center justify-center text-5xl shadow-2xl mb-6`}
          >
            {memory.emoji}
          </motion.div>

          {/* Subtitle badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-block px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${memory.color} mb-4 shadow-lg`}
          >
            {memory.subtitle}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-dancing text-5xl md:text-7xl text-white mb-4 drop-shadow-lg"
          >
            {memory.title}
          </motion.h1>

          {/* Date */}
          {memory.date && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-pink-300 font-inter text-sm mb-6"
            >
              📅 {memory.date}
            </motion.p>
          )}

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-inter"
          >
            {memory.description}
          </motion.p>
        </motion.div>

        {/* Media Gallery */}
        {hasMedia ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            {/* Main Media Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm mb-4">
              <AnimatePresence mode="wait">
                {allMedia[currentMediaIndex]?.type === 'video' ? (
                  <motion.video
                    key={`video-${currentMediaIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={allMedia[currentMediaIndex].url}
                    controls
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <motion.img
                    key={`image-${currentMediaIndex}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={allMedia[currentMediaIndex]?.url}
                    alt={memory.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
              </AnimatePresence>

              {/* Navigation Arrows */}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentMediaIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentMediaIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allMedia.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentMediaIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {allMedia.map((media, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentMediaIndex
                        ? `border-white shadow-lg shadow-white/30`
                        : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-2xl">🎬</span>
                      </div>
                    ) : (
                      <img src={media.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          /* Placeholder when no media */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`rounded-2xl bg-gradient-to-br ${memory.color} p-12 flex flex-col items-center justify-center mb-8`}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              {memory.emoji}
            </motion.span>
            <p className="text-white/80 font-inter text-center">
              Ảnh và video sẽ được thêm vào đây...
            </p>
          </motion.div>
        )}

        {/* Effect Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerEffect(memory.specialEffect)}
            className={`px-10 py-4 bg-gradient-to-r ${memory.color} text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all text-lg`}
          >
            ✨ Xem hiệu ứng kỷ niệm
          </motion.button>
        </motion.div>

        {/* Navigation to other memories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center gap-4"
        >
          {memoryId > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/memory/${memoryId - 1}`)}
              className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kỷ niệm trước
            </motion.button>
          )}
          {memoryId < 7 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/memory/${memoryId + 1}`)}
              className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              Kỷ niệm tiếp theo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 text-center py-8"
      >
        <p className="font-dancing text-xl text-white/40">Love Journey • Created with ❤️</p>
      </motion.footer>
    </div>
  );
};

export default StoryMemoryDetail;
