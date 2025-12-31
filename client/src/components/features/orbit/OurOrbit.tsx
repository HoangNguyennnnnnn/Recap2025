import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { fetchMemories, IMemory } from '../../../services/api';
import { SPECIAL_MEMORIES } from '../vault/SpecialMemoryCard';

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  type: 'memory' | 'milestone' | 'special';
  icon: string;
  color: string;
  photo?: string;
  linkTo?: string; // Link đến trang chi tiết
  hasVideo?: boolean; // Có video không
  specialMessage?: string; // Lời nhắn đặc biệt
}

const OurOrbit = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Start date
  const START_DATE = new Date('2025-07-26T00:00:00');

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setLoading(true);
        const memoriesData = await fetchMemories();
        const memories = memoriesData.memories || [];

        // Create timeline events from memories
        const memoryEvents: TimelineEvent[] = memories.map((m: IMemory) => ({
          id: m._id,
          date: new Date(m.date),
          title: m.title,
          description: m.description,
          type: 'memory' as const,
          icon: '📸',
          color: 'from-pink-400 to-rose-500',
          photo: m.photos?.[0],
        }));

        // Add milestone events
        const milestones: TimelineEvent[] = [
          {
            id: 'start',
            date: START_DATE,
            title: 'Chúng mình bắt đầu 💕',
            description: 'Ngày đầu tiên của hành trình',
            type: 'special',
            icon: '💖',
            color: 'from-red-400 to-pink-500',
          },
          {
            id: 'newyear',
            date: new Date('2026-01-01'),
            title: 'Năm mới 2026 🎆',
            description: 'Cùng nhau đón năm mới',
            type: 'special',
            icon: '🎊',
            color: 'from-purple-400 to-indigo-500',
          },
        ];

        // 7 kỷ niệm đặc biệt với ngày cụ thể
        const specialMemoryDates: { [key: number]: string } = {
          1: '2025-06-29', // Lần đầu gặp lại
          2: '2025-07-12', // Đi xem phim
          3: '2025-07-27', // PTB cùng nhóm
          4: '2025-08-10', // Homestay & Sinh nhật
          5: '2025-08-20', // Đi cà phê Hàng Buồm
          6: '2025-09-02', // PTB ngày 2/9
          7: '2025-09-04', // Ra sân bay tiễn
        };

        // Kỷ niệm có video
        const memoriesWithVideo = [3]; // PTB cùng nhóm có video

        // Lời nhắn đặc biệt
        const specialMessages: { [key: number]: string } = {
          7: '✈️ Đi cẩn thận nha bé, anh yêu em! 💕',
        };

        const specialEvents: TimelineEvent[] = SPECIAL_MEMORIES.map((m) => ({
          id: `special-${m.id}`,
          date: new Date(specialMemoryDates[m.id] || '2025-08-01'),
          title: m.title,
          description: m.description,
          type: 'special' as const,
          icon: m.emoji,
          color: m.color,
          photo: m.thumbnail, // Thêm ảnh đại diện
          linkTo: `/memory/${m.id}`,
          hasVideo: memoriesWithVideo.includes(m.id),
          specialMessage: specialMessages[m.id],
        }));

        // Combine and sort by date
        const allEvents = [...memoryEvents, ...milestones, ...specialEvents].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );

        setTimelineEvents(allEvents);
      } catch (error) {
        console.error('Error loading timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
  }, []);

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB6C1', '#FF69B4', '#FFD700', '#FFA500', '#FF6B6B'],
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDayNumber = (date: Date) => {
    const diffTime = date.getTime() - START_DATE.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-pink-950 via-purple-950 to-indigo-950 text-white font-inter"
    >
      {/* Soft gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating hearts background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -50,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              x: `+=${Math.random() * 100 - 50}`,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            {['💕', '💖', '✨', '🌸', '💗'][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 p-3 text-white/60 hover:text-white transition-colors bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-6"
          >
            💫
          </motion.div>
          <h1 className="font-dancing text-5xl md:text-7xl bg-gradient-to-r from-pink-300 via-rose-300 to-amber-300 bg-clip-text text-transparent mb-4">
            Our Timeline
          </h1>
          <p className="text-lg md:text-xl text-pink-200/80 max-w-md mx-auto">
            Hành trình yêu thương của chúng mình 💕
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <span className="text-pink-300/60 text-sm">Cuộn xuống để khám phá</span>
            <div className="w-px h-12 bg-gradient-to-b from-pink-400 to-transparent mx-auto mt-3" />
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-20 px-4 md:px-8">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full mb-4"
            />
            <p className="text-pink-300 font-dancing text-xl">Đang tải timeline...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-white/10 rounded-full">
              <motion.div
                className="w-full bg-gradient-to-b from-pink-400 via-rose-400 to-amber-400 rounded-full"
                style={{ height: lineHeight }}
              />
            </div>

            {/* Timeline Events */}
            <div className="space-y-16 md:space-y-24">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  className={`relative flex items-center gap-6 md:gap-12 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={`inline-block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 md:p-6 max-w-sm cursor-pointer hover:bg-white/15 transition-all ${
                        event.type === 'special' ? 'ring-2 ring-amber-400/30' : ''
                      }`}
                      onClick={() => {
                        if (event.linkTo) {
                          navigate(event.linkTo);
                        } else if (event.type === 'memory') {
                          navigate(`/vault/${event.id}`);
                        }
                      }}
                    >
                      {/* Photo Preview */}
                      {event.photo && (
                        <div className="mb-4 rounded-xl overflow-hidden aspect-video relative">
                          <img
                            src={event.photo}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Video Badge */}
                          {event.hasVideo && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-lg">
                              🎬 Có Video
                            </div>
                          )}
                        </div>
                      )}

                      {/* Date Badge */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-gradient-to-r ${event.color} text-white`}
                      >
                        <span>{event.icon}</span>
                        <span>Day {getDayNumber(event.date)}</span>
                        {event.hasVideo && !event.photo && <span className="ml-1">🎬</span>}
                      </div>

                      <h3 className="font-dancing text-xl md:text-2xl text-white mb-2">
                        {event.title}
                      </h3>

                      {event.description && (
                        <p className="text-white/60 text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Special Message */}
                      {event.specialMessage && (
                        <div className="mb-3 p-3 bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-400/30 rounded-xl">
                          <p className="text-rose-300 text-sm font-medium italic">
                            {event.specialMessage}
                          </p>
                        </div>
                      )}

                      <p className="text-pink-300/60 text-xs">{formatDate(event.date)}</p>
                    </motion.div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-xl shadow-lg`}
                    >
                      {event.icon}
                    </motion.div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* End Section */}
      <section className="relative py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl border border-pink-400/30 rounded-3xl p-8 md:p-12"
        >
          <div className="text-5xl mb-6">💕</div>
          <h2 className="font-dancing text-3xl md:text-4xl text-pink-200 mb-4">
            Còn nhiều kỷ niệm phía trước...
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Mỗi ngày bên em là một ngày đáng nhớ. Cảm ơn em đã là một phần trong cuộc sống của anh
            💖
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCelebrate}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full shadow-lg hover:shadow-pink-500/30 transition-all"
            >
              🎉 Celebrate!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/vault')}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-all"
            >
              💌 Xem Vault
            </motion.button>
          </div>
        </motion.div>

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 font-dancing text-xl text-pink-300/50"
        >
          Made with 💕 for Hna
        </motion.p>
      </section>
    </div>
  );
};

export default OurOrbit;
