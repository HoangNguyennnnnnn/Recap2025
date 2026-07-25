import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../audio/soundEngine';

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}

/** Close-up panel used whenever the player inspects something. */
const ClueModal = ({ title, children, onClose, wide = false }: Props) => (
  <motion.div
    className="overlay-scrim"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className={`clue-modal ${wide ? 'wide' : ''}`}
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 210, damping: 24 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="clue-head">
        <h4>{title}</h4>
        <button onClick={() => { sfx.click(); onClose(); }}>✕</button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

export default ClueModal;
