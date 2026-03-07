import { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ════════════════════════════════════════════════════════════════════
   SVG Rose — multi-layered petals with proper SVG transforms
   ════════════════════════════════════════════════════════════════════ */
export const SvgRose = ({ delay, x, y, scale, color }: {
  delay: number; x: number; y: number; scale: number; color: string;
}) => {
  const s = scale * 1.3;
  const cx = 50, cy = 50; // center of rotation

  return (
    <motion.div className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%`, zIndex: Math.floor(100 - y) }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 1.5, type: 'spring', stiffness: 70 }}
    >
      <motion.div
        animate={{ rotateZ: [0, 2, -2, 0] }}
        transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: 'easeInOut' }}
      >
        <svg width={100 * s} height={170 * s} viewBox="0 0 100 170" fill="none">
          <defs>
            <radialGradient id={`rg${x}${y}`} cx="50%" cy="40%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.65" />
            </radialGradient>
            <filter id={`gl${x}${y}`}><feGaussianBlur stdDeviation="1.5" result="g" />
              <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Stem */}
          <motion.path d="M50 72 Q48 105 50 170" stroke="#2E7D32" strokeWidth="3.5"
            fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.8 }} />
          {/* Leaves */}
          <motion.path d="M50 110 Q65 98 76 104 Q65 114 50 112" fill="#4CAF50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }} />
          <motion.path d="M50 128 Q35 118 24 124 Q34 132 50 130" fill="#388E3C"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6 }} />
          {/* Thorns */}
          <path d="M52 95 L56 90 L52 92" fill="#2E7D32" />
          <path d="M48 140 L44 136 L48 138" fill="#2E7D32" />

          {/* Outer petals — 5 large, evenly rotated using SVG transform */}
          {[0, 72, 144, 216, 288].map((a, i) => (
            <motion.path key={`o${i}`}
              d="M0,-20 C-10,-18 -16,-8 -14,0 C-12,6 -6,10 0,8 C6,10 12,6 14,0 C16,-8 10,-18 0,-20Z"
              fill={`url(#rg${x}${y})`} opacity={0.85}
              transform={`translate(${cx},${cy}) rotate(${a})`}
              filter={`url(#gl${x}${y})`}
              initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
              transition={{ delay: delay + 0.3 + i * 0.08, duration: 0.6 }}
            />
          ))}

          {/* Inner petals — 5 smaller, offset rotation */}
          {[36, 108, 180, 252, 324].map((a, i) => (
            <motion.path key={`in${i}`}
              d="M0,-14 C-7,-12 -11,-5 -9,1 C-7,5 -4,7 0,6 C4,7 7,5 9,1 C11,-5 7,-12 0,-14Z"
              fill={color} opacity={0.93}
              transform={`translate(${cx},${cy}) rotate(${a})`}
              initial={{ opacity: 0 }} animate={{ opacity: 0.93 }}
              transition={{ delay: delay + 0.6 + i * 0.06, duration: 0.5 }}
            />
          ))}

          {/* Innermost petals — tight spiral feel */}
          {[18, 90, 162, 234, 306].map((a, i) => (
            <motion.path key={`t${i}`}
              d="M0,-9 C-4,-8 -7,-3 -5,1 C-3,3 -2,4 0,4 C2,4 3,3 5,1 C7,-3 4,-8 0,-9Z"
              fill={color} opacity={0.97}
              transform={`translate(${cx},${cy}) rotate(${a})`}
              initial={{ opacity: 0 }} animate={{ opacity: 0.97 }}
              transition={{ delay: delay + 0.85 + i * 0.04, duration: 0.4 }}
            />
          ))}

          {/* Center */}
          <motion.circle cx={cx} cy={cy} r="5" fill="#FFD54F"
            filter={`url(#gl${x}${y})`}
            initial={{ r: 0 }} animate={{ r: 5 }}
            transition={{ delay: delay + 1.1, duration: 0.4, type: 'spring' }} />
          {/* Dewdrop highlight */}
          <circle cx={cx - 2} cy={cy - 2} r="1.8" fill="rgba(255,255,255,0.55)" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   SVG Tulip — elegant cup-shaped petals
   ════════════════════════════════════════════════════════════════════ */
export const SvgTulip = ({ delay, x, y, scale, color }: {
  delay: number; x: number; y: number; scale: number; color: string;
}) => {
  const s = scale * 1.3;
  return (
    <motion.div className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%`, zIndex: Math.floor(100 - y) }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 1.3, type: 'spring', stiffness: 80 }}
    >
      <motion.div animate={{ rotateZ: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
        <svg width={80 * s} height={170 * s} viewBox="0 0 80 170" fill="none">
          <defs>
            <linearGradient id={`tg${x}${y}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Stem */}
          <motion.line x1="40" y1="75" x2="40" y2="170" stroke="#388E3C" strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.7 }} />
          {/* Leaves */}
          <motion.path d="M40 105 Q56 90 62 100 Q56 110 40 107" fill="#4CAF50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }} />
          <motion.path d="M40 125 Q24 112 18 120 Q24 130 40 127" fill="#43A047"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }} />

          {/* Left petal */}
          <motion.path d="M40 75 C28 65 16 45 18 28 C20 14 28 8 34 6 C38 4 40 12 40 30Z"
            fill={`url(#tg${x}${y})`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.7 }} />
          {/* Right petal */}
          <motion.path d="M40 75 C52 65 64 45 62 28 C60 14 52 8 46 6 C42 4 40 12 40 30Z"
            fill={color} opacity="0.88"
            initial={{ opacity: 0 }} animate={{ opacity: 0.88 }}
            transition={{ delay: delay + 0.4, duration: 0.7 }} />
          {/* Center petal */}
          <motion.path d="M40 75 C34 58 33 35 36 18 C38 8 40 5 42 8 C44 18 46 35 46 58Z"
            fill={color} opacity="0.95"
            initial={{ opacity: 0 }} animate={{ opacity: 0.95 }}
            transition={{ delay: delay + 0.5, duration: 0.6 }} />
          {/* Shiny highlight */}
          <path d="M38 50 Q40 25 42 50" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   SVG Sakura — 5-petal cherry blossom with notched tips
   ════════════════════════════════════════════════════════════════════ */
