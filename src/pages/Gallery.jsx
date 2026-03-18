import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Camera, 
  Search, 
  Layout, 
  Maximize2,
  X,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { insforge } from '../lib/insforge';
import Skeleton from '../components/Skeleton';

const Gallery = () => {
  const { lang } = useLanguage();
  const { isLoading: isSiteLoading } = useSite();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await insforge.database
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) setImages(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();

    const handleUpdate = (e) => {
      if (e.detail.type === 'gallery') {
        console.log('Re-fetching gallery due to update');
        fetchGallery();
      }
    };

    window.addEventListener('insforge:content_updated', handleUpdate);
    return () => window.removeEventListener('insforge:content_updated', handleUpdate);
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.categoryen).filter(cat => cat !== 'All' && cat))];

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.categoryen === filter);

  if (isLoading || isSiteLoading) {
    return (
      <div className="w-full bg-cream min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 flex flex-col items-center">
            <Skeleton width="300px" height="60px" />
            <div className="flex space-x-4">
              <Skeleton width="100px" height="40px" className="rounded-full" />
              <Skeleton width="100px" height="40px" className="rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="aspect-square rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-cream min-h-screen">
      {/* Header section */}
      <div className="bg-primary-green pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          >
            <Camera size={18} className="text-light-green" />
            <span className="text-sm font-bold text-white uppercase tracking-widest">
              {lang === 'EN' ? 'Photo Gallery' : 'फोटो गैलरी'}
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white">
            {lang === 'EN' ? 'Moments at Amnour' : 'अमनौर के कुछ पल'}
          </h1>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  filter === cat 
                  ? 'bg-white text-primary-green shadow-lg scale-105' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat === 'All' ? (lang === 'EN' ? 'All' : 'सब') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link to="/" className="inline-flex items-center space-x-2 text-primary-green font-bold mb-10 hover:translate-x-[-4px] transition-transform">
          <ArrowLeft size={20} />
          <span>{lang === 'EN' ? 'Back to Home' : 'मुख्य पृष्ठ'}</span>
        </Link>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedImage(img)}
                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all border border-black/5"
              >
                <img 
                  src={img.url} 
                  alt="" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary-green/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/90 p-3 rounded-2xl scale-0 group-hover:scale-100 transition-transform delay-75 shadow-xl">
                    <Maximize2 size={24} className="text-primary-green" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-4 rounded-3xl backdrop-blur-md">
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-5xl w-full aspect-video md:aspect-auto md:h-[80vh] rounded-[3rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImage.url} className="w-full h-full object-contain" alt="" />
            </motion.div>
            <div className="mt-8 text-center text-white space-y-2">
              <p className="font-heading text-2xl font-bold">{selectedImage.categoryen}</p>
              <p className="text-white/60 font-body">{selectedImage.categoryhi}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
