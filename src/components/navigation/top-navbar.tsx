"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PATH } from "@/constants/PATH";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut, ShoppingBag, BookOpen } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    router.push(PATH.home);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={PATH.home}
          className="flex items-center gap-2 font-bold text-lg"
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white">
            B
          </div>
          <span className="text-foreground">BookHub</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={PATH.shopAll}
            className={`text-sm font-medium transition-colors ${
              isActive(PATH.shopAll)
                ? "text-purple-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Browse Services
          </Link>
          {isSignedIn && (
            <Link
              href={PATH.user.bookings}
              className={`text-sm font-medium transition-colors ${
                isActive(PATH.user.bookings)
                  ? "text-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Bookings
            </Link>
          )}
        </div>

        {/* Right Side - Auth/User Menu */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">
                    {user?.firstName || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-foreground">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={PATH.user.bookings}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={PATH.shopAll} className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Browse Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={PATH.user.profile}
                    className="flex items-center gap-2"
                  >
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Icon (for future mobile menu) */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
}
