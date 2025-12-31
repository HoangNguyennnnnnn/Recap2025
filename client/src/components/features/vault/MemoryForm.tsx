import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IMemory,
  createMemory,
  updateMemory,
  CreateMemoryData,
  UpdateMemoryData,
} from '../../../services/api';
import ImageUploader from '../../common/ImageUploader';

interface MemoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMemory?: IMemory | null; // If provided, we're in edit mode
}

const MemoryForm = ({ isOpen, onClose, onSuccess, editMemory }: MemoryFormProps) => {
  const isEditMode = !!editMemory;

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [sender, setSender] = useState<'nthz' | 'hna'>('nthz');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset or populate form when modal opens/closes or editMemory changes
  useEffect(() => {
    if (isOpen && editMemory) {
      setTitle(editMemory.title || '');
      setDate(editMemory.date ? editMemory.date.split('T')[0] : '');
      setLocation(editMemory.location || '');
      setTagsInput(editMemory.tags?.join(', ') || '');
      setDescription(editMemory.description || '');
      setStory(editMemory.story || '');
      setPhotos(editMemory.photos || []);
      setSender(editMemory.sender || 'nthz');
    } else if (isOpen && !editMemory) {
      // Reset for add mode
      setTitle('');
      setDate('');
      setLocation('');
      setTagsInput('');
      setDescription('');
      setStory('');
      setPhotos([]);
      setSender('nthz');
    }
    setError(null);
  }, [isOpen, editMemory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !date) {
      setError('Title and Date are required fields.');
      return;
    }

    // Parse tags from comma-separated input
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      setSubmitting(true);

      if (isEditMode && editMemory) {
        const updateData: UpdateMemoryData = {
          title: title.trim(),
          date,
          location: location.trim() || undefined,
          tags,
          description: description.trim() || undefined,
          story: story.trim() || undefined,
          photos,
          sender,
        };
        await updateMemory(editMemory._id, updateData);
      } else {
        const createData: CreateMemoryData = {
          title: title.trim(),
          date,
          location: location.trim() || undefined,
          tags,
          description: description.trim() || undefined,
          story: story.trim() || undefined,
          photos,
          sender,
        };
        await createMemory(createData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Memory form error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📸</span>
                <h2 className="font-dancing text-3xl text-white">
                  {isEditMode ? 'Edit Memory' : 'New Memory'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 font-inter text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Our first date..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter placeholder:text-slate-500 focus:outline-none focus:border-slate-400 transition-all"
                  required
                />
              </div>

              {/* Sender Selection */}
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                  From
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSender('nthz')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-inter font-medium text-sm transition-all ${
                      sender === 'nthz'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    💙 nthz
                  </button>
                  <button
                    type="button"
                    onClick={() => setSender('hna')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-inter font-medium text-sm transition-all ${
                      sender === 'hna'
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    💖 hna
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-2 font-inter">
                  From {sender === 'nthz' ? 'nthz' : 'hna'} → {sender === 'nthz' ? 'hna' : 'nthz'}
                </p>
              </div>

              {/* Date + Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter focus:outline-none focus:border-slate-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Paris, France"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter placeholder:text-slate-500 focus:outline-none focus:border-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                  Tags <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="anniversary, travel, surprise"
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter placeholder:text-slate-500 focus:outline-none focus:border-slate-400 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief summary of this memory..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter placeholder:text-slate-500 focus:outline-none focus:border-slate-400 transition-all"
                />
              </div>

              {/* Story */}
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                  Story
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Tell the full story of this memory..."
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter placeholder:text-slate-500 focus:outline-none focus:border-slate-400 transition-all resize-none"
                />
              </div>

              {/* Photo/Video Upload */}
              <ImageUploader
                images={photos}
                onChange={(newPhotos) => setPhotos(newPhotos.map(p => typeof p === 'string' ? p : p.url))}
                maxImages={20}
                label="Ảnh & Video"
                acceptVideo={true}
              />

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-slate-400 hover:text-white font-inter transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting
                    ? isEditMode
                      ? 'Saving...'
                      : 'Creating...'
                    : isEditMode
                    ? 'Save Changes'
                    : 'Create Memory'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemoryForm;
