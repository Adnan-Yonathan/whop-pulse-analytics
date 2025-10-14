'use client';

import React from 'react';
import { PageWrapper } from '@/components/motion/PageWrapper';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>;
}


