'use client';

import React from 'react';
import { DashboardLayout } from './DashboardLayout';

interface DashboardClientProps {
  children: React.ReactNode;
  companyId?: string;
  companyName?: string;
  userId?: string;
  userName?: string;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  children,
  companyId,
  companyName,
  userId,
  userName
}) => {
  return (
    <DashboardLayout
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={userName}
    >
      {children}
    </DashboardLayout>
  );
};
