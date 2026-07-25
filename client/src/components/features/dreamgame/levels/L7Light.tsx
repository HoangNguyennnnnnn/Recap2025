import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck, tone } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

const COLS = 11, ROWS = 7, CELL = 62;
const SOURCE = { c: 0, r: 3 };
const TARGET = { c: 10, r: 4 };

type Slash = '/' | '\\';
const key = (c: number, r: number) => `${c},${r}`;

const INITIAL_MIRRORS: Record<string, Slash> = {
  [key(2, 3)]: '/',
  [key(2, 5)]: '\\',
  [key(5, 5)]: '\\',
  [key(5, 1)]: '/',
  [key(8, 1)]: '/',
  [key(8, 4)]: '/',
  [key(3, 1)]: '\\',
  [key(6, 4)]: '/',
  [key(9, 6)]: '\\',
};

const WALLS = [key(4, 2), key(7, 3), key(6, 6), key(9, 0), key(1, 1), key(3, 4)];
const WAYPOINTS = [
  { c: 1, r: 3, motif: 'reflection' },
  { c: 4, r: 5, motif: 'thread' },
  { c: 7, r: 1, motif: 'constellation' },
] as const;

const DIRS = {
  R: [1, 0], L: [-1, 0], U: [0, -1], D: [0, 1],
} as const;
type Dir = keyof typeof DIRS;

const BOUNCE: Record<Slash, Record<Dir, Dir>> = {
  '/': { R: 'U', U: 'R', L: 'D', D: 'L' },
  '\\': { R: 'D', D: 'R', L: 'U', U: 'L' },
};

interface Trace {
  points: [number, number][];
  hitTarget: boolean;
  waypoints: string[];
}

function traceBeam(mirrors: Record<string, Slash>): Trace {
  const points: [number, number][] = [[SOURCE.c, SOURCE.r]];
  const visited = new Set<string>();
  let c = SOURCE.c, r = SOURCE.r;
  let dir: Dir = 'R';
  let hitTarget = false;

  for (let step = 0; step < 300; step++) {
    const [dc, dr] = DIRS[dir];
    c += dc;
    r += dr;

    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) {
      points.push([c - dc * 0.5, r - dr * 0.5]);
      break;
    }
    if (WALLS.includes(key(c, r))) {
      points.push([c - dc * 0.5, r - dr * 0.5]);
      break;
    }

    const current = key(c, r);
    if (WAYPOINTS.some(waypoint => key(waypoint.c, waypoint.r) === current)) visited.add(current);
    if (c === TARGET.c && r === TARGET.r) {
      points.push([c, r]);
      hitTarget = true;
      break;
    }

    const mirror = mirrors[current];
    if (mirror) {
      points.push([c, r]);
      dir = BOUNCE[mirror][dir];
    }
  }

  if (points.length === 1) points.push([SOURCE.c + 0.5, SOURCE.r]);
  return { points, hitTarget, waypoints: [...visited] };
}

const px = (value: number) => value * CELL + CELL / 2;

