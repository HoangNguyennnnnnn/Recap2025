import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FortuneResult, FortunePalace } from '../../../services/fortune';

const BRANCH_COORDINATES: Record<string, { r: number; c: number }> = {
  'Tỵ': { r: 1, c: 1 }, 'Ngọ': { r: 1, c: 2 }, 'Mùi': { r: 1, c: 3 }, 'Thân': { r: 1, c: 4 },
  'Dậu': { r: 2, c: 4 }, 'Tuất': { r: 3, c: 4 }, 'Hợi': { r: 4, c: 4 },
  'Tý': { r: 4, c: 3 }, 'Sửu': { r: 4, c: 2 }, 'Dần': { r: 4, c: 1 },
  'Mão': { r: 3, c: 1 }, 'Thìn': { r: 2, c: 1 },
};

const DEFAULT_BRANCH_ORDER = ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'];

const SCORE_KEYWORDS: Record<string, string> = {
  'Mệnh': 'Mệnh', 'Quan Lộc': 'Quan Lộc', 'Tài Bạch': 'Tài Bạch',
  'Phu Thê': 'Phu Thê', 'Phụ Mẫu': 'Phụ Mẫu', 'Huynh Đệ': 'Huynh Đệ',
  'Tử Tức': 'Tử Tức', 'Tật Ách': 'Tật Ách', 'Điền Trạch': 'Điền Trạch',
  'Nô Bộc': 'Nô Bộc', 'Phúc Đức': 'Phúc Đức', 'Thiên Di': 'Thiên Di',
};

const clampScore = (value?: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
};

const scoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-300';
  return 'text-red-400';
};

const scoreBarColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-red-400';
};

interface PalaceGridProps {
  result: FortuneResult | null;
  displayName?: string;
  birthDate: string;
  birthTime: string;
  gender: string;
}

