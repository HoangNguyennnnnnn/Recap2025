import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CHAPTERS, ChapterId } from '../data/story';
import { sfx } from '../audio/soundEngine';

interface Props {
  next: ChapterId;
  onDone: () => void;
}

/** Ink-bleed wipe between chapters, with the next chapter's title card. */
const ChapterTransition = ({ next, onDone }: Props) => {
  const ch = CHAPTERS[next];

  useEffect(() => {
    sfx.whoosh();
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="transition-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* expanding ink */}
      <motion.div
        className="transition-ink"
        style={{ background: `radial-gradient(circle, ${ch.accent}22 0%, #05070f 62%)` }}
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 3, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />

      <motion.div
        className="transition-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.9 }}
      >
        <span className="transition-icon" style={{ color: ch.accent }}>{ch.shard.icon}</span>
        <span className="transition-numeral">{ch.numeral}</span>
        <h2 style={{ color: ch.accent }}>{ch.title}</h2>
        <span className="transition-place">{ch.place}</span>
      </motion.div>
    </motion.div>
  );
};

export default ChapterTransition;
