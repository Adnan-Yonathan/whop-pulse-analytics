import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { EngagementHeatmapsClient } from "@/components/dashboard/EngagementHeatmapsClient";

export default async function EngagementHeatmapsPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  
  try {
    const headersList = await headers();
    const authResult = await whopSdk.verifyUserToken(headersList);
    userId = authResult.userId;
    const whopUser = await whopSdk.users.getUser({ userId });
    user = { name: whopUser.name || 'User' };
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
  }

  // Mock engagement heatmap data
  const timeData = [
    { hour: '00:00', activity: 12, intensity: 'low' },
    { hour: '01:00', activity: 8, intensity: 'low' },
    { hour: '02:00', activity: 5, intensity: 'low' },
    { hour: '03:00', activity: 3, intensity: 'low' },
    { hour: '04:00', activity: 7, intensity: 'low' },
    { hour: '05:00', activity: 15, intensity: 'low' },
    { hour: '06:00', activity: 45, intensity: 'medium' },
    { hour: '07:00', activity: 78, intensity: 'medium' },
    { hour: '08:00', activity: 120, intensity: 'high' },
    { hour: '09:00', activity: 156, intensity: 'high' },
    { hour: '10:00', activity: 134, intensity: 'high' },
    { hour: '11:00', activity: 98, intensity: 'medium' },
    { hour: '12:00', activity: 87, intensity: 'medium' },
    { hour: '13:00', activity: 76, intensity: 'medium' },
    { hour: '14:00', activity: 145, intensity: 'high' },
    { hour: '15:00', activity: 167, intensity: 'high' },
    { hour: '16:00', activity: 189, intensity: 'high' },
    { hour: '17:00', activity: 134, intensity: 'high' },
    { hour: '18:00', activity: 98, intensity: 'medium' },
    { hour: '19:00', activity: 76, intensity: 'medium' },
    { hour: '20:00', activity: 89, intensity: 'medium' },
    { hour: '21:00', activity: 67, intensity: 'medium' },
    { hour: '22:00', activity: 45, intensity: 'medium' },
    { hour: '23:00', activity: 23, intensity: 'low' }
  ];

  const dayData = [
    { day: 'Monday', activity: 1456, intensity: 'high' },
    { day: 'Tuesday', activity: 1678, intensity: 'high' },
    { day: 'Wednesday', activity: 1890, intensity: 'high' },
    { day: 'Thursday', activity: 1234, intensity: 'medium' },
    { day: 'Friday', activity: 1567, intensity: 'high' },
    { day: 'Saturday', activity: 890, intensity: 'low' },
    { day: 'Sunday', activity: 567, intensity: 'low' }
  ];

  const deviceData = [
    { device: 'Desktop', users: 456, percentage: 45.2, avgSession: 24.5 },
    { device: 'Mobile', users: 389, percentage: 38.5, avgSession: 12.3 },
    { device: 'Tablet', users: 123, percentage: 12.2, avgSession: 18.7 },
    { device: 'Other', users: 42, percentage: 4.1, avgSession: 8.9 }
  ];

  const locationData = [
    { country: 'United States', users: 456, percentage: 45.2 },
    { country: 'United Kingdom', users: 123, percentage: 12.2 },
    { country: 'Canada', users: 89, percentage: 8.8 },
    { country: 'Australia', users: 67, percentage: 6.6 },
    { country: 'Germany', users: 45, percentage: 4.5 },
    { country: 'Other', users: 230, percentage: 22.7 }
  ];

  return (
    <EngagementHeatmapsClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
      timeData={timeData}
      dayData={dayData}
      deviceData={deviceData}
      locationData={locationData}
    />
  );
}
