import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#572864] text-white shadow-lg flex items-center justify-center z-40 hover:bg-[#6D214F] transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Plus size={24} />
    </motion.button>
  );
};

export default FloatingActionButton;