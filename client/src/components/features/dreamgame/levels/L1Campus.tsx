import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneShell from '../components/SceneShell';
import CodeLock from '../components/CodeLock';
import ClueModal from '../components/ClueModal';
import { sfx } from '../audio/soundEngine';

interface Props { onSolved: () => void; }

const ANSWER = '30082023';

/**
 * Chapter I — Bách Khoa.
 *
 * The gate wants eight digits and says nothing about the format.
 *
 * The banner across the building has its back to the courtyard: you can see
 * there is writing on it, bleeding faintly through the cloth, but not what it
 * says. The puddle is the way in — it reflects the front. That's the whole
 * idea of the chapter: the reflection shows what the direct view can't.
 *
 * The bench is carved with the same date in a different order, on purpose.
 */
const L1Campus = ({ onSolved }: Props) => {
  const [open, setOpen] = useState<'board' | 'puddle' | 'bench' | 'banner' | 'lock' | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [found, setFound] = useState<string[]>([]);

  const add = (piece: string) => {
    setFound(f => (f.includes(piece) ? f : (sfx.chime(), [...f, piece])));
  };

  const pieces = found.filter(f => f !== 'bench');

  return (
    <SceneShell
      sky={['#33345e', '#7b6076', '#d19a6e']}
      accent="#e0a85a"
      stars={18}
      motes="petal"
      vignette={0.52}
      className="lvl-campus"
    >
      <svg viewBox="0 0 1000 620" className="scene-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="cp-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#544c68" />
            <stop offset="100%" stopColor="#39344b" />
          </linearGradient>
          <linearGradient id="cp-roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b25b40" />
            <stop offset="100%" stopColor="#7d3d2d" />
          </linearGradient>
          <linearGradient id="cp-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4c60" />
            <stop offset="100%" stopColor="#2f2839" />
          </linearGradient>
          <radialGradient id="cp-sun">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cp-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3a8cc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4f5678" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cp-cloth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9553f" />
            <stop offset="100%" stopColor="#9e3d2c" />
          </linearGradient>
        </defs>

        <circle cx="838" cy="318" r="168" fill="url(#cp-sun)" opacity="0.5" />
        <circle cx="838" cy="318" r="32" fill="#ffe2b4" opacity="0.85" />

        <rect x="0" y="248" width="150" height="212" fill="#3f3950" opacity="0.72" />
        <rect x="906" y="272" width="94" height="188" fill="#3f3950" opacity="0.6" />

        {/* teaching block */}
        <g>
          <path d="M176 214 L534 214 L534 460 L176 460 Z" fill="url(#cp-face)" />
          <path d="M162 214 L548 214 L512 176 L198 176 Z" fill="url(#cp-roof)" />
          <path d="M162 214 L548 214 L548 222 L162 222 Z" fill="#5f2b20" />
          {[0, 1, 2, 3].map(row => (
            <g key={row}>
              {[0, 1, 2, 3, 4, 5, 6].map(col => {
                const on = (row * 7 + col) % 5 === 1;
                return (
                  <rect key={col} x={196 + col * 47} y={240 + row * 50} width="31" height="32" rx="2"
                    fill={on ? '#ffdca2' : '#282239'} opacity="0.92"
                    stroke="#241f36" strokeWidth="1" />
                );
              })}
            </g>
          ))}
          {[0, 1, 2, 3, 4].map(i => (
            <path key={i} d={`M${204 + i * 67} 460 L${204 + i * 67} 418 q 19 -21 38 0 L${242 + i * 67} 460 Z`}
              fill="#221d33" opacity="0.9" />
          ))}
        </g>

        {/* ── the banner, seen from behind ── */}
        <g className="clue-hot" onClick={() => { sfx.click(); setOpen('banner'); }}>
          <path d="M186 186 L524 178 L524 214 L186 222 Z" fill="url(#cp-cloth)" />
          <path d="M186 186 L524 178" stroke="#7d2f22" strokeWidth="3" />
          {/* writing bleeding through the cloth — marks, not words */}
          <g opacity="0.16" transform="translate(355 202) scale(-1 1) translate(-355 -202)">
            <text x="355" y="209" textAnchor="middle" fontFamily="Playfair Display, serif"
              fontSize="26" fill="#2b1410" letterSpacing="3">THÁNG 8 · 2023</text>
          </g>
          <circle cx="186" cy="188" r="4" fill="#4a2018" />
          <circle cx="524" cy="180" r="4" fill="#4a2018" />
        </g>

        <rect x="0" y="460" width="1000" height="160" fill="url(#cp-ground)" />
        <line x1="0" y1="460" x2="1000" y2="460" stroke="#6b5c73" strokeWidth="1.5" opacity="0.55" />

        {/* flame tree — scenery */}
        <g opacity="0.95">
          <path d="M706 460 C 706 408 692 374 684 344" stroke="#4a3a34" strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d="M688 388 C 656 374 638 348 630 324 M692 370 C 722 358 744 338 754 314"
            stroke="#4a3a34" strokeWidth="8" fill="none" strokeLinecap="round" />
          {[[684, 308, 80, 46], [628, 330, 55, 31], [746, 324, 59, 33], [684, 270, 61, 35]].map(([cx, cy, rx, ry], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#41573f" opacity="0.88" />
          ))}
          {[[640, 314], [676, 296], [716, 308], [746, 326], [660, 338], [704, 338], [684, 266], [728, 282]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="7" fill="#e0563f" />
          ))}
          <ellipse cx="706" cy="464" rx="48" ry="8" fill="#241f33" opacity="0.55" />
        </g>

        {/* ── noticeboard ── */}
        <g className={`clue-hot ${found.includes('30') ? 'solved' : ''}`}
          onClick={() => { sfx.click(); setOpen('board'); }}>
          <rect x="570" y="368" width="8" height="98" fill="#3f3750" />
          <rect x="644" y="368" width="8" height="98" fill="#3f3750" />
          <rect x="552" y="304" width="118" height="74" rx="4" fill="#2d3c36" stroke="#8f7f55" strokeWidth="3" />
          <rect x="562" y="313" width="98" height="56" rx="2" fill="#e8e0cc" opacity="0.82" />
          {[0, 1, 2, 3, 4].map(r => (
            <line key={r} x1="568" y1={322 + r * 10} x2="654" y2={322 + r * 10}
              stroke="#8f8570" strokeWidth="0.9" opacity="0.6" />
          ))}
        </g>

        {/* ── bench (the red herring) ── */}
        <g className={`clue-hot ${found.includes('bench') ? 'solved' : ''}`}
          onClick={() => { sfx.click(); setOpen('bench'); }}>
          <rect x="356" y="498" width="128" height="12" rx="4" fill="#6b5c48" />
          <rect x="356" y="478" width="128" height="10" rx="4" fill="#5f5240" />
          <rect x="366" y="510" width="10" height="30" fill="#463c2f" />
          <rect x="464" y="510" width="10" height="30" fill="#463c2f" />
        </g>

        {/* ── the puddle ── */}
        <g className={`clue-hot ${found.includes('2023') ? 'solved' : ''}`}
          onClick={() => { sfx.click(); setOpen('puddle'); }}>
          <ellipse cx="180" cy="548" rx="112" ry="32" fill="url(#cp-water)" />
          <ellipse cx="180" cy="548" rx="112" ry="32" fill="none" stroke="#b4b9d8" strokeWidth="1.3" opacity="0.5" />
          <g opacity="0.4" transform="translate(180 548) scale(0.4 -0.3) translate(-355 -300)">
            <rect x="176" y="214" width="358" height="246" fill="#d8cee6" />
            <path d="M162 214 L548 214 L512 176 L198 176 Z" fill="#e8ab90" />
            <path d="M186 186 L524 178 L524 214 L186 222 Z" fill="#e07a62" />
          </g>
          <ellipse cx="146" cy="538" rx="28" ry="6" fill="#ffffff" opacity="0.2" />
          <ellipse cx="214" cy="556" rx="18" ry="4" fill="#ffffff" opacity="0.12" />
        </g>

        {/* ── gate padlock ── */}
        <g className={`clue-hot lock-hot ${pieces.length >= 3 ? 'ready' : ''}`}
          onClick={() => { sfx.click(); setOpen('lock'); }}>
          <rect x="846" y="412" width="14" height="140" fill="#413a56" />
          <rect x="918" y="412" width="14" height="140" fill="#413a56" />
          <rect x="860" y="448" width="58" height="10" rx="4" fill="#4f4768" />
          <path d="M876 460 q 0 -22 13 -22 q 13 0 13 22" fill="none"
            stroke={pieces.length >= 3 ? '#ffd27a' : '#6f6690'} strokeWidth="6" />
          <rect x="866" y="460" width="46" height="38" rx="6"
            fill={pieces.length >= 3 ? '#c9a15a' : '#4f4768'}
            stroke={pieces.length >= 3 ? '#ffe6b0' : '#6f6690'} strokeWidth="2" />
          <circle cx="889" cy="478" r="4.5" fill="#2b2438" />
        </g>
      </svg>

      {/* what we have — no labels, no order given */}
      <div className="chip-tray">
        {pieces.length === 0
          ? <span className="chip empty">?</span>
          : pieces.map(f => (
            <motion.span key={f} className="chip"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{f}</motion.span>
          ))}
      </div>

      <AnimatePresence>
        {open === 'banner' && (
          <ClueModal title="Băng-rôn" onClose={() => setOpen(null)}>
            <p className="clue-note">Nó treo úp mặt vào trong trường. Chữ hằn qua vải, mà đọc không nổi.</p>
            <svg viewBox="0 0 360 120" className="clue-svg">
              <rect x="0" y="0" width="360" height="120" fill="#1a1524" />
              <path d="M14 30 L346 22 L346 92 L14 100 Z" fill="#a8412f" />
              <g opacity="0.19" transform="translate(180 62) scale(-1 1) translate(-180 -62)">
                <text x="180" y="72" textAnchor="middle" fontFamily="Playfair Display, serif"
                  fontSize="30" fill="#2b1410" letterSpacing="4">THÁNG 8 · 2023</text>
              </g>
            </svg>
            <p className="clue-sub center">Muốn đọc thì phải thấy mặt trước. Đứng dưới sân thì không thấy.</p>
          </ClueModal>
        )}

        {open === 'puddle' && (
          <ClueModal title="Vũng nước sau mưa" onClose={() => setOpen(null)}>
            <p className="clue-note">Nước soi cả mặt trước tấm băng-rôn.</p>
            <svg viewBox="0 0 360 200" className="clue-svg">
              <rect x="0" y="0" width="360" height="200" fill="#141020" />
              <ellipse cx="180" cy="104" rx="164" ry="88" fill="#454b70" />
              <ellipse cx="180" cy="104" rx="164" ry="88" fill="none" stroke="#9aa2c8" strokeWidth="1.4" opacity="0.5" />
              <g transform={
                flipped
                  ? 'translate(180 104) scale(1 1) translate(-180 -104)'
                  : 'translate(180 104) scale(-1 -1) translate(-180 -104)'
              }>
                <path d="M40 82 L320 76 L320 128 L40 134 Z" fill="#a8412f" opacity="0.9" />
                <text x="180" y="116" textAnchor="middle" fontFamily="Playfair Display, serif"
                  fontSize="27" fill="#ffeccf" letterSpacing="3">THÁNG 8 · 2023</text>
              </g>
              {[0, 1, 2].map(i => (
                <ellipse key={i} cx={90 + i * 76} cy={54 + i * 12} rx={20 - i * 4} ry="4"
                  fill="#ffffff" opacity="0.14" />
              ))}
            </svg>
            <div className="clue-actions">
              <button className="ghost-btn" onClick={() => { sfx.click(); setFlipped(f => !f); }}>
                {flipped ? 'úp lại xuống nước' : 'lật cho xuôi'}
              </button>
              <button className="ghost-btn primary" disabled={!flipped}
                onClick={() => { add('8'); add('2023'); }}>
                đọc được rồi
              </button>
            </div>
          </ClueModal>
        )}

        {open === 'board' && (
          <ClueModal title="Bảng thông báo" onClose={() => setOpen(null)}>
            <p className="clue-note">Tờ lịch bị bóc mất phần đầu. Có ai khoanh một ngày.</p>
            <svg viewBox="0 0 360 210" className="clue-svg">
              <rect x="0" y="0" width="360" height="210" fill="#2d3c36" />
              <rect x="26" y="16" width="308" height="178" rx="3" fill="#ece4d0" />
              <path d="M26 16 L334 16 L334 42 Q300 33 268 43 Q236 53 204 41 Q172 31 140 43 Q108 53 76 41 Q50 33 26 41 Z"
                fill="#2d3c36" />
              {['H', 'B', 'T', 'N', 'S', 'B', 'C'].map((d, i) => (
                <text key={i} x={48 + i * 44} y={64} textAnchor="middle" fontSize="12"
                  fontFamily="Inter, sans-serif" fill="#8a7f68">{d}</text>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const col = (day + 1) % 7;
                const row = Math.floor((day + 1) / 7);
                const x = 48 + col * 44, y = 90 + row * 24;
                const target = day === 30;
                return (
                  <g key={day} className={target ? 'clue-tap' : ''}
                    onClick={() => target && add('30')}>
                    {target && (
                      <ellipse cx={x} cy={y - 4} rx="13" ry="11" fill="none"
                        stroke="#c05046" strokeWidth="2" transform={`rotate(-8 ${x} ${y - 4})`} />
                    )}
                    <text x={x} y={y} textAnchor="middle" fontSize="13"
                      fontFamily="Lora, serif" fill="#4a4234">{day}</text>
                  </g>
                );
              })}
            </svg>
            {found.includes('30') && <p className="clue-result"><b>30</b></p>}
          </ClueModal>
        )}

        {open === 'bench' && (
          <ClueModal title="Ghế đá" onClose={() => setOpen(null)}>
            <p className="clue-note">Có ai lấy đá vạch lên mặt ghế. Vạch cũ rồi.</p>
            <svg viewBox="0 0 360 130" className="clue-svg">
              <rect x="0" y="0" width="360" height="130" fill="#4e4436" />
              <rect x="10" y="18" width="340" height="94" rx="6" fill="#6b5c48" />
              {Array.from({ length: 26 }).map((_, i) => (
                <line key={i} x1={14 + i * 13} y1="20" x2={20 + i * 13} y2="110"
                  stroke="#5d503e" strokeWidth="1" opacity="0.55" />
              ))}
              <text x="180" y="76" textAnchor="middle" fontFamily="Lora, serif" fontSize="34"
                fill="#3f3527" opacity="0.72" letterSpacing="4">23·08·30</text>
            </svg>
            <button className="ghost-btn" style={{ margin: '0.9rem auto 0', display: 'block' }}
              onClick={() => add('bench')}>ghi lại</button>
            {found.includes('bench') && (
              <p className="clue-sub center">Cùng một ngày mà xếp khác. Chỉ một trong hai chỗ nói đúng.</p>
            )}
          </ClueModal>
        )}

        {open === 'lock' && (
          <ClueModal title="Ổ khoá ở cổng" onClose={() => setOpen(null)}>
            <CodeLock answer={ANSWER} label="Tám chữ số" onSolved={onSolved} />
          </ClueModal>
        )}
      </AnimatePresence>
    </SceneShell>
  );
};

export default L1Campus;
