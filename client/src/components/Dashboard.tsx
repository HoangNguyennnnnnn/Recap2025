import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoveTimer from './features/LoveTimer';

// Sample photos for Gallery Grid - organized with aspect ratios
const GALLERY_IMAGES = [
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192525/50acc5f8-607c-4e92-bf55-dda4d88c7afa.png',
    span: 'col-span-1 row-span-2', // Tall
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192513/67732553-c2e2-45bc-b658-351824eaebf2.png',
    span: 'col-span-1 row-span-1', // Square
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192506/0da210b3-8c7f-418b-b4b1-8c7758a260ca.png',
    span: 'col-span-1 row-span-1', // Square
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192381/small5_auy0uk.jpg',
    span: 'col-span-1 row-span-2', // Tall
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192379/small1_rtenao.jpg',
    span: 'col-span-1 row-span-1', // Square
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192378/small2_assy2p.jpg',
    span: 'col-span-1 row-span-1', // Square
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192379/small3_bxsf99.jpg',
    span: 'col-span-1 row-span-1', // Square
  },
  {
    src: 'https://res.cloudinary.com/dn7xu3u3m/image/upload/v1767192380/small4_f8p0pw.jpg',
    span: 'col-span-1 row-span-1', // Square
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  return (
    <div className="min-h-screen font-inter relative bg-gradient-to-b from-pink-100 via-rose-50 to-pink-100 pb-24 md:pb-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating hearts */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/40"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 20}px`,
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              opacity: [0, 0.6, 0.6, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          >
            {['💕', '💖', '🌸', '✨', '💗', '🩷'][i % 6]}
          </motion.div>
        ))}

        {/* Soft gradient orbs */}
        <motion.div
          className="absolute top-20 -left-32 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-rose-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-200/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8 md:gap-12 pt-24 md:pt-32 px-4 md:px-8">
        {/* HERO: Love App Title & Timer */}
        <section className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative"
          >
            <motion.span
              className="absolute -top-6 -left-8 text-3xl"
              animate={{ rotate: [0, 15, -15, 0], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -top-4 -right-6 text-2xl"
              animate={{ rotate: [0, -15, 15, 0], y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              💖
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-dancing font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              Our Universe ✨
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg shadow-pink-200/50 border border-pink-200"
          >
            <LoveTimer />
          </motion.div>
        </section>

        {/* SECTION 1: Photo Grid - Uniform sizes */}
        <section className="w-full">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="h-px bg-pink-300/50 flex-grow"></div>
            <span className="font-dancing text-xl md:text-2xl text-pink-600 whitespace-nowrap flex items-center gap-2">
              <span>📸</span> Our Moments
            </span>
            <div className="h-px bg-pink-300/50 flex-grow"></div>
          </div>

          {/* Responsive Grid with uniform aspect ratio */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {GALLERY_IMAGES.map((image, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredImage(i)}
                onHoverEnd={() => setHoveredImage(null)}
                className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-pink-200/40 cursor-pointer group"
              >
                {/* Image */}
                <img
                  src={image.src}
                  alt={`Memory ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Heart icon on hover */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={hoveredImage === i ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                >
                  <span className="text-lg sm:text-xl">💖</span>
                </motion.div>

                {/* Border frame effect */}
                <div className="absolute inset-0 border-2 sm:border-4 border-white/80 rounded-xl sm:rounded-2xl pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

          {/* View more button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/vault')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-6 mx-auto block px-6 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-pink-600 font-dancing text-lg border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all shadow-md"
          >
            Xem thêm ảnh →
          </motion.button>
        </section>

        {/* SECTION 2: Quick Action Buttons */}
        <section className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full mt-4 md:mt-8">
          {[
            { path: '/vault', icon: '💕', label: 'Kỷ niệm', color: 'from-pink-400 to-rose-400' },
            {
              path: '/open-when',
              icon: '🔒',
              label: 'Open When',
              color: 'from-purple-400 to-pink-400',
            },
            {
              path: '/stats',
              icon: '🪐',
              label: 'Timeline',
              color: 'from-amber-400 to-orange-400',
            },
          ].map((item, i) => (
            <motion.button
              key={i}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 md:p-5 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-lg shadow-pink-100 flex flex-col items-center justify-center gap-1.5 md:gap-2 hover:border-pink-400 hover:shadow-pink-200/50 transition-all group"
            >
              <motion.span
                className="text-2xl md:text-4xl"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {item.icon}
              </motion.span>
              <span className="font-dancing text-sm md:text-lg text-pink-700 font-bold">
                {item.label}
              </span>
            </motion.button>
          ))}
        </section>

        {/* SECTION 3: Special Features */}
        <section className="grid grid-cols-1 gap-3 md:gap-4 w-full">
          {/* Secret Room */}
          <motion.button
            onClick={() => navigate('/secret-room')}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 flex items-center gap-4 hover:border-purple-400 transition-all group shadow-lg shadow-purple-100/50"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <span className="text-3xl md:text-4xl">🔐</span>
            </motion.div>
            <div className="text-left min-w-0">
              <h3 className="font-dancing text-xl md:text-2xl text-purple-700 font-bold mb-1">
                A Secret in Time 💕
              </h3>
              <p className="text-purple-500/70 text-xs md:text-sm font-inter">
                Cần cả hai cùng mở khóa
              </p>
            </div>
            <motion.span
              className="ml-auto text-purple-400"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>

          {/* Birthday Button */}
          <motion.button
            onClick={() => navigate('/birthday')}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, x: -5 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-amber-100 to-pink-100 border-2 border-amber-200 flex items-center gap-4 hover:border-amber-400 transition-all group shadow-lg shadow-amber-100/50"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <span className="text-3xl md:text-4xl">🎂</span>
            </motion.div>
            <div className="text-left min-w-0">
              <h3 className="font-dancing text-xl md:text-2xl text-amber-700 font-bold mb-1">
                Happy Birthday Hna! 🎉
              </h3>
              <p className="text-amber-500/70 text-xs md:text-sm font-inter">
                Một ngày đặc biệt dành riêng cho em
              </p>
            </div>
            <motion.span
              className="ml-auto text-amber-400"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>

          {/* Hna Gallery Button */}
          <motion.button
            onClick={() => navigate('/hna-gallery')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 border-2 border-pink-300 flex items-center gap-4 hover:border-pink-500 transition-all group shadow-lg shadow-pink-200/50"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <span className="text-3xl md:text-4xl">📸</span>
            </motion.div>
            <div className="text-left min-w-0">
              <h3 className="font-dancing text-xl md:text-2xl text-pink-600 font-bold mb-1">
                Hna's Gallery 💖
              </h3>
              <p className="text-pink-400/70 text-xs md:text-sm font-inter">
                Khoảnh khắc xinh đẹp của em
              </p>
            </div>
            <motion.span
              className="ml-auto text-pink-400"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </section>

        {/* Footer message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-pink-400/60 font-dancing text-lg mt-8"
        >
          Made with 💕 by nthz
        </motion.p>
      </div>
    </div>
  );
};

export default Dashboard;
