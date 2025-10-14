import { WhopServerSdk } from "@whop/api";

const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID;
const appApiKey = process.env.WHOP_API_KEY;

// Avoid initializing the SDK during build if env vars are missing (e.g., on static routes like /_not-found)
export const whopSdk = appId && appApiKey
	? WhopServerSdk({
		appId,
		appApiKey,
		onBehalfOfUserId: process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID,
		companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID,
	})
	: {
		// Minimal safe stubs for local/build environments without Whop envs
		async verifyUserToken() {
			throw new Error("Whop SDK not configured");
		},
		users: {
			async getUser() {
				return { name: null } as any;
			},
		},
	};
