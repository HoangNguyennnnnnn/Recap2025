import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck, tone } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

/**
 * Chapter I — Việt Phủ Thành Chương (27-28/08/2023).
 *
 * Optical Aperture Alignment Puzzle with Blooming Flower Center:
 * Rotate 3 light rings to make a glowing flower bloom in the center!
 */
const LVietPhu = ({ onSolved }: Props) => {
  // Angle states for 3 optical rings (0..360 deg)
  const [ring1, setRing1] = useState(130); // target: 0
  const [ring2, setRing2] = useState(220); // target: 0
  const [ring3, setRing3] = useState(80);  // target: 0

  const [flashing, setFlashing] = useState(false);
  const [solved, setSolved] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shortest distance to 0 (or 360)
  const dist1 = Math.min(ring1, 360 - ring1);
  const dist2 = Math.min(ring2, 360 - ring2);
  const dist3 = Math.min(ring3, 360 - ring3);

  // Check if rings are within tolerance (+/- 14°)
  const isRing1Aligned = dist1 <= 14;
  const isRing2Aligned = dist2 <= 14;
  const isRing3Aligned = dist3 <= 14;

  const isAligned = isRing1Aligned && isRing2Aligned && isRing3Aligned;

  // Calculate bloom progress (0..1) based on closeness of all 3 rings
  const totalDist = dist1 + dist2 + dist3;
  const rawProgress = Math.max(0, 1 - totalDist / 360);
  const bloomProgress = isAligned ? 1 : rawProgress;

  useEffect(() => {
    if (!isAligned || solved) return;
    setSolved(true);
    sfx.solved();
    sfx.paper();
    pluck(NOTE.C6, 0, 0.1);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 300);

    tone(NOTE.C3, { dur: 6, type: 'sine', gain: 0.08 });
    timerRef.current = setTimeout(onSolved, 3800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isAligned, solved, onSolved]);

  return (
    <SceneShell
      sky={['#0a0814', '#181228', '#2d1a38']}
      accent="#ffd27a"
      stars={140}
      motes="petal"
      vignette={0.72}
      className="lvl-vietphu"
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', zIndex: 20, userSelect: 'none'
      }}>
        {/* Flash Overlay */}
        <AnimatePresence>
          {flashing && (
            <motion.div
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 99 }}
            />
          )}
        </AnimatePresence>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '0.8rem', color: '#e8dcc4' }}>
          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 500 }}>
            Ống Kính Hoa Nở · Việt Phủ
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232,220,196,0.6)', letterSpacing: '0.1em' }}>
            27 · 28 / 08 / 2023 — Xoay 3 vòng sáng để làm hoa nở bừng ở trung tâm 🌸
          </span>
        </div>

        {/* Optical Aperture Alignment Interactive SVG */}
        <div style={{
          position: 'relative', width: 'min(380px, 86vw)', height: 'min(380px, 86vw)',
          borderRadius: '50%', border: '2px solid rgba(255,210,122,0.3)',
          background: 'radial-gradient(circle, #191428 0%, #090710 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id="flower-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f4b8c7" stopOpacity={0.4 + bloomProgress * 0.5} />
                <stop offset="100%" stopColor="#f4b8c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="ring1-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffd27a" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="ring2-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#86d8a0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#86d8a0" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="ring3-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9fd8ec" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#9fd8ec" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Target Alignment Notch at Top (0°) */}
            <line x1="200" y1="16" x2="200" y2="36" stroke="#ffd27a" strokeWidth="2.5" />

            {/* Ring 1: Outer Gold Ring (Sun Beam) */}
            <g transform={`rotate(${ring1} 200 200)`}>
              <circle cx="200" cy="200" r="160" fill="none" stroke="url(#ring1-grad)" strokeWidth="4" strokeDasharray="140 30" />
              <polygon points="200,40 192,25 208,25" fill="#ffd27a" />
            </g>

            {/* Ring 2: Middle Emerald Ring (Water Ripple) */}
            <g transform={`rotate(${ring2} 200 200)`}>
              <circle cx="200" cy="200" r="120" fill="none" stroke="url(#ring2-grad)" strokeWidth="3.5" strokeDasharray="100 25" />
              <polygon points="200,80 193,68 207,68" fill="#86d8a0" />
            </g>

            {/* Ring 3: Inner Sapphire Ring (Tile Gate) */}
            <g transform={`rotate(${ring3} 200 200)`}>
              <circle cx="200" cy="200" r="80" fill="none" stroke="url(#ring3-grad)" strokeWidth="3" strokeDasharray="60 20" />
              <polygon points="200,120 194,110 206,110" fill="#9fd8ec" />
            </g>

            {/* CENTER BLOOMING FLOWER 🌸 (Gradually blooms & turns clear as progress increases) */}
            <g transform="translate(200 200)">
              {/* Outer Glow Halo */}
              <circle cx="0" cy="0" r={20 + bloomProgress * 30} fill="url(#flower-glow)" />

              {/* Blooming Petals SVG */}
              <motion.g
                animate={{
                  scale: 0.3 + bloomProgress * 0.75,
                  rotate: bloomProgress * 360,
                  opacity: 0.2 + bloomProgress * 0.8
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              >
                {/* 6 Elegant Petals */}
                {[0, 60, 120, 180, 240, 300].map(angle => (
                  <g key={angle} transform={`rotate(${angle})`}>
                    <path
                      d="M0 0 Q-12 -28 0 -45 Q12 -28 0 0 Z"
                      fill="#f4b8c7"
                      stroke="#fff"
                      strokeWidth="1"
                      opacity={0.85}
                    />
                  </g>
                ))}

                {/* Flower Golden Core */}
                <circle cx="0" cy="0" r="10" fill="#ffd27a" stroke="#fff" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#e89bb0" />
              </motion.g>
            </g>
          </svg>
        </div>

        {/* Sliders Control Bar */}
        <div style={{
          marginTop: '1.2rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px', width: 'min(380px, 90vw)'
        }}>
          {/* Ring 1 Slider */}
          <div style={{
            width: '100%', background: 'rgba(10,8,20,0.85)', padding: '6px 14px', borderRadius: '99px',
            border: `1px solid ${isRing1Aligned ? '#86d8a0' : 'rgba(255,210,122,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem'
          }}>
            <span style={{ color: '#ffd27a' }}>☀️ Vệt Nắng (Vòng ngoài):</span>
            <input
              type="range" min="0" max="360" value={ring1}
              onChange={e => { setRing1(Number(e.target.value)); pluck(NOTE.C5, 0, 0.04); }}
              style={{ accentColor: '#ffd27a', width: '130px' }}
            />
            <span style={{ color: isRing1Aligned ? '#86d8a0' : '#888', fontSize: '0.72rem', width: '32px' }}>
              {isRing1Aligned ? '✓ Khớp' : `${ring1}°`}
            </span>
          </div>

          {/* Ring 2 Slider */}
          <div style={{
            width: '100%', background: 'rgba(10,8,20,0.85)', padding: '6px 14px', borderRadius: '99px',
            border: `1px solid ${isRing2Aligned ? '#86d8a0' : 'rgba(134,216,160,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem'
          }}>
            <span style={{ color: '#86d8a0' }}>🍃 Hồ Sen (Vòng giữa):</span>
            <input
              type="range" min="0" max="360" value={ring2}
              onChange={e => { setRing2(Number(e.target.value)); pluck(NOTE.E5, 0, 0.04); }}
              style={{ accentColor: '#86d8a0', width: '130px' }}
            />
            <span style={{ color: isRing2Aligned ? '#86d8a0' : '#888', fontSize: '0.72rem', width: '32px' }}>
              {isRing2Aligned ? '✓ Khớp' : `${ring2}°`}
            </span>
          </div>

          {/* Ring 3 Slider */}
          <div style={{
            width: '100%', background: 'rgba(10,8,20,0.85)', padding: '6px 14px', borderRadius: '99px',
            border: `1px solid ${isRing3Aligned ? '#86d8a0' : 'rgba(159,216,236,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem'
          }}>
            <span style={{ color: '#9fd8ec' }}>⛩️ Cổng Đá (Vòng trong):</span>
            <input
              type="range" min="0" max="360" value={ring3}
              onChange={e => { setRing3(Number(e.target.value)); pluck(NOTE.G5, 0, 0.04); }}
              style={{ accentColor: '#9fd8ec', width: '130px' }}
            />
            <span style={{ color: isRing3Aligned ? '#86d8a0' : '#888', fontSize: '0.72rem', width: '32px' }}>
              {isRing3Aligned ? '✓ Khớp' : `${ring3}°`}
            </span>
          </div>
        </div>

        {/* Master Polaroid Photo Display (When Solved) */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              onClick={onSolved}
              style={{
                position: 'absolute', zIndex: 90, background: '#fcfaf7',
                border: '3px solid #e0d5c1', padding: '16px 16px 20px', borderRadius: '18px',
                boxShadow: '0 30px 70px rgba(0,0,0,0.9)', textAlign: 'center', cursor: 'pointer',
                width: 'min(500px, 92vw)', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
            >
              {/* 16:9 Polaroid Photo Container for vietphu.jpg (1280x720) */}
              <div style={{
                width: '100%', aspectRatio: '16 / 9', background: '#1c1527',
                borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #d4c3aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
              }}>
                <img
                  src="/images/memories/vietphu.jpg"
                  alt="Ảnh Hna ở Việt Phủ Thành Chương"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <b style={{ color: '#1f1625', fontSize: '1.1rem', marginTop: '12px', fontFamily: 'Playfair Display, serif' }}>
                Kỷ Niệm Việt Phủ Thành Chương
              </b>
              <p style={{ color: '#555', fontSize: '0.78rem', margin: '4px 0 0', fontStyle: 'italic', lineHeight: 1.45 }}>
                "Chuyến đi dã ngoại 27-28/08/2023 — Bông hoa nở bừng lưu giữ nụ cười Hna."
              </p>
              <span style={{ color: '#b8945f', fontSize: '0.7rem', marginTop: '8px', letterSpacing: '0.12em', fontWeight: 600 }}>
                27 · 28 / 08 / 2023
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

export default LVietPhu;
