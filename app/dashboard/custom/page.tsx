import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { CustomDashboardsClient } from "@/components/dashboard/CustomDashboardsClient";

export default async function CustomDashboardsPage() {
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

  return (
    <CustomDashboardsClient
      companyId="default"
      companyName="Your Company"
      userId={userId}
      userName={user.name || 'User'}
    />
  );
}