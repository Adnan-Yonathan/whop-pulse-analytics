'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div initial="hidden" animate="show" exit="exit" variants={pageVariants}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


