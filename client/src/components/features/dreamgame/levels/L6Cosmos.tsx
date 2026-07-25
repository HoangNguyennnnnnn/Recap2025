import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { WALL_MARKS, isCipherFound } from '../data/cipher';
import { sfx, NOTE, pluck, tone } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

type PalaceId = 'menh' | 'tai' | 'phuc' | 'di';
type StarId = 'duong' | 'tuvi' | 'hongloan' | 'am';

const PALACES: { id: PalaceId; name: string; sub: string; x: number; y: number }[] = [
  { id: 'menh', name: 'Mệnh', sub: 'tớ là ai', x: 50, y: 15 },
  { id: 'tai', name: 'Tài', sub: 'tớ có gì', x: 85, y: 50 },
  { id: 'phuc', name: 'Phúc', sub: 'tớ để lại gì', x: 50, y: 85 },
  { id: 'di', name: 'Di', sub: 'tớ đi đâu', x: 15, y: 50 },
];

const STARS: { id: StarId; word: string; color: string }[] = [
  { id: 'duong', word: 'Xa', color: '#ffc973' },
  { id: 'tuvi', word: 'mấy', color: '#c9a8f0' },
  { id: 'hongloan', word: 'cũng', color: '#f28ca8' },
  { id: 'am', word: 'về', color: '#a8d4f0' },
];

const SOLUTION: Record<PalaceId, StarId> = {
  menh: 'duong',
  tai: 'tuvi',
  phuc: 'hongloan',
  di: 'am',
};

const READ_ORDER: PalaceId[] = ['menh', 'tai', 'phuc', 'di'];

const CLUES = [
  'Thái Âm không đứng ở đỉnh, cũng không nằm dưới đáy.',
  'Tử Vi với Thái Âm ngó nhau qua trục ngang.',
  'Hồng Loan không ở cung Mệnh.',
  'Trăng mọc ở phía tay trái của lá số.',
];

const OUTER_12 = [
  'Tử Tức', 'Thê', 'Huynh Đệ', 'Mệnh', 'Phụ Mẫu', 'Phúc Đức',
  'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật', 'Tài Bạch',
];

