'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export const MotionButton = React.forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(function MotionButton(
  { className, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={className}
      {...props}
    />
  );
});


