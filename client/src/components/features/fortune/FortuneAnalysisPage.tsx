import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  fetchFortuneProfiles,
  generateFortune,
  reingestFortune,
  uploadFortunePdf,
  FortuneProfile,
  FortuneResult,
} from '../../../services/fortune';
import PalaceGrid from './PalaceGrid';
import FortuneChat from './FortuneChat';

const STARS = Array.from({ length: 100 });

const ZODIAC_SYMBOLS = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇', '✦', '◈', '☯', '⚶', '✧'];

const n = (s?: string) => (s || '').normalize('NFC');

const clampScore = (v?: number) => {
  if (typeof v !== 'number' || isNaN(v)) return 0;
  return Math.min(100, Math.max(0, Math.round(v)));
};

const scoreBar = (s: number) => s >= 80 ? 'bg-emerald-400' : s >= 60 ? 'bg-amber-400' : 'bg-red-400/80';
const scoreText = (s: number) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-300' : 'text-red-400';

const STEPS = [
  'Đang truy vấn tri thức Tử Vi...',
  'Đang phân tích bản mệnh & ngũ hành...',
  'Đang luận giải 12 cung số...',
  'Đang tổng hợp kết quả...',
  'Hoàn tất!',
];

const KEYWORDS: Record<string, string> = {
  generalBanMenh: 'Bản mệnh', generalCucMenh: 'Cục', indicators: 'Chỉ số',
  palaceMenh: 'Mệnh', palaceQuanLoc: 'Quan Lộc', palaceTaiBach: 'Tài Bạch',
  palacePhuThe: 'Phu Thê', palacePhuMau: 'Phụ Mẫu', palaceHuynhDe: 'Huynh Đệ',
  palaceTuTuc: 'Tử Tức', palaceTatAch: 'Tật Ách', palaceDienTrach: 'Điền Trạch',
  palaceNoBoc: 'Nô Bộc', palacePhucDuc: 'Phúc Đức', palaceThienDi: 'Thiên Di',
};

const EMOJIS: Record<string, string> = {
  palaceMenh: '👤', palaceQuanLoc: '💼', palaceTaiBach: '💰', palacePhuThe: '💕',
  palacePhuMau: '👨‍👩‍👧', palaceHuynhDe: '👫', palaceTuTuc: '👶', palaceTatAch: '🏥',
  palaceDienTrach: '🏠', palaceNoBoc: '🤝', palacePhucDuc: '🕊️', palaceThienDi: '✈️',
  conclusion: '📜', generalBanMenh: '⭐', generalCucMenh: '🌊', indicators: '📊',
};

const SECTIONS = [
  { id: 'generalBanMenh', title: 'Chi tiết Bản Mệnh' },
  { id: 'generalCucMenh', title: 'Cục Mệnh và tương tác ngũ hành' },
  { id: 'indicators', title: 'Các chỉ số đặc trưng chủ chốt' },
  { id: 'palaceMenh', title: 'Cung Mệnh' },
  { id: 'palaceQuanLoc', title: 'Công Danh & Sự Nghiệp (Cung Quan Lộc)' },
  { id: 'palaceTaiBach', title: 'Tiền Tài & Tài Lộc (Cung Tài Bạch)' },
  { id: 'palacePhuThe', title: 'Tình Duyên & Hôn Nhân (Cung Phu Thê)' },
  { id: 'palacePhuMau', title: 'Cung Phụ Mẫu (Cha Mẹ)' },
  { id: 'palaceHuynhDe', title: 'Cung Huynh Đệ (Anh/Chị/Em)' },
  { id: 'palaceTuTuc', title: 'Cung Tử Tức (Con Cái)' },
  { id: 'palaceTatAch', title: 'Cung Tật Ách (Sức Khỏe)' },
  { id: 'palaceDienTrach', title: 'Cung Điền Trạch (Nhà Cửa)' },
  { id: 'palaceNoBoc', title: 'Cung Nô Bộc (Bạn Bè)' },
  { id: 'palacePhucDuc', title: 'Cung Phúc Đức (Dòng Họ)' },
  { id: 'palaceThienDi', title: 'Cung Thiên Di (Di Chuyển)' },
  { id: 'conclusion', title: 'Lời Kết & Lời Khuyên' },
];

