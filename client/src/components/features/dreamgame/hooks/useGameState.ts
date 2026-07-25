import { useState, useCallback, useEffect, useRef } from 'react';
import { ChapterId, CHAPTER_ORDER, CHAPTERS } from '../data/story';
import { clearCipherFound } from '../data/cipher';

export type Phase =
  | 'title'        // start screen
  | 'intro'        // chapter narration before the puzzle
  | 'playing'      // puzzle
  | 'outro'        // chapter narration after the puzzle
  | 'transition';  // wipe to next chapter

const STORAGE_KEY = 'dreamgame_save_v2';

interface Save {
  chapter: ChapterId;
  cleared: ChapterId[];
  seenIntro: ChapterId[];
}

function load(): Save {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const cleared: ChapterId[] = Array.isArray(p.cleared)
        ? p.cleared.filter((c: ChapterId) => CHAPTER_ORDER.includes(c))
        : [];
      let chapter: ChapterId = CHAPTER_ORDER.includes(p.chapter) ? p.chapter : 'room';

      // Saves made before the airport chapter existed would otherwise resume
      // after it and silently skip 04/09/2025.
      if (!cleared.includes('airport') && ['cosmos', 'chase', 'epilogue'].includes(chapter)) {
        chapter = 'airport';
      }

      return {
        chapter,
        cleared,
        seenIntro: Array.isArray(p.seenIntro)
          ? p.seenIntro.filter((c: ChapterId) => CHAPTER_ORDER.includes(c))
          : [],
      };
    }
  } catch { /* ignore */ }
  return { chapter: 'room', cleared: [], seenIntro: [] };
}

function persist(s: Save) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function useGameState() {
  const [save, setSave] = useState<Save>(load);
  // Fresh saves open on the title screen; returning players resume mid-story.
  const [phase, setPhase] = useState<Phase>('title');
  const initial = useRef(save);

  useEffect(() => { persist(save); }, [save]);

  const hasProgress = initial.current.cleared.length > 0;

  /** Leave the title screen and enter a chapter. */
  const start = useCallback((chapter?: ChapterId) => {
    const target = chapter ?? save.chapter;
    setSave(s => ({ ...s, chapter: target }));
    setPhase(initial.current.seenIntro.includes(target) && chapter === undefined ? 'playing' : 'intro');
  }, [save.chapter]);

  const introDone = useCallback(() => {
    setSave(s => s.seenIntro.includes(s.chapter) ? s : { ...s, seenIntro: [...s.seenIntro, s.chapter] });
    setPhase('playing');
  }, []);

  /** Puzzle solved → play outro narration, or transition directly if no outro lines. */
  const solve = useCallback(() => {
    setSave(s => {
      const nextSave = s.cleared.includes(s.chapter) ? s : { ...s, cleared: [...s.cleared, s.chapter] };
      const ch = CHAPTERS[s.chapter];
      if (!ch?.outro || ch.outro.length === 0) {
        setPhase('transition');
      } else {
        setPhase('outro');
      }
      return nextSave;
    });
  }, []);

  const outroDone = useCallback(() => setPhase('transition'), []);

  const advance = useCallback(() => {
    const next = CHAPTER_ORDER[CHAPTER_ORDER.indexOf(save.chapter) + 1];
    if (!next) return;
    setSave(s => ({ ...s, chapter: next }));
    // The epilogue has no narration of its own — it *is* the payoff.
    setPhase(next === 'epilogue' ? 'playing' : 'intro');
  }, [save.chapter]);

  const jumpTo = useCallback((chapter: ChapterId) => {
    setSave(s => ({ ...s, chapter }));
    setPhase(chapter === 'epilogue' ? 'playing' : 'intro');
  }, []);

  const reset = useCallback(() => {
    const fresh: Save = { chapter: 'room', cleared: [], seenIntro: [] };
    clearCipherFound();
    setSave(fresh);
    initial.current = fresh;
    persist(fresh);
    setPhase('title');
  }, []);

  const nextChapter = CHAPTER_ORDER[CHAPTER_ORDER.indexOf(save.chapter) + 1] ?? 'epilogue';

  return {
    chapter: save.chapter,
    cleared: save.cleared,
    phase,
    nextChapter,
    hasProgress,
    start, introDone, solve, outroDone, advance, jumpTo, reset,
  };
}
