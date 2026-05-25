import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFortune } from '../../../services/fortune';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface FortuneChatProps {
  profileSlug: string;
  profileName: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  onClose: () => void;
}

const n = (s?: string) => (s || '').normalize('NFC');

const FortuneChat = ({
  profileSlug,
  profileName,
  birthDate,
  birthTime,
  gender,
  onClose,
}: FortuneChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: n(`Xin chào! Tôi là trợ lý tử vi của ${profileName}. Bạn muốn hỏi gì về lá số?`),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: q, timestamp: new Date() }]);
    setLoading(true);
    try {
      const data = await generateFortune({ profileSlug, birthDate, birthTime, gender, question: q });
      const answer =
        data.detailedReading?.conclusion ||
        data.overview ||
        data.sections?.[0]?.summary ||
        n('Đã phân tích xong, vui lòng xem kết quả.');
      setMessages((prev) => [...prev, { role: 'ai', content: n(answer), timestamp: new Date() }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: n(`Lỗi: ${e.message || 'Không thể kết nối AI'}`), timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const SUGGESTIONS = [n('Công danh năm nay?'), n('Tình duyên thế nào?'), n('Sức khỏe ra sao?'), n('Tài lộc 2025?')];

  return (
    <AnimatePresence>
      <motion.div
        key="chat-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/40 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="chat-panel"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:w-[420px] h-[90vh] sm:h-screen flex flex-col bg-gradient-to-b from-pink-50 via-rose-50/60 to-white shadow-2xl sm:rounded-l-3xl overflow-hidden border-l border-pink-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">🔮</div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm leading-tight truncate">{n(`Trợ lý Tử Vi — ${profileName}`)}</p>
              <p className="text-[11px] text-pink-100 mt-0.5">{n('Hỏi về lá số, vận hạn, cung số...')}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
            >
              <span className="text-white text-xl leading-none">×</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-1 ${
                  msg.role === 'ai' ? 'bg-gradient-to-br from-pink-400 to-rose-400 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {msg.role === 'ai' ? '🔮' : '👤'}
                </div>
                <div className={`max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-pink-500 to-rose-400 text-white rounded-tr-sm'
                      : 'bg-white/90 border border-pink-100 text-slate-700 rounded-tl-sm'
                  }`}>
                    {n(msg.content)}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-sm shrink-0 mt-1">🔮</div>
                <div className="bg-white/90 border border-pink-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-pink-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          <div className="px-4 pb-2 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-medium hover:bg-pink-100 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="px-4 pb-5 pt-2 shrink-0 bg-white/80 backdrop-blur-sm border-t border-pink-100">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={n('Hỏi về lá số...')}
                disabled={loading}
                className="flex-1 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md hover:opacity-90 transition-all disabled:opacity-40 shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FortuneChat;
