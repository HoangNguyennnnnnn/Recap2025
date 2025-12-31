import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import UniverseBackground from '../universe/UniverseBackground';
import MemoryCard from './vault/MemoryCard';
import MemoryForm from './vault/MemoryForm';
import LetterForm from './vault/LetterForm';
import SpecialMemoryCard, { SPECIAL_MEMORIES } from './vault/SpecialMemoryCard';
import { fetchMemories, fetchLetters, IMemory, ILetter } from '../../services/api';
import LetterCard from './vault/LetterCard';

const MemoryVault = () => {
  // Chỉ 2 tab: memories và letters
  const [activeTab, setActiveTab] = useState<'memories' | 'letters'>('memories');
  const [memories, setMemories] = useState<IMemory[]>([]);
  const [letters, setLetters] = useState<ILetter[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<IMemory[]>([]);
  const [filteredLetters, setFilteredLetters] = useState<ILetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMemories, setTotalMemories] = useState(0);

  // Form Modal States
  const [isMemoryFormOpen, setIsMemoryFormOpen] = useState(false);
  const [isLetterFormOpen, setIsLetterFormOpen] = useState(false);

  const loadMemories = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const data = await fetchMemories(pageNum, 12); // Fetch 12 at a time for better grid layout
      
      if (append) {
        setMemories(prev => [...prev, ...data.memories]);
        setFilteredMemories(prev => [...prev, ...data.memories]);
      } else {
        setMemories(data.memories);
        setFilteredMemories(data.memories);
      }
      
      setTotalMemories(data.pagination.total);
      setHasMore(pageNum < data.pagination.pages);
      setPage(pageNum);
      setError(null);
    } catch (err: any) {
      console.error('Error loading memories:', err);
      setError('Các vì sao đang lạc hướng. Vui lòng thử lại sau nhé!');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMemories = () => {
    if (!loading && hasMore) {
      loadMemories(page + 1, true);
    }
  };

  const loadLetters = async () => {
    try {
      setLoading(true);
      const data = await fetchLetters();
      setLetters(data);
      setFilteredLetters(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading letters:', err);
      setError('Các vì sao đang lạc hướng. Vui lòng thử lại sau nhé!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'memories') {
      setPage(1);
      loadMemories(1, false);
    } else if (activeTab === 'letters') {
      loadLetters();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'memories') {
      const results = memories.filter(
        (memory) =>
          memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          memory.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          memory.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMemories(results);
    } else {
      const results = letters.filter((_letter) =>
        'Secret Letter'.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLetters(results);
    }
  }, [searchTerm, memories, letters, activeTab]);

  // Filter special memories by search term
  const filteredSpecialMemories = SPECIAL_MEMORIES.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSuccess = () => {
    // Refresh the memories list after creating a new one
    loadMemories();
  };

  const handleLetterFormSuccess = () => {
    // Refresh the letters list after creating a new one
    loadLetters();
  };

  return (
    <div className="min-h-screen bg-deep-blue text-white relative overflow-hidden">
      <UniverseBackground />

      {/* Header Overlay */}
      <div className="relative z-10 p-4 md:p-10 max-w-7xl mx-auto">
        <header className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Top Row - Back Button & Title */}
          <div className="space-y-1 md:space-y-2">
            <Link
              to="/"
              className="inline-flex items-center text-soft-pink hover:text-stardust-gold transition-colors font-inter text-xs md:text-sm mb-2 md:mb-4"
            >
              <svg
                className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Link>
            <h1 className="font-dancing text-3xl sm:text-4xl md:text-6xl bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              ✨ Memory Vault ✨
            </h1>
            <p className="font-inter text-pink-300 max-w-md text-xs md:text-sm hidden sm:block">
              Where our precious moments live forever 💕
            </p>
          </div>

          {/* Tab Switching - Chỉ 2 tab: Memories và Letters */}
          <div className="flex p-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-400/30 rounded-full w-full shadow-lg">
            <button
              onClick={() => setActiveTab('memories')}
              className={`flex-1 px-3 md:px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest transition-all ${
                activeTab === 'memories'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                  : 'text-pink-300 hover:text-white hover:bg-white/10'
              }`}
            >
              📸 Memories
            </button>
            <button
              onClick={() => setActiveTab('letters')}
              className={`flex-1 px-3 md:px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest transition-all ${
                activeTab === 'letters'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                  : 'text-pink-300 hover:text-white hover:bg-white/10'
              }`}
            >
              💌 Secret Letters
            </button>
          </div>

          {/* Search Bar - Always visible */}

          <div className="relative group w-full">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'memories' ? 'memories' : 'letters'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-soft-pink/20 rounded-full py-2.5 md:py-3 px-10 focus:outline-none focus:border-soft-pink/50 transition-all font-inter text-xs placeholder:text-white/20"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-pink/40 group-focus-within:text-soft-pink transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-inter text-xs md:text-sm">
              {activeTab === 'memories'
                ? `${totalMemories} memories`
                : `${filteredLetters.length} letters`}
            </span>
            {activeTab === 'memories' && (
              <span className="text-amber-400/60 text-[10px] md:text-xs">
                (7 đặc biệt + {filteredMemories.length} mới)
              </span>
            )}
          </div>

          {/* Add Button */}
          <AnimatePresence mode="wait">
            {activeTab === 'memories' ? (
              <motion.button
                key="add-memory"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMemoryFormOpen(true)}
                className="relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 rounded-xl md:rounded-2xl shadow-lg shadow-orange-400/30 hover:shadow-orange-400/50 transition-all"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg md:text-xl"
                >
                  ✨
                </motion.div>
                <span className="font-bold text-white text-xs md:text-sm">Thêm kỷ niệm</span>
              </motion.button>
            ) : (
              <motion.button
                key="add-letter"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLetterFormOpen(true)}
                className="relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2.5 md:py-3 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-xl md:rounded-2xl shadow-lg shadow-pink-400/30 hover:shadow-pink-400/50 transition-all"
              >
                <motion.div
                  animate={{ y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg md:text-xl"
                >
                  💌
                </motion.div>
                <span className="font-bold text-white text-xs md:text-sm">Viết thư</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        {loading && activeTab === 'memories' && memories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40 animate-pulse">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-stardust-gold border-t-transparent rounded-full animate-spin mb-3 md:mb-4" />
            <p className="font-dancing text-xl md:text-2xl text-stardust-gold">
              Đang mở kho báu...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 md:py-40">
            <p className="font-dancing text-xl md:text-3xl text-soft-pink mb-3 md:mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-soft-pink/20 border border-soft-pink/40 rounded-full text-soft-pink hover:bg-soft-pink/30 font-inter text-sm transition-all active:scale-95"
            >
              Thử lại
            </button>
          </div>
        ) : activeTab === 'memories' ? (
          <div className="space-y-8 pb-20">
            {/* Section 1: 7 Kỷ niệm đặc biệt */}
            {filteredSpecialMemories.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-amber-400 font-dancing text-lg md:text-xl flex items-center gap-2">
                    ⭐ Kỷ niệm đặc biệt
                  </span>
                  <div className="h-px bg-amber-400/30 flex-grow"></div>
                </div>
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredSpecialMemories.map((memory, index) => (
                      <SpecialMemoryCard
                        key={`special-${memory.id}`}
                        memory={memory}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}

            {/* Section 2: User added memories */}
            {filteredMemories.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-pink-400 font-dancing text-lg md:text-xl flex items-center gap-2">
                    💕 Kỷ niệm của chúng mình
                  </span>
                  <div className="h-px bg-pink-400/30 flex-grow"></div>
                </div>
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredMemories.map((memory, index) => (
                      <MemoryCard key={memory._id} memory={memory} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                {hasMore && !searchTerm && (
                  <div className="flex justify-center mt-12 pb-10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadMoreMemories}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-full text-pink-300 font-bold hover:text-white hover:border-pink-400/60 transition-all flex items-center gap-3"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "🌟"
                      )}
                      {loading ? "Đang tìm thêm..." : "Khám phá thêm kỷ niệm"}
                    </motion.button>
                  </div>
                )}
              </div>
            )}

            {/* Empty state for user memories */}
            {filteredMemories.length === 0 && filteredSpecialMemories.length > 0 && (
              <div className="text-center py-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <p className="font-inter text-soft-pink/60 text-sm">
                  Chưa có kỷ niệm mới. Hãy thêm kỷ niệm của riêng bạn! ✨
                </p>
              </div>
            )}
          </div>
        ) : filteredLetters.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 pb-20"
          >
            <AnimatePresence mode="popLayout">
              {filteredLetters.map((letter, index) => (
                <LetterCard key={letter._id} letter={letter} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 md:py-40 bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 mx-2">
            <div className="text-4xl md:text-5xl mb-4 md:mb-6">💌</div>
            <h2 className="font-dancing text-2xl md:text-4xl text-stardust-gold mb-2">
              No letters yet...
            </h2>
            <p className="font-inter text-soft-pink/60 text-xs md:text-sm px-4">
              Write a secret letter for your loved one!
            </p>
          </div>
        )}
      </div>

      {/* Decorative Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-[10%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
        <div className="absolute bottom-1/3 left-[5%] w-1 h-1 bg-soft-pink rounded-full animate-pulse delay-700 shadow-[0_0_10px_#ffb6c1]" />
      </div>

      {/* Memory Form Modal */}
      <MemoryForm
        isOpen={isMemoryFormOpen}
        onClose={() => setIsMemoryFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Letter Form Modal */}
      <LetterForm
        isOpen={isLetterFormOpen}
        onClose={() => setIsLetterFormOpen(false)}
        onSuccess={handleLetterFormSuccess}
      />
    </div>
  );
};

export default MemoryVault;
