// ═══════════════════════════════════════════════════════════════
// Giấc Mơ Của Chúng Ta — Procedural Sound Engine
//
// Every note is synthesised at runtime with the Web Audio API, so the
// game ships with music and no audio files. Each chapter gets its own
// chord bed; the leitmotif (LEITMOTIF) recurs from the first room to
// the last letter.
// ═══════════════════════════════════════════════════════════════

const MUTE_KEY = 'dreamgame_muted';

// ── Note table (A minor world) ──────────────────────────────────
export const NOTE: Record<string, number> = {
  A1: 55.0, C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0,
  A2: 110.0, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0,
  A3: 220.0, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
  A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  A5: 880.0, C6: 1046.5, D6: 1174.66, E6: 1318.51,
};

/** The five notes the whole game is built on — used as a puzzle in chapter 0. */
export const LEITMOTIF = ['E5', 'C5', 'D5', 'A4', 'G4'];

// ── Chapter beds ────────────────────────────────────────────────
export type MoodId =
  | 'silence' | 'empty' | 'awakening' | 'campus' | 'museum'
  | 'cinema' | 'distance' | 'reunion' | 'airport' | 'cosmos' | 'chase' | 'letter';

interface Mood {
  chords: string[][];   // progression, one chord per bar
  barSeconds: number;
  cutoff: number;       // lowpass, Hz — dark vs open
  gain: number;
  shimmer?: boolean;    // sprinkle high random notes
  pulse?: boolean;      // soft heartbeat on the downbeat
}

const MOODS: Record<MoodId, Mood> = {
  silence:   { chords: [[]], barSeconds: 8, cutoff: 300, gain: 0 },
  empty:     { chords: [['A2', 'E3'], ['A2', 'F3']], barSeconds: 9, cutoff: 520, gain: 0.055, pulse: true },
  awakening: { chords: [['A2', 'E3', 'A3'], ['F2', 'C3', 'A3'], ['C3', 'G3', 'E4'], ['G2', 'D3', 'B3']], barSeconds: 7, cutoff: 1500, gain: 0.07, shimmer: true },
  campus:    { chords: [['F2', 'C3', 'A3'], ['C3', 'G3', 'E4'], ['D3', 'A3', 'F4'], ['G2', 'D3', 'B3']], barSeconds: 6.5, cutoff: 1700, gain: 0.075, shimmer: true },
  museum:    { chords: [['C3', 'G3', 'E4'], ['A2', 'E3', 'C4'], ['F2', 'C3', 'A3'], ['G2', 'D3', 'B3']], barSeconds: 7.5, cutoff: 1400, gain: 0.07, shimmer: true },
  cinema:    { chords: [['D3', 'A3', 'F4'], ['A2', 'E3', 'C4'], ['E3', 'B3', 'G4'], ['A2', 'E3', 'A3']], barSeconds: 6, cutoff: 1250, gain: 0.07 },
  distance:  { chords: [['E3', 'B3'], ['C3', 'G3'], ['A2', 'E3'], ['F2', 'C3']], barSeconds: 8.5, cutoff: 750, gain: 0.065, pulse: true },
  reunion:   { chords: [['G2', 'D3', 'B3'], ['C3', 'G3', 'E4'], ['D3', 'A3', 'F4'], ['E3', 'B3', 'G4']], barSeconds: 5.5, cutoff: 2200, gain: 0.08, shimmer: true },
  airport:   { chords: [['A2', 'E3', 'B3'], ['F2', 'C3', 'G3'], ['D3', 'A3', 'E4'], ['E3', 'B3', 'D4']], barSeconds: 7, cutoff: 1150, gain: 0.06, pulse: true, shimmer: true },
  cosmos:    { chords: [['C3', 'G3', 'B3'], ['A2', 'E3', 'G3'], ['F2', 'C3', 'E4'], ['G2', 'D3', 'F4']], barSeconds: 9, cutoff: 1900, gain: 0.07, shimmer: true },
  chase:     { chords: [['A2', 'E3', 'A3'], ['F2', 'C3', 'A3'], ['C3', 'G3', 'E4'], ['E3', 'B3', 'G4']], barSeconds: 4.5, cutoff: 2400, gain: 0.085, shimmer: true, pulse: true },
  letter:    { chords: [['F2', 'C3', 'A3'], ['C3', 'G3', 'E4'], ['G2', 'D3', 'B3'], ['A2', 'E3', 'C4']], barSeconds: 8, cutoff: 2600, gain: 0.075, shimmer: true },
};

