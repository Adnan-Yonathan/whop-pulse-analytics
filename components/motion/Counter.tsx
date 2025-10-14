'use client';

import React, { useEffect } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';

export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const mv = useMotionValue(0);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.35, ease: 'easeOut' });
    return () => controls.stop();
  }, [value]);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  return <span>{prefix}{rounded.get()}{suffix}</span>;
}


