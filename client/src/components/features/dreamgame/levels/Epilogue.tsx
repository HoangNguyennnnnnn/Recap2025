import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LETTER, LETTER_TITLE, LETTER_SIGNOFF, VIDEO_CAPTION } from '../data/story';
import { NETFLIX_GIFT, GIFT_READY, VIDEO_SRC, VIDEO_POSTER } from '../data/gift';
import { sfx } from '../audio/soundEngine';

interface Props { onReplay: () => void; }

/**
 * Epilogue — Dual-column side-by-side layout:
 * Left side: Romantic Letter to Hna
 * Right side: Video Recap & Netflix Gift Box
 */
const Epilogue = ({ onReplay }: Props) => {
  const [phase, setPhase] = useState(0); // 0 curtain, 1 revealed
  const [videoFailed, setVideoFailed] = useState(false);
  const [localVideo, setLocalVideo] = useState<string | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
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

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      sfx.chime();
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied('fail');
      setTimeout(() => setCopied(null), 1800);
    }
  };

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

          {/* ── RIGHT COLUMN: Video & Gift Box ── */}
          <div className="epi-col-right">
            {/* Video Section */}
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

            {/* Gift Box Section */}
            <section className="epi-section" style={{ margin: 0, width: '100%' }}>
              <h2 className="epi-h2">À, còn cái này nữa</h2>

              {!giftOpen ? (
                <motion.button
                  className="gift-box"
                  onClick={() => { sfx.unlock(); setGiftOpen(true); }}
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ y: [0, -7, 0] }}
                  transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
                >
                  <svg viewBox="0 0 160 150" width="160" height="150">
                    <rect x="20" y="56" width="120" height="82" rx="6" fill="#2a2038" stroke="#d8b06a" strokeWidth="2" />
                    <rect x="20" y="42" width="120" height="22" rx="5" fill="#372a48" stroke="#d8b06a" strokeWidth="2" />
                    <rect x="70" y="42" width="20" height="96" fill="#d8b06a" opacity="0.75" />
                    <path d="M80 42 C 62 42 50 28 58 18 C 66 8 78 24 80 42 C 82 24 94 8 102 18 C 110 28 98 42 80 42z"
                      fill="#d8b06a" opacity="0.9" />
                  </svg>
                  <span>mở ra</span>
                </motion.button>
              ) : (
                <motion.div
                  className="gift-card"
                  initial={{ opacity: 0, scale: 0.94, rotateX: -8 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 18 }}
                >
                  <span className="gift-brand">{NETFLIX_GIFT.brand}</span>
                  <h3>{NETFLIX_GIFT.title}</h3>
                  <p className="gift-sub">{NETFLIX_GIFT.subtitle}</p>

                  {GIFT_READY ? (
                    <div className="gift-fields">
                      {NETFLIX_GIFT.fields.map(f => {
                        const hidden = f.secret && !revealed[f.label];
                        return (
                          <div key={f.label} className="gift-row">
                            <span className="gift-label">{f.label}</span>
                            <span
                              className={`gift-value ${f.copyable ? 'mono' : ''} ${hidden ? 'hidden' : ''}`}
                              onClick={() => {
                                if (hidden) { sfx.click(); setRevealed(r => ({ ...r, [f.label]: true })); }
                              }}
                            >
                              {hidden ? '••••••••••' : f.value}
                            </span>
                            {f.copyable && !hidden && (
                              <button className="gift-copy" onClick={() => copy(f.label, f.value)}>
                                {copied === f.label ? '✓' : 'copy'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="gift-pending">
                      <span>🎟️</span>
                      <b>Quà đang được niêm phong</b>
                      <p>Tớ sẽ mở đúng lúc để tài khoản không bị lộ trước ngày của mình.</p>
                    </div>
                  )}

                  <p className="gift-note">{NETFLIX_GIFT.note}</p>

                  {NETFLIX_GIFT.link && (
                    <a className="gift-link" href={NETFLIX_GIFT.link} target="_blank" rel="noreferrer">
                      {NETFLIX_GIFT.linkLabel}
                    </a>
                  )}
                </motion.div>
              )}
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
