import React from 'react';
import { motion } from 'framer-motion';

export const MotionWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full max-w-4xl mx-auto p-4 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};
