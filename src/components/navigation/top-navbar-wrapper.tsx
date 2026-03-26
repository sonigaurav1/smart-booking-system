"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "@/components/navigation/top-navbar";
import { PATH } from "@/constants/PATH";

export default function TopNavbarWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === PATH.home;

  return !isHomePage && <TopNavbar />;
}