// ── Engine state ────────────────────────────────────────────────
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let sfxBus: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let bedTimer: number | null = null;
let shimmerTimer: number | null = null;
let currentMood: MoodId = 'silence';
let bar = 0;
let muted = false;
const listeners = new Set<(m: boolean) => void>();

try {
  muted = localStorage.getItem(MUTE_KEY) === '1';
} catch { /* private mode */ }

/** Cheap plate reverb: exponentially decaying noise burst as an impulse response. */
function buildReverb(context: AudioContext): ConvolverNode {
  const seconds = 3.2;
  const len = Math.floor(context.sampleRate * seconds);
  const buf = context.createBuffer(2, len, context.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6) * 0.55;
    }
  }
  const conv = context.createConvolver();
  conv.buffer = buf;
  return conv;
}

/**
 * Must be called from a user gesture (browsers block autoplay).
 * Safe to call repeatedly.
 */
export function initAudio(): boolean {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return true;
  }
  const AudioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext || AudioWindow.webkitAudioContext;
  if (!Ctor) return false;

  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.9;
  master.connect(ctx.destination);

  reverb = buildReverb(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.5;
  reverb.connect(wet);
  wet.connect(master);

  musicBus = ctx.createGain();
  musicBus.gain.value = 1;
  musicBus.connect(master);
  musicBus.connect(reverb);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.9;
  sfxBus.connect(master);
  const sfxWet = ctx.createGain();
  sfxWet.gain.value = 0.35;
  sfxBus.connect(sfxWet);
  sfxWet.connect(reverb);

  return true;
}

export function isAudioReady() { return ctx !== null; }
export function isMuted() { return muted; }

export function setMuted(next: boolean) {
  muted = next;
  try { localStorage.setItem(MUTE_KEY, next ? '1' : '0'); } catch { /* ignore */ }
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(next ? 0 : 0.9, ctx.currentTime, 0.25);
  }
  listeners.forEach(fn => fn(next));
}

export function toggleMuted() { setMuted(!muted); return muted; }

