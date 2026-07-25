import { motion } from 'framer-motion';
import { ChapterId, CHAPTERS, CHAPTER_ORDER } from '../data/story';
import { sfx } from '../audio/soundEngine';
import { WALL_MARKS, isCipherFound } from '../data/cipher';

interface Props {
  cleared: ChapterId[];
  onClose: () => void;
}

/** Memory shards collected so far — one per chapter cleared. */
const Journal = ({ cleared, onClose }: Props) => {
  const total = CHAPTER_ORDER.length - 1; // epilogue isn't collectible
  const cipher = isCipherFound();

  return (
    <motion.div
      className="overlay-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => { sfx.paper(); onClose(); }}
    >
      <motion.div
        className="journal"
        initial={{ opacity: 0, y: 40, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="journal-head">
          <div>
            <h3>Sổ kỉ niệm</h3>
            <span>{cleared.length} / {total} mảnh</span>
          </div>
          <button className="journal-close" onClick={() => { sfx.paper(); onClose(); }}>✕</button>
        </div>

        <div className="journal-body">
          {cipher && (
            <div className="journal-cipher">
              <div className="cipher-head">
                <span>Bốn vạch trong căn phòng</span>
                <i>trang giấy gập lại</i>
              </div>
              <div className="cipher-grid">
                {WALL_MARKS.map(mark => (
                  <div key={mark.star} className="cipher-entry">
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d={mark.path} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                    <span className="cipher-equals">=</span>
                    <b>{mark.glyph}</b>
                    <em>{mark.name}</em>
                  </div>
                ))}
              </div>
            </div>
          )}

          {CHAPTER_ORDER.slice(0, -1).map((id, i) => {
            const ch = CHAPTERS[id];
            const got = cleared.includes(id);
            return (
              <div key={id} className={`shard ${got ? 'got' : 'locked'}`}>
                <span className="shard-icon">{got ? ch.shard.icon : '·'}</span>
                <div className="shard-text">
                  {got ? (
                    <>
                      <b>{ch.shard.title}</b>
                      <i>{ch.shard.date}</i>
                      <p>{ch.shard.text}</p>
                      {ch.shard.image && (
                        <div className="shard-img-wrap">
                          <img
                            src={ch.shard.image}
                            alt={ch.shard.title}
                            onError={(e) => {
                              (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <b className="shard-hidden">Chương {i + 1} — chưa mở</b>
                      <p className="shard-hidden">Chơi xong chương này thì mảnh kỉ niệm hiện ra.</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {cleared.length === total && (
          <p className="journal-foot">Đủ hết rồi. Món quà đang đợi ở chương cuối 💛</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Journal;
