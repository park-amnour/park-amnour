import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Clock,
  Waves,
  Camera,
  Heart,
  Star,
  Tent,
  Wind,
  Compass,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Play,
  Navigation
} from 'lucide-react';
import { insforge } from '../lib/insforge';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import InfoStrip from '../components/InfoStrip';
import AttractionCard from '../components/AttractionCard';
import FeedbackComponent from '../components/FeedbackComponent';
import SplashScreen from '../components/SplashScreen';

const getIcon = (id) => {
  switch(id) {
    case '11111111-1111-1111-1111-111111111111': return <Waves size={24} />; // Lake
    case '22222222-2222-2222-2222-222222222222': return <Waves size={24} />; // Boating
    case '33333333-3333-3333-3333-333333333333': return <Sparkles size={24} />; // Kids
    case '44444444-4444-4444-4444-444444444444': return <Wind size={24} />; // Sunset
    case '55555555-5555-5555-5555-555555555555': return <Sparkles size={24} />; // Garden
    case '66666666-6666-6666-6666-666666666666': return <Compass size={24} />; // Nature Trail
    case '77777777-7777-7777-7777-777777777777': return <Star size={24} />; // Picnic Deck
    default: return <Navigation size={24} />;
  }
};

const Home = () => {
  const { lang } = useLanguage();
  const { stats, isLoading: isSiteLoading } = useSite();
  const [heroData, setHeroData] = useState({
    titleEn: 'Amnour Park',
    titleHi: 'अमनौर पार्क',
    descEn: 'Experience the beauty of Amrit Sarovar.',
    descHi: 'अमृत सरोवर की खूबसूरती का अनुभव करें।',
    videoUrl: 'https://v1.covered.ai/covered-media/drone_park.mp4'
  });
  const [attractions, setAttractions] = useState([]);
  const [pricing, setPricing] = useState({
    dayEntry: 10,
    eveningEntry: 25,
    boating2p: 50,
    boating4p: 100,
    parkingBike: 10,
    parkingCycle: 0,
    entryFree: false,
    boatingFree: false,
    parkingFree: false,
    festivalName: '',
    festivalUntil: ''
  });
  const [reach, setReach] = useState({
    timingsEn: '7:00 AM – 9:00 PM',
    timingsHi: '7:00 AM – 9:00 PM',
    locationEn: 'Amnour, Saran, Bihar',
    locationHi: 'अमनौर, सारण, बिहार',
    distChhapraEn: '~31 km',
    distChhapraHi: '~31 किमी',
    distPatnaEn: '~52 km',
    distPatnaHi: '~52 किमी',
    mapUrl: 'https://maps.google.com/?q=Amnour+Park'
  });
  const [seo, setSeo] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [settingsRes, attrRes, galleryRes] = await Promise.all([
        insforge.database.from('site_settings').select('key, data').in('key', ['hero', 'pricing', 'reach', 'seo']),
        insforge.database.from('attractions').select('*').order('order_index', { ascending: true }),
        insforge.database.from('gallery').select('*').order('created_at', { ascending: false }).limit(6)
      ]);

      if (settingsRes?.data) {
        settingsRes.data.forEach(item => {
          if (item.key === 'hero') setHeroData(item.data);
          if (item.key === 'pricing') setPricing(item.data);
          if (item.key === 'reach') setReach(item.data);
          if (item.key === 'seo') {
            setSeo(item.data);
            if (item.data?.siteTitle) {
              document.title = item.data.siteTitle;
            }
          }
        });
      }

      if (attrRes?.data) setAttractions(attrRes.data);
      if (galleryRes?.data) setGallery(galleryRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = (e) => {
      const { type } = e.detail;
      if (['hero', 'pricing', 'reach', 'attractions', 'seo', 'gallery'].includes(type)) {
        fetchData();
      }
    };

    window.addEventListener('insforge:content_updated', handleUpdate);
    return () => window.removeEventListener('insforge:content_updated', handleUpdate);
  }, []);

  // Removed early return for animation transition

  return (
    <AnimatePresence mode="wait">
      {(isLoading || isSiteLoading) ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-cream min-h-screen font-body text-text-dark"
        >
          {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary-green">
          {heroData.videoUrl?.match(/\.(mp4|webm|ogg)$/i) || heroData.videoUrl?.includes('hero/videos') ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              key={heroData.videoUrl}
              className="w-full h-full object-cover opacity-90 scale-105"
            >
              <source src={heroData.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={heroData.videoUrl} 
              alt="Amnour Park" 
              fetchpriority="high"
              loading="eager"
              className="w-full h-full object-cover opacity-90 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-green/20 via-transparent to-cream z-10" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium px-4 py-1.5 rounded-full text-sm inline-flex items-center space-x-2 shadow-lg">
              <span>🌿</span>
              <span>{lang === 'EN' ? 'Amrit Sarovar, Bihar' : 'अमृत सरोवर, बिहार'}</span>
            </div>
            <div className="bg-accent-gold/20 backdrop-blur-md border border-accent-gold/40 text-accent-gold font-bold px-4 py-1.5 rounded-full text-sm inline-flex items-center space-x-2 shadow-lg">
              <span>❤️</span>
              <span>{lang === 'EN' ? 'Best Place for Couples' : 'कपल्स के लिए सबसे अच्छी जगह'}</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 drop-shadow-md text-balance"
          >
            {lang === 'EN' ? heroData.titleEn : heroData.titleHi}
          </motion.h1>
          <motion.h2 className="text-2xl md:text-3xl font-heading font-semibold text-accent-gold mb-6 drop-shadow-sm italic">
            {lang === 'EN' ? 'The Pride of Saran' : 'सारण की शान'}
          </motion.h2>
          <motion.p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-body drop-shadow">
            {lang === 'EN' ? heroData.descEn : heroData.descHi}
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
            <Link to="/visit" className="w-full sm:w-auto bg-accent-gold hover:bg-accent-gold/90 text-text-dark px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2">
              <span>{lang === 'EN' ? 'Plan Your Visit' : 'अपनी यात्रा की योजना बनाएं'}</span>
              <ArrowRight size={20} />
            </Link>
            <a href={reach.mapUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-transparent border-2 border-white/60 hover:bg-white/10 text-white backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center space-x-2 hover:-translate-y-1">
              <span>{lang === 'EN' ? '📍 Get Directions' : '📍 रास्ता देखें'}</span>
            </a>
          </motion.div>
        </div>
      </section>

      <InfoStrip />

      {/* Attractions Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-green mb-3">
            {lang === 'EN' ? 'Explore Our Attractions' : 'हमारे आकर्षण देखें'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {attractions.slice(0, 3).map((item, index) => (
            <AttractionCard 
              key={item.id}
              {...item}
              icon={getIcon(item.id)}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/attractions" className="inline-flex items-center space-x-2 border-b-2 border-accent-gold pb-1 text-primary-green font-bold hover:text-accent-gold transition-colors text-lg">
            <span>{lang === 'EN' ? 'View All Details' : 'सभी विवरण देखें'}</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-primary-green/5 border-y border-primary-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-green mb-3">
              {lang === 'EN' ? 'Affordable for Everyone' : 'सबके लिए किफायती'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingCard title={lang === 'EN' ? 'Day Entry' : 'प्रवेश (दिन)'} price={pricing.entryFree ? 'FREE' : pricing.dayEntry} icon="🌞" timing={reach.timingsEn.split(',')[0]} isFree={pricing.entryFree} />
            <PricingCard title={lang === 'EN' ? 'Evening Entry' : 'प्रवेश (शाम)'} price={pricing.entryFree ? 'FREE' : pricing.eveningEntry} icon="🌙" timing="After 5:00 PM" premium isFree={pricing.entryFree} />
            
            <motion.div className="bg-white text-text-dark rounded-3xl p-8 shadow-lg border border-primary-green/10 relative overflow-hidden">
              {pricing.boatingFree && (
                <div className="absolute top-0 right-0 bg-accent-gold text-text-dark font-bold text-[10px] px-4 py-1 -mr-4 mt-2 rotate-45 shadow-sm">
                  FREE
                </div>
              )}
              <div className="text-2xl mb-4">🚣</div>
              <h3 className="text-xl font-bold mb-1">{lang === 'EN' ? 'Boating' : 'नौका विहार'}</h3>
              <p className="text-text-dark/60 text-xs mb-6">{pricing.boatingDuration || 20} {lang === 'EN' ? 'mins ride' : 'मिनट की राइड'}</p>
              
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center border-b border-black/5 pb-2">
                  <span className="text-sm font-medium">{lang === 'EN' ? '2 Persons' : '2 व्यक्ति'}</span>
                  {pricing.boatingFree ? (
                    <span className="font-bold text-emerald-500">FREE</span>
                  ) : (
                    <span className="font-bold text-primary-green">₹{pricing.boating2p}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{lang === 'EN' ? '4 Persons' : '4 व्यक्ति'}</span>
                  {pricing.boatingFree ? (
                    <span className="font-bold text-emerald-500">FREE</span>
                  ) : (
                    <span className="font-bold text-primary-green">₹{pricing.boating4p}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-sm text-text-dark/60 font-body">
            <div className={`bg-white px-6 py-3 rounded-full border border-black/5 shadow-sm ${pricing.parkingFree ? 'ring-2 ring-emerald-400 bg-emerald-50' : ''}`}>
              <span className="font-semibold text-text-dark">Parking:</span> Bike ({pricing.parkingFree ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${pricing.parkingBike}`})  •  Cycle (<span className="text-emerald-600 font-bold">FREE</span>)
            </div>
            
            {(pricing.entryFree || pricing.boatingFree || pricing.parkingFree) && pricing.festivalName && (
              <div className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-500/20 text-center animate-pulse">
                <div className="text-xl mb-1">🎊 {pricing.festivalName} {lang === 'EN' ? 'Special Offer!' : 'खास ऑफर!'} 🎊</div>
                {pricing.festivalUntil && <div className="text-sm font-medium text-white/90">Valid {lang === 'EN' ? 'Until' : 'तक'}: {pricing.festivalUntil}</div>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rules & Guidelines Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-red-500/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-green mb-2">
                  {lang === 'EN' ? 'Rules & Guidelines' : 'पार्क के नियम और दिशा-निर्देश'}
                </h2>
                <p className="text-text-dark/50 text-sm">{lang === 'EN' ? 'Ensuring a safe and beautiful experience for everyone' : 'सभी के लिए एक सुरक्षित और सुंदर अनुभव सुनिश्चित करना'}</p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center space-x-3">
                <span className="text-xl">🛡️</span>
                <span className="font-bold text-sm">{lang === 'EN' ? 'Safety & Privacy Guaranteed' : 'सुरक्षा और प्राइवेसी की गारंटी'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <RuleItem 
                icon="📸" 
                title={lang === 'EN' ? 'Strictly Prohibited' : 'सख्त मनाही व जुर्माना'} 
                desc={lang === 'EN' 
                  ? 'Taking photos or videos of couples is strictly prohibited. Violators will face a ₹500 fine and strict action under CCTV surveillance.' 
                  : 'कपल्स की फोटो या वीडियो खींचना सख्त मना है। पकड़े जाने पर डिवाइस जब्त कर ₹500 का जुर्माना और सख्त कार्रवाई की जाएगी। पूरा पार्क CCTV की निगरानी में है।'} 
              />
              <RuleItem 
                icon="🌸" 
                title={lang === 'EN' ? 'Protect Nature' : 'प्रकृति की रक्षा'} 
                desc={lang === 'EN' ? 'Plucking flowers or damaging plants is a punishable offense. Fine: ₹500.' : 'फूल तोड़ना या पौधों को नुकसान पहुँचाना दंडनीय अपराध है। जुर्माना: ₹500।'} 
                alert
              />
              <RuleItem 
                icon="🚫" 
                title={lang === 'EN' ? 'Pond Safety' : 'पोखरा सुरक्षा'} 
                desc={lang === 'EN' ? 'Bathing in the Amrit Sarovar is strictly prohibited. Fine: ₹500.' : 'अमृत सरोवर में नहाना सख्त मना है। जुर्माना: ₹500।'} 
                alert
              />
              <RuleItem 
                icon="🚭" 
                title={lang === 'EN' ? 'No Smoking' : 'धूम्रपान निषेध'} 
                desc={lang === 'EN' ? 'Smoking and any type of intoxicant/drugs are strictly prohibited in the park premises.' : 'पार्क परिसर में धूम्रपान और किसी भी प्रकार के नशीले पदार्थों का उपयोग सख्त मना है।'} 
              />
              <RuleItem 
                icon="📹" 
                title={lang === 'EN' ? 'CCTV Surveillance' : 'CCTV निगरानी'} 
                desc={lang === 'EN' ? 'The entire park is under 24/7 CCTV surveillance for your safety.' : 'आपकी सुरक्षा के लिए पूरा पार्क 24/7 CCTV कैमरों की निगरानी में है।'} 
              />
              <RuleItem 
                icon="✨" 
                title={lang === 'EN' ? 'Cleanliness' : 'स्वच्छता'} 
                desc={lang === 'EN' ? 'Please use dustbins for all waste. Help us keep Amnour Park beautiful.' : 'कृपया सभी कचरे के लिए डस्टबिन का उपयोग करें। अमनौर पार्क को सुंदर रखने में हमारी मदद करें।'} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-green mb-2">
              {lang === 'EN' ? 'Moments at Amnour Park' : 'अमनौर पार्क के पल'}
            </h2>
          </div>
          <Link to="/gallery" className="bg-primary-green hover:bg-primary-green/90 text-white px-6 py-3 rounded-xl font-medium shadow-md text-sm flex items-center space-x-2">
            <span>{lang === 'EN' ? 'View All Photos' : 'सभी फोटो देखें'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[400px] md:h-[500px]">
          {gallery.length > 0 ? (
            <>
              {/* Main Large Image */}
              {gallery[0] && (
                <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden group shadow-xl">
                  <img src={gallery[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                </div>
              )}
              
              {/* Secondary Images */}
              <div className="rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg">
                <img src={gallery[1]?.url || gallery[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              </div>
              
              <div className="rounded-2xl md:rounded-3xl overflow-hidden group border-4 border-white shadow-lg">
                <img src={gallery[2]?.url || gallery[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
              </div>

              {gallery[3] && (
                <div className="col-span-2 rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg">
                  <img src={gallery[3].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full h-full flex items-center justify-center bg-white/50 rounded-3xl border-2 border-dashed border-primary-green/20">
               <p className="text-primary-green/60 font-medium italic">Photos appearing soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Visitor Feedback */}
      <FeedbackComponent />

      {/* How to Reach */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-light-green/10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-primary-green mb-2">{lang === 'EN' ? 'Easy to Reach' : 'पहुँचना आसान है'}</h2>
            <div className="space-y-4">
               <ReachItem icon={<MapPin size={18} />} title={lang === 'EN' ? 'From Chhapra' : 'छपरा से'} desc={lang === 'EN' ? reach.distChhapraEn : reach.distChhapraHi} />
               <ReachItem icon={<MapPin size={18} />} title={lang === 'EN' ? 'From Patna' : 'पटना से'} desc={lang === 'EN' ? reach.distPatnaEn : reach.distPatnaHi} />
            </div>
            <a href={reach.mapUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 bg-primary-green text-white px-6 py-3 rounded-xl font-medium shadow-md text-sm">
              {lang === 'EN' ? 'View Map' : 'नक्शा देखें'}
            </a>
          </div>

          <div className="flex-1 w-full bg-cream rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px]">
             <MapPin size={32} className="text-accent-gold mb-4" />
             <h3 className="font-heading font-bold text-xl text-primary-green mb-1">Amnour Park</h3>
             <p className="text-text-dark/70 text-sm text-center">{lang === 'EN' ? reach.locationEn : reach.locationHi}</p>
          </div>
        </div>
      </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PricingCard = ({ title, price, icon, timing, premium, isFree }) => (
  <motion.div className={`${premium ? 'bg-primary-green text-white scale-105' : 'bg-white text-text-dark'} rounded-3xl p-8 shadow-lg border border-primary-green/10 relative overflow-hidden`}>
    {isFree && (
      <div className="absolute top-0 right-0 bg-accent-gold text-text-dark font-bold text-[10px] px-4 py-1 -mr-4 mt-2 rotate-45 shadow-sm">
        FREE
      </div>
    )}
    <div className="text-2xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-1">{title}</h3>
    <p className={`${premium ? 'text-white/60' : 'text-text-dark/60'} text-xs mb-6`}>{timing}</p>
    <div className="flex items-baseline space-x-1 mb-4">
      {isFree ? (
        <span className={`text-4xl font-bold text-emerald-500 uppercase`}>FREE</span>
      ) : (
        <>
          <span className={`text-4xl font-bold ${premium ? 'text-accent-gold' : 'text-primary-green'}`}>₹{price}</span>
          <span className="text-xs opacity-50">/person</span>
        </>
      )}
    </div>
  </motion.div>
);

const RuleItem = ({ icon, title, desc, alert }) => (
  <div className={`p-6 rounded-2xl border transition-all ${alert ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30' : 'bg-cream/40 border-black/5 hover:border-primary-green/30'}`}>
    <div className="text-2xl mb-4">{icon}</div>
    <h4 className={`font-bold mb-2 ${alert ? 'text-red-600' : 'text-text-dark'}`}>{title}</h4>
    <p className="text-xs text-text-dark/60 leading-relaxed font-body">{desc}</p>
  </div>
);

const ReachItem = ({ icon, title, desc }) => (
  <div className="flex items-start space-x-3">
    <div className="bg-light-green/10 p-2 rounded-lg text-primary-green">{icon}</div>
    <div>
      <h4 className="font-bold text-text-dark text-sm">{title}</h4>
      <p className="text-xs text-text-dark/60">{desc}</p>
    </div>
  </div>
);

export default Home;
