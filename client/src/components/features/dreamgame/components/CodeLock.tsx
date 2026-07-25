import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { sfx, NOTE, pluck } from '../audio/soundEngine';

interface Props {
  /** The correct code. Compared case-insensitively. */
  answer: string;
  /** Character pool for the keypad. Digits by default. */
  keys?: string[];
  label?: string;
  /** Slot separators, e.g. [2, 4] puts a dot after slot 2 and 4 → DD·MM·YYYY */
  groups?: number[];
  onSolved: () => void;
  /** Hint shown under the slots. */
  caption?: string;
}

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

/**
 * Reusable combination lock. Wrong codes shake and clear, so she can
 * keep trying without penalty.
 */
const CodeLock = ({
  answer, keys = DIGITS, label = 'Ổ khoá', groups = [], onSolved, caption,
}: Props) => {
  const [input, setInput] = useState('');
  const [state, setState] = useState<'idle' | 'wrong' | 'right'>('idle');
  const timers = useRef<number[]>([]);

  const queue = useCallback((fn: () => void, delay: number) => {
    timers.current.push(window.setTimeout(fn, delay));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const push = useCallback((ch: string) => {
    if (state === 'right') return;
    setInput(prev => {
      if (prev.length >= answer.length) return prev;
      pluck(NOTE.A4 * (1 + (keys.indexOf(ch) % 5) * 0.09), 0, 0.07);
      return prev + ch;
    });
  }, [answer.length, keys, state]);

  const back = useCallback(() => {
    if (state === 'right') return;
    sfx.click();
    setInput(prev => prev.slice(0, -1));
  }, [state]);

  // Check on full
  useEffect(() => {
    if (input.length !== answer.length || state === 'right') return;
    const t = setTimeout(() => {
      if (input.toUpperCase() === answer.toUpperCase()) {
        setState('right');
        sfx.unlock();
        queue(onSolved, 1100);
      } else {
        setState('wrong');
        sfx.wrong();
        queue(() => { setState('idle'); setInput(''); }, 620);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [input, answer, state, onSolved, queue]);

  // Physical keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') { back(); return; }
      const ch = e.key.toUpperCase();
      if (keys.includes(ch)) push(ch);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [push, back, keys]);

  return (
    <div className="lock">
      <div className="lock-label">{label}</div>

      <motion.div
        className={`lock-slots ${state}`}
        animate={state === 'wrong' ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
      >
        {Array.from({ length: answer.length }).map((_, i) => (
          <span key={i} className="lock-slot-wrap">
            <span className={`lock-slot ${input[i] ? 'filled' : ''}`}>
              {input[i] ?? ''}
            </span>
            {groups.includes(i + 1) && i + 1 < answer.length && <i className="lock-sep">·</i>}
          </span>
        ))}
      </motion.div>

      {caption && <p className="lock-caption">{caption}</p>}

      <div className={`lock-keys ${keys.length > 10 ? 'wide' : ''}`}>
        {keys.map(k => (
          <button key={k} className="lock-key" onClick={() => push(k)}>{k}</button>
        ))}
        <button className="lock-key lock-back" onClick={back}>⌫</button>
      </div>
    </div>
  );
};

export default CodeLock;
