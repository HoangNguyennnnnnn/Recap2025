import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AuthGate from './components/AuthGate';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PhotoGallery from './components/PhotoGallery';
import MemoryVault from './components/features/MemoryVault';
import MemoryDetail from './components/features/vault/MemoryDetail';
import LetterDetail from './components/features/vault/LetterDetail';
import StoryMemoryDetail from './components/features/vault/StoryMemoryDetail';
import OurOrbit from './components/features/orbit/OurOrbit';
import FiftyReasons from './components/features/thanks/FiftyReasons';
import VideoFeed from './components/VideoFeed';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/layout/Navbar';
import BirthdayPage from './components/features/birthday/BirthdayPage';
import OpenWhenPage from './components/features/openwhen/OpenWhenPage';
import SecretRoom from './components/features/biometric/SecretRoom';
import HnaGallery from './components/features/hna/HnaGallery';

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: 'tween' as any,
  ease: 'anticipate' as any,
  duration: 0.5,
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bg-deep-blue min-h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AuthGate onSuccess={() => navigate('/')} />
              </motion.div>
            }
          />

          {/* Protected Routes */}
          <Route
            element={
              <SocketProvider>
                <Navbar />
                <div className="pt-16">
                  {' '}
                  {/* Add padding for sticky navbar */}
                  <ProtectedRoute />
                </div>
              </SocketProvider>
            }
          >
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              }
            />

            <Route
              path="/video"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <VideoFeed />
                </motion.div>
              }
            />
            <Route
              path="/photo"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PhotoGallery />
                </motion.div>
              }
            />
            <Route
              path="/vault"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MemoryVault />
                </motion.div>
              }
            />
            <Route
              path="/vault/:id"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MemoryDetail />
                </motion.div>
              }
            />
            <Route
              path="/memory/:id"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <StoryMemoryDetail />
                </motion.div>
              }
            />
            <Route
              path="/vault/letter/:id"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LetterDetail />
                </motion.div>
              }
            />
            <Route
              path="/stats"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <OurOrbit />
                </motion.div>
              }
            />
            <Route
              path="/hna-gallery"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <HnaGallery />
                </motion.div>
              }
            />
            <Route path="/our-memories" element={<Navigate to="/vault" replace />} />
            <Route
              path="/thanks"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <FiftyReasons />
                </motion.div>
              }
            />

            <Route
              path="/birthday"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <BirthdayPage />
                </motion.div>
              }
            />
            <Route
              path="/open-when"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <OpenWhenPage />
                </motion.div>
              }
            />
            <Route
              path="/secret-room"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SecretRoom />
                </motion.div>
              }
            />
          </Route>

          {/* Catch-all - Redirect to Dashboard if logged in, or Login if not */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
