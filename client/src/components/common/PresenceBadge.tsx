import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';

const PresenceBadge = ({ className = '' }: { className?: string }) => {
  const { onlineUsers } = useSocket();

  // Filter out self, assuming backend might echo self or we just want to show *others*
  // If backend uses session ID as user.id, then multiple tabs of same user might show up.
  // For "Partner Presence", we ideally want to see if > 1 distinct users are online.
  // Given authentication is same-user (shared password), "onlineUsers.length > 1" implies
  // the other person (or another device) is online.
  const isPartnerOnline = onlineUsers.length > 1;

  if (!isPartnerOnline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`flex items-center gap-2 bg-deep-blue/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-soft-pink/30 shadow-[0_0_15px_rgba(255,182,193,0.3)] ${className}`}
      >
        <div className="relative flex h-3 w-3">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inline-flex h-full w-full rounded-full bg-soft-pink opacity-75"
          />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-soft-pink" />
        </div>
        
        <span className="text-[10px] font-bold uppercase tracking-widest text-soft-pink select-none">
          Partner Online
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default PresenceBadge;
