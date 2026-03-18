import { motion } from 'framer-motion';

const Placeholder = ({ title }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-12 rounded-[3rem] border border-black/5 shadow-sm text-center"
  >
    <div className="w-20 h-20 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-4xl text-primary-green">🚀</span>
    </div>
    <h2 className="text-3xl font-heading font-bold text-text-dark mb-4">{title}</h2>
    <p className="text-text-dark/50 max-w-md mx-auto">
      This management interface has been moved to its own dedicated component.
    </p>
  </motion.div>
);

// All specific management pages have been moved to separate files.
// This file remains for utility components used in the admin section.
