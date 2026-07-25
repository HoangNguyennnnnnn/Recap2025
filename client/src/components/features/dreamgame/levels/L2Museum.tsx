import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

interface Painting {
  id: string;
  letter: string;
  title: string;
  thread: { from: number; to: number; color: string };
  art: ReactNode;
}

const PAINTINGS: Painting[] = [
  {
    id: 'h', letter: 'H', title: 'Hiên nhà',
    thread: { from: 132, to: 82, color: '#9cf4ff' },
    art: <>
      <rect y="132" width="200" height="68" fill="#31405a" />
      <path d="M0 132 L34 92 L70 132 L108 76 L154 132 L181 104 L200 130 V200 H0z" fill="#2b2942" />
      <path d="M0 132 L34 92 L70 132 L108 76 L154 132 L181 104 L200 130" fill="none" stroke="#a17b67" strokeWidth="3" />
      <rect x="111" y="117" width="18" height="25" fill="#f0bf72" opacity=".78" />
      <rect x="48" y="119" width="14" height="18" fill="#f0bf72" opacity=".6" />
    </>,
  },
  {
    id: 'a', letter: 'A', title: 'Ánh đèn hồ',
    thread: { from: 82, to: 124, color: '#b7ffcd' },
    art: <>
      <rect y="112" width="200" height="88" fill="#365665" />
      <ellipse cx="48" cy="142" rx="48" ry="6" fill="#d8bc85" opacity=".19" />
      <ellipse cx="56" cy="160" rx="63" ry="5" fill="#d8bc85" opacity=".13" />
      <path d="M145 112 V56 M145 70 q25 -18 44 0" stroke="#2a2938" strokeWidth="4" fill="none" />
      <circle cx="145" cy="48" r="12" fill="#ffe6a0" opacity=".9" />
      <path d="M0 112 q40 -12 82 0 q40 13 118 -2" fill="none" stroke="#607b76" strokeWidth="5" />
    </>,
  },
  {
    id: 'n', letter: 'N', title: 'Người qua cầu',
    thread: { from: 124, to: 62, color: '#ffe39d' },
    art: <>
      <rect y="128" width="200" height="72" fill="#2d465d" />
      <path d="M10 130 Q100 62 190 130" fill="none" stroke="#c75549" strokeWidth="9" />
      <path d="M10 142 Q100 74 190 142" fill="none" stroke="#873a38" strokeWidth="4" />
      {[36, 68, 100, 132, 164].map((x) => <line key={x} x1={x} y1={118 - Math.abs(x - 100) * .23} x2={x} y2={137 - Math.abs(x - 100) * .23} stroke="#c75549" strokeWidth="3" />)}
      <circle cx="99" cy="82" r="5" fill="#282435" /><path d="M99 87 v14" stroke="#282435" strokeWidth="5" />
      <circle cx="112" cy="88" r="5" fill="#58394c" /><path d="M112 93 v13" stroke="#58394c" strokeWidth="5" />
    </>,
  },
  {
    id: 'o', letter: 'O', title: 'Ô cửa sổ',
    thread: { from: 62, to: 146, color: '#f1a9d4' },
    art: <>
      <rect y="126" width="200" height="74" fill="#41334b" />
      <rect x="38" y="30" width="124" height="105" rx="3" fill="#1f2540" stroke="#aa8660" strokeWidth="7" />
      <path d="M100 34 v97 M41 82 h118" stroke="#aa8660" strokeWidth="4" />
      <circle cx="73" cy="57" r="9" fill="#f6d9a1" opacity=".9" />
      <path d="M46 111 q26 -21 49 1 q24 18 61 -6" fill="none" stroke="#6a7895" strokeWidth="4" />
      <path d="M0 152 q50 -12 100 0 q50 12 100 -2" fill="none" stroke="#ad8490" strokeWidth="2" opacity=".5" />
    </>,
  },
  {
    id: 'i', letter: 'I', title: 'Im lặng',
    thread: { from: 146, to: 96, color: '#c3b1ff' },
    art: <>
      <rect y="136" width="200" height="64" fill="#343044" />
      <path d="M30 136 V72 q70 -56 140 0 v64" fill="#282638" stroke="#d6bf94" strokeWidth="3" />
      <path d="M100 48 v88" stroke="#d6bf94" strokeWidth="2" opacity=".75" />
      <rect x="55" y="124" width="35" height="8" rx="2" fill="#916d4a" />
      <rect x="58" y="102" width="7" height="25" rx="2" fill="#916d4a" />
      <rect x="110" y="124" width="35" height="8" rx="2" fill="#916d4a" />
      <rect x="135" y="102" width="7" height="25" rx="2" fill="#916d4a" />
    </>,
  },
];

