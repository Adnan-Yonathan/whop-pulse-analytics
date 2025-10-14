import type { Variants, Transition } from 'framer-motion';

export const transitionFast: Transition = { duration: 0.3, ease: 'easeOut' };

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: transitionFast },
  exit: { opacity: 0, y: 8, transition: transitionFast },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: transitionFast },
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: transitionFast },
};

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 12, x: 12 },
  show: { opacity: 1, y: 0, x: 0, transition: transitionFast },
  exit: { opacity: 0, y: 12, x: 12, transition: transitionFast },
};


