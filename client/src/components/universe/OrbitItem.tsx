import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface OrbitItemProps {
  id: string;
  label: string;
  icon: string | React.ReactNode;
  angle: number;
  radius: number;
  isMobile: boolean;
  index: number;
}

const OrbitItem = ({ id, label, icon, angle, radius, isMobile, index }: OrbitItemProps) => {
  // Convert polar coordinates to Cartesian for positioning
  // Using % for responsiveness
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  const itemVariants = {
    hidden: { 
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: isMobile ? 0 : `${x}%`,
      y: isMobile ? 0 : `${y}%`,
      transition: {
        type: 'spring' as any,
        stiffness: 100,
        damping: 15,
        delay: 0.5 + index * 0.1 // Staggered entry
      }
    }
  };

  const floatingTransition = {
    y: {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      repeatType: 'mirror' as any,
      ease: 'easeInOut' as any,
      delay: Math.random() * 2,
    },
    scale: {
       duration: 4 + Math.random() * 2,
       repeat: Infinity,
       repeatType: 'mirror' as any,
       ease: 'easeInOut' as any,
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className={`${
        isMobile ? 'relative' : 'absolute'
      } flex flex-col items-center justify-center group`}
      style={!isMobile ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' } : {}}
    >
      <Link to={`/${id}`}>
        {/* Floating Wrapper */}
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={floatingTransition}
          className="relative flex flex-col items-center cursor-pointer"
        >
          {/* Glow & Icon Circle */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-deep-blue border-2 border-stardust-gold border-opacity-30 group-hover:border-opacity-100 flex items-center justify-center text-3xl md:text-4xl shadow-[0_0_15px_rgba(255,215,0,0.2)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] group-hover:bg-opacity-80 transition-all duration-300">
            <div className="absolute inset-0 bg-stardust-gold opacity-0 group-hover:opacity-10 blur-xl rounded-full transition-opacity" />
            {icon}
          </div>

          {/* Label Tooltip UI */}
          <div className="mt-3 md:mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="font-dancing text-soft-pink text-lg md:text-xl text-center whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {label}
            </span>
          </div>

          {/* Hover Hint Glow */}
          <motion.div
            className="absolute -inset-2 bg-stardust-gold opacity-0 group-hover:opacity-5 blur-2xl rounded-full z-[-1]"
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default OrbitItem;
