import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck, tone } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

interface ReunionSpot {
  id: string;
  name: string;
  time: string;
  icon: string;
  cx: number; // SVG center X (0..1000)
  cy: number; // SVG center Y (0..500)
}

const SPOTS: ReunionSpot[] = [
  { id: 'airport_bk', name: '1. Sân Bay / Bách Khoa', time: 'Trưa 26/07', icon: '✈️', cx: 180, cy: 380 },
  { id: 'kebin', name: '2. Kebin CF Giường Nằm', time: 'Chiều 26/07', icon: '☕', cx: 360, cy: 260 },
  { id: 'ck', name: '3. Quán CK Quen Thuộc', time: 'Chiều tối', icon: '🏪', cx: 520, cy: 320 },
  { id: 'cinema_guom', name: '4. Rạp Phim & Hồ Gươm', time: 'Buổi Tối', icon: '🎬', cx: 700, cy: 220 },
  { id: 'westlake', name: '5. Dạo Quanh Hồ Tây', time: 'Hôm Sau', icon: '🌊', cx: 850, cy: 120 },
];

/**
 * Chapter V — Ngày Cậu Về (26/07/2025).
 * Perfectly Aligned Hanoi Map Route (5 Most Frequent Reunion Locations).
 */
const L5Reunion = ({ onSolved }: Props) => {
  const [visited, setVisited] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentStep = visited.length;
  const targetSpot = SPOTS[currentStep];

  const handleSpotClick = (spot: ReunionSpot) => {
    if (solved) return;

    if (spot.id === targetSpot?.id) {
      pluck(NOTE.C5, 0, 0.1);
      sfx.pick();
      const next = [...visited, spot.id];
      setVisited(next);

      if (next.length === SPOTS.length) {
        setSolved(true);
        sfx.solved();
        tone(NOTE.C3, { dur: 5, type: 'sine', gain: 0.08 });
        timerRef.current = setTimeout(onSolved, 5400);
      }
    } else {
      sfx.wrong();
    }
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [onSolved]);

  // Construct unbroken SVG path string for visited points
  const routePath = visited.map((id, idx) => {
    const s = SPOTS.find(item => item.id === id)!;
    return `${idx === 0 ? 'M' : 'L'} ${s.cx} ${s.cy}`;
  }).join(' ');

  return (
    <SceneShell
      sky={['#100d1d', '#23182d', '#3d223c']}
      accent="#c55e78"
      stars={110}
      motes="petal"
      vignette={0.72}
      className="reunion-scene"
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', zIndex: 20, userSelect: 'none'
      }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.6rem', color: '#e8dcc4' }}>
          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', fontWeight: 500 }}>
            Hành Trình Gặp Lại · 26 / 07 / 2025
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232,220,196,0.65)', letterSpacing: '0.08em' }}>
            {!solved
              ? `Bấm chọn địa điểm tiếp theo: ${targetSpot.name} (${currentStep + 1}/5) 📍`
              : '✨ Đã kết nối trọn vẹn 5 địa điểm yêu thích nhất ngày gặp lại!'
            }
          </span>
        </div>

        {/* Hanoi Map Interactive Board */}
        <div style={{
          position: 'relative', width: 'min(780px, 94vw)', height: 'clamp(300px, 48vh, 390px)',
          borderRadius: '24px', border: '2px solid rgba(197,94,120,0.4)',
          background: 'linear-gradient(180deg, #181224 0%, #0c0814 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)', overflow: 'hidden'
        }}>
          {/* SVG Map Canvas & Perfectly Aligned Connecting Path */}
          <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%', display: 'block' }}>
            <defs>
              <linearGradient id="reunion-gold-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c55e78" />
                <stop offset="100%" stopColor="#ffd27a" />
              </linearGradient>
            </defs>

            {/* Hanoi River & Westlake SVG visual art */}
            <path d="M920 0 C840 120 880 240 800 340 C740 420 780 500 720 500 L1000 500Z" fill="#1b2a40" opacity="0.75" />
            <ellipse cx="850" cy="120" rx="90" ry="45" fill="#203a54" opacity="0.8" />

            {/* Perfectly Aligned Connecting Path (Draws directly through pin centers) */}
            {visited.length > 1 && (
              <path
                d={routePath}
                fill="none"
                stroke="url(#reunion-gold-line)"
                strokeWidth="4.5"
                strokeDasharray="8,5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 5 Pins rendered directly in SVG coordinate space (Zero Alignment Drift) */}
            {SPOTS.map((spot, idx) => {
              const isVisited = visited.includes(spot.id);
              const isNext = visited.length === idx;
              return (
                <g
                  key={spot.id}
                  cursor="pointer"
                  onClick={() => handleSpotClick(spot)}
                  transform={`translate(${spot.cx} ${spot.cy})`}
                >
                  {/* Glowing Target Ring for next pin */}
                  {isNext && (
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#ffd27a" strokeWidth="2" opacity="0.8" />
                  )}

                  {/* Main Pin Circle */}
                  <circle
                    cx="0" cy="0" r="20"
                    fill={isVisited ? '#c55e78' : isNext ? '#ffd27a' : '#1e1828'}
                    stroke={isVisited ? '#ffd27a' : isNext ? '#fff' : '#4f3c5a'}
                    strokeWidth="2.5"
                  />

                  {/* Icon or Check */}
                  <text x="0" y="5" textAnchor="middle" fontSize="13" fill={isVisited ? '#fff' : isNext ? '#100a02' : '#aaa'}>
                    {isVisited ? '✓' : spot.icon}
                  </text>

                  {/* Label Box */}
                  <g transform="translate(0 34)">
                    <rect x="-70" y="-12" width="140" height="22" rx="11" fill="rgba(12,10,24,0.9)" stroke={isVisited ? '#ffd27a' : isNext ? '#fff' : 'rgba(255,255,255,0.15)'} strokeWidth="1" />
                    <text x="0" y="2" textAnchor="middle" fill={isVisited ? '#ffd27a' : isNext ? '#fff' : '#aaa'} fontSize="10" fontWeight="bold">
                      {spot.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Meaningful Footnote */}
        <p style={{ margin: '0.6rem 0 0', fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', textAlign: 'center' }}>
          *Dù đã đi qua rất nhiều nơi, nhưng đây là 5 địa điểm gắn bó và được hai đứa ghé thăm nhiều nhất trong ngày gặp lại.
        </p>

        {/* Victory Celebration Stamp */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 30, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: -4 }}
              style={{
                position: 'absolute', zIndex: 90, background: 'rgba(12,10,24,0.94)',
                border: '2px solid #c55e78', borderRadius: '18px', padding: '18px 32px',
                textAlign: 'center', color: '#ffd27a', boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '2.8rem' }}>✈️☕🏪🎬🌊</span>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#c55e78', fontWeight: 700, marginTop: '6px' }}>
                ĐÃ GẶP LẠI · TRỌN VẸN 5 ĐỊA ĐIỂM YÊU THÍCH NHẤT
              </span>
              <h3 style={{ margin: '4px 0 2px', fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#fff' }}>
                26 · 07 · 2025
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                "Sân bay ➔ Kebin CF ➔ Quán CK ➔ Rạp phim ➔ Hồ Tây: Đi qua bao nẻo đường, thương nhớ nối trọn thương nhớ."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

export default L5Reunion;
