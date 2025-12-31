import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchHnaGallerySets, createHnaGallerySet, IHnaGallery } from '../../../services/api';
import ImageUploader, { UploadedFile } from '../../common/ImageUploader';

const HnaGallery = () => {
  const [sets, setSets] = useState<IHnaGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSet, setSelectedSet] = useState<IHnaGallery | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedFile[]>([]);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');

  const loadSets = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const data = await fetchHnaGallerySets(pageNum, 12);
      
      if (append) {
        setSets(prev => [...prev, ...data.sets]);
      } else {
        setSets(data.sets);
      }
      
      setHasMore(pageNum < data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching gallery sets:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  const handleAddSet = async () => {
    if (uploadedPhotos.length === 0) return;

    try {
      const photos = uploadedPhotos.map((p, index) => ({
        publicId: p.publicId,
        url: p.url,
        caption: '', // We could add per-photo caption support later
        order: index
      }));

      await createHnaGallerySet({
        title: newSetTitle || 'Kỷ niệm mới',
        description: newSetDescription,
        photos,
        date: new Date()
      });
      
      loadSets(); 
      setUploadedPhotos([]);
      setNewSetTitle('');
      setNewSetDescription('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error creating photo set:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300/30"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${16 + Math.random() * 16}px`,
            }}
            initial={{ y: -30, opacity: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'linear',
            }}
          >
            {['🌸', '💖', '✨', '🦋', '💕'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-pink-500 hover:text-pink-600 transition-colors text-sm mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-dancing text-4xl md:text-6xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent"
              >
                ✨ Hna's Gallery ✨
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-pink-400 mt-2"
              >
                Khoảnh khắc xinh đẹp của em 💕
              </motion.p>
            </div>

            {/* Add Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-2xl shadow-lg shadow-pink-300/50 hover:shadow-pink-400/60 transition-all"
            >
              <span className="text-xl">📸</span>
              <span>Thêm ảnh mới</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.button>
          </div>
        </header>

        {/* Photo Grid */}
        {loading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40">
            <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-dancing text-xl text-pink-500">Đang sắp xếp ảnh xinh...</p>
          </div>
        ) : sets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🌸</div>
            <p className="text-pink-500 font-dancing text-2xl">Chưa có bộ ảnh nào được lưu giữ...</p>
            <button
               onClick={() => setShowAddForm(true)}
               className="mt-6 px-8 py-3 bg-white text-pink-500 rounded-2xl shadow-lg border border-pink-100 hover:bg-pink-50 transition-all font-medium"
            >
              Tạo bộ ảnh đầu tiên
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
          >
            {sets.map((set) => {
              const coverPhoto = set.photos[0];
              if (!coverPhoto) return null;

              return (
                <motion.div
                  key={set._id}
                  variants={{
                    hidden: { opacity: 0, y: 30, rotate: -3 },
                    visible: { opacity: 1, y: 0, rotate: 0 },
                  }}
                  whileHover={{ y: -8, scale: 1.02, rotate: 1 }}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => {
                    setSelectedSet(set);
                    setSelectedPhotoIndex(0);
                  }}
                >
                  <div className="relative bg-white p-2 rounded-xl shadow-lg shadow-pink-200/50 border border-pink-100 overflow-hidden">
                    {/* Stack effect */}
                    {set.photos.length > 1 && (
                      <>
                        <div className="absolute inset-0 bg-white/20 -rotate-2 scale-105 z-[-1] rounded-xl border border-pink-100/50" />
                        <div className="absolute inset-0 bg-white/40 rotate-2 scale-105 z-[-2] rounded-xl border border-pink-100/30" />
                      </>
                    )}

                    <img
                      src={coverPhoto.url}
                      alt={set.title || 'Hna set'}
                      className="w-full rounded-lg object-cover"
                      loading="lazy"
                    />

                    {/* Group count indicator */}
                    {set.photos.length > 1 && (
                      <div className="absolute top-4 right-4 bg-pink-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <span>{set.photos.length} ảnh</span>
                        <span>✨</span>
                      </div>
                    )}

                    {/* Caption overlay */}
                    <div className="absolute inset-x-2 bottom-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-pink-700 text-sm font-medium line-clamp-2">
                        {set.title || 'Kỷ niệm xinh'}
                      </p>
                      <p className="text-pink-400 text-xs mt-1">
                        {new Date(set.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12 pb-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadSets(page + 1, true)}
              disabled={loadingMore}
              className="px-10 py-4 bg-white/80 backdrop-blur-md text-pink-500 font-bold rounded-2xl shadow-xl shadow-pink-200/30 border-2 border-pink-100 hover:border-pink-300 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loadingMore ? (
                <div className="w-5 h-5 border-3 border-pink-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>🌸</span>
              )}
              {loadingMore ? 'Đang tìm thêm...' : 'Xem thêm bộ ảnh xinh'}
            </motion.button>
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📸</span>
                  <h2 className="font-dancing text-2xl text-pink-600">Thêm ảnh mới</h2>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <ImageUploader
                  images={uploadedPhotos}
                  onChange={setUploadedPhotos}
                  maxImages={10}
                  label="Ảnh"
                  acceptVideo={false}
                />
               <div className="space-y-4">
                <div>
                  <label className="block text-sm text-pink-600 mb-2">Tên bộ ảnh</label>
                  <input
                    type="text"
                    value={newSetTitle}
                    onChange={(e) => setNewSetTitle(e.target.value)}
                    placeholder="Chuyến đi Đà Lạt..."
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm text-pink-600 mb-2">Lời nhắn gửi (không bắt buộc)</label>
                  <textarea
                    value={newSetDescription}
                    onChange={(e) => setNewSetDescription(e.target.value)}
                    placeholder="Kỷ niệm đẹp của chúng mình..."
                    rows={3}
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-gray-700 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 text-pink-500 hover:bg-pink-50 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddSet}
                    disabled={uploadedPhotos.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    Lưu bộ ảnh 💖
                  </button>
                </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setSelectedSet(null)}
          >
            {/* Close button - Top Right Floating */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedSet(null)}
              className="absolute top-6 right-6 z-[60] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full md:h-[90vh] md:max-w-7xl md:rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden shadow-[0_0_100px_rgba(244,114,182,0.2)] flex flex-col md:flex-row relative"
            >
              {/* Left Side: Cinematic Photo View */}
              <div className="flex-1 relative group flex items-center justify-center p-4 md:p-0 bg-black/40">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSet.photos[selectedPhotoIndex].url}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full flex items-center justify-center relative"
                  >
                    <img
                      src={selectedSet.photos[selectedPhotoIndex].url}
                      alt={selectedSet.photos[selectedPhotoIndex].caption || 'Detail'}
                      className="max-w-full max-h-full object-contain shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]"
                    />
                    
                    {/* Background Glow */}
                    <div 
                      className="absolute inset-0 z-[-1] opacity-20 blur-[100px]"
                      style={{ 
                        backgroundImage: `url(${selectedSet.photos[selectedPhotoIndex].url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {selectedSet.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIndex(prev => prev === 0 ? selectedSet.photos.length - 1 : prev - 1);
                      }}
                      className="absolute left-6 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoIndex(prev => (prev + 1) % selectedSet.photos.length);
                      }}
                      className="absolute right-6 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Photo Counter Floating */}
                <div className="absolute bottom-10 left-10 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 text-sm font-medium border border-white/10">
                  {selectedPhotoIndex + 1} / {selectedSet.photos.length}
                </div>
              </div>

              {/* Right Side: Story & Info */}
              <div className="w-full md:w-[400px] h-full bg-white flex flex-col relative">
                {/* Header with Title & Date */}
                <div className="p-8 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">✨</span>
                    <p className="text-pink-500 font-bold uppercase tracking-widest text-xs">Phim Trường Kỷ Niệm</p>
                  </div>
                  <h3 className="text-gray-900 text-3xl font-dancing mb-2">
                    {selectedSet.title || 'Khoảnh khắc xinh'}
                  </h3>
                  <p className="text-gray-400 text-sm border-l-2 border-pink-200 pl-3">
                    {new Date(selectedSet.date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 scrollbar-thin scrollbar-thumb-pink-100 scrollbar-track-transparent">
                  {/* Story Section */}
                  <div className="bg-pink-50/50 rounded-3xl p-6 border border-pink-100/50">
                    <p className="text-gray-700 leading-relaxed font-medium italic">
                      {selectedSet.description || 'Không gian nơi lưu giữ những điều tuyệt vời nhất của đôi mình...'}
                    </p>
                    
                    {selectedSet.photos[selectedPhotoIndex].caption && (
                      <div className="mt-6 pt-6 border-t border-pink-200/50">
                        <p className="text-xs text-pink-400 font-bold uppercase tracking-tighter mb-2">Lời nhắn cho ảnh này</p>
                        <p className="text-pink-600 font-medium">
                          "{selectedSet.photos[selectedPhotoIndex].caption}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Photolist / Thumbnails */}
                  {selectedSet.photos.length > 1 && (
                    <div>
                      <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span>Danh sách ảnh</span>
                        <div className="h-[1px] flex-1 bg-gray-100" />
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedSet.photos.map((p, idx) => (
                          <motion.button
                            key={p.publicId}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedPhotoIndex(idx)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                              selectedPhotoIndex === idx 
                                ? 'border-pink-500 ring-4 ring-pink-50' 
                                : 'border-transparent grayscale-[0.5] hover:grayscale-0'
                            }`}
                          >
                            <img src={p.url} className="w-full h-full object-cover" alt="" />
                            {selectedPhotoIndex === idx && (
                              <div className="absolute inset-0 bg-pink-500/10 flex items-center justify-center">
                                <span className="text-white text-lg">❤️</span>
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="p-8 pt-4 border-t border-gray-100 bg-gray-50/50">
                   <div className="flex items-center justify-between">
                     <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors font-medium">
                       <span className="text-2xl">❤️</span>
                       <span>Yêu thích</span>
                     </button>
                     <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                       Chia sẻ ngay
                     </button>
                   </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <span className="text-8xl">🌸</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HnaGallery;
