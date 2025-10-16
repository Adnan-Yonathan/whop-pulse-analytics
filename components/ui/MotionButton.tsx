'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Slot } from "@radix-ui/react-slot";

interface MotionButtonProps extends HTMLMotionProps<'button'> {
  asChild?: boolean;
}

export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(function MotionButton(
  { className, asChild = false, whileHover, whileTap, transition, ...props },
  ref
) {
  if (asChild) {
    // Filter out motion-specific props for Slot
    const { children, onClick, disabled, type, ...slotProps } = props as any;
    return (
      <Slot
        ref={ref}
        className={className}
        {...slotProps}
      >
        {children}
      </Slot>
    );
  }
  
  return (
    <motion.button
      ref={ref}
      whileHover={whileHover || { scale: 1.02 }}
      whileTap={whileTap || { scale: 0.98 }}
      transition={transition || { duration: 0.15, ease: 'easeOut' }}
      className={className}
      {...props}
    />
  );
});