const SOLUTION = ['h', 'a', 'n', 'o', 'i'];
const INITIAL_ORDER = ['o', 'h', 'i', 'a', 'n'];

const L2Museum = ({ onSolved }: Props) => {
  const [dark, setDark] = useState(false);
  const [order, setOrder] = useState(INITIAL_ORDER);
  const [pickedSlot, setPickedSlot] = useState<number | null>(null);
  const [solving, setSolving] = useState(false);
  const timers = useRef<number[]>([]);
  const solved = useRef(false);

  const queue = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const complete = () => {
    if (solved.current) return;
    solved.current = true;
    setSolving(true);
    sfx.solved();
    queue(onSolved, 2500);
  };

  const swapSlots = (slot: number) => {
    if (solving) return;
    if (pickedSlot === null) {
      setPickedSlot(slot);
      sfx.pick();
      return;
    }
    if (pickedSlot === slot) {
      setPickedSlot(null);
      return;
    }

    const next = [...order];
    [next[pickedSlot], next[slot]] = [next[slot], next[pickedSlot]];
    setOrder(next);
    setPickedSlot(null);
    sfx.place();
    if (next.every((id, index) => id === SOLUTION[index])) queue(complete, 600);
  };

  const toggleLight = () => {
    if (solving) return;
    sfx.click();
    setPickedSlot(null);
    setDark(value => !value);
  };

  return (
    <SceneShell
      sky={dark ? ['#070817', '#10142e', '#04050d'] : ['#1b1730', '#241d38', '#100d1c']}
      accent="#d8b06a"
      stars={dark ? 4 : 14}
      motes="dust"
      vignette={0.84}
      className={`lvl-museum ${dark ? 'museum-uv' : 'museum-day'} ${solving ? 'museum-solving' : ''}`}
    >
      <div className="gallery museum-gallery">
        <div className="gallery-rail" />
        <div className="gallery-frames museum-frames">
          {order.map((id, slot) => {
            const painting = PAINTINGS.find(item => item.id === id)!;
            return (
              <motion.button
                key={id}
                layout
                className={`frame museum-painting ${pickedSlot === slot ? 'museum-picked' : ''}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + slot * 0.08 }}
                onClick={() => swapSlots(slot)}
                aria-label={dark ? `Bức tranh ${painting.letter}` : painting.title}
              >
                <span className="frame-light" />
                <span className="frame-inner museum-canvas">
                  <MuseumArt painting={painting} ultraviolet={dark} />
                </span>
                <span className="frame-plate museum-plate">{dark ? painting.letter : painting.title}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="gallery-floor" />
      </div>

      <button
        className={`museum-switch ${dark ? 'museum-switch-on' : ''}`}
        onClick={toggleLight}
        aria-pressed={dark}
        aria-label="Bật hoặc tắt đèn phòng tranh"
      >
        <span className="museum-switch-toggle" />
        <i>{dark ? 'UV' : 'đèn'}</i>
      </button>

      <p className="museum-whisper">
        {dark ? 'Một đường sáng đi qua cả căn phòng.' : 'Phòng tranh yên như đang nín thở.'}
      </p>

      {solving && (
        <motion.div className="museum-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.span initial={{ letterSpacing: '0.8em' }} animate={{ letterSpacing: '0.18em' }} transition={{ duration: 1.4 }}>
            HÀ NỘI
          </motion.span>
        </motion.div>
      )}
    </SceneShell>
  );
};

const MuseumArt = ({ painting, ultraviolet }: { painting: Painting; ultraviolet: boolean }) => {
  const { from, to, color } = painting.thread;
  return (
    <svg viewBox="0 0 200 200" className="frame-art museum-art" aria-hidden>
      <defs>
        <linearGradient id={`museum-sky-${painting.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ultraviolet ? '#0d1741' : '#312748'} />
          <stop offset="100%" stopColor={ultraviolet ? '#111b39' : '#76556a'} />
        </linearGradient>
        <filter id={`museum-glow-${painting.id}`} x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" fill={`url(#museum-sky-${painting.id})`} />
      {painting.art}
      {ultraviolet && <>
        <path d={`M-4 ${from} C 48 ${from}, 92 ${to}, 204 ${to}`} fill="none" stroke={color} strokeWidth="9" opacity=".28" filter={`url(#museum-glow-${painting.id})`} />
        <path d={`M-4 ${from} C 48 ${from}, 92 ${to}, 204 ${to}`} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="4" cy={from} r="4" fill={color} /><circle cx="196" cy={to} r="4" fill={color} />
      </>}
    </svg>
  );
};

export default L2Museum;