export const SvgSakura = ({ delay, x, y, scale }: {
  delay: number; x: number; y: number; scale: number;
}) => {
  const s = scale * 1.3;
  const cx = 45, cy = 50;
  const angles = useMemo(() => [0, 72, 144, 216, 288], []);

  return (
    <motion.div className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%`, zIndex: Math.floor(100 - y) }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 1.4, type: 'spring', stiffness: 80 }}
    >
      <motion.div animate={{ rotateZ: [0, 4, -4, 0], scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
        <svg width={90 * s} height={160 * s} viewBox="0 0 90 160" fill="none">
          <defs>
            <radialGradient id={`sg${x}${y}`} cx="50%" cy="30%">
              <stop offset="0%" stopColor="#FFF0F3" />
              <stop offset="50%" stopColor="#FFCDD2" />
              <stop offset="100%" stopColor="#F8BBD0" />
            </radialGradient>
          </defs>

          {/* Branch */}
          <motion.path d="M45 65 Q44 95 46 160" stroke="#795548" strokeWidth="4.5"
            strokeLinecap="round" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.8 }} />
          <motion.path d="M45 90 Q60 80 68 86" stroke="#6D4C41" strokeWidth="2.5"
            strokeLinecap="round" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.4 }} />

          {/* 5 sakura petals — proper SVG transform */}
          {angles.map((a, i) => (
            <motion.path key={i}
              d="M0,-20 C-8,-16 -12,-8 -10,-2 C-8,2 -3,5 -1,3 L0,0 L1,3 C3,5 8,2 10,-2 C12,-8 8,-16 0,-20Z"
              fill={`url(#sg${x}${y})`}
              transform={`translate(${cx},${cy}) rotate(${a})`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 + i * 0.1, duration: 0.6 }}
            />
          ))}

          {/* Center */}
          <circle cx={cx} cy={cy} r="4.5" fill="#EF5350" opacity="0.75" />
          {/* Stamens */}
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <g key={`s${i}`}>
              <line x1={cx} y1={cy}
                x2={cx + Math.cos(a * Math.PI / 180) * 8}
                y2={cy + Math.sin(a * Math.PI / 180) * 8}
                stroke="#FFCDD2" strokeWidth="0.7" />
              <circle
                cx={cx + Math.cos(a * Math.PI / 180) * 8}
                cy={cy + Math.sin(a * Math.PI / 180) * 8}
                r="1.2" fill="#FFD54F" />
            </g>
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   SVG Daisy — proper petal spread with SVG transform
   ════════════════════════════════════════════════════════════════════ */
