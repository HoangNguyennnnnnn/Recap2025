import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterId, CHAPTERS, CHAPTER_ORDER, ChapterDef } from '../data/story';
import { toggleMuted, isMuted, onMuteChange, sfx } from '../audio/soundEngine';

interface Props {
  chapter: ChapterDef;
  cleared: ChapterId[];
  onOpenJournal: () => void;
  onOpenMenu: () => void;
}

/**
 * Top bar: chapter title, objective, progress beads, and the
 * mute / journal / menu controls. Also owns the progressive hint
 * panel — the puzzles are hard on purpose, so the way out is always
 * one tap away.
 */
const HUD = ({ chapter, cleared, onOpenJournal, onOpenMenu }: Props) => {
  const [muted, setMutedState] = useState(isMuted());
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [nudge, setNudge] = useState(false);

  useEffect(() => onMuteChange(setMutedState), []);

  // Reset hints when the chapter changes; nudge toward the hint button
  // if she has been stuck on this screen for a while.
  useEffect(() => {
    setRevealed(0);
    setHintsOpen(false);
    setNudge(false);
    const t = setTimeout(() => setNudge(true), 75_000);
    return () => clearTimeout(t);
  }, [chapter.id]);

  const playableIdx = CHAPTER_ORDER.indexOf(chapter.id);

  return (
    <>
      <div className="hud">
        <div className="hud-left">
          <span className="hud-numeral">{chapter.numeral}</span>
          <h2 className="hud-title">{chapter.title}</h2>
          <span className="hud-place">{chapter.place}</span>
        </div>

        <div className="hud-right">
          {chapter.hints.length > 0 && (
            <button
              className={`hud-btn ${nudge && revealed === 0 ? 'nudge' : ''}`}
              title="Gợi ý"
              onClick={() => { sfx.click(); setHintsOpen(o => !o); setNudge(false); }}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" />
              </svg>
            </button>
          )}

          <button
            className="hud-btn"
            title="Sổ kỉ niệm"
            onClick={() => { sfx.paper(); onOpenJournal(); }}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 5a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5zM8 3v18" />
            </svg>
            {cleared.length > 0 && <i className="hud-badge">{cleared.length}</i>}
          </button>

          <button
            className="hud-btn"
            title={muted ? 'Bật nhạc' : 'Tắt nhạc'}
            onClick={() => { setMutedState(toggleMuted()); }}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M11 5 6 9H3v6h3l5 4V5zM17 9l4 6M21 9l-4 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M11 5 6 9H3v6h3l5 4V5zM16 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12" />
              </svg>
            )}
          </button>

          <button className="hud-btn" title="Menu" onClick={() => { sfx.click(); onOpenMenu(); }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Objective ribbon */}
      {chapter.objective && (
        <motion.div
          className="hud-objective"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          key={chapter.id}
        >
          <span className="hud-objective-dot" />
          {chapter.objective}
        </motion.div>
      )}

      {/* Progress beads */}
      <div className="hud-beads">
        {CHAPTER_ORDER.slice(0, -1).map((id, i) => (
          <span
            key={id}
            className={`bead ${cleared.includes(id) ? 'done' : ''} ${i === playableIdx ? 'now' : ''}`}
            title={CHAPTERS[id].title}
          />
        ))}
      </div>

      {/* Hint panel */}
      <AnimatePresence>
        {hintsOpen && (
          <motion.div
            className="hint-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            <div className="hint-head">
              <span>Gợi ý</span>
              <button onClick={() => { sfx.click(); setHintsOpen(false); }}>✕</button>
            </div>

            {chapter.hints.slice(0, revealed).map((h, i) => (
              <motion.p
                key={i}
                className="hint-line"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <b>{i + 1}.</b> {h}
              </motion.p>
            ))}

            {revealed === 0 && (
              <p className="hint-empty">Thử thêm một chút nữa đi… nhưng nếu bí thật thì bấm bên dưới.</p>
            )}

            {revealed < chapter.hints.length ? (
              <button
                className="hint-more"
                onClick={() => { sfx.chime(); setRevealed(r => r + 1); }}
              >
                {revealed === 0 ? 'Cho tớ một gợi ý' : 'Gợi ý rõ hơn nữa'}
                <em> ({chapter.hints.length - revealed} còn lại)</em>
              </button>
            ) : (
              <p className="hint-empty">Hết gợi ý rồi. Cậu làm được mà.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HUD;
