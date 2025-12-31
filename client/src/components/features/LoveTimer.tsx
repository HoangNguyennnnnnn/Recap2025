import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const START_DATE = new Date('2025-07-26T00:00:00');

interface TimeUnitProps {
  value: number;
  label: string;
  color?: string;
}

const TimeUnit = ({ value, label, color = 'text-pink-600' }: TimeUnitProps) => (
  <div className="flex flex-col items-center mx-1 md:mx-2">
    <div className="relative h-8 md:h-12 w-10 md:w-14 flex items-center justify-center overflow-hidden bg-white/80 rounded-lg shadow-sm">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'backOut' }}
          className={`text-xl md:text-3xl font-bold ${color} tabular-nums`}
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="font-inter text-pink-500 text-[9px] md:text-xs mt-1 font-medium">{label}</span>
  </div>
);

const LoveTimer = () => {
  const [time, setTime] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffInMs = now.getTime() - START_DATE.getTime();

      if (diffInMs < 0) return; // Future date handling

      const seconds = Math.floor((diffInMs / 1000) % 60);
      const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor((diffInMs / (1000 * 60 * 60 * 24)) % 365);
      const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

      setTime({ years, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs md:text-sm text-pink-500 mb-2 font-medium flex items-center gap-2"
      >
        <span>💕</span> Together For <span>💕</span>
      </motion.p>

      <div className="flex items-center justify-center">
        {time.years > 0 && <TimeUnit value={time.years} label="Years" color="text-rose-600" />}
        <TimeUnit value={time.days} label="Days" color="text-pink-600" />
        <TimeUnit value={time.hours} label="Hrs" color="text-pink-500" />
        <TimeUnit value={time.minutes} label="Min" color="text-rose-500" />
        <TimeUnit value={time.seconds} label="Sec" color="text-pink-400" />
      </div>
    </div>
  );
};

export default LoveTimer;
