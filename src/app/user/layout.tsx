import type React from "react";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { userId } = await auth();
  // if (!userId) redirect("/");

  return <div className="min-h-screen p-6">{children}</div>;
}
