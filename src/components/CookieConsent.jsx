import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('amnour_cookies_accepted');
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('amnour_cookies_accepted', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          {/* Refined compact bar */}
          <div className="bg-primary-green/95 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center justify-between space-x-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-accent-gold/20 p-2.5 rounded-xl text-accent-gold shrink-0">
                  <Cookie size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-heading font-bold mb-0.5">Cookies & Privacy</h4>
                  <p className="text-white/70 text-[11px] leading-tight font-medium">
                    We use cookies to improve your experience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={handleAccept}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-text-dark font-bold py-2 px-6 rounded-xl transition-all active:scale-95 text-xs uppercase tracking-wider shadow-lg shadow-accent-gold/10"
                >
                  Accept
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-white/30 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
