import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

type WindowId = 'hanoi' | 'poland';

const HANOI_HOURS = [17, 19, 21, 23];
const POLAND_HOURS = [11, 13, 15, 17];
const STARS: [number, number][] = [[21, 24], [44, 13], [59, 39], [76, 18], [88, 52]];

/**
 * Chapter IV — Khoảng Lệch Yêu Xa (L4Distance).
 * Any hour pair with exact 6-hour offset (Hanoi - Poland = 6) solves the puzzle!
 */
const L4Distance = ({ onSolved }: Props) => {
  const [hours, setHours] = useState<Record<WindowId, number>>({ hanoi: 21, poland: 11 });
  const [joined, setJoined] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const onSolvedRef = useRef(onSolved);
  const advanced = useRef(false);

  useEffect(() => { onSolvedRef.current = onSolved; }, [onSolved]);

  // Solved whenever Hanoi time minus Poland time equals 6 hours!
  const isAligned = (hours.hanoi - hours.poland === 6);

  useEffect(() => {
    if (!isAligned || joined) return;
    setJoined(true);
    sfx.solved();
  }, [isAligned, joined]);

  useEffect(() => {
    if (!joined) return;
    const crackTimer = window.setTimeout(() => {
      setBreaking(true);
      sfx.crack();
    }, 2200);
    const leaveTimer = window.setTimeout(() => {
      if (!advanced.current) {
        advanced.current = true;
        onSolvedRef.current();
      }
    }, 2200);
    return () => {
      window.clearTimeout(crackTimer);
      window.clearTimeout(leaveTimer);
    };
  }, [joined]);

  const turnWindow = (id: WindowId) => {
    if (joined) return;
    pluck(NOTE[id === 'hanoi' ? 'D4' : 'G4'], 0, 0.08);
    setHours(current => {
      const choices = id === 'hanoi' ? HANOI_HOURS : POLAND_HOURS;
      const next = choices[(choices.indexOf(current[id]) + 1) % choices.length];
      return { ...current, [id]: next };
    });
  };

  return (
    <SceneShell
      sky={['#070c1c', '#0d1730', '#132038']}
      accent="#9fd8ec"
      stars={44}
      motes="snow"
      vignette={0.9}
      className="distance-scene"
    >
      {/* Hanoi Window */}
      <div className={`distance-room distance-room-hanoi ${joined ? 'distance-room-joined' : ''}`}>
        <div className="distance-place">Hà Nội</div>
        <div className="distance-window-frame">
          <WindowSkyBackground hour={hours.hanoi} />
          <div className="distance-sky" aria-hidden="true">
            <OrbitalCelestialOrb hour={hours.hanoi} targetHour={23} isHanoi />
            <Constellation offset={(hours.hanoi - 23) * 12} opacity={hours.hanoi >= 19 ? 0.9 : 0.2} />
          </div>
          <button className="distance-window-pull" onClick={() => turnWindow('hanoi')} disabled={joined}>
            <span>xoay giờ</span>
            <b>{String(hours.hanoi).padStart(2, '0')}:00</b>
          </button>
        </div>
      </div>

      <div className={`distance-seam ${isAligned ? 'distance-seam-near' : ''} ${joined ? 'distance-seam-open' : ''}`}>
        <motion.p
          className="distance-hint"
          animate={{ opacity: joined ? 0 : 1 }}
        >
          Không cần cùng giờ. Cùng một bầu trời.
        </motion.p>
      </div>

      {/* Poland Window */}
      <div className={`distance-room distance-room-poland ${joined ? 'distance-room-joined' : ''}`}>
        <div className="distance-place">Ba Lan</div>
        <div className="distance-window-frame">
          <WindowSkyBackground hour={hours.poland} />
          <div className="distance-sky" aria-hidden="true">
            <OrbitalCelestialOrb hour={hours.poland} targetHour={17} isHanoi={false} />
            <Constellation offset={(hours.poland - 17) * -12} opacity={hours.poland >= 19 ? 0.9 : 0.2} />
          </div>
          <button className="distance-window-pull" onClick={() => turnWindow('poland')} disabled={joined}>
            <span>xoay giờ</span>
            <b>{String(hours.poland).padStart(2, '0')}:00</b>
          </button>
        </div>
      </div>

      {joined && (
        <motion.div
          className={`distance-shared-sky ${breaking ? 'distance-shared-sky-breaking' : ''}`}
          initial={{ opacity: 0, scaleX: 0.15 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <svg viewBox="0 0 600 250" className="distance-shared-constellation" aria-hidden="true">
            <Constellation offset={0} wide opacity={1} />
            <OrbitalCelestialOrb hour={23} targetHour={23} isHanoi wide />
          </svg>
          <motion.p
            className="distance-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: breaking ? 0 : 1 }}
            transition={{ delay: 0.7 }}
          >
            Một vệt sáng, đi qua cả hai cửa sổ.
          </motion.p>
          {breaking && <p className="distance-caption distance-caption-fade">Rồi trời lại chia đôi.</p>}
        </motion.div>
      )}
    </SceneShell>
  );
};

function WindowSkyBackground({ hour }: { hour: number }) {
  const isDay = hour >= 11 && hour <= 15;
  const isDusk = hour === 17;

  const bgGradient = isDay
    ? 'linear-gradient(180deg, #3b5f8a 0%, #7da2c8 100%)'
    : isDusk
    ? 'linear-gradient(180deg, #4d3a5c 0%, #d78b68 100%)'
    : 'linear-gradient(180deg, #060b1c 0%, #121c33 100%)';

  return (
    <motion.div
      animate={{ background: bgGradient }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
}

function OrbitalCelestialOrb({ hour, targetHour, isHanoi, wide = false }: { hour: number; targetHour: number; isHanoi: boolean; wide?: boolean }) {
  const isSun = hour >= 11 && hour <= 15;

  const choices = isHanoi ? HANOI_HOURS : POLAND_HOURS;
  const idx = choices.indexOf(hour);
  const angleDeg = (idx - choices.indexOf(targetHour)) * 32;

  const R = wide ? 160 : 70;
  const centerX = wide ? 300 : 90;
  const centerY = wide ? 130 : 90;

  const rad = (angleDeg * Math.PI) / 180;
  const orbX = centerX + Math.sin(rad) * R;
  const orbY = centerY - Math.cos(rad) * (R * 0.45);

  return (
    <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <motion.g
        animate={{ x: orbX, y: orbY, rotate: angleDeg }}
        transition={{ type: 'spring', stiffness: 100, damping: 16 }}
      >
        {isSun ? (
          <g>
            <circle r="18" fill="#ffd27a" opacity="0.4" />
            <circle r="12" fill="#ffbe4b" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <line
                key={a}
                x1={Math.cos((a * Math.PI) / 180) * 15}
                y1={Math.sin((a * Math.PI) / 180) * 15}
                x2={Math.cos((a * Math.PI) / 180) * 20}
                y2={Math.sin((a * Math.PI) / 180) * 20}
                stroke="#ffd27a" strokeWidth="2" strokeLinecap="round"
              />
            ))}
          </g>
        ) : (
          <g>
            <circle r="16" fill="#f7f0cf" opacity="0.25" />
            <circle r="12" fill="#f7f0cf" />
            <circle cx="4" cy="-2" r="10" fill="#0d1730" opacity={hour === 23 ? 0.15 : 0.75} />
          </g>
        )}
      </motion.g>
    </svg>
  );
}

function Constellation({ offset, opacity = 1, wide = false }: { offset: number; opacity?: number; wide?: boolean }) {
  const scale = wide ? 3 : 1;
  const xShift = wide ? 154 : 0;
  const points = STARS.map(([x, y]) => [x * scale + xShift + offset, y * scale + 40] as [number, number]);
  return (
    <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <motion.g animate={{ x: offset, opacity }} transition={{ duration: 1.2, ease: 'easeInOut' }}>
        {points.slice(0, -1).map((point, i) => (
          <line key={i} x1={point[0]} y1={point[1]} x2={points[i + 1][0]} y2={points[i + 1][1]} stroke="rgba(200,222,255,0.4)" strokeWidth="1" />
        ))}
        {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={wide ? 3 : 1.8} fill="#eaf3ff" />)}
      </motion.g>
    </svg>
  );
}

export default L4Distance;