const Scratch = ({ starId, color }: { starId: StarId; color: string }) => {
  const mark = WALL_MARKS.find(item => item.star === starId);
  if (!mark) return null;
  return (
    <svg viewBox="0 0 24 24" className="cipher-scratch" aria-hidden="true">
      <path d={mark.path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

/** Chapter VI — a four-palace deduction that needs the first room's journal. */
const L6Cosmos = ({ onSolved }: Props) => {
  const [placed, setPlaced] = useState<Partial<Record<PalaceId, StarId>>>({});
  const [held, setHeld] = useState<StarId | null>(null);
  const [state, setState] = useState<'idle' | 'wrong' | 'right'>('idle');
  const [clueIdx, setClueIdx] = useState(0);
  const cipherFound = isCipherFound();
  const finished = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const usedStars = Object.values(placed);
  const full = Object.keys(placed).length === 4;
  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  };

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  useEffect(() => {
    if (!full || state !== 'idle' || finished.current) return;
    const ok = READ_ORDER.every(palace => placed[palace] === SOLUTION[palace]);
    const timer = setTimeout(() => {
      if (ok) {
        finished.current = true;
        setState('right');
        sfx.solved();
        tone(NOTE.C3, { dur: 6, type: 'sine', gain: 0.07 });
        READ_ORDER.forEach((_, i) => pluck(NOTE.C6, 0.7 + i * 0.5, 0.09));
        schedule(onSolved, 6000);
      } else {
        setState('wrong');
        sfx.wrong();
        schedule(() => { setState('idle'); setPlaced({}); setHeld(null); }, 950);
      }
    }, 420);
    return () => clearTimeout(timer);
  }, [full, placed, state, onSolved]);

  const tapStar = (id: StarId) => {
    if (state !== 'idle' || usedStars.includes(id)) return;
    sfx.pick();
    setHeld(current => (current === id ? null : id));
  };

  const tapPalace = (id: PalaceId) => {
    if (state !== 'idle') return;
    if (placed[id]) {
      sfx.click();
      setPlaced(current => { const next = { ...current }; delete next[id]; return next; });
      return;
    }
    if (!held) return;
    sfx.place();
    setPlaced(current => ({ ...current, [id]: held }));
    setHeld(null);
  };

  return (
    <SceneShell
      sky={['#0a0a24', '#171034', '#241a44']}
      accent="#9d8ce8"
      stars={110}
      motes="dust"
      vignette={0.86}
      className="lvl-cosmos"
    >
      <motion.div
        className="zodiac-outer"
        animate={{ rotate: 360 }}
        transition={{ duration: 220, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 560 560">
          <circle cx="280" cy="280" r="268" fill="none" stroke="rgba(157,140,232,0.16)" strokeWidth="1" />
          <circle cx="280" cy="280" r="238" fill="none" stroke="rgba(157,140,232,0.1)" strokeWidth="1" />
          {OUTER_12.map((name, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <g key={name}>
                <line
                  x1={280 + Math.cos(angle) * 238} y1={280 + Math.sin(angle) * 238}
                  x2={280 + Math.cos(angle) * 268} y2={280 + Math.sin(angle) * 268}
                  stroke="rgba(157,140,232,0.2)" strokeWidth="1"
                />
                <text
                  x={280 + Math.cos(angle + 0.26) * 253}
                  y={280 + Math.sin(angle + 0.26) * 253 + 3}
                  textAnchor="middle" className="zodiac-label"
                >{name}</text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      <div className="chart">
        <svg viewBox="0 0 400 400" className="chart-lines">
          <path d="M200 40 L360 200 L200 360 L40 200 Z"
            fill="rgba(157,140,232,0.05)" stroke="rgba(157,140,232,0.32)" strokeWidth="1.4" />
          <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(157,140,232,0.16)" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(157,140,232,0.16)" strokeWidth="1" strokeDasharray="4 6" />
        </svg>

        {PALACES.map(palace => {
          const starId = placed[palace.id];
          const star = STARS.find(item => item.id === starId);
          return (
            <button
              key={palace.id}
              className={`palace ${starId ? 'filled' : ''} ${held && !starId ? 'target' : ''} ${state}`}
              style={{ left: `${palace.x}%`, top: `${palace.y}%` }}
              onClick={() => tapPalace(palace.id)}
            >
              <span className="palace-name">{palace.name}</span>
              {star ? (
                <motion.span
                  className="palace-star cosmos-mark"
                  style={{ color: star.color }}
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                >
                  {state === 'right' ? star.word : <Scratch starId={star.id} color={star.color} />}
                </motion.span>
              ) : <span className="palace-sub">{palace.sub}</span>}
            </button>
          );
        })}
      </div>

      <div className="star-tray cosmos-token-tray">
        {STARS.map(star => (
          <motion.button
            key={star.id}
            draggable={false}
            drag={state === 'idle' && !usedStars.includes(star.id) ? true : false}
            dragElastic={0.12}
            dragSnapToOrigin
            className={`star-token cosmos-token ${held === star.id ? 'held' : ''} ${usedStars.includes(star.id) ? 'used' : ''}`}
            style={{ ['--c' as string]: star.color }}
            onClick={() => tapStar(star.id)}
          >
            <Scratch starId={star.id} color={star.color} />
          </motion.button>
        ))}
      </div>

      <div className="clue-scroll cosmos-clue-scroll">
        <div className="clue-scroll-head">
          <span>Nhìn lá số</span>
          <span className="clue-count">{clueIdx + 1}/{CLUES.length}</span>
        </div>
        <p key={clueIdx}>{CLUES[clueIdx]}</p>
        <div className="clue-scroll-nav">
          <button onClick={() => { sfx.click(); setClueIdx(i => (i - 1 + CLUES.length) % CLUES.length); }}>‹</button>
          <span className="clue-dots">
            {CLUES.map((_, i) => <i key={i} className={i === clueIdx ? 'on' : ''} />)}
          </span>
          <button onClick={() => { sfx.click(); setClueIdx(i => (i + 1) % CLUES.length); }}>›</button>
        </div>
        {!cipherFound && <p className="cipher-reminder">Vệt khắc vẫn ở căn phòng đầu.</p>}
      </div>

      <AnimatePresence>
        {state === 'right' && (
          <motion.div
            className="cosmos-reveal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1.4 }}
          >
            <p>Xa mấy cũng về</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
};

export default L6Cosmos;
