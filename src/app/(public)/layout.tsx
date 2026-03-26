import TopNavbarWrapper from "@/components/navigation/top-navbar-wrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNavbarWrapper />
      {children}
    </>
  );
}
