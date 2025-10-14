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
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const result = await whopSdk.access.checkIfUserHasAccessToCompany({
		userId,
		companyId,
	});

	const user = await whopSdk.users.getUser({ userId });
	const company = await whopSdk.companies.getCompany({ companyId });

	// Either: 'admin' | 'no_access';
	// 'admin' means the user is an admin of the company, such as an owner or moderator
	// 'no_access' means the user is not an authorized member of the company
	const { accessLevel } = result;

	// Check if user has access to view analytics
	if (!result.hasAccess || accessLevel !== 'admin') {
		return (
			<div className="flex justify-center items-center h-screen px-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
					<p className="text-gray-600">
						You need admin access to view Pulse Analytics for {company.title}
					</p>
				</div>
			</div>
		);
	}

	return (
		<PulseAnalyticsDashboard 
			companyId={companyId}
			companyName={company.title}
			userId={userId}
			userName={user.name || 'User'}
		/>
	);
}
