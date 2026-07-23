'use client'

import { checkUser } from "@/lib/checkUser";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShieldCheck, Stethoscope, Calendar, User as UserIcon, CreditCard, Menu, X } from "lucide-react";
import { User } from "@/lib/generated/prisma";
import { Badge } from "./ui/badge";
import Logo from '@/assets/Logo.png';
import { ThemeToggle, ThemeToggleMobile } from "./theme-toggle";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await checkUser();
      if (!('error' in response)) {
        setUser(response);
      }
    };
    fetchUser();
  }, []);

  const navLink = user?.role === "ADMIN"
    ? { href: "/admin", label: "Admin Dashboard", icon: ShieldCheck }
    : user?.role === "DOCTOR"
    ? { href: "/doctor", label: "Doctor Dashboard", icon: Stethoscope }
    : user?.role === "PATIENT"
    ? { href: "/appointments", label: "My Appointments", icon: Calendar }
    : user?.role === "UNASSIGNED"
    ? { href: "/onboarding", label: "Complete Setup", icon: UserIcon }
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={Logo.src}
              alt="MediCure Logo"
              className="w-9 h-9 rounded-xl"
            />
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              MediCure
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <SignedIn>
              {/* Role-based nav link */}
              {navLink && (
                <Link href={navLink.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl font-medium"
                  >
                    <navLink.icon className="h-4 w-4" />
                    {navLink.label}
                  </Button>
                </Link>
              )}

              {/* Credits / Pricing badge */}
              {(!user || user?.role !== "ADMIN") && (
                <Link href={user?.role === "DOCTOR" ? "/doctor" : "/pricing"}>
                  <Badge className="h-9 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-3 py-1 gap-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer font-medium">
                    <CreditCard className="h-3.5 w-3.5" />
                    {user && user.role !== "ADMIN" ? (
                      <span>{user.credits} {user?.role === "PATIENT" ? "Credits" : "Earned"}</span>
                    ) : (
                      <span>Pricing</span>
                    )}
                  </Badge>
                </Link>
              )}

              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 cursor-pointer">
                <SignInButton />
              </div>
            </SignedOut>
          </div>

          {/* ── Mobile Controls ── */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggleMobile />

            <SignedIn>
              {(!user || user?.role !== "ADMIN") && (
                <Link href={user?.role === "DOCTOR" ? "/doctor" : "/pricing"}>
                  <Badge className="h-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2 gap-1 text-xs font-medium">
                    <CreditCard className="h-3 w-3" />
                    {user ? user.credits : "Plan"}
                  </Badge>
                </Link>
              )}
              <UserButton />
              {navLink && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              )}
            </SignedIn>

            <SignedOut>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer">
                <SignInButton />
              </div>
            </SignedOut>
          </div>
        </div>

        {/* ── Mobile Dropdown ── */}
        {mobileMenuOpen && navLink && (
          <div className="md:hidden border-t border-slate-100 dark:border-slate-800 py-3">
            <Link
              href={navLink.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              <navLink.icon className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{navLink.label}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
