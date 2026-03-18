import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();

  const navLinks = [
    { name: lang === 'EN' ? 'Home' : 'मुख्य पृष्ठ', path: '/' },
    { name: lang === 'EN' ? 'Attractions' : 'आकर्षण', path: '/attractions' },
    { name: lang === 'EN' ? 'Visit Info' : 'यात्रा जानकारी', path: '/visit' },
    { name: lang === 'EN' ? 'Gallery' : 'गैलरी', path: '/gallery' },
    { name: lang === 'EN' ? 'Location' : 'स्थान', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-primary-green/95 backdrop-blur-sm text-text-light shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Title */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-2xl text-light-green">🌿</span>
            <div className="flex flex-col">
              <span className="font-hindi-hero text-xl leading-tight font-bold">अमनौर पार्क</span>
              <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider">Amrit Sarovar</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                className={({isActive}) => 
                  `font-title text-sm transition-colors hover:text-light-green ${isActive ? 'text-accent-gold font-semibold' : 'text-text-light/90'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4 shrink-0">
            <button 
              onClick={toggleLang}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-sm font-medium transition"
            >
              {lang === 'EN' ? 'हिंदी' : 'EN'}
            </button>
            <a href="https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar" target="_blank" rel="noreferrer" className="flex items-center space-x-1 bg-accent-gold hover:bg-accent-gold/90 text-text-dark px-4 py-1.5 rounded-full text-sm font-semibold transition">
              <MapPin size={16} />
              <span>{lang === 'EN' ? 'Directions' : 'रास्ता देखें'}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
             <button 
              onClick={toggleLang}
              className="bg-white/10 hover:bg-white/20 px-2 py-1 flex items-center justify-center rounded-full text-xs font-medium transition"
            >
              {lang === 'EN' ? 'HI' : 'EN'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-light hover:text-white focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-green overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({isActive}) => 
                    `block px-3 py-2 rounded-md font-title text-base transition-colors ${isActive ? 'bg-light-green/20 text-accent-gold' : 'text-text-light/90 hover:bg-white/5'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <a href="https://maps.google.com/?q=Amnour+Park+Amrit+Sarovar" target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center space-x-2 bg-accent-gold text-text-dark w-full px-4 py-3 rounded-xl text-base font-semibold">
                <MapPin size={18} />
                <span>Get Directions</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