export const SvgDaisy = ({ delay, x, y, scale }: {
  delay: number; x: number; y: number; scale: number;
}) => {
  const s = scale * 1.3;
  const cx = 40, cy = 48;
  const petalAngles = useMemo(() => Array.from({ length: 16 }, (_, i) => (360 / 16) * i), []);

  return (
    <motion.div className="absolute"
      style={{ left: `${x}%`, bottom: `${y}%`, zIndex: Math.floor(100 - y) }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 1.2, type: 'spring', stiffness: 90 }}
    >
      <motion.div animate={{ rotateZ: [0, 3, -3, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
        <svg width={80 * s} height={160 * s} viewBox="0 0 80 160" fill="none">
          <defs>
            <radialGradient id={`dc${x}${y}`} cx="40%" cy="35%">
              <stop offset="0%" stopColor="#FFEE58" />
              <stop offset="60%" stopColor="#FDD835" />
              <stop offset="100%" stopColor="#F9A825" />
            </radialGradient>
          </defs>

          {/* Stem */}
          <motion.path d="M40 62 Q39 95 40 160" stroke="#43A047" strokeWidth="3"
            strokeLinecap="round" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.7 }} />
          <motion.path d="M40 100 Q54 90 60 97 Q54 105 40 103" fill="#66BB6A"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }} />

          {/* White petals — using SVG native transform for proper rotation */}
          {petalAngles.map((a, i) => (
            <motion.ellipse key={i}
              cx="0" cy="-16" rx="5.5" ry="14"
              fill="white" stroke="#E8E8E8" strokeWidth="0.4"
              transform={`translate(${cx},${cy}) rotate(${a})`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 + i * 0.04, duration: 0.5 }}
            />
          ))}

          {/* Golden center with texture */}
          <circle cx={cx} cy={cy} r="9" fill={`url(#dc${x}${y})`} />
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="#F9A825" strokeWidth="0.5" />
          {/* Center texture dots */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (360 / 8) * i;
            return (
              <circle key={`d${i}`}
                cx={cx + Math.cos(a * Math.PI / 180) * 4.5}
                cy={cy + Math.sin(a * Math.PI / 180) * 4.5}
                r="1" fill="#EF6C00" opacity="0.5" />
            );
          })}
        </svg>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   Garden Layout — mix of all flower types
   ════════════════════════════════════════════════════════════════════ */
export const GARDEN_FLOWERS: Array<{
  type: 'rose' | 'tulip' | 'sakura' | 'daisy';
  x: number; y: number; scale: number; color: string; delay: number;
}> = [
  // Front row
  { type: 'rose',   x: 2,  y: 0,  scale: 1.1, color: '#E91E63', delay: 0.3 },
  { type: 'tulip',  x: 11, y: 2,  scale: 1.0, color: '#FF5252', delay: 0.6 },
  { type: 'sakura', x: 21, y: 1,  scale: 0.9, color: '#F48FB1', delay: 0.9 },
  { type: 'rose',   x: 30, y: 0,  scale: 1.2, color: '#FF1744', delay: 0.4 },
  { type: 'daisy',  x: 40, y: 2,  scale: 1.0, color: '#FFF', delay: 0.7 },
  { type: 'tulip',  x: 50, y: 1,  scale: 1.1, color: '#E040FB', delay: 1.0 },
  { type: 'rose',   x: 60, y: 0,  scale: 1.0, color: '#F50057', delay: 0.5 },
  { type: 'sakura', x: 70, y: 2,  scale: 0.9, color: '#F48FB1', delay: 0.8 },
  { type: 'tulip',  x: 80, y: 1,  scale: 1.1, color: '#FF4081', delay: 1.1 },
  { type: 'rose',   x: 90, y: 0,  scale: 1.0, color: '#D81B60', delay: 0.6 },
  // Back row
  { type: 'sakura', x: 7,  y: 12, scale: 0.55, color: '#F8BBD0', delay: 1.5 },
  { type: 'daisy',  x: 18, y: 14, scale: 0.5,  color: '#FFF', delay: 1.7 },
  { type: 'rose',   x: 35, y: 13, scale: 0.55, color: '#EC407A', delay: 1.8 },
  { type: 'tulip',  x: 46, y: 15, scale: 0.5,  color: '#AB47BC', delay: 2.0 },
  { type: 'sakura', x: 56, y: 13, scale: 0.55, color: '#F48FB1', delay: 2.1 },
  { type: 'rose',   x: 66, y: 14, scale: 0.5,  color: '#E91E63', delay: 2.3 },
  { type: 'daisy',  x: 78, y: 12, scale: 0.55, color: '#FFF', delay: 2.4 },
  { type: 'tulip',  x: 88, y: 14, scale: 0.5,  color: '#FF80AB', delay: 2.5 },
];

export const FlowerRenderer = ({ type, ...props }: typeof GARDEN_FLOWERS[number]) => {
  switch (type) {
    case 'rose': return <SvgRose {...props} />;
    case 'tulip': return <SvgTulip {...props} />;
    case 'sakura': return <SvgSakura {...props} />;
    case 'daisy': return <SvgDaisy {...props} />;
  }
};
