import { redirect } from "next/navigation";

export default function LandingPage() {
  // Since this is a Whop-integrated app, redirect to the dashboard
  // The actual company ID will be determined by Whop's routing
  redirect("/dashboard");
}