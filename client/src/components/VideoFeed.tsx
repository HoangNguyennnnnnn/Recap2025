import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VideoCard from './video/VideoCard';
import UniverseBackground from './universe/UniverseBackground';
import { fetchVideos, Video } from '../services/api';

const VideoFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const fetchedVideos = await fetchVideos();
        setVideos(fetchedVideos);
        setError(null);
      } catch (err: any) {
        console.error('Error loading videos:', err);
        setError(err.message || 'Unable to load memories right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    if (videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    const elements = containerRef.current?.querySelectorAll('[data-video-item]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [videos]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-6">
        <UniverseBackground />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-soft-pink font-dancing text-4xl text-center px-6"
        >
          Gathering Memories...
        </motion.div>
        <div className="w-48 h-1 bg-soft-pink bg-opacity-20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-stardust-gold"
            animate={{ x: [-200, 200] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-6 px-6">
        <UniverseBackground />
        <div className="text-center space-y-4 z-10">
          <p className="text-soft-pink font-dancing text-3xl">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-romantic-red hover:bg-opacity-80 text-white px-6 py-2 rounded-full transition-all font-inter text-sm tracking-widest uppercase"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <UniverseBackground />
        <div className="z-10 space-y-4">
          <p className="text-soft-pink font-dancing text-4xl">Our Universe is Waiting...</p>
          <p className="text-white text-opacity-60 font-inter text-sm max-w-xs mx-auto">
            It looks like no memories have been uploaded yet. Please check 
            <code className="text-stardust-gold px-2">CLOUDINARY_SETUP.md</code> 
            to start adding our journey!
          </p>
          <Link 
            to="/"
            className="inline-block mt-4 bg-soft-pink bg-opacity-20 hover:bg-opacity-40 text-soft-pink px-8 py-3 rounded-full border border-soft-pink border-opacity-30 transition-all font-inter text-xs tracking-[0.2em] uppercase"
          >
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Background Starry Sky (Subtle) */}
      <div className="opacity-20">
        <UniverseBackground />
      </div>

      {/* Floating Back Button */}
      <Link to="/" className="fixed top-6 left-6 z-50 group">
        <motion.div
          whileHover={{ x: -5 }}
          className="flex items-center space-x-2 bg-black bg-opacity-40 backdrop-blur-md px-4 py-2 rounded-full border border-soft-pink border-opacity-30 group-hover:border-opacity-100 transition-all shadow-xl"
        >
          <svg className="w-5 h-5 text-stardust-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-dancing text-soft-pink text-lg">Universe</span>
        </motion.div>
      </Link>

      {/* Vertical Snap Scroll Feed */}
      <div 
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {videos.map((video, index) => {
          // Format date and placeholder metadata
          const videoDate = new Date(video.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div key={video.publicId} data-video-item data-index={index}>
              <VideoCard
                id={video.publicId}
                url={video.url}
                title={`Memory #${index + 1}`}
                date={videoDate}
                description="Another beautiful moment captured in our journey together. ❤️"
                likes={100 + index * 10} // Placeholder until backend supports it
                comments={5 + index} // Placeholder until backend supports it
                isActive={activeIndex === index}
              />
            </div>
          );
        })}
      </div>

      {/* Side Info Overlay (Progress Bar) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center space-y-4 opacity-50">
        <div className="w-1 h-20 bg-soft-pink bg-opacity-20 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 w-full bg-stardust-gold"
            animate={{ height: `${((activeIndex + 1) / videos.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-stardust-gold font-bold">
          {activeIndex + 1} / {videos.length}
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default VideoFeed;
