import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import UniverseBackground from './universe/UniverseBackground';
import AlbumCard from './photo/AlbumCard';
import PhotoGrid from './photo/PhotoGrid';
import PhotoLightbox from './photo/PhotoLightbox';
import { fetchAlbums, fetchPhotos, Album, Photo } from '../services/api';

const PhotoGallery = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingPhotos, setFetchingPhotos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        setLoading(true);
        const fetchedAlbums = await fetchAlbums();
        setAlbums(fetchedAlbums);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching albums:', err);
        setError(err.message || 'Unable to load albums. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  const handleAlbumSelect = async (album: Album) => {
    try {
      setFetchingPhotos(true);
      const fetchedPhotos = await fetchPhotos(album.name);
      setPhotos(fetchedPhotos);
      setSelectedAlbum(album);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching photos:', err);
      setError(err.message || 'Failed to load photos for this album.');
    } finally {
      setFetchingPhotos(false);
    }
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setPhotos([]);
  };

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      <UniverseBackground />

      {/* Top Loading Progress Bar */}
      <AnimatePresence>
        {fetchingPhotos && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-soft-pink via-stardust-gold to-soft-pink z-[200] origin-left"
          >
            <motion.div 
              className="w-full h-full bg-white opacity-30 shadow-[0_0_10px_#fff]"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex items-center justify-between pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center space-x-2 bg-black bg-opacity-40 backdrop-blur-md px-4 py-2 rounded-full border border-soft-pink border-opacity-30 hover:border-opacity-100 transition-all shadow-xl"
          >
            <svg className="w-5 h-5 text-stardust-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-dancing text-soft-pink text-lg">Universe</span>
          </motion.div>
        </Link>

        <motion.h1 
          className="text-2xl md:text-3xl font-dancing text-stardust-gold text-right hidden sm:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Captured Moments
        </motion.h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-24 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {loading && !selectedAlbum ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.div 
                className="w-16 h-16 border-4 border-soft-pink border-t-stardust-gold rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="font-dancing text-soft-pink text-2xl">Unfolding our story...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 z-10"
            >
              <p className="text-romantic-red font-dancing text-3xl">{error}</p>
              <button 
                onClick={() => selectedAlbum ? handleAlbumSelect(selectedAlbum) : window.location.reload()}
                className="bg-soft-pink bg-opacity-20 hover:bg-opacity-40 text-white px-8 py-2 rounded-full transition-all border border-soft-pink font-inter text-xs tracking-widest uppercase"
              >
                Retry
              </button>
            </motion.div>
          ) : selectedAlbum ? (
            <motion.div 
              key="photo-grid" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <div className="max-w-7xl mx-auto px-6 mb-8 pt-4">
                 <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleBackToAlbums}
                  className="flex items-center space-x-2 text-soft-pink hover:text-white transition-colors group"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                  <span className="font-dancing text-xl">Back to Albums</span>
                </motion.button>
              </div>
              <PhotoGrid 
                photos={photos} 
                albumName={selectedAlbum.name} 
                onPhotoClick={(_p, index) => openLightbox(index)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="album-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center"
            >
              <div className="text-center mb-12 px-6">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-soft-pink font-dancing text-4xl m-0"
                >
                  Our Journey in Pictures
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white text-opacity-40 text-xs tracking-[0.3em] uppercase mt-2"
                >
                  Choose a chapter to explore
                </motion.p>
              </div>

              {/* 3D Flex Carousel of Albums */}
              <div className="flex flex-wrap justify-center gap-8 px-6 max-w-6xl pb-12">
                {albums.length > 0 ? (
                  albums.map((album, index) => (
                    <AlbumCard 
                      key={album.name} 
                      album={album} 
                      index={index} 
                      onClick={() => handleAlbumSelect(album)} 
                    />
                  ))
                ) : (
                  <div className="text-center space-y-4 opacity-60">
                    <p className="font-dancing text-2xl">The gallery is empty right now...</p>
                    <p className="text-xs font-inter uppercase tracking-widest">Upload photos to Cloudinary to see them here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <PhotoLightbox 
            photos={photos}
            initialIndex={activePhotoIndex}
            onClose={() => setIsLightboxOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Persistent CSS for scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default PhotoGallery;
