import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import UniverseBackground from '../../universe/UniverseBackground';
import BiometricSyncLock from './BiometricSyncLock';
import { fetchSecrets, addSecret, ISecretMedia } from '../../../services/api';

const SecretRoom = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [showLockScreen, setShowLockScreen] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [secrets, setSecrets] = useState<ISecretMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingSecret, setIsAddingSecret] = useState(false);

  // Form State
  const [newSecret, setNewSecret] = useState({
    type: 'photo' as 'photo' | 'video' | 'note',
    title: '',
    content: '',
  });

  // Check if already unlocked (session storage)
  useEffect(() => {
    const unlocked = sessionStorage.getItem('secret_room_unlocked');
    if (unlocked === 'true') {
      setIsLocked(false);
      setShowLockScreen(false);
      setShowContent(true);
      loadSecrets();
    }
  }, []);

  const loadSecrets = async () => {
    try {
      setLoading(true);
      const data = await fetchSecrets();
      setSecrets(data);
    } catch (error) {
      console.error('Failed to load secrets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlocked = () => {
    setIsLocked(false);
    sessionStorage.setItem('secret_room_unlocked', 'true');

    // Delay showing content for dramatic effect
    setTimeout(() => {
      setShowLockScreen(false);
      setTimeout(() => {
        setShowContent(true);
        loadSecrets();
      }, 500);
    }, 2000);
  };

  const handleAddSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecret.title) return;

    try {
      const payload: any = {
        type: 'note', // Force note type for now
        title: newSecret.title,
        content: newSecret.content,
      };

      await addSecret(payload);
      
      // Reset form and reload
      setNewSecret({
        type: 'note',
        title: '',
        content: '',
      });
      setIsAddingSecret(false);
      loadSecrets();
    } catch (error) {
      console.error('Failed to add secret:', error);
      alert('Có lỗi xảy ra khi lưu bí mật. Thử lại sau nhé!');
    }
  };

  return (
    <div className="min-h-screen bg-deep-blue text-white relative overflow-hidden font-inter">
      <UniverseBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 hover:border-soft-pink/50 transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-dancing text-lg text-soft-pink ml-2">Back to Universe</span>
        </Link>

        {showContent && !isLocked && (
          <button
            onClick={() => setIsAddingSecret(true)}
            className="bg-gradient-to-r from-soft-pink to-rose-500 px-6 py-2 rounded-full font-dancing text-xl shadow-lg hover:shadow-soft-pink/50 transition-all active:scale-95"
          >
            + Add a Secret
          </button>
        )}
      </nav>

      {/* Biometric Lock Screen */}
      <BiometricSyncLock
        isOpen={showLockScreen && isLocked}
        onClose={() => setShowLockScreen(false)}
        onUnlocked={handleUnlocked}
      />

      {/* Lock Preview */}
      <AnimatePresence>
        {!showLockScreen && isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <div className="text-8xl mb-6 drop-shadow-[0_0_30px_rgba(255,182,193,0.5)]">🔐</div>
              <h1 className="font-dancing text-6xl text-stardust-gold mb-4">A Secret in Time 💕</h1>
              <p className="font-inter text-soft-pink/80 max-w-md mb-8 mx-auto leading-relaxed">
                Phòng bí mật này được bảo vệ bởi **Biometric Sync Lock**. 
                Cả hai người phải cùng online và chạm tay vào màn hình cùng lúc để mở khóa.
              </p>
              <button
                onClick={() => setShowLockScreen(true)}
                className="px-8 py-3 bg-gradient-to-r from-soft-pink to-stardust-gold text-deep-blue font-bold rounded-full shadow-xl hover:shadow-soft-pink/30 transition-all active:scale-95"
              >
                Attempt to Unlock 💓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlocked Content */}
      <AnimatePresence>
        {showContent && !isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 min-h-screen pt-24 pb-20 px-4"
          >
            {/* Header */}
            <header className="max-w-4xl mx-auto text-center mb-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-dancing text-6xl md:text-8xl text-stardust-gold drop-shadow-2xl mb-6"
              >
                A Secret in Time 💕
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-px w-32 bg-gradient-to-r from-transparent via-stardust-gold/50 to-transparent mx-auto mb-6"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-inter text-soft-pink text-lg max-w-2xl mx-auto leading-relaxed italic"
              >
                "Nơi lưu giữ những bí mật nhỏ lao, những tấm ảnh chỉ mình ta thấy, 
                và những lời nhắn gửi dành riêng cho hai tâm hồn đồng điệu."
              </motion.p>
            </header>

            {/* Content Feed */}
            <main className="max-w-6xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-stardust-gold border-t-transparent rounded-full"
                  />
                  <p className="font-dancing text-2xl text-stardust-gold/60">Đang lục tìm bí mật...</p>
                </div>
              ) : secrets.length === 0 ? (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                >
                  <div className="text-6xl mb-6">🏜️</div>
                  <h2 className="font-dancing text-3xl text-white/50 mb-4">Chưa có bí mật nào ở đây...</h2>
                  <p className="text-white/30 mb-8">Hãy là người đầu tiên gieo mầm bí mật 💕</p>
                  <button 
                    onClick={() => setIsAddingSecret(true)}
                    className="text-stardust-gold border border-stardust-gold/30 px-6 py-2 rounded-full hover:bg-stardust-gold/10 transition-all font-dancing text-xl"
                  >
                    Bắt đầu ngay
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {secrets.map((secret, index) => (
                    <motion.div
                      key={secret._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="group relative bg-[#111827]/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                      {/* Media Header */}
                      {secret.type !== 'note' && secret.url && (
                        <div className="aspect-[4/5] overflow-hidden relative">
                          {secret.type === 'photo' ? (
                            <img 
                              src={secret.url} 
                              alt={secret.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <video 
                              src={secret.url} 
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>
                      )}

                      {/* Content Body */}
                      <div className="p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                             {new Date(secret.date).toLocaleDateString('vi-VN', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <h3 className="font-dancing text-3xl text-stardust-gold mb-3 leading-tight">
                          {secret.title}
                        </h3>

                        {secret.content && (
                          <p className="font-inter text-white/80 text-lg italic leading-relaxed">
                            "{secret.content}"
                          </p>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                           <span className="font-dancing text-rose-400 text-xl italic opacity-60">Forever yours, nthz</span>
                        </div>
                      </div>

                      {/* Gentle Glow Effect */}
                      <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-br from-soft-pink/20 to-transparent pointer-events-none"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </main>

            {/* Footer Message */}
            <footer className="mt-24 text-center">
              <p className="font-dancing text-2xl text-white/30">
                "No matter the distance, our hearts beat as one." 💕
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/10 mt-4">PRIVATE SPACE • FOR TWO HEARTS ONLY</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Secret Modal */}
      <AnimatePresence>
        {isAddingSecret && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingSecret(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1f2937] border border-white/10 rounded-[2rem] shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsAddingSecret(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>

              <h2 className="font-dancing text-5xl text-stardust-gold mb-8 text-center italic">
                 Gieo mầm Bí mật... 💓
              </h2>

              <form onSubmit={handleAddSecret} className="space-y-8">
                {/* Type Selection - Hidden or Disabled for text-only focus */}
                <div className="hidden">
                  {(['photo', 'video', 'note'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewSecret({ ...newSecret, type: t })}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        newSecret.type === t 
                        ? 'border-soft-pink bg-soft-pink/10 shadow-[0_0_15px_rgba(255,182,193,0.3)]' 
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                    >
                       <span className="text-3xl">
                         {t === 'photo' ? '📸' : t === 'video' ? '🎬' : '💌'}
                       </span>
                    </button>
                  ))}
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 ml-1 font-bold">Tiêu đề lời chúc</label>
                    <input 
                      type="text"
                      required
                      placeholder="Lời chúc mừng, lời nhắn gửi..."
                      value={newSecret.title}
                      onChange={(e) => setNewSecret({ ...newSecret, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-soft-pink transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 ml-1 font-bold">
                       Nội dung dịu dàng
                    </label>
                    <textarea 
                      required
                      placeholder="Ghi lại những lời chúc ngọt ngào nhất..."
                      value={newSecret.content}
                      onChange={(e) => setNewSecret({ ...newSecret, content: e.target.value })}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-soft-pink transition-all outline-none resize-none italic"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!newSecret.title || !newSecret.content}
                  className="w-full bg-gradient-to-r from-soft-pink to-rose-500 py-5 rounded-2xl font-dancing text-2xl shadow-xl hover:shadow-soft-pink/40 transition-all disabled:opacity-30 disabled:grayscale disabled:pointer-events-none active:scale-95"
                >
                  Gửi lời chúc 💖
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-soft-pink/10 to-transparent blur-3xl"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SecretRoom;
