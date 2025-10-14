import { redirect } from "next/navigation";

export default function DefaultDashboardPage() {
  // Redirect to the main dashboard
  redirect("/dashboard");
}
