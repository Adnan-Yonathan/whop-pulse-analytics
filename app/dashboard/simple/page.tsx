import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export default async function SimpleDashboardPage() {
  let user = { name: 'Demo User' };
  let userId = 'demo-user';
  
  try {
    const headersList = await headers();
    const authResult = await whopSdk.verifyUserToken(headersList);
    userId = authResult.userId;
    user = await whopSdk.users.getUser({ userId });
  } catch (error) {
    console.warn('Whop SDK error, using demo data:', error);
    // Continue with demo data if Whop SDK fails
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pulse Analytics Dashboard</h1>
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user.name || 'User'}!
          </h2>
          <p className="text-gray-300 mb-4">
            This is a simplified version of the dashboard to test the basic functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-400 mb-2">Total Members</h3>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-400 mb-2">Revenue</h3>
              <p className="text-2xl font-bold">$18,420</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-orange-400 mb-2">Engagement</h3>
              <p className="text-2xl font-bold">78.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
