import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UniverseBackground from '../../universe/UniverseBackground';
import { fetchVoiceNotes, IVoiceNote } from '../../../services/api';
import VoiceRecorder from './VoiceRecorder';

// ... constants and helpers stay same ...

// --- Sub-Component: Audio Player UI ---
const AudioPlayer = ({ url, isPlaying, onToggle }: { url: string; isPlaying: boolean; onToggle: () => void }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => { /* internal play error */ });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="w-full space-y-6">
      <audio 
        ref={audioRef} 
        src={url} 
        onEnded={onToggle}
        className="hidden" 
      />
      
      {/* Waveform Visualizer Mock */}
      <div className="h-16 flex items-center justify-center gap-1">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={isPlaying ? { 
              height: [10, Math.random() * 40 + 20, 10],
              opacity: [0.3, 1, 0.3]
            } : { 
              height: 4,
              opacity: 0.1
            }}
            transition={{ 
              duration: 0.5 + Math.random() * 0.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 bg-soft-pink rounded-full"
          />
        ))}
      </div>

      <button 
        onClick={onToggle}
        className="w-full py-4 bg-soft-pink/20 border border-soft-pink/40 rounded-full flex items-center justify-center gap-3 group hover:bg-soft-pink/30 transition-all"
      >
        <div className={`text-2xl transition-transform group-hover:scale-110 ${isPlaying ? 'text-soft-pink' : 'text-white'}`}>
          {isPlaying ? '⏸' : '▶'}
        </div>
        <span className="font-bold text-sm tracking-widest text-soft-pink uppercase">
          {isPlaying ? 'Pause Whisper' : 'Listen to Echo'}
        </span>
      </button>
    </div>
  );
};

// ... Earth and VoiceMarker sub-components stay same ... [OMITTED FOR BREVITY - assuming I keep them or re-adding in next chunk if needed]
// Actually, I'll provide the full component to avoid partial issues if the previous write was small.

// (Re-copying constants and helpers to ensure full file integrity as I'm replacing large block)
const EARTH_RADIUS = 2;
const EARTH_NIGHT_TEXTURE = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png';
const EARTH_NORMAL_MAP = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg';

const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const Earth = () => {
  const [nightMap, normalMap] = useLoader(THREE.TextureLoader, [EARTH_NIGHT_TEXTURE, EARTH_NORMAL_MAP]);
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial map={nightMap} normalMap={normalMap} metalness={0.4} roughness={0.7} emissive={new THREE.Color('#ffdf00')} emissiveIntensity={0.5} emissiveMap={nightMap} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.05, 64, 64]} />
        <meshBasicMaterial color="#0077ff" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

const VoiceMarker = ({ note, onClick }: { note: IVoiceNote, onClick: (n: IVoiceNote) => void }) => {
  const position = useMemo(() => latLngToVector3(note.coordinates.lat, note.coordinates.lng, EARTH_RADIUS * 1.02), [note]);
  return (
    <group position={position}>
      <mesh onClick={() => onClick(note)}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffb6c1" />
        <mesh scale={[2.5, 2.5, 2.5]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffb6c1" transparent opacity={0.3} />
        </mesh>
      </mesh>
      <Html distanceFactor={10} position={[0, 0.15, 0]}>
        <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-soft-pink/30 pointer-events-none">
          <p className="font-dancing text-soft-pink text-[10px]">{note.location}</p>
        </div>
      </Html>
    </group>
  );
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-4 w-60">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-stardust-gold" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
        <p className="font-dancing text-2xl text-stardust-gold animate-pulse text-center">Plotting Echoes... {Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

// --- Main Feature Component ---
const VoiceMap = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<IVoiceNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<IVoiceNote | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await fetchVoiceNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to load voice notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleMarkerClick = (note: IVoiceNote) => {
    setIsPlaying(false);
    setSelectedNote(note);
  };

  const onRecordComplete = () => {
    setShowRecorder(false);
    loadNotes(); // Refresh markers
  };

  return (
    <div className="relative h-screen w-full bg-deep-blue overflow-hidden">
      <UniverseBackground />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full z-10 p-6 flex flex-col items-start gap-4">
        <button 
          onClick={() => navigate('/')}
          className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 hover:border-soft-pink/50 transition-all flex items-center gap-2 group pointer-events-auto"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-dancing text-lg text-soft-pink">Universe</span>
        </button>

        <div className="pointer-events-none">
          <h1 className="font-dancing text-5xl md:text-6xl text-stardust-gold drop-shadow-lg">
            Echoes of Love
          </h1>
          <p className="font-inter text-soft-pink/60 text-sm tracking-widest uppercase">
            Voices whispered across our world
          </p>
        </div>
      </div>

      {/* Floating Action: Record */}
      <button 
        onClick={() => setShowRecorder(true)}
        className="absolute bottom-10 right-10 z-30 w-16 h-16 rounded-full bg-soft-pink text-deep-blue shadow-[0_0_20px_rgba(255,182,193,0.5)] flex items-center justify-center text-3xl hover:scale-110 active:scale-90 transition-all group"
      >
        <span className="group-hover:rotate-12 transition-transform">🎤</span>
        <div className="absolute -top-12 right-0 bg-black/40 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          <span className="font-dancing text-soft-pink text-sm">Leave a Whisper</span>
        </div>
      </button>

      {/* 3D Scene */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff8e7" />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        
        <Suspense fallback={<Loader />}>
          <Earth />
          {notes.map((note) => (
            <VoiceMarker 
              key={note._id} 
              note={note} 
              onClick={handleMarkerClick} 
            />
          ))}
        </Suspense>
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={12} autoRotate={!selectedNote} autoRotateSpeed={0.5} makeDefault />
      </Canvas>

      {/* Recorder Overlay */}
      <AnimatePresence>
        {showRecorder && (
          <VoiceRecorder onNoteSaved={onRecordComplete} onCancel={() => setShowRecorder(false)} />
        )}
      </AnimatePresence>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 h-full w-full md:w-96 bg-black/60 backdrop-blur-2xl border-l border-white/10 z-50 p-8 flex flex-col"
          >
            <button 
              onClick={() => { setSelectedNote(null); setIsPlaying(false); }}
              className="self-end p-2 text-white/40 hover:text-white"
            >
              ✕
            </button>
            
            <div className="mt-8 text-center flex-grow flex flex-col">
              <div className="text-4xl mb-6 p-6 rounded-full bg-white/5 border border-white/5 inline-block mx-auto">
                📢
              </div>
              <h2 className="font-dancing text-5xl text-stardust-gold mb-2">
                {selectedNote.location}
              </h2>
              <p className="text-soft-pink text-xs uppercase tracking-[0.3em] font-bold mb-12 opacity-60">
                {new Date(selectedNote.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 relative overflow-hidden group mb-12">
                <div className="absolute top-0 left-0 w-1 h-full bg-soft-pink/40" />
                <p className="text-white/80 font-inter leading-relaxed italic text-lg">
                  "{selectedNote.transcript || 'Transcribing our love echoes...'}"
                </p>
              </div>
              
              <AudioPlayer 
                url={selectedNote.audioUrl} 
                isPlaying={isPlaying} 
                onToggle={() => setIsPlaying(!isPlaying)} 
              />
            </div>

            <p className="text-[10px] text-white/20 text-center uppercase tracking-widest mt-12">
              Distance should never silence our hearts
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceMap;
