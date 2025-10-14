import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Pulse Analytics - Whop Intelligence Dashboard",
	description: "Advanced analytics and intelligence dashboard for Whop communities. Track performance, predict churn, and optimize growth with deep insights.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground`}
			>
				<WhopApp>{children}</WhopApp>
			</body>
		</html>
	);
}