const PalaceGrid = ({ result, displayName, birthDate, birthTime, gender }: PalaceGridProps) => {
  const [selectedPalace, setSelectedPalace] = useState<FortunePalace | null>(null);
  const n = (str?: string) => (str || '').normalize('NFC');

  const gridPalaces = useMemo(() => {
    if (!result?.palaces) return [];
    const positioned = new Array(12).fill(null);
    const palacesCopy = [...result.palaces];

    palacesCopy.forEach((palace, idx) => {
      let branchName = palace.location;
      if (!branchName || !DEFAULT_BRANCH_ORDER.includes(branchName)) {
        branchName = DEFAULT_BRANCH_ORDER[idx % 12];
      }
      const orderIdx = DEFAULT_BRANCH_ORDER.indexOf(branchName);
      positioned[orderIdx] = { ...palace, location: branchName };
    });

    DEFAULT_BRANCH_ORDER.forEach((branch, idx) => {
      if (!positioned[idx]) {
        positioned[idx] = {
          name: branch === 'Dần' ? 'Mệnh' : `Cung ${branch}`,
          location: branch,
          stars: ['Cát Tinh', 'Thiên Đức'],
          interpretation: 'Cung này chưa được phân tích sâu.',
        };
      }
    });

    return positioned;
  }, [result]);

  const palaceScores = useMemo(() => {
    const map = new Map<string, number>();
    if (!result?.sections) return map;

    for (const [palaceName, keyword] of Object.entries(SCORE_KEYWORDS)) {
      const match = result.sections.find(s => s.title.includes(keyword));
      if (match?.score != null) map.set(palaceName, clampScore(match.score));
    }

    return map;
  }, [result]);

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2 font-playfair drop-shadow-[0_0_20px_rgba(251,191,36,0.1)]">
        <span>✦</span> {n('Bản Đồ Số Mệnh 12 Cung')}
      </h2>

      <div className="grid grid-cols-4 grid-rows-4 gap-2.5 bg-[#0F1525]/80 border border-amber-500/10 p-3.5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-x-auto min-w-[700px] lg:min-w-0 backdrop-blur-md">
        {gridPalaces.map((palace, index) => {
          const coords = BRANCH_COORDINATES[palace.location || 'Dần'] || { r: 1, c: 1 };
          const isSelected = selectedPalace?.name === palace.name;
          const score = palaceScores.get(palace.name.replace('Cung ', ''));

          return (
            <motion.div
              key={`${palace.name}-${index}`}
              onClick={() => setSelectedPalace(palace)}
              style={{ gridRow: coords.r, gridColumn: coords.c }}
              className={`relative flex flex-col border rounded-xl p-2.5 cursor-pointer select-none transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/15 to-yellow-500/10 border-amber-400/60 shadow-[0_0_30px_rgba(217,119,6,0.35),0_0_60px_rgba(217,119,6,0.15)] scale-[1.03] z-20'
                  : 'bg-[#0A0F1E]/60 hover:bg-amber-500/5 border-slate-700/60 hover:border-amber-500/20 shadow-sm'
              }`}
              whileHover={{ scale: isSelected ? 1.03 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow ring on selected */}
              {isSelected && (
                <motion.div className="absolute -inset-[2px] rounded-[13px] border border-amber-400/30 pointer-events-none"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              {/* Header: name + location + score */}
              <div className="flex items-center justify-between gap-1 border-b border-amber-500/10 pb-1">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-500/5 text-amber-400/70'
                }`}>
                  {n(palace.name)}
                </span>
                <span className="text-[10px] font-bold uppercase text-amber-400/50">
                  {n(palace.location)}
                </span>
              </div>

              {/* Stars */}
              <div className="my-1.5 space-y-0.5 overflow-y-auto max-h-[60px] no-scrollbar">
                {(palace.stars || []).slice(0, 3).map((star, starIdx) => (
                  <span key={`${star}-${starIdx}`} className={`block text-[10px] rounded px-1 py-0.5 truncate leading-tight ${
                    starIdx === 0
                      ? 'bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20'
                      : 'text-amber-400/50'
                  }`}>
                    ★ {n(star)}
                  </span>
                ))}
              </div>

              {/* Score bar */}
              {score != null && score > 0 && (
                <div className="mt-auto pt-1">
                  <div className="h-1 rounded-full bg-slate-700/50 overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBarColor(score)}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Center info panel */}
        <div
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
          className="bg-gradient-to-br from-[#0F1525] via-[#1A1040] to-[#131B2F] rounded-3xl p-4 md:p-5 shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-amber-500/20 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none text-9xl text-amber-400">✦</div>
          {/* Center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/8 rounded-full blur-[60px] pointer-events-none" />

          <div className="text-center relative z-10">
            <p className="text-[9px] uppercase tracking-[0.25em] text-amber-400/60 font-bold">{n('BẢN MỆNH TRUNG ƯƠNG')}</p>
            <h3 className="font-bold text-xl md:text-2xl text-amber-300 mt-0.5 leading-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              {n(result?.profile.displayName || displayName || 'Chưa rõ')}
            </h3>
          </div>

          <div className="text-center relative z-10 my-1">
            <span className="text-xs px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300/90 font-serif leading-relaxed block">
              {n(result?.headline || 'Đại Vận Đang Phân Tích')}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 py-1.5 border-t border-amber-500/10 text-xs relative z-10 font-serif">
            <div className="text-center">
              <span className="text-amber-400/60 block text-[10px]">{n('Ngày sinh')}</span>
              <span className="font-semibold text-slate-300 block text-xs">
                {n(result?.profile.birthDate || birthDate || 'Chưa rõ')}
              </span>
            </div>
            <div className="text-center">
              <span className="text-amber-400/60 block text-[10px]">{n('Giờ sinh')}</span>
              <span className="font-semibold text-slate-300 block text-xs">
                {n(result?.profile.birthTime || birthTime || 'Chưa rõ')}
              </span>
            </div>
            <div className="text-center">
              <span className="text-amber-400/60 block text-[10px]">{n('Giới tính')}</span>
              <span className="font-semibold text-slate-300 block text-xs">
                {result?.profile.gender === 'male' || gender === 'male' ? n('Nam') : n('Nữ')}
              </span>
            </div>
            {result?.score != null && (
            <div className="text-center">
              <span className="text-amber-400/60 block text-[10px]">{n('Điểm')}</span>
              <span className="font-bold text-amber-400 block text-sm">
                {`${clampScore(result.score)}%`}
              </span>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected palace detail */}
      <AnimatePresence mode="wait">
        {selectedPalace && (
          <motion.div
            key={selectedPalace.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-5 bg-[#0F1525]/80 border border-amber-500/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/50 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl text-amber-400/60">✦</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-serif">
                    {n('Cung ')}{n(selectedPalace.name)}{n(' (')}{n(selectedPalace.location)}{')'}
                  </h3>
                  {(() => {
                    const s = palaceScores.get(selectedPalace.name.replace('Cung ', ''));
                    return s != null ? (
                      <span className={`text-sm font-bold ${scoreColor(s)}`}>
                        {n('Điểm:')} {s}%
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
              {selectedPalace.stars && selectedPalace.stars.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedPalace.stars.map((star, idx) => (
                    <span key={`${star}-${idx}`} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ★ {n(star)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed font-serif text-base whitespace-pre-line">
              {n(selectedPalace.interpretation)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PalaceGrid;
