import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChapterId, CHAPTERS, CHAPTER_ORDER } from '../data/story';
import { sfx } from '../audio/soundEngine';

interface Props {
  current: ChapterId;
  cleared: ChapterId[];
  onJump: (c: ChapterId) => void;
  onClose: () => void;
  onReset: () => void;
}

/**
 * Pause menu with chapter select. Cleared chapters are replayable, and
 * the next one is always reachable — nobody gets walled off from the letter.
 */
const ChapterMenu = ({ current, cleared, onJump, onClose, onReset }: Props) => {
  const [askReset, setAskReset] = useState(false);
  return (
    <motion.div
      className="overlay-scrim"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="menu-card"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="journal-head">
          <div><h3>Các chương</h3><span>bấm để đi tới</span></div>
          <button className="journal-close" onClick={() => { sfx.click(); onClose(); }}>✕</button>
        </div>

        <div className="menu-list">
          {CHAPTER_ORDER.map((id) => {
            const ch = CHAPTERS[id];
            const done = cleared.includes(id);
            const open = true; // Allow free chapter selection
            return (
              <button
                key={id}
                disabled={!open}
                className={`menu-row ${id === current ? 'current' : ''} ${done ? 'done' : ''}`}
                onClick={() => { sfx.whoosh(); onJump(id); onClose(); }}
              >
                <span className="menu-icon" style={{ color: ch.accent }}>
                  {open ? ch.shard.icon : '🔒'}
                </span>
                <span className="menu-meta">
                  <b>{ch.title}</b>
                  <i>{open ? ch.place : 'chưa mở'}</i>
                </span>
                {done && <span className="menu-check">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="menu-foot">
          <button className="title-btn small" onClick={() => { sfx.click(); setAskReset(true); }}>
            Chơi lại từ đầu
          </button>
        </div>

        {askReset && (
          <div className="confirm-scrim inner" onClick={() => setAskReset(false)}>
            <div className="confirm-box" onClick={e => e.stopPropagation()}>
              <p>Xoá hết tiến trình?</p>
              <div className="confirm-row">
                <button className="title-btn" onClick={() => setAskReset(false)}>Thôi</button>
                <button className="title-btn primary" onClick={() => { sfx.whoosh(); onReset(); }}>Xoá</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChapterMenu;
