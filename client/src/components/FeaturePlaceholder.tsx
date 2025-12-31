import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import UniverseBackground from './universe/UniverseBackground';

interface FeaturePlaceholderProps {
  label: string;
  icon: string | React.ReactNode;
}

/**
 * A generic placeholder component for features not yet implemented.
 */
const FeaturePlaceholder = ({ label, icon }: FeaturePlaceholderProps) => {
  return (
    <div className="min-h-screen text-soft-pink font-inter relative flex flex-col items-center justify-center overflow-hidden p-6">
      <UniverseBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full bg-deep-blue bg-opacity-40 backdrop-blur-xl border border-soft-pink border-opacity-20 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-stardust-gold opacity-10 blur-2xl rounded-3xl z-[-1]" />

        {/* Feature Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-deep-blue border-2 border-stardust-gold border-opacity-30 flex items-center justify-center text-5xl md:text-6xl mx-auto mb-8 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
        >
          {icon}
        </motion.div>

        {/* Feature Label */}
        <h1 className="font-dancing text-4xl md:text-5xl text-stardust-gold mb-4 drop-shadow-lg">
          {label}
        </h1>

        <div className="w-16 h-1 bg-stardust-gold bg-opacity-30 mx-auto mb-6 rounded-full" />

        <p className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed font-light">
          This part of our universe is still forming. <br />
          <span className="text-soft-pink font-semibold">Coming Soon</span> in our 2025 journey.
        </p>

        {/* Back Button */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,182,193,0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 bg-soft-pink bg-opacity-10 hover:bg-opacity-20 border border-soft-pink border-opacity-40 px-8 py-3 rounded-full text-stardust-gold font-semibold transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Universe</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-stardust-gold rounded-full blur-[1px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-soft-pink rounded-full blur-[1px] animate-pulse delay-700" />
      </div>
    </div>
  );
};

export default FeaturePlaceholder;
