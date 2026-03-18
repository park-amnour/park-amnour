import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AttractionCard = ({ id, nameen, namehi, image, descen, deschi, desc, icon }) => {
  const { lang } = useLanguage();
  
  // Use explicit localized fields if available, otherwise fallback to 'desc'
  const displayName = lang === 'EN' ? nameen : namehi;
  const displayDesc = lang === 'EN' ? (descen || desc) : (deschi || desc);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-light-green/10 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-primary-green/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <img 
          src={image} 
          alt={nameen} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl z-20 shadow-sm text-primary-green">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-heading font-bold text-text-dark leading-tight">{displayName}</h3>
            <p className="text-sm font-body text-primary-green font-medium mt-1">{lang === 'EN' ? namehi : nameen}</p>
          </div>
        </div>
        
        <p className="text-text-dark/70 font-body text-sm line-clamp-3 mb-6 flex-grow">
          {displayDesc}
        </p>

        <Link to={`/attractions#${id}`} className="mt-auto group/btn flex items-center space-x-2 text-primary-green font-semibold font-title text-sm hover:text-accent-gold transition-colors w-fit">
          <span>{lang === 'EN' ? 'Learn More' : 'अधिक जानें'}</span>
          <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default AttractionCard;
