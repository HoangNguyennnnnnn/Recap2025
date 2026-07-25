import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

const TARGET: [number, number, number] = [1, 2, 1];
const REEL_NAMES = ['Phông nền', 'Bóng đôi', 'Trăng tròn'];
const ROWS = ['A', 'B', 'C', 'D', 'E']; // 5 Rows total

/**
 * Chapter III — Beta Giải Phóng.
 * Full Theater Seat Map (Rows A..E).
 * Real Couple Seats: Row E (back row), far right (Seats E7 & E8).
 */
const L3Cinema = ({ onSolved }: Props) => {
  const [reels, setReels] = useState<[number, number, number]>([2, 0, 2]);
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const [seats, setSeats] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const timers = useRef<number[]>([]);

  const sceneReady = reels.every((value, index) => value === TARGET[index]);

  const queue = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const cycleReel = (index: 0 | 1 | 2) => {
    if (solved) return;
    pluck(NOTE[index === 0 ? 'D4' : index === 1 ? 'A3' : 'E4'], 0, 0.09);
    setMirrorOpen(false);
    setSeats([]);
    setReels(current => {
      const next = [...current] as [number, number, number];
      next[index] = (next[index] + 1) % 3;
      return next;
    });
  };

  const inspectMirror = () => {
    if (!sceneReady || solved) return;
    sfx.pick();
    setMirrorOpen(true);
  };

  const chooseSeat = (seatId: string) => {
    if (!mirrorOpen || solved || seats.includes(seatId)) return;
    const next = [...seats, seatId];
    setSeats(next);
    sfx.pick();
    if (next.length !== 2) return;

    // Check if E7 and E8 (far right couple seats of Row E) are selected
    const correct = next.includes('E7') && next.includes('E8');
    if (!correct) {
      sfx.wrong();
      queue(() => setSeats([]), 720);
      return;
    }

    setSolved(true);
    sfx.solved();
    queue(onSolved, 1600);
  };

  return (
    <SceneShell
      sky={['#120e22', '#191330', '#0b0817']}
      accent="#a98cd8"
      stars={12}
      motes="dust"
      vignette={0.9}
      className="lvl-cinema"
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', zIndex: 20, userSelect: 'none'
      }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.4rem', color: '#e8dcc4' }}>
          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', fontWeight: 500 }}>
            Buổi Xem Phim · Beta Giải Phóng
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232,220,196,0.6)', letterSpacing: '0.08em' }}>
            {!sceneReady
              ? 'Bước 1: Bấm 3 cuộn phim phía dưới để chỉnh nét màn chiếu 🎞️'
              : !mirrorOpen
              ? 'Bước 2: Bấm vào Chiếc Gương Chiếu bên hông để soi thông điệp 🪞'
              : 'Bước 3: Chọn 2 ghế đôi dãy cuối trong cùng bên phải (Ghế E7 và E8) 🍿'
            }
          </span>
        </div>

        {/* Theater Hall with Full Seat Map */}
        <div style={{
          position: 'relative', width: 'min(760px, 94vw)', height: 'clamp(320px, 52vh, 420px)',
          borderRadius: '20px', border: '2px solid rgba(169,140,216,0.3)',
          background: 'linear-gradient(180deg, #100d1e 0%, #06050a 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-between', padding: '12px'
        }}>
          {/* Projection Screen */}
          <div style={{
            position: 'relative', width: '80%', height: '85px', borderRadius: '8px',
            border: `2px solid ${sceneReady ? '#ffd27a' : 'rgba(169,140,216,0.3)'}`,
            overflow: 'hidden', boxShadow: sceneReady ? '0 0 30px rgba(255,210,122,0.4)' : 'none'
          }}>
            <ProjectionScene reels={reels} mirrored />
            {sceneReady && !mirrorOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(10,8,20,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffd27a', fontSize: '0.82rem', fontWeight: 600
                }}
              >
                👉 Đã nét màn chiếu! Bấm vào Gương bên hông để soi thông điệp
              </motion.div>
            )}
          </div>

          {/* Side Mirror Button */}
          <button
            onClick={inspectMirror}
            disabled={!sceneReady || solved}
            style={{
              margin: '2px 0', padding: '4px 16px', borderRadius: '99px',
              border: `1.5px solid ${sceneReady ? '#ffd27a' : 'rgba(255,255,255,0.2)'}`,
              background: sceneReady ? 'rgba(255,210,122,0.2)' : 'transparent',
              color: sceneReady ? '#ffd27a' : 'rgba(255,255,255,0.4)',
              fontSize: '0.74rem', fontWeight: 600, cursor: sceneReady ? 'pointer' : 'not-allowed'
            }}
          >
            🪞 Gương soi thông điệp ẩn: {mirrorOpen ? '"Cậu ngồi cùng tớ."' : '.ớt gnùc ồi ng ậuC'}
          </button>

          {/* Full Seat Map Rows A..E */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            {ROWS.map((rowName) => (
              <div key={rowName} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: rowName === 'E' && mirrorOpen ? '#ffd27a' : 'rgba(255,255,255,0.4)', width: '48px', textAlign: 'right', fontWeight: 600 }}>
                  {rowName === 'E' ? 'Hàng E (Đôi):' : `Hàng ${rowName}:`}
                </span>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(col => {
                  const seatId = `${rowName}${col}`;
                  const isSelected = seats.includes(seatId);
                  const isTarget = seatId === 'E7' || seatId === 'E8';
                  return (
                    <motion.button
                      key={seatId}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => chooseSeat(seatId)}
                      disabled={!mirrorOpen || solved}
                      style={{
                        width: '28px', height: '24px', borderRadius: '4px 4px 2px 2px',
                        border: `1px solid ${isSelected ? '#86d8a0' : isTarget && mirrorOpen ? '#ffd27a' : 'rgba(255,255,255,0.15)'}`,
                        background: isSelected ? 'rgba(134,216,160,0.4)' : isTarget && mirrorOpen ? 'rgba(255,210,122,0.3)' : mirrorOpen && rowName === 'E' ? 'rgba(169,140,216,0.15)' : 'rgba(0,0,0,0.3)',
                        color: isSelected ? '#86d8a0' : isTarget && mirrorOpen ? '#ffd27a' : 'rgba(255,255,255,0.7)',
                        fontSize: '0.62rem', fontWeight: 600,
                        cursor: mirrorOpen && !solved ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {col}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Reel Controls Bar */}
        <div style={{ marginTop: '0.6rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[0, 1, 2].map((idx) => {
            const isCorrect = reels[idx] === TARGET[idx];
            return (
              <button
                key={idx}
                onClick={() => cycleReel(idx as 0 | 1 | 2)}
                disabled={solved}
                style={{
                  padding: '6px 14px', borderRadius: '8px',
                  border: `1.5px solid ${isCorrect ? '#86d8a0' : '#a98cd8'}`,
                  background: isCorrect ? 'rgba(134,216,160,0.2)' : 'rgba(10,8,20,0.85)',
                  color: isCorrect ? '#86d8a0' : '#ffd27a', fontSize: '0.75rem',
                  fontWeight: 600, cursor: 'pointer'
                }}
              >
                🎞️ {REEL_NAMES[idx]} ({isCorrect ? '✓ Khớp' : `Mẫu ${reels[idx]}`})
              </button>
            );
          })}
        </div>

        {/* Solved Victory Banner */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                position: 'absolute', zIndex: 90, background: 'rgba(12,10,24,0.92)',
                border: '1.5px solid #a98cd8', borderRadius: '16px', padding: '16px 28px',
                textAlign: 'center', color: '#ffd27a', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>🍿✨</span>
              <h4 style={{ margin: '6px 0 2px', fontFamily: 'Playfair Display, serif', fontSize: '1.15rem' }}>
                Cậu ngồi cùng tớ!
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                Beta Giải Phóng — Ghế E7 & E8 dãy cuối trong cùng bên phải đọng lại trọn vẹn kỷ niệm.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

const ProjectionScene = ({ reels, mirrored = false }: { reels: [number, number, number]; mirrored?: boolean }) => (
  <svg viewBox="0 0 320 200" style={{ width: '100%', height: '100%', display: 'block' }}>
    <g transform={mirrored ? 'translate(320 0) scale(-1 1)' : undefined}>
      <rect width="320" height="200" fill="#151329" />

      {reels[0] === 1 ? <>
        <rect width="320" height="126" fill="url(#cinema-sunset)" />
        <rect y="126" width="320" height="74" fill="#344d69" />
        <ellipse cx="74" cy="146" rx="55" ry="5" fill="#ffc27b" opacity=".32" />
        <circle cx="254" cy="58" r="13" fill="#ffe0a4" />
      </> : reels[0] === 0 ? <>
        <rect width="320" height="126" fill="#6b8dad" />
        <rect y="126" width="320" height="74" fill="#74826e" />
      </> : <>
        <rect width="320" height="126" fill="#17234b" />
        <rect y="126" width="320" height="74" fill="#202943" />
      </>}

      {reels[1] === 2 ? <>
        <circle cx="152" cy="117" r="10" fill="#292438" /><path d="M152 128 v25" stroke="#292438" strokeWidth="8" />
        <circle cx="180" cy="119" r="10" fill="#5a374d" /><path d="M180 130 v23" stroke="#5a374d" strokeWidth="8" />
      </> : reels[1] === 0 ? <>
        <circle cx="90" cy="120" r="10" fill="#292438" /><path d="M90 130 v25" stroke="#292438" strokeWidth="8" />
      </> : <>
        <circle cx="248" cy="119" r="10" fill="#5a374d" /><path d="M248 129 v26" stroke="#5a374d" strokeWidth="8" />
      </>}

      {reels[2] === 1 ? <>
        <circle cx="74" cy="68" r="23" fill="#ffd49a" opacity=".92" />
      </> : reels[2] === 0 ? <>
        <circle cx="146" cy="35" r="19" fill="#fff0b3" opacity=".82" />
      </> : <>
        <path d="M238 30 a19 19 0 1 0 0 38 a15 15 0 1 1 0 -38z" fill="#f5e5ba" />
      </>}
    </g>
    <defs>
      <linearGradient id="cinema-sunset" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5e407b" />
        <stop offset="100%" stopColor="#ee9562" />
      </linearGradient>
    </defs>
  </svg>
);

export default L3Cinema;
