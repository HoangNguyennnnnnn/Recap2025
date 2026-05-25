import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFortuneProfiles, FortuneProfile } from '../../../services/fortune';

const QUICK_PROFILES = [
  { slug: 'hna', displayName: 'Nguyễn Hồng Anh', label: 'Hồng Anh (Hna)', gender: 'female', birthDate: '2004-10-06', birthTime: '11:15' },
  { slug: 'nthz', displayName: 'Nguyễn Trịnh Hoàng Nguyên', label: 'Hoàng Nguyên (Nthz)', gender: 'male', birthDate: '2004-08-13', birthTime: '03:00' },
];

const BIRTH_HOURS = [
  { value: '23:00', label: 'Tý (23:00 - 01:00)' },
  { value: '01:00', label: 'Sửu (01:00 - 03:00)' },
  { value: '03:00', label: 'Dần (03:00 - 05:00)' },
  { value: '05:00', label: 'Mão (05:00 - 07:00)' },
  { value: '07:00', label: 'Thìn (07:00 - 09:00)' },
  { value: '09:00', label: 'Tỵ (09:00 - 11:00)' },
  { value: '11:00', label: 'Ngọ (11:00 - 13:00)' },
  { value: '13:00', label: 'Mùi (13:00 - 15:00)' },
  { value: '15:00', label: 'Thân (15:00 - 17:00)' },
  { value: '17:00', label: 'Dậu (17:00 - 19:00)' },
  { value: '19:00', label: 'Tuất (19:00 - 21:00)' },
  { value: '21:00', label: 'Hợi (21:00 - 23:00)' },
];

