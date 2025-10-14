import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { EngagementHeatmapsClient } from "@/components/dashboard/EngagementHeatmapsClient";
import { getEngagementHeatmapData } from "@/lib/analytics-data";

export const dynamic = 'force-dynamic';

export default async function EngagementHeatmapsPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  let companyId = 'default';
  let companyName = 'Your Company';
  
  try {
    const headersList = await headers();
    const authResult = await (whopSdk as any).verifyUserToken(headersList);
    userId = authResult.userId;
    const whopUser = await (whopSdk as any).users.getUser({ userId });
    user = { name: whopUser.name || 'User' };
    
    companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || 'default';
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
  }

  // Fetch real engagement heatmap data
  let timeData: any[] = [];
  let dayData: any[] = [];
  let deviceData: any[] = [];
  let locationData: any[] = [];

  try {
    const data = await getEngagementHeatmapData(companyId);
    
    // Map hourly data
    timeData = data.byHour.map((activity: number, index: number) => ({
      hour: `${String(index).padStart(2, '0')}:00`,
      activity,
      intensity: activity > 100 ? 'high' : activity > 50 ? 'medium' : 'low'
    }));

    // Map daily data
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayData = data.byDay.map((activity: number, index: number) => ({
      day: days[index],
      activity,
      intensity: activity > 1000 ? 'high' : activity > 500 ? 'medium' : 'low'
    }));

    // Placeholder for device and location data (not available from SDK)
    deviceData = [];
    locationData = [];
  } catch (error) {
    console.error('Failed to fetch engagement heatmap data:', error);
  }

  return (
    <EngagementHeatmapsClient
      companyId={companyId}
      companyName={companyName}
      userId={userId}
      userName={user.name || 'User'}
      timeData={timeData}
      dayData={dayData}
      deviceData={deviceData}
      locationData={locationData}
    />
  );
}
