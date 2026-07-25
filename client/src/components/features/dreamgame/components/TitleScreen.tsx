import { useState } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../audio/soundEngine';

interface Props {
  hasProgress: boolean;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
}

/**
 * Opening screen. Also the audio unlock gesture — browsers won't let us
 * make a sound until she taps something, so the first tap starts the music.
 */
const TitleScreen = ({ hasProgress, onStart, onContinue, onReset }: Props) => {
  const [askReset, setAskReset] = useState(false);

  return (
    <motion.div
      className="title-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.1 }}
    >
      {/* soft moon */}
      <motion.div
        className="title-moon"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4, delay: 0.3 }}
      />

      <motion.div
        className="title-inner"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.6 }}
      >
        <span className="title-kicker">nthz &nbsp;·&nbsp; hna</span>

        <h1 className="title-main">
          Giấc Mơ<br />Của Chúng Ta
        </h1>

        <svg className="title-rule" viewBox="0 0 220 12" width="220" height="12">
          <line x1="0" y1="6" x2="92" y2="6" stroke="currentColor" strokeWidth="0.8" />
          <path d="M110 2.4 c 2.4 -3 7 -1.4 7 2 0 3.2 -4.6 5.4 -7 7.2 -2.4 -1.8 -7 -4 -7 -7.2 0 -3.4 4.6 -5 7 -2z" fill="currentColor" />
          <line x1="128" y1="6" x2="220" y2="6" stroke="currentColor" strokeWidth="0.8" />
        </svg>

        <p className="title-sub">
          Chín chương, chín câu đố, một lá thư.<br />
          <em>Kỉ niệm 26 · 07</em>
        </p>

        <div className="title-actions">
          {hasProgress ? (
            <>
              <button
                className="title-btn primary"
                onClick={() => { sfx.chapterClear(); onContinue(); }}
              >
                Tiếp tục giấc mơ
              </button>
              <button
                className="title-btn"
                onClick={() => { sfx.click(); setAskReset(true); }}
              >
                Chơi lại từ đầu
              </button>
            </>
          ) : (
            <button
              className="title-btn primary"
              onClick={() => { sfx.chapterClear(); onStart(); }}
            >
              Bắt đầu
            </button>
          )}
        </div>

        <p className="title-note">
          Có nhạc — nghe bằng tai nghe thì hay hơn 🎧
        </p>
      </motion.div>

      {askReset && (
        <motion.div
          className="confirm-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setAskReset(false)}
        >
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <p>Xoá hết tiến trình và chơi lại từ chương đầu?</p>
            <div className="confirm-row">
              <button className="title-btn" onClick={() => setAskReset(false)}>Thôi</button>
              <button
                className="title-btn primary"
                onClick={() => { sfx.whoosh(); onReset(); setAskReset(false); }}
              >
                Chơi lại
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TitleScreen;
