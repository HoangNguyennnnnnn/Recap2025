import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { WALL_MARKS, markCipherFound } from '../data/cipher';
import { sfx, NOTE, pluck, tone } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

/**
 * Chapter 0 — the empty room.
 *
 * Nothing announces itself. The only thing in the room that responds is the
 * clock, and the clock is draggable — and moving time moves the shaft of
 * moonlight across the room. Everything else is found by putting the light
 * on it.
 *
 * Two things have to be lit: the scratches on the wall (they go into the
 * journal and are needed in chapter VI) and the keyhole.
 */

const HOURS = 12;
/** Where the light lands for each hour, in scene x. */
const beamXFor = (h: number) => 902 - h * 70;

interface Lit {
  hour: number;
  id: 'bed' | 'plant' | 'mirror' | 'marks' | 'chair' | 'keyhole';
}
const LIT: Lit[] = [
  { hour: 1, id: 'bed' },
  { hour: 2, id: 'plant' },
  { hour: 3, id: 'mirror' },
  { hour: 5, id: 'marks' },
  { hour: 7, id: 'chair' },
  { hour: 10, id: 'keyhole' },
];

const litAt = (h: number) => LIT.find(l => l.hour === h)?.id;

const L0Room = ({ onSolved }: Props) => {
  const [hour, setHour] = useState(0);
  const [seenMarks, setSeenMarks] = useState(false);
  const [marksOpen, setMarksOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [touchedClock, setTouchedClock] = useState(false);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const finished = useRef(false);

  const lit = litAt(hour);
  const beamX = beamXFor(hour);

  // Note anything the light finds, and chime the first time.
  useEffect(() => {
    if (!lit || discovered.includes(lit)) return;
    setDiscovered(d => [...d, lit]);
    if (lit === 'marks' && !seenMarks) {
      setSeenMarks(true);
      markCipherFound();
    }
    pluck(NOTE.C5, 0, 0.09);
    pluck(NOTE.G5, 0.1, 0.07);
  }, [lit, discovered, seenMarks]);

  // The keyhole auto-opens ONLY if the wall marks (note) were found first!
  useEffect(() => {
    if (lit !== 'keyhole' || finished.current || !seenMarks) return;
    finished.current = true;
    sfx.unlock();
    setOpening(true);
    sfx.solved();
    tone(NOTE.C3, { dur: 6, type: 'sine', gain: 0.08 });
    const t = setTimeout(onSolved, 1200);
    return () => clearTimeout(t);
  }, [lit, onSolved, seenMarks]);

  /** Clicking the clock face sets the hour to whatever you pointed at. */
  const grabClock = (e: React.MouseEvent<SVGGElement>) => {
    const box = (e.currentTarget as SVGGElement).getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    let a = Math.atan2(dy, dx) * 180 / Math.PI + 90;   // 0 = 12 o'clock
    if (a < 0) a += 360;
    const h = Math.round(a / 30) % HOURS;
    if (h !== hour) {
      setHour(h);
      pluck(NOTE.A3 * (1 + h * 0.03), 0, 0.07);
    }
    setTouchedClock(true);
  };

  const nudge = (d: 1 | -1) => {
    setHour(h => (h + d + HOURS) % HOURS);
    setTouchedClock(true);
    pluck(NOTE.A3, 0, 0.06);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nudge(1);
      if (e.key === 'ArrowLeft') nudge(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Keyhole only glows if the wall marks (note) have been discovered
  const glow = (id: string) => lit === id && (id !== 'keyhole' || seenMarks);

  return (
    <SceneShell
      sky={['#05070f', '#080b16', '#0b0e18']}
      accent="#8fa3c8"
      stars={0}
      motes="dust"
      vignette={0.96}
      className="lvl-room"
    >
      <svg viewBox="0 0 1000 620" className="scene-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="rm-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141827" />
            <stop offset="100%" stopColor="#0a0d16" />
          </linearGradient>
          <linearGradient id="rm-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#121622" />
            <stop offset="100%" stopColor="#070910" />
          </linearGradient>
          <linearGradient id="rm-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe9ff" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#cdd9f5" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#cdd9f5" stopOpacity="0.03" />
          </linearGradient>
          <radialGradient id="rm-pool">
            <stop offset="0%" stopColor="#e4ecff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e4ecff" stopOpacity="0" />
          </radialGradient>
          <filter id="rm-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        {/* shell */}
        <rect x="0" y="0" width="1000" height="452" fill="url(#rm-wall)" />
        <rect x="0" y="452" width="1000" height="168" fill="url(#rm-floor)" />
        <line x1="0" y1="452" x2="1000" y2="452" stroke="#1e2438" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <line key={i} x1={70 + i * 128} y1="452" x2={-160 + i * 205} y2="620"
            stroke="#161b2a" strokeWidth="1" />
        ))}
        {/* skirting + damp patch, for texture */}
        <rect x="0" y="440" width="1000" height="12" fill="#171d2c" />
        <ellipse cx="620" cy="230" rx="150" ry="90" fill="#1a2032" opacity="0.5" filter="url(#rm-blur)" />

        {/* ── the moonlight shaft ── */}
        <g style={{ transition: 'transform 0.75s cubic-bezier(.4,0,.2,1)' }}
          transform={`translate(${beamX - 820} 0)`}>
          <path d="M782 168 L858 168 L936 452 L706 452 Z" fill="url(#rm-beam)" />
          <ellipse cx="820" cy="456" rx="118" ry="26" fill="url(#rm-pool)" />
        </g>

        {/* ── window (fixed) ── */}
        <g>
          <rect x="770" y="96" width="140" height="150" rx="3" fill="#0c1020"
            stroke="#232b40" strokeWidth="2.5" />
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x="778" y={104 + i * 29} width="124" height="20" rx="2"
              fill="#101728" stroke="#1d2438" strokeWidth="0.8" />
          ))}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1="778" y1={105 + i * 29} x2="902" y2={105 + i * 29}
              stroke="#cfdcf8" strokeWidth="1.2" opacity="0.34" />
          ))}
          <rect x="758" y="246" width="164" height="11" rx="3" fill="#1a2032" stroke="#252d42" strokeWidth="1" />
        </g>

        {/* ── door, far left ── */}
        <g
          style={{ cursor: glow('keyhole') ? 'pointer' : 'default' }}
          onClick={() => {
            if (glow('keyhole') && seenMarks) {
              finished.current = true;
              sfx.unlock();
              setOpening(true);
              sfx.solved();
              onSolved();
            }
          }}
        >
          <rect x="52" y="146" width="152" height="306" rx="3" fill="#101522"
            stroke="#242c40" strokeWidth="2.5" />
          <rect x="68" y="164" width="120" height="122" rx="2" fill="none" stroke="#1c2334" strokeWidth="1.4" />
          <rect x="68" y="300" width="120" height="134" rx="2" fill="none" stroke="#1c2334" strokeWidth="1.4" />
          {/* keyhole */}
          <g className={glow('keyhole') ? 'rm-hot on' : 'rm-hot'}>
            <circle cx="180" cy="330" r="13"
              fill={glow('keyhole') ? 'rgba(228,236,255,0.2)' : 'transparent'} />
            <circle cx="180" cy="326" r="5.5" fill="none"
              stroke={glow('keyhole') ? '#f0f5ff' : '#2c3550'} strokeWidth="2" />
            <path d="M180 331 L177 340 L183 340 Z"
              fill={glow('keyhole') ? '#f0f5ff' : '#2c3550'} />
          </g>
          {opening && (
            <motion.rect
              x="52" y="146" width="152" height="306"
              fill="#fff6da"
              initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
              transition={{ duration: 1.6 }}
            />
          )}
        </g>

        {/* ── things the light can find ── */}

        {/* bed */}
        <g opacity={glow('bed') ? 1 : 0.16}>
          <rect x="770" y="392" width="176" height="18" rx="4" fill="#2a2135" />
          <rect x="784" y="410" width="12" height="42" fill="#1d1828" />
          <rect x="922" y="410" width="12" height="42" fill="#1d1828" />
          <path d="M770 392 q 44 -22 92 -6 q 46 16 84 6z" fill="#3a3048" />
          <ellipse cx="808" cy="382" rx="30" ry="13" fill="#4a3f58" />
        </g>

        {/* plant */}
        <g opacity={glow('plant') ? 1 : 0.16}>
          <path d="M726 452 L733 404 L779 404 L786 452 Z" fill="#221c30" />
          <path d="M756 402 C 750 372 730 356 714 350 M756 402 C 762 368 782 354 800 350 M756 402 C 754 366 748 344 744 326"
            fill="none" stroke={glow('plant') ? '#6f9a72' : '#2c3a2e'} strokeWidth="2.6" strokeLinecap="round" />
          {[[714, 350, -34], [800, 350, 32], [744, 326, -8]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="15" ry="7.5" transform={`rotate(${r} ${x} ${y})`}
              fill={glow('plant') ? 'rgba(120,180,128,0.5)' : 'rgba(44,58,46,0.6)'}
              stroke={glow('plant') ? '#7fb488' : '#2c3a2e'} strokeWidth="1.2" />
          ))}
        </g>

        {/* mirror */}
        <g opacity={glow('mirror') ? 1 : 0.16}>
          <rect x="638" y="238" width="98" height="140" rx="46" fill="#0e1320"
            stroke={glow('mirror') ? '#c3d2f0' : '#28304a'} strokeWidth="3" />
          {glow('mirror') && (
            <>
              <rect x="644" y="244" width="86" height="128" rx="43" fill="#dfe9ff" opacity="0.16" />
              <path d="M660 356 q 26 -70 58 -102" stroke="#fff" strokeWidth="4" opacity="0.3" fill="none" />
            </>
          )}
        </g>

        {/* chair */}
        <g opacity={glow('chair') ? 1 : 0.16}>
          <rect x="356" y="382" width="76" height="10" rx="3" fill="#3a2f26" />
          <rect x="358" y="316" width="9" height="70" rx="3" fill="#3a2f26" />
          <rect x="362" y="392" width="7" height="60" fill="#2d241d" />
          <rect x="420" y="392" width="7" height="60" fill="#2d241d" />
          <rect x="358" y="336" width="66" height="6" rx="2" fill="#33291f" />
        </g>

        {/* the scratches — the one thing that matters twice */}
        <g
          className={glow('marks') ? 'rm-hot on' : 'rm-hot'}
          opacity={glow('marks') ? 1 : seenMarks ? 0.28 : 0.07}
          onClick={() => {
            if (!glow('marks')) return;
            sfx.paper();
            setMarksOpen(true);
            if (!seenMarks) { setSeenMarks(true); markCipherFound(); }
          }}
        >
          <rect x="452" y="252" width="184" height="86" rx="4"
            fill={glow('marks') ? 'rgba(228,236,255,0.07)' : 'transparent'} />
          {WALL_MARKS.map((m, i) => (
            <g key={i} transform={`translate(${470 + i * 42} 274) scale(1.55)`}>
              <path d={m.path} fill="none"
                stroke={glow('marks') ? '#eef4ff' : '#39435e'}
                strokeWidth="1.7" strokeLinecap="round" />
            </g>
          ))}
          {glow('marks') && !seenMarks && (
            <text x="544" y="332" textAnchor="middle" className="rm-tip">có ai vạch lên tường</text>
          )}
        </g>

        {/* ── the clock — the only thing that answers ── */}
        <g className="rm-clock" onClick={grabClock}>
          <circle cx="256" cy="176" r="62" fill="#0d1220" stroke="#2c3550" strokeWidth="2.5" />
          <circle cx="256" cy="176" r="52" fill="none" stroke="#1e2740" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const on = i === hour;
            return (
              <circle key={i}
                cx={256 + Math.cos(a) * 44} cy={176 + Math.sin(a) * 44}
                r={on ? 3.2 : 1.8}
                fill={on ? '#e8f0ff' : '#3a4562'} />
            );
          })}
          <g style={{ transition: 'transform 0.5s cubic-bezier(.34,1.4,.5,1)' }}
            transform={`rotate(${hour * 30} 256 176)`}>
            <line x1="256" y1="176" x2="256" y2="140" stroke="#dbe5ff" strokeWidth="3.4" strokeLinecap="round" />
          </g>
          <circle cx="256" cy="176" r="4" fill="#dbe5ff" />
          {!touchedClock && (
            <circle cx="256" cy="176" r="62" fill="none" stroke="#8fa3c8" strokeWidth="1.5"
              className="rm-clock-ping" />
          )}
        </g>
      </svg>

      {/* the only UI: two nudges, and a mark for what the light has found */}
      <div className="rm-ui">
        <button className="rm-arrow" onClick={() => nudge(-1)} aria-label="lùi">‹</button>
        <span className="rm-found">
          {LIT.map(l => (
            <i key={l.id}
              className={
                l.id === 'marks' ? (seenMarks ? 'key on' : 'key') :
                  discovered.includes(l.id) ? 'on' : ''
              } />
          ))}
        </span>
        <button className="rm-arrow" onClick={() => nudge(1)} aria-label="tiến">›</button>
      </div>

      {/* the scratches, close up */}
      <AnimatePresence>
        {marksOpen && (
          <motion.div className="overlay-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMarksOpen(false)}>
            <motion.div className="marks-card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              onClick={e => e.stopPropagation()}>
              <p className="marks-note">Bốn vạch. Chưa biết để làm gì.</p>
              <div className="marks-row">
                {WALL_MARKS.map((m, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="mark-glyph">
                    <path d={m.path} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                ))}
              </div>
              <p className="marks-foot">đã ghi vào sổ</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {opening && (
        <motion.div className="room-doorlight"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 1] }} transition={{ duration: 2.6 }} />
      )}
    </SceneShell>
  );
};

export default L0Room;
