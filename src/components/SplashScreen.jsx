import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#1A2E22] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-green/20 rounded-full blur-[100px] animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-accent-gold/30 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-6xl md:text-8xl drop-shadow-2xl"
          >
            🌿
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">
            अमनौर पार्क
          </h1>
          <p className="text-accent-gold uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mt-2">
            Amrit Sarovar
          </p>
        </motion.div>

        <div className="mt-12 flex space-x-2 items-center">
          <motion.div 
            animate={{ height: [4, 12, 4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-1.5 bg-accent-gold rounded-full"
          />
          <motion.div 
            animate={{ height: [4, 16, 4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-1.5 bg-accent-gold rounded-full"
          />
          <motion.div 
            animate={{ height: [4, 12, 4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-1.5 bg-accent-gold rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
