import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LETTER, LETTER_TITLE, LETTER_SIGNOFF, VIDEO_CAPTION } from '../data/story';
import { VIDEO_SRC, VIDEO_POSTER } from '../data/gift';
import { sfx } from '../audio/soundEngine';

interface Props { onReplay: () => void; }

/**
 * Epilogue — Dual-column side-by-side layout:
 * Left side: Romantic Letter to Hna
 * Right side: Video Recap
 */
const Epilogue = ({ onReplay }: Props) => {
  const [phase, setPhase] = useState(0); // 0 curtain, 1 revealed
  const [videoFailed, setVideoFailed] = useState(false);
  const [localVideo, setLocalVideo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase(1); sfx.chapterClear(); }, 2200);
    return () => clearTimeout(t1);
  }, []);

  const confetti = useMemo(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      glyph: ['✦', '✧', '❤', '·', '✦'][i % 5],
      delay: Math.random() * 5,
      dur: 9 + Math.random() * 9,
      size: 8 + Math.random() * 12,
    })), []);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setLocalVideo(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(f);
      });
      setVideoFailed(false);
    }
  };

  useEffect(() => () => { if (localVideo) URL.revokeObjectURL(localVideo); }, [localVideo]);

  return (
    <div className="epilogue">
      {/* Drifting sparkle glyphs */}
      <div className="epi-motes">
        {confetti.map(c => (
          <motion.span
            key={c.id}
            style={{ left: `${c.x}%`, fontSize: c.size }}
            initial={{ y: '105vh', opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 0.6, 0.6, 0] }}
            transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
          >{c.glyph}</motion.span>
        ))}
      </div>

      {/* Opening Curtain */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div className="epi-curtain" exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6 }}
              className="epi-curtain-inner"
            >
              <span className="epi-numeral">Kết</span>
              <h1>Giấc mơ dừng ở đây</h1>
              <p>vì chỗ tiếp theo, mình đang sống thật</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Container with Side-by-Side Dual Column Layout */}
      <div className="epi-scroll">
        <motion.div
          className="epi-dual-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 30 }}
          transition={{ duration: 1.2 }}
        >
          {/* ── LEFT COLUMN: Romantic Letter ── */}
          <div className="epi-col-left">
            <section className="epi-section" style={{ margin: 0 }}>
              <div className="letter">
                <div className="letter-stamp">
                  <span>26</span><i>07</i><span>26</span>
                </div>

                <h3 className="letter-title">{LETTER_TITLE}</h3>

                {LETTER.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    {para}
                  </motion.p>
                ))}

                <p className="letter-signoff">{LETTER_SIGNOFF.line}</p>
                <p className="letter-name">{LETTER_SIGNOFF.name}</p>
                <p className="letter-date">{LETTER_SIGNOFF.date}</p>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN: Video Recap ── */}
          <div className="epi-col-right">
            <section className="epi-section" style={{ margin: 0, width: '100%' }}>
              <h2 className="epi-h2">Một năm của mình</h2>
              <p className="epi-cap">{VIDEO_CAPTION}</p>

              <div className="reel-portrait">
                {!videoFailed || localVideo ? (
                  <video
                    key={localVideo ?? VIDEO_SRC}
                    controls
                    playsInline
                    preload="metadata"
                    poster={VIDEO_POSTER || undefined}
                    onError={() => { if (!localVideo) setVideoFailed(true); }}
                    style={{ width: '100%', borderRadius: '12px' }}
                  >
                    <source src={localVideo ?? VIDEO_SRC} type="video/mp4" />
                  </video>
                ) : (
                  <div className="reel-empty">
                    <span className="reel-empty-icon">🎞️</span>
                    <b>Video sắp về</b>
                    <span className="reel-empty-note">
                      Chưa tìm thấy <code>/videos/recap2026.mp4</code>
                    </span>
                    <button className="ghost-btn" onClick={() => fileRef.current?.click()}>
                      chọn video từ máy
                    </button>
                    <input
                      ref={fileRef} type="file" accept="video/*" hidden onChange={pickFile}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </motion.div>

        {/* ── THE END FOOTER ── */}
        <motion.section
          className="epi-section epi-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 1.4, delay: 0.6 }}
        >
          <svg width="80" height="14" viewBox="0 0 80 14">
            <line x1="0" y1="7" x2="30" y2="7" stroke="currentColor" strokeWidth="0.7" />
            <path d="M40 3 c 2 -2.6 6 -1.2 6 1.8 0 2.8 -4 4.8 -6 6.4 -2 -1.6 -6 -3.6 -6 -6.4 0 -3 4 -4.4 6 -1.8z" fill="currentColor" />
            <line x1="50" y1="7" x2="80" y2="7" stroke="currentColor" strokeWidth="0.7" />
          </svg>
          <p className="epi-end-text">nthz &nbsp;·&nbsp; hna &nbsp;·&nbsp; 26.07.2026</p>
          <div className="epi-end-actions">
            <button className="ghost-btn" onClick={() => { sfx.whoosh(); onReplay(); }}>
              chơi lại từ đầu
            </button>
            <a className="ghost-btn" href="/">vào trang của mình</a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Epilogue;