const FortunePage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<FortuneProfile[]>([]);

  const [selectedSlug, setSelectedSlug] = useState('hna');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [formData, setFormData] = useState({
    displayName: 'Nguyễn Hồng Anh',
    gender: 'female',
    birthDate: '2004-10-06',
    birthTime: '11:15',
  });

  useEffect(() => {
    fetchFortuneProfiles()
      .then(setProfiles)
      .catch(() => {});
  }, []);

  const profileMap = useMemo(() => {
    const map = new Map<string, FortuneProfile>();
    profiles.forEach((p) => map.set(p.slug, p));
    return map;
  }, [profiles]);

  const handleSelectPreset = (slug: string) => {
    setSelectedSlug(slug);
    const preset = QUICK_PROFILES.find((p) => p.slug === slug);
    const stored = profileMap.get(slug);
    if (preset) {
      setFormData({
        displayName: stored?.displayName || preset.displayName,
        gender: stored?.gender || preset.gender,
        birthDate: stored?.birthDate || preset.birthDate,
        birthTime: stored?.birthTime || preset.birthTime,
      });
    }
  };

  const handleStartAnalysis = () => {
    navigate(`/fortune/${selectedSlug}`, {
      state: {
        formData: {
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          gender: formData.gender,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0D17] via-[#131B2F] to-[#1A1040] text-amber-100 font-inter pb-20 relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2.5 + 0.5}px`,
              height: `${Math.random() * 2.5 + 0.5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `pulse ${Math.random() * 5 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={`big-${i}`} className="absolute rounded-full"
            style={{ width: 4, height: 4, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, background: 'rgba(251,191,36,0.6)', boxShadow: '0 0 6px rgba(251,191,36,0.4)', animation: `pulse ${Math.random()*4+3}s ease-in-out infinite`, animationDelay: `${Math.random()*3}s` }} />
        ))}
        {['☉','☽','☿','♀','♂','♃','♄','♅','♆','♇','✦','◈','☯','⚶','✧'].map((sym, i) => (
          <div key={`z-${i}`} className="absolute text-amber-400/10 pointer-events-none"
            style={{ top: `${5+Math.random()*90}%`, left: `${5+Math.random()*90}%`, fontSize: `${Math.random()*14+10}px`, animation: `float ${Math.random()*10+8}s ease-in-out infinite`, animationDelay: `${Math.random()*6}s` }}>
            {sym}
          </div>
        ))}
      </div>
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-14 relative z-10">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-full px-4 py-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(251,191,36,0.08)]">
            <span>✦</span> Tử Vi Đẩu Số
          </div>
          <h1 className="font-bold text-3xl md:text-4xl tracking-[0.2em] text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)] leading-tight">
            Lá Số Tử Vi Trọn Đời
          </h1>
          <p className="text-amber-200/60 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Nhập thông tin bản mệnh để khởi tạo và luận giải lá số tử vi chi tiết.
          </p>
        </header>

        {/* Main card */}
        <div className="bg-[#0F1525]/80 backdrop-blur-md border border-amber-500/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)] rounded-3xl p-6 md:p-8">
          {/* Profile selector */}
          <div className="mb-7 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400/70 font-bold mb-3">
              Chọn hồ sơ
            </p>
            <div className="flex justify-center gap-3">
              {QUICK_PROFILES.map((p) => {
                const isSelected = selectedSlug === p.slug;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => handleSelectPreset(p.slug)}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white border-amber-400/30 shadow-[0_0_20px_rgba(217,119,6,0.3)] scale-[1.03]'
                        : 'bg-white/5 text-slate-300 border-slate-700 hover:border-amber-500/30 hover:bg-amber-500/5'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowComingSoon(true)}
                className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 bg-white/5 text-slate-300 border-dashed border-slate-600 hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                + Tự nhập
              </button>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-amber-300/70 uppercase tracking-wider mb-1.5 ml-1">Họ tên</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                className="rounded-xl border border-slate-700 bg-[#0A0F1E]/80 px-4 py-2.5 text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/30 transition-all"
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-amber-300/70 uppercase tracking-wider mb-1.5 ml-1">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                className="rounded-xl border border-slate-700 bg-[#0A0F1E]/80 px-4 py-2.5 text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer transition-all"
              >
                <option value="female">Nữ</option>
                <option value="male">Nam</option>
              </select>
            </div>

            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-amber-300/70 uppercase tracking-wider mb-1.5 ml-1">Ngày sinh (dương lịch)</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                className="rounded-xl border border-slate-700 bg-[#0A0F1E]/80 px-4 py-2.5 text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-amber-300/70 uppercase tracking-wider mb-1.5 ml-1">Giờ sinh</label>
              <select
                value={formData.birthTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, birthTime: e.target.value }))}
                className="rounded-xl border border-slate-700 bg-[#0A0F1E]/80 px-4 py-2.5 text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer transition-all"
              >
                {BIRTH_HOURS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>

          </div>

          <button
            onClick={handleStartAnalysis}
            className="mt-7 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:brightness-110 text-[#0B0D17] font-bold transition-all shadow-[0_0_30px_rgba(217,119,6,0.3)] text-sm flex items-center justify-center gap-2 tracking-wide"
          >
            <span>✦</span> Xem Lá Số
          </button>
        </div>

        {/* Feature badges */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '✦', title: '110+ Vì Sao', desc: '14 chính tinh và gần 100 phụ tinh' },
            { icon: '☽', title: 'Chuẩn Âm Lịch', desc: 'Tự động chuyển đổi can chi' },
            { icon: '◈', title: 'Tử Vi AI', desc: 'Phân tích chi tiết từng cung số' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 backdrop-blur-sm border border-amber-500/10 rounded-2xl p-4 shadow-sm hover:shadow-[0_0_20px_rgba(217,119,6,0.15)] transition-all hover:border-amber-500/20">
              <p className="text-xl mb-1.5 text-amber-400/80">{f.icon}</p>
              <p className="text-xs font-bold text-amber-200">{f.title}</p>
              <p className="text-[10px] text-amber-300/50 mt-0.5 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowComingSoon(false)}>
          <div className="bg-[#0F1525] border border-amber-500/20 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-[0_0_60px_rgba(0,0,0,0.5)] text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
              ✦
            </div>
            <h3 className="text-lg font-bold text-amber-300 mb-6">Tính năng đang phát triển nha bé :&gt;</h3>
            <button onClick={() => setShowComingSoon(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-[#0B0D17] font-bold text-sm shadow-[0_0_20px_rgba(217,119,6,0.2)]">
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortunePage;
