import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Waves, 
  Tent, 
  Trees, 
  Ship, 
  Baby, 
  Navigation,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { insforge } from '../lib/insforge';
import Skeleton from '../components/Skeleton';

// Map icons helper moved outside to avoid scope issues
const getIcon = (id) => {
  const iconId = String(id).toLowerCase();
  if (iconId.includes('pokhra')) return <Waves size={24} />;
  if (iconId.includes('temple')) return <Tent size={24} />;
  if (iconId.includes('park')) return <Trees size={24} />;
  if (iconId.includes('boating')) return <Ship size={24} />;
  if (iconId.includes('kids')) return <Baby size={24} />;
  return <Navigation size={24} />;
};

const AttractionSection = ({ id, nameen, namehi, descen, deschi, image, isReversed, lang }) => {
  const icon = getIcon(id);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 py-16 border-b border-primary-green/5 last:border-0`}
    >
      <div className="flex-1 w-full">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary-green/5 rounded-[3rem] blur-2xl group-hover:bg-primary-green/10 transition-colors" />
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
            <img 
              src={image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'} 
              alt={nameen} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center space-x-3 text-primary-green bg-primary-green/5 px-4 py-2 rounded-xl border border-primary-green/10">
          {icon}
          <span className="font-bold uppercase tracking-widest text-xs">FEATURE</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-dark leading-tight">
          {lang === 'EN' ? (nameen || 'Attraction') : (namehi || 'आकर्षण')}
        </h2>

        <p className="text-lg md:text-xl text-text-dark/70 font-body leading-relaxed">
          {lang === 'EN' ? (descen || 'Experience this feature.') : (deschi || 'इस सुविधा का अनुभव करें।')}
        </p>

        <div className="pt-4">
           <Link to="/visit" className="inline-flex items-center space-x-2 bg-primary-green text-white px-8 py-4 rounded-full font-bold hover:bg-primary-green/90 transition-all shadow-lg hover:-translate-y-1">
             <span>{lang === 'EN' ? 'Plan Your Visit' : 'अपनी यात्रा की योजना बनाएं'}</span>
             <ArrowRight size={20} />
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Attractions = () => {
  const { lang } = useLanguage();
  const { isLoading: isSiteLoading } = useSite();
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttractions = async () => {
    try {
      const { data, error } = await insforge.database
        .from('attractions')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (data) setAttractions(data);
    } catch (err) {
      console.error('Error fetching attractions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();

    const handleUpdate = (e) => {
      if (e.detail.type === 'attractions') {
        fetchAttractions();
      }
    };

    window.addEventListener('insforge:content_updated', handleUpdate);
    return () => window.removeEventListener('insforge:content_updated', handleUpdate);
  }, []);

  if (isLoading || isSiteLoading) {
    return (
      <div className="w-full bg-cream min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 space-y-12 text-center">
          <div className="space-y-4 flex flex-col items-center">
            <Skeleton width="300px" height="60px" />
            <Skeleton width="500px" height="20px" />
          </div>
          <div className="space-y-20 mt-20">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col md:flex-row gap-10 md:gap-20 items-center">
                <Skeleton className="flex-1 aspect-[4/3] w-full rounded-[2.5rem]" />
                <div className="flex-1 space-y-6 w-full text-left">
                  <Skeleton width="100px" height="30px" />
                  <Skeleton width="80%" height="50px" />
                  <Skeleton width="100%" height="100px" />
                  <Skeleton width="200px" height="50px" className="rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pt-8 pb-20 font-body">
      {/* Header section with background */}
      <div className="bg-primary-green/90 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-primary-green opacity-80" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/30"
          >
            <span className="text-sm font-medium tracking-wide uppercase">{lang === 'EN' ? '✨ Discover the Beauty' : '✨ सुंदरता की खोज करें'}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            {lang === 'EN' ? 'Attractions & Activities' : 'आकर्षण और गतिविधियां'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-white/90 font-body max-w-2xl"
          >
            {lang === 'EN' 
              ? 'From peaceful temples to exciting boat rides, explore everything Amnour Park has to offer.' 
              : 'शांत मंदिरों से लेकर रोमांचक नाव की सवारी तक, अविस्मरणीय यात्रा के लिए वह सब कुछ खोजें जो अमनौर पार्क में है।'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <Link to="/" className="inline-flex items-center space-x-2 text-primary-green font-bold mb-10 hover:text-accent-gold transition-colors">
          <ArrowLeft size={20} />
          <span>{lang === 'EN' ? 'Back to Home' : 'मुख्य पृष्ठ पर वापस'}</span>
        </Link>

        <div>
          {attractions.length > 0 ? attractions.map((attr, idx) => (
            <AttractionSection 
              key={attr.id} 
              {...attr} 
              isReversed={idx % 2 !== 0} 
              lang={lang} 
            />
          )) : (
            <div className="py-40 text-center">
               <p className="text-text-dark/40 font-bold">No attractions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attractions;
