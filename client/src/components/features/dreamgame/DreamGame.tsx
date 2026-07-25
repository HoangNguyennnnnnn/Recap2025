import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import { CHAPTERS, ChapterId } from './data/story';
import { initAudio, setMood, stopAll, sfx } from './audio/soundEngine';

import TitleScreen from './components/TitleScreen';
import Narration from './components/Narration';
import HUD from './components/HUD';
import Journal from './components/Journal';
import ChapterMenu from './components/ChapterMenu';
import ChapterTransition from './components/ChapterTransition';

import L0Room from './levels/L0Room';
import LVietPhu from './levels/LVietPhu';
import L1Campus from './levels/L1Campus';
import L2Museum from './levels/L2Museum';
import L3Cinema from './levels/L3Cinema';
import L4Distance from './levels/L4Distance';
import L5Reunion from './levels/L5Reunion';
import LAirport from './levels/LAirport';
import L6Cosmos from './levels/L6Cosmos';
import LScreenCall from './levels/LScreenCall';
import L7Light from './levels/L7Light';
import Epilogue from './levels/Epilogue';

import './styles/dreamgame.css';

const LEVELS: Record<ChapterId, ((p: { onSolved: () => void }) => JSX.Element) | null> = {
  room: L0Room,
  vietphu: LVietPhu,
  museum: L2Museum,
  campus: L1Campus,
  cinema: L3Cinema,
  distance: L4Distance,
  reunion: L5Reunion,
  airport: LAirport,
  cosmos: L6Cosmos,
  screencall: LScreenCall,
  chase: L7Light,
  epilogue: null,
};

const DreamGame = () => {
  const {
    chapter, cleared, phase, nextChapter, hasProgress,
    start, introDone, solve, outroDone, advance, jumpTo, reset,
  } = useGameState();

  const [audioOn, setAudioOn] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shardToast, setShardToast] = useState<ChapterId | null>(null);

  const def = CHAPTERS[chapter];

  /** First gesture wakes the audio context up. */
  const wakeAudio = useCallback(() => {
    if (audioOn) return;
    if (initAudio()) setAudioOn(true);
  }, [audioOn]);

  // ambient bed follows the chapter
  useEffect(() => {
    if (!audioOn) return;
    setMood(phase === 'title' ? 'awakening' : def.mood);
  }, [audioOn, def.mood, phase]);

  useEffect(() => stopAll, []);

  const handleSolve = useCallback(() => {
    sfx.chapterClear();
    setShardToast(chapter);
    setTimeout(() => setShardToast(null), 4200);
    solve();
  }, [chapter, solve]);

  const Level = LEVELS[chapter];
  const showHUD = phase === 'playing' && chapter !== 'epilogue';

  return (
    <div className="dream-game" onPointerDown={wakeAudio}>
      <AnimatePresence mode="wait">
        {/* ── title ── */}
        {phase === 'title' && (
          <TitleScreen
            key="title"
            hasProgress={hasProgress}
            onStart={() => { wakeAudio(); start('room'); }}
            onContinue={() => { wakeAudio(); start(); }}
            onReset={() => { reset(); }}
          />
        )}

        {/* ── the level ── */}
        {(phase === 'playing' || phase === 'intro' || phase === 'outro') && (
          <motion.div
            key={`lvl-${chapter}`}
            className={`level-holder ${phase === 'outro' ? 'settling' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {chapter === 'epilogue'
              ? <Epilogue onReplay={reset} />
              : Level && <Level onSolved={handleSolve} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── chapter narration ── */}
      <AnimatePresence>
        {phase === 'intro' && def.intro.length > 0 && (
          <Narration key={`in-${chapter}`} lines={def.intro} accent={def.accent} onDone={introDone} />
        )}
        {phase === 'outro' && def.outro.length > 0 && (
          <Narration key={`out-${chapter}`} lines={def.outro} accent={def.accent} onDone={outroDone} />
        )}
      </AnimatePresence>

      {/* ── HUD ── */}
      {showHUD && (
        <HUD
          chapter={def}
          cleared={cleared}
          onOpenJournal={() => setJournalOpen(true)}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {/* ── shard earned & Next Chapter Button ── */}
      <AnimatePresence>
        {(shardToast || cleared.includes(chapter)) && chapter !== 'epilogue' && (
          <motion.div
            className="shard-toast"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ cursor: 'pointer', zIndex: 999, background: 'linear-gradient(135deg, rgba(35, 25, 45, 0.95), rgba(65, 45, 80, 0.95))', border: '1.5px solid #ffd27a' }}
            onClick={() => {
              sfx.whoosh();
              setShardToast(null);
              advance();
            }}
          >
            <span className="shard-toast-icon">{CHAPTERS[chapter].shard.icon}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <b style={{ color: '#ffd27a', fontSize: '0.95rem' }}>✨ Đã giải xong · Mở mảnh kỉ niệm</b>
              <i style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>Bấm vào đây để Sang Chương Tiếp Theo ▶</i>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── overlays ── */}
      <AnimatePresence>
        {journalOpen && <Journal cleared={cleared} onClose={() => setJournalOpen(false)} />}
        {menuOpen && (
          <ChapterMenu
            current={chapter}
            cleared={cleared}
            onJump={jumpTo}
            onClose={() => setMenuOpen(false)}
            onReset={() => { setMenuOpen(false); reset(); }}
          />
        )}
      </AnimatePresence>

      {/* ── chapter wipe ── */}
      <AnimatePresence>
        {phase === 'transition' && (
          <ChapterTransition next={nextChapter} onDone={advance} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DreamGame;
