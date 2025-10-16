import { waitUntil } from "@vercel/functions";
import { makeWebhookValidator } from "@whop/api";
import type { NextRequest } from "next/server";
import { storeWebhookEvent } from "@/lib/webhook-store";

const validateWebhook = makeWebhookValidator({
	webhookSecret: process.env.WHOP_WEBHOOK_SECRET ?? "fallback",
});

export async function POST(request: NextRequest): Promise<Response> {
	// Validate the webhook to ensure it's from Whop
	const webhookData = await validateWebhook(request);

	// Store webhook event for churn analysis
	const event = {
		type: webhookData.action as any,
		timestamp: new Date(),
		data: webhookData.data
	};

	// Handle different webhook events
	switch (webhookData.action) {
		case "payment.succeeded":
			const { id, final_amount, amount_after_fees, currency, user_id } = webhookData.data;
			
			console.log(
				`Payment ${id} succeeded for ${user_id} with amount ${final_amount} ${currency}`,
			);

			// Store event for churn analysis
			if (user_id) {
				storeWebhookEvent(user_id, event);
			}

			// if you need to do work that takes a long time, use waitUntil to run it in the background
			waitUntil(
				potentiallyLongRunningHandler(
					user_id,
					final_amount,
					currency,
					amount_after_fees,
				),
			);
			break;

		case "membership.went_invalid":
			const invalidData = webhookData.data as any;
			console.log(`Membership became invalid for user ${invalidData.user_id}`);
			
			if (invalidData.user_id) {
				storeWebhookEvent(invalidData.user_id, event);
			}
			break;

		case "membership.cancel_at_period_end_changed":
			const cancelData = webhookData.data as any;
			console.log(`Membership cancellation scheduled for user ${cancelData.user_id}`);
			
			if (cancelData.user_id) {
				storeWebhookEvent(cancelData.user_id, event);
			}
			break;

		default:
			console.log(`Webhook event: ${webhookData.action}`);
			// Store all events for potential future analysis
			const eventData = webhookData.data as any;
			if (eventData?.user_id) {
				storeWebhookEvent(eventData.user_id, event);
			}
	}

	// Make sure to return a 2xx status code quickly. Otherwise the webhook will be retried.
	return new Response("OK", { status: 200 });
}

async function potentiallyLongRunningHandler(
	_user_id: string | null | undefined,
	_amount: number,
	_currency: string,
	_amount_after_fees: number | null | undefined,
) {
	// This is a placeholder for a potentially long running operation
	// In a real scenario, you might need to fetch user data, update a database, etc.
}
