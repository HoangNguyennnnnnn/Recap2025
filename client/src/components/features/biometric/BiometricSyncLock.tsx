import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../../context/SocketContext';

interface BiometricSyncLockProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
}

const BiometricSyncLock = ({ isOpen, onClose, onUnlocked }: BiometricSyncLockProps) => {
  const { socket, isConnected, onlineUsers } = useSocket();
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [isTouching, setIsTouching] = useState(false);
  const [myPosition, setMyPosition] = useState<{ x: number; y: number } | null>(null);
  const [partnerPosition, setPartnerPosition] = useState<{ x: number; y: number } | null>(null);
  const [isWaitingForPartner, setIsWaitingForPartner] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState('');
  const [partnerOnline, setPartnerOnline] = useState(false);

  // Check if partner is online
  useEffect(() => {
    setPartnerOnline(onlineUsers.length >= 2);
  }, [onlineUsers]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isOpen) return;

    // Partner started touching
    const handlePartnerTouching = (data: {
      position: { x: number; y: number };
      isWaiting: boolean;
    }) => {
      setPartnerPosition(data.position);
      setIsWaitingForPartner(false);
    };

    // Partner position update
    const handlePartnerPosition = (data: { partnerPosition: { x: number; y: number } }) => {
      setPartnerPosition(data.partnerPosition);
    };

    // Partner released
    const handlePartnerReleased = () => {
      setPartnerPosition(null);
    };

    // Alignment update
    const handleAlignment = (_data: {
      yourPosition: { x: number; y: number };
      targetPosition: { x: number; y: number };
      isAligned: boolean;
      distance?: number;
    }) => {
      // Could show distance feedback here
    };

    // UNLOCKED!
    const handleUnlocked = (data: { success: boolean; message: string }) => {
      if (data.success) {
        setIsUnlocked(true);
        setUnlockMessage(data.message);

        // Trigger vibration if supported
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // Notify parent after animation
        setTimeout(() => {
          onUnlocked();
        }, 3000);
      }
    };

    // Reset
    const handleReset = () => {
      setIsTouching(false);
      setMyPosition(null);
      setPartnerPosition(null);
      setIsWaitingForPartner(false);
    };

    socket.on('sync_lock_partner_touching', handlePartnerTouching);
    socket.on('sync_lock_partner_position', handlePartnerPosition);
    socket.on('sync_lock_partner_released', handlePartnerReleased);
    socket.on('sync_lock_alignment', handleAlignment);
    socket.on('sync_lock_unlocked', handleUnlocked);
    socket.on('sync_lock_reset', handleReset);

    return () => {
      socket.off('sync_lock_partner_touching', handlePartnerTouching);
      socket.off('sync_lock_partner_position', handlePartnerPosition);
      socket.off('sync_lock_partner_released', handlePartnerReleased);
      socket.off('sync_lock_alignment', handleAlignment);
      socket.off('sync_lock_unlocked', handleUnlocked);
      socket.off('sync_lock_reset', handleReset);
    };
  }, [socket, isOpen, onUnlocked]);

  // Get normalized position (0-1)
  const getNormalizedPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, []);

  // Touch/Mouse handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!socket || isUnlocked) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const pos = getNormalizedPosition(clientX, clientY);

      if (pos) {
        setIsTouching(true);
        setMyPosition(pos);
        setIsWaitingForPartner(true);
        socket.emit('sync_lock_touch_start', pos);
      }
    },
    [socket, getNormalizedPosition, isUnlocked]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!socket || !isTouching || isUnlocked) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const pos = getNormalizedPosition(clientX, clientY);

      if (pos) {
        setMyPosition(pos);
        socket.emit('sync_lock_touch_move', pos);
      }
    },
    [socket, isTouching, getNormalizedPosition, isUnlocked]
  );

  const handleTouchEnd = useCallback(() => {
    if (!socket) return;

    setIsTouching(false);
    setMyPosition(null);
    setIsWaitingForPartner(false);
    socket.emit('sync_lock_touch_end');
  }, [socket]);

  // Close handler
  const handleClose = () => {
    handleTouchEnd();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-deep-blue"
        >
          {/* Background Stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="font-dancing text-4xl md:text-5xl text-stardust-gold mb-3">
                Cái Chạm Tay Định Mệnh
              </h1>
              <p className="font-inter text-soft-pink text-sm max-w-md mx-auto">
                {!isConnected
                  ? 'Connecting to the universe...'
                  : !partnerOnline
                  ? 'Waiting for your soulmate to come online... 💕'
                  : 'Both of you must place your finger on the screen at the same position to unlock the secret room.'}
              </p>
            </motion.div>

            {/* Online Status */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className={`w-3 h-3 rounded-full ${
                  partnerOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                }`}
              />
              <span className="font-inter text-sm text-white/60">
                {partnerOnline ? 'Both soulmates online ✨' : 'Waiting for partner...'}
              </span>
            </div>

            {/* Touch Area */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative w-full max-w-md aspect-square rounded-3xl border-2 transition-all duration-500 ${
                isUnlocked
                  ? 'border-stardust-gold bg-stardust-gold/20 shadow-[0_0_100px_rgba(255,215,0,0.5)]'
                  : isTouching
                  ? 'border-soft-pink bg-soft-pink/10'
                  : 'border-white/20 bg-white/5'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              style={{ touchAction: 'none' }}
            >
              {/* Fingerprint Icon (Center) */}
              {!isTouching && !partnerPosition && !isUnlocked && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-8xl mb-4 opacity-30">👆</div>
                    <p className="font-inter text-white/40 text-sm">Place your finger here</p>
                  </div>
                </motion.div>
              )}

              {/* My Touch Point */}
              {myPosition && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${myPosition.x * 100}%`,
                    top: `${myPosition.y * 100}%`,
                  }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255,182,193,0.5)',
                        '0 0 40px rgba(255,182,193,0.8)',
                        '0 0 20px rgba(255,182,193,0.5)',
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-full h-full rounded-full bg-soft-pink/30 border-2 border-soft-pink flex items-center justify-center"
                  >
                    <div className="text-3xl">👆</div>
                  </motion.div>
                </motion.div>
              )}

              {/* Partner's Touch Point (Glowing Fingerprint) */}
              {partnerPosition && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${partnerPosition.x * 100}%`,
                    top: `${partnerPosition.y * 100}%`,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        '0 0 30px rgba(255,215,0,0.5)',
                        '0 0 60px rgba(255,215,0,1)',
                        '0 0 30px rgba(255,215,0,0.5)',
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-full h-full rounded-full bg-stardust-gold/30 border-2 border-stardust-gold flex items-center justify-center"
                  >
                    <div className="text-3xl">✨</div>
                  </motion.div>
                  <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-stardust-gold text-xs font-bold">
                    Their finger
                  </p>
                </motion.div>
              )}

              {/* Waiting for Partner Indicator */}
              {isWaitingForPartner && !partnerPosition && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-6 left-0 right-0 text-center"
                >
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="font-inter text-soft-pink text-sm"
                  >
                    Waiting for your soulmate to touch... 💕
                  </motion.p>
                </motion.div>
              )}

              {/* UNLOCKED Animation */}
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1 }}
                      className="text-8xl mb-4"
                    >
                      💖
                    </motion.div>
                    <h2 className="font-dancing text-4xl text-stardust-gold mb-2">Connected!</h2>
                    <p className="font-inter text-soft-pink">{unlockMessage}</p>
                  </motion.div>
                </motion.div>
              )}

              {/* Explosion Particles on Unlock */}
              {isUnlocked && (
                <>
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: `${50 + (Math.random() - 0.5) * 200}%`,
                        y: `${50 + (Math.random() - 0.5) * 200}%`,
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 1.5, delay: i * 0.05 }}
                      className="absolute w-3 h-3 rounded-full pointer-events-none"
                      style={{
                        background: i % 2 === 0 ? '#FFD700' : '#FFB6C1',
                        boxShadow: `0 0 10px ${i % 2 === 0 ? '#FFD700' : '#FFB6C1'}`,
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center max-w-md"
            >
              <div className="flex items-center justify-center gap-4 text-white/40 text-sm font-inter">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-soft-pink/50 border border-soft-pink" />
                  <span>Your touch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-stardust-gold/50 border border-stardust-gold" />
                  <span>Their touch</span>
                </div>
              </div>
              <p className="text-white/30 text-xs mt-4">
                When both fingerprints overlap, the secret room will unlock! 🔓
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BiometricSyncLock;