export function onMuteChange(fn: (m: boolean) => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

// ── Voices ──────────────────────────────────────────────────────

/**
 * Soft bell / music-box tone. The workhorse for interaction feedback.
 */
export function tone(
  freq: number,
  {
    dur = 1.2, type = 'sine', gain = 0.14, delay = 0, detune = 0, bus = 'sfx',
  }: { dur?: number; type?: OscillatorType; gain?: number; delay?: number; detune?: number; bus?: 'sfx' | 'music' } = {},
) {
  if (!ctx || !sfxBus || !musicBus) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  if (detune) osc.detune.value = detune;

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(g);
  g.connect(bus === 'music' ? musicBus : sfxBus);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Named-note helper. */
export function note(name: string, opts?: Parameters<typeof tone>[1]) {
  const f = NOTE[name];
  if (f) tone(f, opts);
}

/** Plucked string — two partials, quick decay. */
export function pluck(freq: number, delay = 0, gain = 0.13) {
  tone(freq, { dur: 1.6, type: 'triangle', gain, delay });
  tone(freq * 2, { dur: 0.7, type: 'sine', gain: gain * 0.35, delay });
}

function noiseBurst(dur: number, gain: number, filterFreq: number, delay = 0) {
  if (!ctx || !sfxBus) return;
  const t = ctx.currentTime + delay;
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(filter);
  filter.connect(g);
  g.connect(sfxBus);
  src.start(t);
}

// ── SFX vocabulary ──────────────────────────────────────────────
export const sfx = {
  hover: () => tone(NOTE.E5, { dur: 0.22, gain: 0.035, type: 'sine' }),
  click: () => { tone(NOTE.A4, { dur: 0.5, gain: 0.075 }); tone(NOTE.E5, { dur: 0.35, gain: 0.04 }); },
  pick: () => pluck(NOTE.C5, 0, 0.1),
  place: () => { pluck(NOTE.G4, 0, 0.1); pluck(NOTE.C5, 0.05, 0.07); },

  /** Small step of progress. */
  chime: () => {
    pluck(NOTE.C5, 0, 0.1);
    pluck(NOTE.E5, 0.09, 0.09);
    pluck(NOTE.G5, 0.18, 0.08);
  },

  /** A puzzle stage solved. */
  solved: () => {
    ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => pluck(NOTE[n], i * 0.11, 0.11));
    tone(NOTE.C4, { dur: 3, type: 'sine', gain: 0.06, delay: 0.1 });
  },

  /** A whole chapter cleared — the leitmotif, rising. */
  chapterClear: () => {
    LEITMOTIF.forEach((n, i) => pluck(NOTE[n] * 2, i * 0.16, 0.1));
    tone(NOTE.A2, { dur: 4.5, type: 'sine', gain: 0.07, delay: 0.2 });
    tone(NOTE.E3, { dur: 4.5, type: 'sine', gain: 0.05, delay: 0.3 });
  },

  wrong: () => {
    tone(NOTE.B2 * 1.06, { dur: 0.5, type: 'sawtooth', gain: 0.045 });
    tone(NOTE.A2, { dur: 0.6, type: 'triangle', gain: 0.05, delay: 0.04 });
  },

  unlock: () => {
    noiseBurst(0.18, 0.09, 2400);
    tone(NOTE.G3, { dur: 0.3, type: 'square', gain: 0.035, delay: 0.06 });
    pluck(NOTE.C5, 0.2, 0.11);
    pluck(NOTE.G5, 0.3, 0.09);
  },

  whoosh: () => noiseBurst(1.1, 0.055, 700),
  paper: () => noiseBurst(0.3, 0.05, 4200),
  shutter: () => { noiseBurst(0.07, 0.11, 1600); noiseBurst(0.05, 0.07, 900, 0.09); },

  /** Distance / heartache. */
  heartbeat: () => {
    tone(NOTE.A1, { dur: 0.5, type: 'sine', gain: 0.16 });
    tone(NOTE.A1, { dur: 0.45, type: 'sine', gain: 0.11, delay: 0.32 });
  },

  crack: () => {
    noiseBurst(0.5, 0.12, 1100);
    tone(NOTE.A1 * 1.02, { dur: 1.6, type: 'sawtooth', gain: 0.05 });
  },

  typeTick: () => tone(2100 + Math.random() * 500, { dur: 0.03, gain: 0.012, type: 'square' }),

  /** Plays the game's theme — used by the chapter-0 music box. */
  motif: (speed = 0.34, octave = 2) => {
    LEITMOTIF.forEach((n, i) => pluck(NOTE[n] * octave, i * speed, 0.11));
  },
};

// ── Ambient bed ─────────────────────────────────────────────────
function playChord(names: string[], mood: Mood) {
  if (!ctx || !musicBus || names.length === 0) return;
  const t = ctx.currentTime;
  const dur = mood.barSeconds * 1.35;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = mood.cutoff;
  filter.Q.value = 0.7;

  const bedGain = ctx.createGain();
  bedGain.gain.setValueAtTime(0, t);
  bedGain.gain.linearRampToValueAtTime(mood.gain, t + mood.barSeconds * 0.35);
  bedGain.gain.linearRampToValueAtTime(0.0001, t + dur);

  filter.connect(bedGain);
  bedGain.connect(musicBus);

  names.forEach((n, i) => {
    const f = NOTE[n];
    if (!f) return;
    // two slightly detuned oscillators per note = analogue-ish warmth
    [-4, 5].forEach(cents => {
      const osc = ctx!.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      osc.detune.value = cents;
      osc.connect(filter);
      osc.start(t);
      osc.stop(t + dur + 0.1);
    });
  });

  if (mood.pulse) {
    tone(NOTE.A1, { dur: 0.9, type: 'sine', gain: 0.05, bus: 'music' });
  }
}

function scheduleBed() {
  const mood = MOODS[currentMood];
  if (!mood || mood.gain === 0) return;
  playChord(mood.chords[bar % mood.chords.length], mood);
  bar++;
  bedTimer = window.setTimeout(scheduleBed, mood.barSeconds * 1000);
}

function scheduleShimmer() {
  const mood = MOODS[currentMood];
  if (mood?.shimmer) {
    const pool = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6'];
    const n = pool[Math.floor(Math.random() * pool.length)];
    tone(NOTE[n], { dur: 2.4, type: 'sine', gain: 0.022, bus: 'music' });
  }
  shimmerTimer = window.setTimeout(scheduleShimmer, 2600 + Math.random() * 4200);
}

/** Cross-fade the ambient bed to a chapter mood. */
export function setMood(mood: MoodId) {
  if (!ctx) return;
  if (currentMood === mood && bedTimer !== null) return;
  currentMood = mood;
  bar = 0;
  if (bedTimer !== null) { clearTimeout(bedTimer); bedTimer = null; }
  if (shimmerTimer === null) scheduleShimmer();
  scheduleBed();
}

export function stopAll() {
  if (bedTimer !== null) { clearTimeout(bedTimer); bedTimer = null; }
  if (shimmerTimer !== null) { clearTimeout(shimmerTimer); shimmerTimer = null; }
  currentMood = 'silence';
}
