import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import { sfx, NOTE, pluck } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

/**
 * Chapter — Screen Call (Yêu xa hiện tại).
 * Two devices: Laptop (nthz) and Phone (Hna) looking at each other across distance.
 * Player aligns frequency, camera focus, and audio wave to connect the call.
 */
const LScreenCall = ({ onSolved }: Props) => {
  const [freq, setFreq] = useState(1);
  const [focus, setFocus] = useState(1);
  const [wave, setWave] = useState(1);
  const [connected, setConnected] = useState(false);

  const solvedRef = useRef(false);

  // Target values to sync call: freq: 3, focus: 2, wave: 3
  const isTargetSynced = freq === 3 && focus === 2 && wave === 3;

  useEffect(() => {
    if (!isTargetSynced || solvedRef.current) return;
    solvedRef.current = true;
    setConnected(true);
    sfx.solved();
    const timer = setTimeout(() => {
      onSolved();
    }, 4500);
    return () => clearTimeout(timer);
  }, [isTargetSynced, onSolved]);

  const cycleFreq = () => {
    if (connected) return;
    pluck(NOTE.G4, 0, 0.08);
    setFreq(f => (f % 4) + 1);
  };

  const cycleFocus = () => {
    if (connected) return;
    pluck(NOTE.C5, 0, 0.08);
    setFocus(f => (f % 3) + 1);
  };

  const cycleWave = () => {
    if (connected) return;
    pluck(NOTE.E5, 0, 0.08);
    setWave(w => (w % 4) + 1);
  };

  return (
    <SceneShell
      sky={['#08091a', '#101432', '#1b1d42']}
      accent="#7ad5ff"
      stars={90}
      motes="dust"
      vignette={0.85}
      className="screencall-scene"
    >
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '1rem',
        zIndex: 20
      }}>
        {/* Two Devices Container */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(1rem, 5vw, 4rem)', flexWrap: 'wrap'
        }}>
          {/* Laptop Screen (nthz) */}
          <motion.div
            animate={{ scale: connected ? 1.05 : 1 }}
            style={{
              width: 'min(300px, 42vw)', height: '190px', borderRadius: '12px',
              border: `2px solid ${connected ? '#7ad5ff' : 'rgba(255,255,255,0.2)'}`,
              background: 'linear-gradient(135deg, #13172e, #090c1a)',
              boxShadow: connected ? '0 0 30px rgba(122,213,255,0.5)' : '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', position: 'relative'
            }}
          >
            <div style={{ fontSize: '0.7rem', color: '#7ad5ff', letterSpacing: '0.15em', fontWeight: 600 }}>
              LAPTOP · HÀ NỘI (nthz)
            </div>

            <div style={{
              flex: 1, width: '100%', borderRadius: '8px', margin: '8px 0',
              background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '6px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '2.4rem' }}>💻</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                {connected ? '🟢 Đã kết nối FaceTime' : 'Đang tìm tín hiệu từ Ba Lan...'}
              </span>
            </div>

            <div style={{ width: '120px', height: '4px', background: '#3a4468', borderRadius: '2px' }} />
          </motion.div>

          {/* Connection Signal Line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ fontSize: '1.4rem' }}
            >
              {connected ? '💖' : '📡'}
            </motion.div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              {connected ? '9.000 KM KẾT NỐI' : 'SÁU GIỜ LỆCH'}
            </span>
          </div>

          {/* Smartphone Screen (Hna) */}
          <motion.div
            animate={{ scale: connected ? 1.05 : 1 }}
            style={{
              width: 'min(160px, 32vw)', height: '260px', borderRadius: '20px',
              border: `2px solid ${connected ? '#f2a8bd' : 'rgba(255,255,255,0.2)'}`,
              background: 'linear-gradient(135deg, #241628, #100814)',
              boxShadow: connected ? '0 0 30px rgba(242,168,189,0.5)' : '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px', position: 'relative'
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#4a324e', borderRadius: '2px' }} />

            <div style={{
              flex: 1, width: '100%', borderRadius: '12px', margin: '10px 0',
              background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '6px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '2.4rem' }}>📱</span>
              <span style={{ fontSize: '0.75rem', color: '#f2a8bd', textAnchor: 'middle', textAlign: 'center' }}>
                {connected ? 'Hna đang cười 😊' : 'PHONE · BA LAN'}
              </span>
            </div>

            <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)' }} />
          </motion.div>
        </div>

        {/* Controls to sync call */}
        {!connected ? (
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="ghost-btn" onClick={cycleFreq}>
              Tần số: <b>{freq} / 3</b>
            </button>
            <button className="ghost-btn" onClick={cycleFocus}>
              Ống kính: <b>{focus} / 2</b>
            </button>
            <button className="ghost-btn" onClick={cycleWave}>
              Âm thanh: <b>{wave} / 3</b>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', color: '#ffe4ab', fontSize: '0.95rem' }}
          >
            <p style={{ margin: 0, fontWeight: 500 }}>Hai màn hình đã nhìn thấy nhau ❤️</p>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
              "Dù cách nhau 6 múi giờ, chỉ cần bật máy lên là thấy cậu."
            </span>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
};

export default LScreenCall;
