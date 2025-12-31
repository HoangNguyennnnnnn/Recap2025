import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UniverseBackground from '../../universe/UniverseBackground';
import PhotoLightbox from '../../photo/PhotoLightbox';
import MemoryForm from './MemoryForm';
import {
  fetchMemoryById,
  postComment,
  toggleReaction,
  deleteMemory,
  IMemory,
  IComment,
  Photo,
} from '../../../services/api';

const MemoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<IMemory | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Edit/Delete State
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMemory = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchMemoryById(id);
      setMemory(data.memory);
      setComments(data.comments);
      // Check if user has liked (simplified check)
      setIsLiked(data.reactions.some((r) => r.type === 'love'));
      setError(null);
    } catch (err: any) {
      console.error('Error loading memory:', err);
      setError('Lost in space. This memory might not exist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemory();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const comment = await postComment(id, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    try {
      // Optimistic UI
      setIsLiked(!isLiked);
      await toggleReaction('memory', id, 'love');
      // In a real app we'd sync the reaction count correctly
    } catch (err) {
      setIsLiked(!isLiked); // Rollback
      console.error('Failed to update reaction:', err);
    }
  };

  const handleEditSuccess = () => {
    // Reload memory data after successful edit
    loadMemory();
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await deleteMemory(id);
      navigate('/vault');
    } catch (err) {
      console.error('Failed to delete memory:', err);
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-blue flex items-center justify-center">
        <UniverseBackground />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-dancing text-4xl text-stardust-gold"
        >
          Reliving the moment...
        </motion.div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="min-h-screen bg-deep-blue flex flex-col items-center justify-center p-6 text-center">
        <UniverseBackground />
        <h2 className="font-dancing text-4xl text-soft-pink mb-4">{error || 'Memory Missing'}</h2>
        <Link
          to="/vault"
          className="px-8 py-3 bg-soft-pink/20 border border-soft-pink/40 rounded-full text-soft-pink hover:bg-soft-pink/30 font-inter transition-all"
        >
          Back to Vault
        </Link>
      </div>
    );
  }

  // Convert URLs to Photo objects for Lightbox
  const mappedPhotos: Photo[] = memory.photos.map((url, index) => ({
    publicId: `${memory._id}-p-${index}`,
    url: url,
    thumbnail: url,
    medium: url,
    large: url,
    placeholder: url,
    width: 0,
    height: 0,
    createdAt: memory.date,
    caption: memory.title,
  }));

  return (
    <div
      className="min-h-screen bg-deep-blue text-white selection:bg-soft-pink/30"
      ref={scrollContainerRef}
    >
      <UniverseBackground />

      {/* Sticky Top Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/vault')}
          className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 hover:border-soft-pink/50 transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-dancing text-lg text-soft-pink">Back to Vault</span>
        </button>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditFormOpen(true)}
            className="bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-stardust-gold/30 hover:border-stardust-gold/70 transition-all flex items-center gap-2 group"
          >
            <svg
              className="w-4 h-4 text-stardust-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="font-inter text-sm text-stardust-gold font-bold hidden sm:inline">
              Edit
            </span>
          </button>
          <button
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-red-500/30 hover:border-red-500/70 transition-all flex items-center gap-2 group"
          >
            <svg
              className="w-4 h-4 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="font-inter text-sm text-red-400 font-bold hidden sm:inline">
              Delete
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Big Hero Image */}
        <motion.div layoutId={`memory-image-${memory._id}`} className="absolute inset-0 z-0">
          <img
            src={memory.photos[0]}
            alt={memory.title}
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-blue/50 to-deep-blue" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-dancing text-6xl md:text-8xl text-stardust-gold drop-shadow-2xl mb-4">
              {memory.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-soft-pink font-inter tracking-[0.2em] uppercase text-sm">
              <span>
                {new Date(memory.date).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {memory.location && (
                <>
                  <span className="opacity-30">•</span>
                  <span>{memory.location}</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content Section */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-20 -mt-20">
        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl mb-12"
        >
          <div className="prose prose-invert max-w-none">
            {memory.story ? (
              <p className="font-inter text-lg leading-relaxed text-white/80 whitespace-pre-wrap first-letter:text-5xl first-letter:font-dancing first-letter:text-stardust-gold first-letter:float-left first-letter:mr-3">
                {memory.story}
              </p>
            ) : memory.description ? (
              <p className="font-inter text-lg leading-relaxed text-white/80">
                {memory.description}
              </p>
            ) : (
              <p className="font-dancing text-3xl text-center opacity-40">
                A beautiful day we shared...
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1 bg-soft-pink/10 border border-soft-pink/20 rounded-full text-xs text-soft-pink font-bold uppercase tracking-widest"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Interaction Bar */}
        <section className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-12">
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className="flex items-center gap-2 group">
              <motion.div
                whileTap={{ scale: 2 }}
                className={`text-3xl ${
                  isLiked
                    ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                    : 'text-white/40'
                }`}
              >
                {isLiked ? '❤️' : '🤍'}
              </motion.div>
              <span className="font-inter text-sm font-bold opacity-60">Love This</span>
            </button>
            <div className="flex items-center gap-2 text-white/40">
              <span className="text-2xl">💬</span>
              <span className="font-inter text-sm font-bold">{comments.length} Messages</span>
            </div>
          </div>

          <button className="text-stardust-gold/60 hover:text-stardust-gold transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </section>

        {/* Photo Gallery - Sliding Filmstrip */}
        <section className="mb-20 overflow-visible">
          <h3 className="font-dancing text-3xl text-stardust-gold mb-6 ml-2">Visual Echoes</h3>
          <div className="flex gap-4 overflow-x-auto pb-6 px-2 hide-scrollbar snap-x">
            {memory.photos.map((photo, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => openLightbox(index)}
                className="flex-shrink-0 w-64 aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-xl snap-center border-2 border-white/5"
              >
                <img src={photo} alt={`Memory ${index}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Engagement Section: Messages */}
        <section id="comments">
          <h3 className="font-dancing text-4xl text-soft-pink mb-8">Messages for Us</h3>

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mb-12 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave a message for this milestone..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pt-6 min-h-[120px] focus:outline-none focus:border-soft-pink/50 transition-all font-inter text-white placeholder:text-white/20 resize-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submittingComment}
              className="absolute bottom-4 right-4 px-6 py-2 bg-soft-pink text-deep-blue font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stardust-gold transition-colors shadow-lg"
            >
              {submittingComment ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-6">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 border-l-4 border-soft-pink/30 p-6 rounded-r-2xl"
                >
                  <p className="text-white/90 font-inter mb-3 italic">"{comment.content}"</p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold opacity-40">
                    <span>— {comment.author || 'Me'}</span>
                    <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {comments.length === 0 && (
              <div className="text-center py-10 opacity-30">
                <p className="font-dancing text-2xl">No messages left here yet...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <PhotoLightbox
            photos={mappedPhotos}
            initialIndex={activePhotoIndex}
            onClose={() => setIsLightboxOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Memory Modal */}
      <MemoryForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSuccess={handleEditSuccess}
        editMemory={memory}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-deep-blue/95 border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="font-dancing text-3xl text-red-400 mb-3">Delete Memory?</h3>
              <p className="font-inter text-white/60 mb-8">
                This action cannot be undone. This memory and all its data will be permanently
                removed from the vault.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-6 py-3 text-white/60 hover:text-white font-inter font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
};

export default MemoryDetail;