const parseInline = (text: string) => {
  const parts = text.normalize('NFC').split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      const t = p.slice(2, -2);
      const lo = t.toLowerCase();
      const bad = /xấu|hãm|tai họa|bất lợi|hao hụt|xung khắc|hình khắc|bệnh tật|hóa kỵ/.test(lo);
      const good = /miếu|vượng|đắc|tốt|may mắn|thuận lợi|phát đạt|hóa lộc|hóa quyền|hóa khoa|cát/.test(lo);
      if (bad) return <strong key={i} className="text-red-400 font-extrabold bg-red-500/10 px-1 rounded border border-red-500/20">{t}</strong>;
      if (good) return <strong key={i} className="text-amber-300 font-extrabold bg-amber-500/10 px-1 rounded border border-amber-500/20">{t}</strong>;
      return <strong key={i} className="text-amber-200 font-extrabold">{t}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
};

const Paragraph = ({ text }: { text: string }) => {
  const lo = text.toLowerCase();
  const bad = /xấu|hãm|tai họa|bất lợi|hao hụt|xung khắc|hình khắc|bệnh tật|hóa kỵ/.test(lo);
  const good = /miếu|vượng|đắc|tốt|may mắn|thuận lợi|phát đạt|hóa lộc|hóa quyền|hóa khoa|cát/.test(lo);
  return (
    <div className={`relative p-4 rounded-r-xl rounded-l-sm border shadow-sm text-sm leading-relaxed font-serif text-amber-200/90
      ${bad ? 'border-l-4 border-l-red-400 bg-red-500/5 border-red-500/20' :
        good ? 'border-l-4 border-l-amber-400 bg-amber-500/5 border-amber-500/20' :
        'border-l-4 border-l-amber-500/30 bg-[#0A0F1E]/60 border-slate-700/50'}`}>
      <span className="absolute top-2 right-2 text-xs opacity-30">{bad ? '⚠️' : good ? '✦' : '◈'}</span>
      {parseInline(text)}
    </div>
  );
};

const SectionBody = ({ id, data }: { id: string; data: any }) => {
  if (id === 'indicators' && data && typeof data === 'object') {
    const items = [
      { k: 'chuMenh', label: 'Chủ Mệnh', desc: 'Nửa đời trước', color: 'from-amber-600 to-amber-400' },
      { k: 'chuThan', label: 'Chủ Thân', desc: 'Nửa đời sau', color: 'from-slate-500 to-slate-400' },
      { k: 'laiNhan', label: 'Lai Nhân', desc: 'Nguyên nhân', color: 'from-rose-500 to-pink-400' },
      { k: 'canLuong', label: 'Cân Lượng', desc: 'Cốt cách', color: 'from-emerald-600 to-emerald-400' },
      { k: 'thanCu', label: 'Thân Cư', desc: 'Hành động hậu vận', color: 'from-purple-600 to-purple-400' },
    ];
    return (
      <div className="grid md:grid-cols-2 gap-3 pt-4">
        {items.map(({ k, label, desc, color }) => data[k] ? (
          <div key={k} className="bg-[#0A0F1E]/80 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center font-bold text-base shrink-0`}>
              {label[0]}
            </div>
            <div>
              <p className="text-[10px] text-amber-400/60 font-semibold uppercase tracking-wide">{n(label)}</p>
              <p className="text-sm font-bold text-amber-100">{n(data[k])}</p>
              <p className="text-[10px] text-amber-400/60 italic">{n(desc)}</p>
            </div>
          </div>
        ) : null)}
      </div>
    );
  }
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const paras = text.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
  return (
    <div className="space-y-3 pt-4">
      {paras.map((p: string, i: number) => <Paragraph key={i} text={p} />)}
    </div>
  );
};

