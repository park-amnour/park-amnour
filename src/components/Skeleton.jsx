import { motion } from 'framer-motion';

const Skeleton = ({ className, width, height, variant = 'rect' }) => {
  const baseStyles = "bg-black/5 animate-pulse relative overflow-hidden";
  const variants = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-md h-4 mb-2"
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height }}
    >
      <motion.div 
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-light-green/10 space-y-4">
    <Skeleton height="200px" />
    <div className="space-y-2">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="40%" />
    </div>
  </div>
);

export default Skeleton;
