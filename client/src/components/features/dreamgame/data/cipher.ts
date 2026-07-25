// ═══════════════════════════════════════════════════════════════
// The scratches on the wall.
//
// Found in chapter 0 (moonlight has to fall on them), recorded in the
// journal, and needed in chapter VI — where the clues name the stars by
// mark instead of by name. Cross-chapter information, so the journal is
// something you actually use.
// ═══════════════════════════════════════════════════════════════

export interface Mark {
  /** The scratch, drawn as an SVG path in a 24×24 box. */
  path: string;
  star: string;      // star id in L6
  name: string;      // Vietnamese name
  glyph: string;     // the star's own glyph
}

export const WALL_MARKS: Mark[] = [
  { path: 'M6 4 L6 20 M12 4 L12 20 M18 4 L18 20', star: 'duong', name: 'Thái Dương', glyph: '☀' },
  { path: 'M5 8 Q12 22 19 8', star: 'am', name: 'Thái Âm', glyph: '☾' },
  { path: 'M5 5 L19 19 M19 5 L5 19', star: 'tuvi', name: 'Tử Vi', glyph: '✦' },
  { path: 'M12 4 L12 9 M7 15 L7 20 M17 15 L17 20', star: 'hongloan', name: 'Hồng Loan', glyph: '❤' },
];

/** Storage key — the journal shows the cipher only once it has been found. */
export const CIPHER_FOUND_KEY = 'dreamgame_cipher_found';

export function markCipherFound() {
  try { localStorage.setItem(CIPHER_FOUND_KEY, '1'); } catch { /* ignore */ }
}

export function isCipherFound(): boolean {
  try { return localStorage.getItem(CIPHER_FOUND_KEY) === '1'; } catch { return false; }
}

export function clearCipherFound() {
  try { localStorage.removeItem(CIPHER_FOUND_KEY); } catch { /* ignore */ }
}