const FortuneAnalysisPage = () => {
  const { profileSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const triggered = useRef(false);

  const [profiles, setProfiles] = useState<FortuneProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [reingestLoading, setReingestLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsReupload, setNeedsReupload] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [openSection, setOpenSection] = useState('generalBanMenh');
  const [step, setStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handlePageClick = (e: React.MouseEvent) => {
    const id = Date.now();
    setRipples(prev => [...prev, { x: e.clientX, y: e.clientY, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800);
  };

  const formData = (location.state as any)?.formData as {
    birthDate?: string; birthTime?: string; gender?: string; question?: string;
  } | undefined;

  useEffect(() => {
    fetchFortuneProfiles().then(setProfiles).catch(() => setError('Không thể tải hồ sơ'));
  }, []);

  const activeProfile = useMemo(
    () => profiles.find(p => p.slug === profileSlug),
    [profiles, profileSlug]
  );

  const handleGenerate = useCallback(async (question?: string) => {
    if (!profileSlug || !activeProfile) return;
    setError(''); setNeedsReupload(false); setLoading(true); setStep(0);
    const iv = setInterval(() => setStep(s => s < STEPS.length - 1 ? s + 1 : s), 3000);
    try {
      const data = await generateFortune({
        profileSlug,
        birthDate: formData?.birthDate || activeProfile.birthDate,
        birthTime: formData?.birthTime || activeProfile.birthTime,
        gender: formData?.gender || activeProfile.gender,
        question: question || formData?.question || '',
      });
      setResult(data);
    } catch (e: any) {
      const msg = e.message || '';
      if (msg.includes('No PDF') || msg.includes('needsReupload')) setNeedsReupload(true);
      setError(msg || 'Lỗi khi lập lá số');
    } finally {
      clearInterval(iv); setLoading(false);
    }
  }, [profileSlug, activeProfile, formData]);

  useEffect(() => {
    if (triggered.current || profiles.length === 0 || !activeProfile || !profileSlug || result) return;
    if (activeProfile.lastIngestAt) { triggered.current = true; handleGenerate(); }
  }, [activeProfile, profileSlug, profiles, result, handleGenerate]);

  const isNotReady = useMemo(() => {
    if (!profileSlug || profiles.length === 0) return false;
    const p = profiles.find(x => x.slug === profileSlug);
    return !p || !p.lastIngestAt;
  }, [profiles, profileSlug]);

  const handleReingest = async () => {
    if (!profileSlug) return;
    setReingestLoading(true); setError('');
    try {
      await reingestFortune(profileSlug);
      triggered.current = false;
      await handleGenerate();
    } catch (e: any) {
      setError(e.message || 'Re-ingest thất bại');
      setNeedsReupload(true);
    } finally {
      setReingestLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!profileSlug || !activeProfile) return;
    setUploadLoading(true); setError('');
    try {
      await uploadFortunePdf(file, profileSlug, activeProfile.displayName);
      const updated = await fetchFortuneProfiles();
      setProfiles(updated);
      triggered.current = false;
      await handleGenerate();
    } catch (e: any) {
      setError(e.message || 'Upload thất bại');
    } finally {
      setUploadLoading(false);
    }
  };

  const getScore = (id: string) => {
    if (!result) return undefined;
    if (id === 'overall') return result.score;
    const kw = KEYWORDS[id];
    if (kw) {
      const kwn = kw.normalize('NFC').toLowerCase();
      const m = result.sections?.find(s => s.title.normalize('NFC').toLowerCase().includes(kwn));
      if (m?.score != null) return clampScore(m.score);
    }
    const idx = SECTIONS.findIndex(s => s.id === id);
    if (idx >= 0 && result.sections?.[idx]?.score != null) return clampScore(result.sections[idx]!.score);
    return undefined;
  };

  const getTags = (id: string) => {
    const kw = KEYWORDS[id];
    if (!kw || !result?.sections) return undefined;
    return result.sections.find(s => s.title.includes(kw))?.tags;
  };

  const getSectionData = (id: string) => {
    if (!result?.detailedReading) return null;
    const dr = result.detailedReading as any;
    const map: Record<string, any> = {
      generalBanMenh: dr.generalBanMenh, generalCucMenh: dr.generalCucMenh,
      indicators: dr.indicators, palaceMenh: dr.palaceMenh,
      palaceQuanLoc: dr.palaceQuanLoc, palaceTaiBach: dr.palaceTaiBach,
      palacePhuThe: dr.palacePhuThe, palacePhuMau: dr.palacePhuMau,
      palaceHuynhDe: dr.palaceHuynhDe, palaceTuTuc: dr.palaceTuTuc,
      palaceTatAch: dr.palaceTatAch, palaceDienTrach: dr.palaceDienTrach,
      palaceNoBoc: dr.palaceNoBoc, palacePhucDuc: dr.palacePhucDuc,
      palaceThienDi: dr.palaceThienDi, conclusion: dr.conclusion,
    };
    return map[id] ?? null;
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0D17] via-[#131B2F] to-[#1A1040] flex items-center justify-center p-4 relative overflow-hidden">
      {STARS.map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: `${Math.random()*2+1}px`, height: `${Math.random()*2+1}px`, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.5+0.2, animation: `pulse ${Math.random()*4+3}s ease-in-out infinite`, animationDelay: `${Math.random()*3}s` }} />
      ))}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0F1525]/90 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)] max-w-sm w-full text-center border border-amber-500/10 backdrop-blur-md">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <motion.div className="absolute inset-0 rounded-full border border-amber-500/30"
            animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
          <motion.div className="absolute inset-0 rounded-full border border-amber-500/10"
            animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">✦</div>
        </div>
        <p className="text-xs uppercase tracking-widest text-amber-400/70 font-semibold mb-1">ĐANG LUẬN GIẢI</p>
        <h3 className="text-lg font-semibold text-amber-100 mb-4">{n(activeProfile?.displayName || profileSlug)}</h3>
        <div className="bg-[#0A0F1E]/80 rounded-xl p-4 min-h-[72px] flex items-center justify-center border border-amber-500/10">
              <p className="text-sm text-amber-200/80">{n(STEPS[step])}</p>
        </div>
        <div className="mt-4 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-5 bg-amber-400' : i < step ? 'w-1.5 bg-amber-400/40' : 'w-1.5 bg-slate-700'}`} />
          ))}
        </div>
      </motion.div>
    </div>
  );

  // ── Not ready / needs upload ─────────────────────────────────────────────────
  if ((isNotReady || needsReupload) && !result) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0D17] via-[#131B2F] to-[#1A1040] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {STARS.map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: `${Math.random()*2+1}px`, height: `${Math.random()*2+1}px`, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.5+0.2, animation: `pulse ${Math.random()*4+3}s ease-in-out infinite`, animationDelay: `${Math.random()*3}s` }} />
      ))}
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0F1525]/80 border border-amber-500/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)] text-center backdrop-blur-md">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-4xl animate-pulse">
          {needsReupload ? '✦' : '☽'}
        </div>
        <h2 className="text-xl font-playfair font-bold text-amber-100 mb-2">
          {n(needsReupload ? 'Cần tải lại PDF' : 'Chưa có dữ liệu')}
        </h2>
        <p className="text-sm text-amber-200/70 mb-6 leading-relaxed">
          {n(needsReupload
            ? 'Dữ liệu PDF đã bị mất. Vui lòng upload lại file PDF lá số.'
            : `Lá số của ${activeProfile?.displayName || profileSlug} chưa được tải lên.`)}
        </p>

        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs">
            {n(error)}
          </div>
        )}

        {!needsReupload && (
          <button onClick={handleReingest} disabled={reingestLoading}
            className="w-full mb-3 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-[#0B0D17] font-bold text-sm disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(217,119,6,0.2)]">
            {reingestLoading ? '⏳ Đang xử lý...' : '✦ Phân tích lại từ PDF đã lưu'}
          </button>
        )}

        <label className="block w-full cursor-pointer">
          <div className="w-full py-3 rounded-xl border-2 border-dashed border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400/80 font-bold text-sm transition-all text-center">
            {uploadLoading ? '⏳ Đang upload...' : '☰ Upload PDF lá số'}
          </div>
          <input type="file" accept=".pdf" className="hidden" disabled={uploadLoading}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
        </label>

        <button onClick={() => navigate('/fortune')}
          className="mt-4 w-full py-2.5 rounded-xl border border-amber-500/20 text-amber-300/70 text-sm hover:bg-amber-500/5 transition-all">
          ← Quay lại
        </button>
      </motion.div>
    </div>
  );

  // ── Main view ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0D17] via-[#131B2F] to-[#1A1040] text-amber-100 font-inter pb-20 relative overflow-hidden" onClick={handlePageClick}>
      {/* Ripple effects */}
      {ripples.map(r => (
        <span key={r.id} className="fixed pointer-events-none z-50 rounded-full border border-amber-400/40"
          style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40, animation: 'ripple 0.8s ease-out forwards' }} />
      ))}
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {STARS.map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: `${Math.random()*2.5+0.5}px`, height: `${Math.random()*2.5+0.5}px`, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, opacity: Math.random()*0.6+0.2, animation: `pulse ${Math.random()*5+3}s ease-in-out infinite`, animationDelay: `${Math.random()*4}s` }} />
        ))}
        {/* Constellation-style larger stars */}
        {STARS.slice(0, 15).map((_, i) => (
          <div key={`big-${i}`} className="absolute rounded-full"
            style={{ width: 4, height: 4, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, background: 'rgba(251,191,36,0.6)', boxShadow: '0 0 6px rgba(251,191,36,0.4)', animation: `pulse ${Math.random()*4+3}s ease-in-out infinite`, animationDelay: `${Math.random()*3}s` }} />
        ))}
        {/* Floating zodiac symbols */}
        {ZODIAC_SYMBOLS.map((sym, i) => (
          <div key={`zodiac-${i}`} className="absolute text-amber-400/10 pointer-events-none"
            style={{ top: `${5 + Math.random()*90}%`, left: `${5 + Math.random()*90}%`, fontSize: `${Math.random()*14+10}px`, animation: `float ${Math.random()*10+8}s ease-in-out infinite`, animationDelay: `${Math.random()*6}s` }}>
            {sym}
          </div>
        ))}
      </div>
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent relative z-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-10 text-left">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/10 pb-6 mb-8">
          <div>
            <span className="inline-block text-amber-300 text-xs font-bold uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-amber-500/20 mb-2 shadow-[0_0_20px_rgba(251,191,36,0.08)]">
              ✦ Lá Số Tử Vi
            </span>
            <h1 className="font-bold text-3xl md:text-4xl tracking-[0.3em] text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] mt-[5px]">
              {n('LÁ SỐ TỬ VI CHI TIẾT')}
            </h1>
            <p className="text-amber-200/70 mt-1.5 font-serif text-sm">
              {n('Bản đồ số mệnh của ')}
              <strong className="text-amber-300">{n(activeProfile?.displayName || profileSlug)}</strong>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <button onClick={() => navigate('/fortune')}
              className="px-4 py-2 rounded-xl border border-amber-500/20 bg-[#0A0F1E]/80 text-amber-300 hover:bg-amber-500/10 font-semibold text-sm transition-all">
              ← Quay lại
            </button>
            <button onClick={() => handleGenerate()} disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-[#0B0D17] font-bold text-sm shadow-[0_0_20px_rgba(217,119,6,0.2)] disabled:opacity-50 transition-all">
              ✦ Luận giải lại
            </button>
            <button onClick={() => setChatOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-[#0B0D17] font-bold text-sm shadow-[0_0_20px_rgba(217,119,6,0.2)] transition-all flex items-center gap-1.5">
              ✦ Hỏi AI
            </button>
          </div>
        </div>
        {/* Error banner */}
        {error && !needsReupload && (
          <div className="mb-6 bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-3">
            <span>◈ {n(error)}</span>
            <button onClick={handleReingest} disabled={reingestLoading}
              className="shrink-0 px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold transition-all">
              {reingestLoading ? '⏳...' : '✦ Thử lại'}
            </button>
          </div>
        )}

        {/* Palace Grid */}
        <PalaceGrid
          result={result}
          displayName={activeProfile?.displayName}
          birthDate={formData?.birthDate || activeProfile?.birthDate || ''}
          birthTime={formData?.birthTime || activeProfile?.birthTime || ''}
          gender={formData?.gender || activeProfile?.gender || ''}
        />

        {/* Score grid */}
        {result && result.sections && result.sections.length > 0 && (
          <div className="mt-8 bg-[#0F1525]/80 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-amber-500/10 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-5 border-b border-amber-500/10 pb-3">
              <span className="text-xl text-amber-400/80">◈</span>
              <div>
                <h3 className="text-base font-bold text-amber-400 font-playfair">{n('Điểm Số Từng Cung')}</h3>
                <p className="text-[11px] text-amber-300/70">{n('Trích xuất từ lá số PDF')}</p>
              </div>
              {result.score != null && result.score > 0 && (
                <div className="ml-auto text-right">
                  <span className="text-[10px] text-amber-300/70 block">Tổng điểm</span>
                  <span className={`text-2xl font-bold font-mono ${scoreText(clampScore(result.score))}`}>
                    {clampScore(result.score)}<span className="text-sm font-normal text-amber-300/70">%</span>
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { id: 'palaceMenh', label: 'Cung Mệnh', emoji: '✦' },
                { id: 'palaceQuanLoc', label: 'Quan Lộc', emoji: '✦' },
                { id: 'palaceTaiBach', label: 'Tài Bạch', emoji: '✦' },
                { id: 'palacePhuThe', label: 'Phu Thê', emoji: '✦' },
                { id: 'palacePhuMau', label: 'Phụ Mẫu', emoji: '✦' },
                { id: 'palaceHuynhDe', label: 'Huynh Đệ', emoji: '✦' },
                { id: 'palaceTuTuc', label: 'Tử Tức', emoji: '✦' },
                { id: 'palaceTatAch', label: 'Tật Ách', emoji: '✦' },
                { id: 'palaceDienTrach', label: 'Điền Trạch', emoji: '✦' },
                { id: 'palaceNoBoc', label: 'Nô Bộc', emoji: '✦' },
                { id: 'palacePhucDuc', label: 'Phúc Đức', emoji: '✦' },
                { id: 'palaceThienDi', label: 'Thiên Di', emoji: '✦' },
              ].map(({ id, label, emoji }) => {
                const sc = getScore(id);
                if (sc == null) return null;
                const bg = sc >= 80 ? 'bg-emerald-500/10 border-emerald-500/20' : sc >= 60 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';
                return (
                  <button key={id} onClick={() => {
                    setOpenSection(id);
                    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }} className={`${bg} border rounded-2xl p-3 text-left hover:shadow-[0_0_20px_rgba(217,119,6,0.15)] transition-all hover:scale-[1.02]`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-base text-amber-400/60">{emoji}</span>
                      <span className={`text-sm font-bold font-mono ${scoreText(sc)}`}>{sc}%</span>
                    </div>
                    <p className="text-[11px] font-semibold text-amber-200 truncate">{n(label)}</p>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                      <div className={`h-full rounded-full ${scoreBar(sc)}`} style={{ width: `${sc}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Accordion sections */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-amber-100 mb-5 flex items-center gap-2 font-playfair">
            <span className="text-amber-400/80">✦</span> {n('Thập Nhị Cung Chân Giải')}
          </h2>
          <div className="space-y-2.5">
            {result && SECTIONS.map(sec => {
              const data = getSectionData(sec.id);
              if (!data) return null;
              const sc = getScore(sec.id);
              const tags = getTags(sec.id);
              const emoji = EMOJIS[sec.id] || '✦';
              const isOpen = openSection === sec.id;
              return (
                <div key={sec.id} id={`sec-${sec.id}`}
                  className={`bg-[#0F1525]/60 rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-sm ${
                    isOpen ? 'border-amber-500/30 shadow-[0_4px_20px_rgba(217,119,6,0.15)]' : 'border-slate-700/50 hover:border-amber-500/20 shadow-sm'
                  }`}>
                  {/* Header */}
                  <button onClick={() => setOpenSection(isOpen ? '' : sec.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0 text-amber-400/60">{emoji}</span>
                      <div className="min-w-0">
                        <h3 className={`font-bold font-serif truncate transition-colors ${isOpen ? 'text-amber-300' : 'text-amber-200/70'}`}>
                          {n(sec.title)}
                        </h3>
                        {sc != null && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-14 h-1 rounded-full bg-slate-700/50 overflow-hidden">
                              <div className={`h-full rounded-full ${scoreBar(sc)}`} style={{ width: `${sc}%` }} />
                            </div>
                            <span className={`text-xs font-bold font-mono ${scoreText(sc)}`}>{sc}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tags && tags.slice(0, 2).map((t, i) => (
                        <span key={i} className="hidden sm:block px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400/80 rounded border border-amber-500/20">
                          #{n(t)}
                        </span>
                      ))}
                      <span className={`text-amber-400/60 text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </div>
                  </button>
                  {/* Body */}
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }} className="px-5 pb-6 border-t border-slate-700/50">
                      <SectionBody id={sec.id} data={data} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* FortuneChat modal */}
      {chatOpen && (
        <FortuneChat
          profileSlug={profileSlug!}
          profileName={activeProfile?.displayName || profileSlug!}
          birthDate={formData?.birthDate || activeProfile?.birthDate}
          birthTime={formData?.birthTime || activeProfile?.birthTime}
          gender={formData?.gender || activeProfile?.gender}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default FortuneAnalysisPage;
