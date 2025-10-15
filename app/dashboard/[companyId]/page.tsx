import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { PulseAnalyticsDashboard } from "@/components/analytics/PulseAnalyticsDashboard";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The companyId is a path param
	const { companyId } = await params;

	// The user token is in the headers
	let userId = 'demo-user';
	let user = { name: 'Demo User' } as any;
	let company = { title: 'Demo Company' } as any;
	let isDemoMode = false;

	try {
		const verified = await (whopSdk as any).verifyUserToken(headersList);
		userId = verified.userId;
		const result = await (whopSdk as any).access.checkIfUserHasAccessToCompany({ userId, companyId });
		user = await (whopSdk as any).users.getUser({ userId });
		company = await (whopSdk as any).companies.getCompany({ companyId });
		
		// If user doesn't have admin access, enable demo mode instead of blocking
		if (!result.hasAccess || result.accessLevel !== 'admin') {
			isDemoMode = true;
		}
	} catch (error) {
		console.warn('Whop SDK error, using demo mode:', error);
		isDemoMode = true;
	}

	return (
		<PulseAnalyticsDashboard 
			companyId={companyId}
			companyName={company.title}
			userId={userId}
			userName={user.name || 'User'}
			isDemoMode={isDemoMode}
		/>
	);
}
