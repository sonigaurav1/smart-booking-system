import { redirect } from "next/navigation";

export default function ClientSignInIndex() {
  // Redirect index route to a catch-all child to ensure Clerk mounts in a catch-all route
  redirect("/client/sign-in/start");
}
