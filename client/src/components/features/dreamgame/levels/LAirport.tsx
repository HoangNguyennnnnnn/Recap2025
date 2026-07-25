import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

const TARGET_GATE = 4;
const TARGET_MONTH = 9;
const TARGET_YEAR = 2025;

/**
 * Chapter VI — Sân Bay Nội Bài (LAirport).
 * Clean, subtle flight radar code alignment.
 */
const LAirport = ({ onSolved }: Props) => {
  const [gateCode, setGateCode] = useState(1); // 1..10
  const [monthCode, setMonthCode] = useState(5); // 1..12
  const [yearCode, setYearCode] = useState(2023); // 2023..2026
  const [solved, setSolved] = useState(false);

  const timers = useRef<number[]>([]);
  const isAligned = gateCode === TARGET_GATE && monthCode === TARGET_MONTH && yearCode === TARGET_YEAR;

  const queue = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!isAligned || solved) return;
    setSolved(true);
    sfx.solved();
    queue(onSolved, 5200);
  }, [isAligned, onSolved, solved]);

  const cycleGate = () => {
    if (solved) return;
    pluck(NOTE.D4, 0, 0.08);
    setGateCode(g => (g % 10) + 1);
  };

  const cycleMonth = () => {
    if (solved) return;
    pluck(NOTE.F4, 0, 0.08);
    setMonthCode(m => (m % 12) + 1);
  };

  const cycleYear = () => {
    if (solved) return;
    pluck(NOTE.A4, 0, 0.08);
    setYearCode(y => y >= 2026 ? 2023 : y + 1);
  };

  return (
    <SceneShell
      sky={['#0a0f1d', '#141c33', '#1e253b']}
      accent="#d7a38f"
      stars={60}
      motes="dust"
      vignette={0.88}
      className="airport-scene"
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', zIndex: 20, userSelect: 'none'
      }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#e8dcc4' }}>
          <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', fontWeight: 500 }}>
            Sân Bay Nội Bài · Chuyến Bay Khởi Hành
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'rgba(232,220,196,0.6)', letterSpacing: '0.08em' }}>
            Điều chỉnh Cổng, Tháng và Năm cất cánh trên bảng Radar
          </span>
        </div>

        {/* Airport Flight Radar Screen */}
        <div style={{
          position: 'relative', width: 'min(720px, 92vw)', height: 'clamp(260px, 44vh, 340px)',
          borderRadius: '20px', border: '2px solid rgba(215,163,143,0.3)',
          background: 'linear-gradient(180deg, #0d1222 0%, #060812 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'space-between', padding: '20px'
        }}>
          {/* Radar Horizon Arc Visual */}
          <div style={{ position: 'relative', width: '100%', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%' }}>
              <path d="M 50 180 Q 300 20 550 180" fill="none" stroke="rgba(215,163,143,0.25)" strokeWidth="2" strokeDasharray="6,6" />
              {/* Flight icon animated along horizon */}
              <motion.g animate={{ x: isAligned ? 500 : 250, y: isAligned ? 30 : 100 }} transition={{ duration: 3, ease: 'easeOut' }}>
                <text x="0" y="0" fontSize="26" fill="#ffd27a">✈️</text>
              </motion.g>
            </svg>
          </div>

          {/* 3 Parameter Controllers */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Gate Dial */}
            <button
              onClick={cycleGate}
              disabled={solved}
              style={{
                padding: '10px 18px', borderRadius: '12px',
                border: `1.5px solid ${gateCode === TARGET_GATE ? '#86d8a0' : 'rgba(215,163,143,0.4)'}`,
                background: gateCode === TARGET_GATE ? 'rgba(134,216,160,0.15)' : 'rgba(10,12,24,0.8)',
                color: gateCode === TARGET_GATE ? '#86d8a0' : '#ffd27a',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              🚪 Cổng: <b>Gate {String(gateCode).padStart(2, '0')}</b>
            </button>

            {/* Month Dial */}
            <button
              onClick={cycleMonth}
              disabled={solved}
              style={{
                padding: '10px 18px', borderRadius: '12px',
                border: `1.5px solid ${monthCode === TARGET_MONTH ? '#86d8a0' : 'rgba(215,163,143,0.4)'}`,
                background: monthCode === TARGET_MONTH ? 'rgba(134,216,160,0.15)' : 'rgba(10,12,24,0.8)',
                color: monthCode === TARGET_MONTH ? '#86d8a0' : '#ffd27a',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              📅 Tháng: <b>Tháng {String(monthCode).padStart(2, '0')}</b>
            </button>

            {/* Year Dial */}
            <button
              onClick={cycleYear}
              disabled={solved}
              style={{
                padding: '10px 18px', borderRadius: '12px',
                border: `1.5px solid ${yearCode === TARGET_YEAR ? '#86d8a0' : 'rgba(215,163,143,0.4)'}`,
                background: yearCode === TARGET_YEAR ? 'rgba(134,216,160,0.15)' : 'rgba(10,12,24,0.8)',
                color: yearCode === TARGET_YEAR ? '#86d8a0' : '#ffd27a',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              ✈️ Năm: <b>Năm {yearCode}</b>
            </button>
          </div>
        </div>

        {/* Solved Victory Banner */}
        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{
                position: 'absolute', zIndex: 90, background: 'rgba(12,10,24,0.92)',
                border: '1.5px solid #d7a38f', borderRadius: '16px', padding: '16px 28px',
                textAlign: 'center', color: '#ffd27a', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>✈️🌅</span>
              <h4 style={{ margin: '6px 0 2px', fontFamily: 'Playfair Display, serif', fontSize: '1.15rem' }}>
                Gate 04 · Tháng 09 · 2025
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                "Cổng cất cánh đã mở. Tạm biệt để hẹn ngày gặp lại."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
};

export default LAirport;
