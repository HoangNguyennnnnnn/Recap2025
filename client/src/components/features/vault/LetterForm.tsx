import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createLetter, CreateLetterData } from '../../../services/api';

interface LetterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LetterForm = ({ isOpen, onClose, onSuccess }: LetterFormProps) => {
  // Form State
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [unlockTime, setUnlockTime] = useState('00:00');
  const [sender, setSender] = useState<'nthz' | 'hna'>('nthz');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setContent('');
      setUnlockDate('');
      setUnlockTime('00:00');
      setSender('nthz');
      setError(null);
    }
  }, [isOpen]);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim() || !unlockDate) {
      setError('Please write your secret letter and set an unlock date.');
      return;
    }

    // Combine date and time for unlock
    const unlockDateTime = new Date(`${unlockDate}T${unlockTime}:00`);

    if (unlockDateTime <= new Date()) {
      setError('The unlock date must be in the future.');
      return;
    }

    try {
      setSubmitting(true);

      const letterData: CreateLetterData = {
        content: content.trim(),
        unlockDate: unlockDateTime.toISOString(),
        sender,
      };

      await createLetter(letterData);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Letter form error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate time until unlock
  const getTimePreview = () => {
    if (!unlockDate) return null;
    const unlockDateTime = new Date(`${unlockDate}T${unlockTime}:00`);
    const now = new Date();
    const diff = unlockDateTime.getTime() - now.getTime();

    if (diff <= 0) return 'Invalid date';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    if (days > 0) {
      return `Unlocks in ${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `Unlocks in ${hours} hour${hours !== 1 ? 's' : ''}`;
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
                <span className="text-2xl">💌</span>
                <h2 className="font-dancing text-3xl text-white">Secret Letter</h2>
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

            {/* Description */}
            <p className="text-slate-400 font-inter text-sm mb-5">
              Write a message that will be locked until the unlock date 🔐
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-inter text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Letter Content */}
              <div>
                <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="My dearest love, by the time you read this..."
                  rows={6}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter placeholder:text-slate-500 focus:outline-none focus:border-slate-400 transition-all resize-none leading-relaxed"
                  required
                />
                <p className="text-slate-500 text-xs mt-2 font-inter">
                  {content.length} characters
                </p>
              </div>

              {/* Unlock Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                    Unlock Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter focus:outline-none focus:border-slate-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs uppercase tracking-wide mb-2">
                    Unlock Time
                  </label>
                  <input
                    type="time"
                    value={unlockTime}
                    onChange={(e) => setUnlockTime(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg py-3 px-4 text-white font-inter focus:outline-none focus:border-slate-400 transition-all"
                  />
                </div>
              </div>

              {/* Time Preview */}
              {unlockDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-600 rounded-lg"
                >
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="font-inter text-sm text-white">{getTimePreview()}</p>
                    <p className="text-slate-500 text-xs font-inter">
                      on{' '}
                      {new Date(`${unlockDate}T${unlockTime}:00`).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              )}

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
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <span>{submitting ? 'Sealing...' : 'Seal Letter'}</span>
                  <span>💌</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LetterForm;