const WaypointMotif = ({ motif, c, r, lit }: { motif: typeof WAYPOINTS[number]['motif']; c: number; r: number; lit: boolean }) => {
  const x = px(c), y = px(r);
  const color = lit ? '#fff0bd' : 'rgba(255,210,122,0.38)';
  return (
    <g className={`light-waypoint light-waypoint-${motif} ${lit ? 'is-lit' : ''}`}>
      <circle cx={x} cy={y} r="23" fill={lit ? 'rgba(255,210,122,0.16)' : 'rgba(255,255,255,0.025)'} stroke={color} strokeWidth="1.2" />
      {motif === 'reflection' && <>
        <path d={`M${x - 11} ${y - 8} L${x + 11} ${y - 8} M${x - 11} ${y + 8} L${x + 11} ${y + 8}`} stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d={`M${x - 5} ${y - 3} L${x + 5} ${y + 3}`} stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </>}
      {motif === 'thread' && <path d={`M${x - 14} ${y + 5} C${x - 6} ${y - 14}, ${x + 5} ${y + 14}, ${x + 14} ${y - 5}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />}
      {motif === 'constellation' && <>
        <path d={`M${x - 10} ${y + 7} L${x} ${y - 9} L${x + 11} ${y + 6}`} fill="none" stroke={color} strokeWidth="1.2" />
        <circle cx={x - 10} cy={y + 7} r="2.5" fill={color} /><circle cx={x} cy={y - 9} r="2.5" fill={color} /><circle cx={x + 11} cy={y + 6} r="2.5" fill={color} />
      </>}
    </g>
  );
};

/** Chapter VII — route the beam through every shared sign before the target opens. */
const L7Light = ({ onSolved }: Props) => {
  const [mirrors, setMirrors] = useState<Record<string, Slash>>({ ...INITIAL_MIRRORS });
  const [won, setWon] = useState(false);
  const finished = useRef(false);
  const solveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trace = useMemo(() => traceBeam(mirrors), [mirrors]);
  const allWaypointsLit = WAYPOINTS.every(waypoint => trace.waypoints.includes(key(waypoint.c, waypoint.r)));
  const targetOpen = trace.hitTarget && allWaypointsLit;

  useEffect(() => () => {
    if (solveTimer.current) clearTimeout(solveTimer.current);
  }, []);

  useEffect(() => {
    if (!targetOpen || finished.current) return;
    finished.current = true;
    setWon(true);
    sfx.solved();
    tone(NOTE.C3, { dur: 7, type: 'sine', gain: 0.08 });
    [0, 1, 2, 3, 4].forEach(i => pluck(NOTE.C6, 0.6 + i * 0.42, 0.08));
    solveTimer.current = setTimeout(onSolved, 6200);
  }, [targetOpen, onSolved]);

  const flip = (mirrorKey: string) => {
    if (won) return;
    pluck(NOTE.E5, 0, 0.08);
    setMirrors(current => ({ ...current, [mirrorKey]: current[mirrorKey] === '/' ? '\\' : '/' }));
  };

  const width = COLS * CELL, height = ROWS * CELL;

  return (
    <SceneShell
      sky={['#06081a', '#0d1130', '#151a3c']}
      accent="#ffd27a"
      stars={130}
      motes="dust"
      vignette={0.9}
      className="lvl-light"
    >
      <div className="light-board">
        <svg viewBox={`0 0 ${width} ${height}`} className="light-svg">
          <defs>
            <linearGradient id="beam-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffd27a" />
              <stop offset="100%" stopColor="#ffe9b8" />
            </linearGradient>
            <filter id="beam-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="src-glow">
              <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffd27a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {Array.from({ length: COLS + 1 }).map((_, c) => (
            <line key={`v${c}`} x1={c * CELL} y1="0" x2={c * CELL} y2={height} stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          ))}
          {Array.from({ length: ROWS + 1 }).map((_, r) => (
            <line key={`h${r}`} x1="0" y1={r * CELL} x2={width} y2={r * CELL} stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          ))}

          {WALLS.map(wallKey => {
            const [c, r] = wallKey.split(',').map(Number);
            return (
              <g key={wallKey}>
                <rect x={c * CELL + 6} y={r * CELL + 6} width={CELL - 12} height={CELL - 12} rx="6" fill="rgba(120,120,160,0.14)" stroke="rgba(150,150,190,0.28)" strokeWidth="1.2" />
                <path d={`M${c * CELL + 16} ${r * CELL + 16} L${c * CELL + CELL - 16} ${r * CELL + CELL - 16} M${c * CELL + CELL - 16} ${r * CELL + 16} L${c * CELL + 16} ${r * CELL + CELL - 16}`} stroke="rgba(150,150,190,0.2)" strokeWidth="1.4" />
              </g>
            );
          })}

          {WAYPOINTS.map(waypoint => <WaypointMotif key={waypoint.motif} {...waypoint} lit={trace.waypoints.includes(key(waypoint.c, waypoint.r))} />)}

          <polyline
            points={trace.points.map(([c, r]) => `${px(c)},${px(r)}`).join(' ')}
            fill="none"
            stroke="url(#beam-grad)"
            strokeWidth={won ? 5 : 3.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#beam-glow)"
            opacity={won ? 1 : 0.9}
            className="beam-line"
          />

          <g>
            <circle cx={px(SOURCE.c)} cy={px(SOURCE.r)} r="46" fill="url(#src-glow)" />
            <circle cx={px(SOURCE.c)} cy={px(SOURCE.r)} r="13" fill="#ffe9b8" />
            <circle cx={px(SOURCE.c)} cy={px(SOURCE.r)} r="19" fill="none" stroke="#ffd27a" strokeWidth="1.4" opacity="0.6" />
            <text x={px(SOURCE.c)} y={px(SOURCE.r) + 44} textAnchor="middle" className="board-label">Hà Nội</text>
          </g>

          <g className={`target ${won ? 'won' : ''} ${trace.hitTarget && !targetOpen ? 'target-closed' : ''}`}>
            <circle cx={px(TARGET.c)} cy={px(TARGET.r)} r={won ? 44 : 24} fill="url(#src-glow)" opacity={won ? 1 : targetOpen ? 0.65 : 0.2} />
            <path
              d={`M${px(TARGET.c)} ${px(TARGET.r) - 16} L${px(TARGET.c) + 5} ${px(TARGET.r) - 5} L${px(TARGET.c) + 16} ${px(TARGET.r)} L${px(TARGET.c) + 5} ${px(TARGET.r) + 5} L${px(TARGET.c)} ${px(TARGET.r) + 16} L${px(TARGET.c) - 5} ${px(TARGET.r) + 5} L${px(TARGET.c) - 16} ${px(TARGET.r)} L${px(TARGET.c) - 5} ${px(TARGET.r) - 5} Z`}
              fill={won ? '#fff3d0' : 'rgba(255,226,168,0.4)'}
              stroke="#ffd27a" strokeWidth="1.2"
            />
            <text x={px(TARGET.c)} y={px(TARGET.r) + 44} textAnchor="middle" className="board-label">cậu</text>
          </g>

          {Object.entries(mirrors).map(([mirrorKey, slash]) => {
            const [c, r] = mirrorKey.split(',').map(Number);
            const cx = px(c), cy = px(r);
            const path = slash === '/'
              ? `M${cx - 19} ${cy + 19} L${cx + 19} ${cy - 19}`
              : `M${cx - 19} ${cy - 19} L${cx + 19} ${cy + 19}`;
            return (
              <g key={mirrorKey} className="mirror" onClick={() => flip(mirrorKey)}>
                <rect x={c * CELL} y={r * CELL} width={CELL} height={CELL} fill="transparent" />
                <circle cx={cx} cy={cy} r="25" fill="rgba(255,255,255,0.03)" stroke="rgba(255,226,168,0.16)" strokeWidth="1" />
                <path d={path} stroke="rgba(255,255,255,0.22)" strokeWidth="9" strokeLinecap="round" />
                <path d={path} stroke="#dfe8ff" strokeWidth="3.4" strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      </div>

      <p className="light-hint">
        {won ? 'Tới rồi.' : trace.hitTarget ? 'Cửa còn khép.' : 'Xoay kính. Đi qua ba dấu.'}
      </p>

      <AnimatePresence>
        {won && (
          <motion.div className="light-win" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 1.2 }}>
            <p>Đường không thẳng. Nhưng nó tới.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
};

export default L7Light;
