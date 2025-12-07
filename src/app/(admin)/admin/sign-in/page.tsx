import { redirect } from "next/navigation";

export default function AdminSignInIndex() {
  // Redirect index route to a catch-all child to ensure Clerk mounts in a catch-all route
  redirect("/admin/sign-in/start");
}
