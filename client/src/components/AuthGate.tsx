import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storeToken, hasValidSession } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthGateProps {
  onSuccess: () => void;
}

const AuthGate = ({ onSuccess }: AuthGateProps) => {
  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-skip if valid session exists
  useEffect(() => {
    if (hasValidSession()) {
      onSuccess();
    } else {
      // Autofocus on input
      inputRef.current?.focus();
    }
  }, [onSuccess]);

  const validateDate = (input: string): boolean => {
    // Check if input matches DDMMYYYY format (8 digits)
    const dateRegex = /^\d{8}$/;
    return dateRegex.test(input);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate format
    if (!validateDate(dateInput)) {
      setError('Please enter date in DDMMYYYY format');
      return;
    }

    setIsLoading(true);

    try {
      // Call the server API to verify passcode
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode: dateInput }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        // Success! Store the JWT token from server
        setIsSuccess(true);
        storeToken(data.token, rememberMe);

        // Wait for animation to complete before navigating
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setIsLoading(false);
        setError(data.message || "That's not quite right... Try our special date ❤️");
      }
    } catch (err) {
      console.error('Auth error:', err);
      setIsLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-deep-blue to-purple-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Starry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`heart-${i}`}
            className="absolute text-soft-pink opacity-20 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-50px',
            }}
            animate={{
              y: [-50, -window.innerHeight - 50],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Lock Container */}
            <div className="bg-deep-blue bg-opacity-40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-stardust-gold border-opacity-30">
              {/* Lock Icon */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{
                  rotate: isLoading ? [0, -5, 5, -5, 5, 0] : 0,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isLoading ? Infinity : 0,
                }}
              >
                <div className="relative">
                  {/* Keyhole Glow Effect */}
                  <div className="absolute inset-0 bg-stardust-gold opacity-30 blur-xl rounded-full animate-pulse" />
                  <svg
                    className="w-20 h-20 text-stardust-gold relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="font-dancing text-4xl md:text-5xl text-stardust-gold text-center mb-4 drop-shadow-lg">
                Enter Our Universe
              </h1>

              <p className="font-inter text-soft-pink text-center mb-8 text-sm md:text-base">
                Our special date unlocks the memories ✨
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={dateInput}
                    onChange={(e) => {
                      setDateInput(e.target.value.replace(/\D/g, ''));
                      setError('');
                    }}
                    placeholder="DDMMYYYY"
                    className="w-full px-6 py-4 bg-deep-blue bg-opacity-60 border-2 border-stardust-gold border-opacity-50 rounded-xl text-soft-pink font-inter text-center text-lg tracking-widest placeholder-soft-pink placeholder-opacity-40 focus:outline-none focus:border-stardust-gold focus:border-opacity-100 focus:ring-4 focus:ring-stardust-gold focus:ring-opacity-20 transition-all"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-soft-pink text-opacity-60 text-center mt-2 font-inter">
                    Hint: The day we started our journey together 💕
                  </p>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-500 bg-opacity-20 border border-red-400 rounded-lg p-3 text-red-300 text-sm font-inter text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-stardust-gold cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-soft-pink text-sm font-inter cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || dateInput.length !== 8}
                  className="w-full bg-stardust-gold hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed text-deep-blue font-inter font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Unlocking...
                    </span>
                  ) : (
                    'Unlock Our Memories'
                  )}
                </button>
              </form>

              {/* Footer Hint */}
              <p className="text-center text-soft-pink text-opacity-40 text-xs font-inter mt-6">
                A date worth remembering forever 🌟
              </p>
            </div>
          </motion.div>
        ) : (
          /* Success Animation */
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Unlocking Animation */}
            <motion.div
              animate={{
                rotate: [0, -15, 15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.8 }}
            >
              <svg
                className="w-32 h-32 text-stardust-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </motion.div>

            {/* Confetti Hearts */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute text-4xl"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: 0,
                  scale: 1,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                }}
              >
                {['❤️', '💕', '💖', '✨', '🌟'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-dancing text-5xl text-stardust-gold mt-8 text-center"
            >
              Welcome Back, Love! 💖
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthGate;
