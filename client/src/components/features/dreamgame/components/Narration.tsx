import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, SPEAKER_NAME } from '../data/story';
import { sfx } from '../audio/soundEngine';

interface Props {
  lines: Line[];
  onDone: () => void;
  /** Chapter accent colour. */
  accent: string;
}

const CHAR_MS = 26;

/**
 * Bottom dialogue box with typewriter reveal. Click / space / enter
 * finishes the current line, then advances. Everything is skippable —
 * nobody should be trapped in someone else's feelings.
 */
const Narration = ({ lines, onDone, accent }: Props) => {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState('');
  const [complete, setComplete] = useState(false);
  const timer = useRef<number | null>(null);

  const line = lines[idx];

  // Type the current line out
  useEffect(() => {
    if (!line) return;
    setShown('');
    setComplete(false);
    let i = 0;
    const tick = () => {
      i++;
      setShown(line.text.slice(0, i));
      if (i % 3 === 0) sfx.typeTick();
      if (i >= line.text.length) {
        setComplete(true);
        timer.current = null;
        return;
      }
      timer.current = window.setTimeout(tick, CHAR_MS);
    };
    timer.current = window.setTimeout(tick, 260);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [line]);

  const advance = useCallback(() => {
    if (!complete) {
      // reveal the rest instantly
      if (timer.current) { clearTimeout(timer.current); timer.current = null; }
      setShown(line?.text ?? '');
      setComplete(true);
      return;
    }
    sfx.click();
    if (idx + 1 >= lines.length) onDone();
    else setIdx(idx + 1);
  }, [complete, idx, line, lines.length, onDone]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        advance();
      } else if (e.key === 'Escape') {
        onDone();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, onDone]);

  if (!line) return null;

  const who = SPEAKER_NAME[line.who];

  return (
    <div className="narration-layer" onClick={advance}>
      <div className="narration-scrim" />

      <motion.div
        className="narration-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ '--accent': accent } as React.CSSProperties}
      >
        <AnimatePresence mode="wait">
          {who && (
            <motion.div
              key={line.who}
              className={`narration-who who-${line.who}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              {who}
            </motion.div>
          )}
        </AnimatePresence>

        <p className={`narration-text speaker-${line.who}`}>
          {shown}
          {!complete && <span className="narration-caret" />}
        </p>

        <div className="narration-foot">
          <span className="narration-progress">
            {lines.map((_, i) => (
              <i key={i} className={i <= idx ? 'on' : ''} />
            ))}
          </span>
          <button
            className="narration-skip"
            onClick={(e) => { e.stopPropagation(); sfx.click(); onDone(); }}
          >
            bỏ qua ›
          </button>
        </div>

        {complete && (
          <motion.span
            className="narration-next"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            ▾
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};

export default Narration;
