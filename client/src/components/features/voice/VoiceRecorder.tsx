import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { postVoiceNote } from '../../../services/api';

interface VoiceRecorderProps {
  onNoteSaved: () => void;
  onCancel: () => void;
}

const VoiceRecorder = ({ onNoteSaved, onCancel }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [locationName, setLocationName] = useState('My Current Echo');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // --- Visualizer Setup ---
  const startVisualizer = (stream: MediaStream) => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 64;
    source.connect(analyserRef.current);

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      animationRef.current = requestAnimationFrame(draw);
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        const colorFactor = dataArray[i] / 255;
        ctx.fillStyle = `rgba(255, 182, 193, ${0.3 + colorFactor * 0.7})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
      }
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  // --- Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualizer(stream);
      
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Universe denied microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopVisualizer();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSave = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get Location
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // 2. Mock Cloudinary Upload (Since backend needs an audioUrl)
      // In a production app, we would upload to Cloudinary signed/unsigned here.
      // For now, we simulate the upload and provide a temporary blob URL or a placeholder.
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUrl = "https://res.cloudinary.com/demo/video/upload/v1606132742/sample_audio.mp3"; 

      // 3. Save to DB
      await postVoiceNote({
        location: locationName,
        coordinates: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        },
        audioUrl: mockUrl, // Placeholder
        transcript: "A whisper from the heart...",
        date: new Date().toISOString()
      });

      onNoteSaved();
    } catch (err: any) {
      console.error('Failed to save echo:', err);
      setError(err.message || 'The signal was lost. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-deep-blue/40 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-black/80 w-full max-w-md rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden"
      >
        {/* Glow Background */}
        <div className={`absolute inset-0 bg-soft-pink/5 pointer-events-none transition-opacity duration-1000 ${isRecording ? 'opacity-100' : 'opacity-0'}`} />
        
        <header className="text-center mb-8 relative z-10">
          <div className="inline-block p-4 rounded-full bg-soft-pink text-deep-blue text-4xl mb-4 shadow-[0_0_20px_rgba(255,182,193,0.5)]">
            {isRecording ? '🎤' : '📢'}
          </div>
          <h2 className="font-dancing text-4xl text-stardust-gold">
            {isRecording ? 'Recording Whisper' : audioBlob ? 'Review Echo' : 'Whisper to the Universe'}
          </h2>
        </header>

        <div className="space-y-6 relative z-10">
          {/* Visualizer / Preview */}
          <div className="relative h-24 bg-white/5 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
            {isRecording ? (
              <canvas ref={canvasRef} width={300} height={100} className="w-full h-full" />
            ) : audioBlob ? (
              <div className="text-soft-pink font-inter text-sm flex items-center gap-2">
                <span>Echo Captured</span>
                <span className="w-2 h-2 rounded-full bg-soft-pink animate-ping" />
              </div>
            ) : (
              <p className="font-inter text-white/20 text-xs italic italic">Awaiting your voice...</p>
            )}
            
            {isRecording && (
              <div className="absolute top-2 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-xs text-red-500">{formatTime(time)}</span>
              </div>
            )}
          </div>

          {!audioBlob ? (
            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  isRecording ? 'bg-red-500 shadow-red-500/50' : 'bg-soft-pink shadow-soft-pink/50'
                }`}
              >
                <div className={isRecording ? 'w-6 h-6 bg-white rounded-sm' : 'w-6 h-6 bg-deep-blue rounded-full'} />
              </motion.button>
              <p className="mt-4 text-xs text-white/40 uppercase tracking-widest">
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/30 uppercase tracking-widest ml-2">Location Name</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Where are you? (e.g. Our Balcony)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-soft-pink/50 transition-all"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { setAudioBlob(null); setTime(0); }}
                  className="flex-1 py-3 px-6 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
                >
                  Retake
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isUploading}
                  className="flex-2 py-3 px-8 rounded-xl bg-soft-pink text-deep-blue font-bold text-sm shadow-xl hover:shadow-soft-pink/30 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-deep-blue/30 border-t-deep-blue rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : 'Save Echo'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-[10px] text-center font-inter">{error}</p>
          )}

          <button 
            onClick={onCancel}
            disabled={isRecording || isUploading}
            className="w-full text-white/20 hover:text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold py-4 transition-colors"
          >
            Cancel Echo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceRecorder;
