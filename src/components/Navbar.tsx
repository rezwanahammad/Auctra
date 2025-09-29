"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowRight,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

const PRIMARY_LINKS = [
  { href: "/auctions", label: "Auctions" },
  { href: "/buy", label: "Buy Now" },
  { href: "/private-sales", label: "Private" },
  { href: "/sell", label: "Sell" },
  { href: "/stories", label: "Stories" },
];

const SECONDARY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Support" },
  { href: "/finance", label: "Finance" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  // close on escape
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSearchOpen(false);
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isSearchOpen]);

  // close account menu on outside click
  useEffect(() => {
    if (!isAccountOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!accountMenuRef.current) return;
      if (!accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isAccountOpen]);

  useEffect(() => {
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const initials = useMemo(() => {
    const name = session?.user?.name ?? "";
    if (!name.trim()) return undefined;
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [session?.user?.name]);

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false);
    setIsAccountOpen(false);
  };

  const navClasses = isHome
    ? "fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-sm transition-colors duration-300"
    : "fixed inset-x-0 top-0 z-50 bg-white/80 shadow-sm backdrop-blur-xl dark:bg-slate-950/80";

  return (
    <>
      <nav className={navClasses}>
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link
            href="/"
            className={`flex flex-col leading-tight ${
              isHome ? "text-white" : "text-slate-900 dark:text-slate-50"
            }`}
          >
            <span className="text-2xl font-bold tracking-tight">Auctra</span>
            <span
              className={`text-[11px] uppercase tracking-[0.35em] ${
                isHome ? "text-white/70" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Curated Auctions
            </span>
          </Link>

          {/* Primary nav links */}
          <div className="hidden lg:flex flex-1 justify-center gap-1">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname?.startsWith(link.href)
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            <Link
              href="/favorites"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="View favorites"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="View cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </Link>

            <Link
              href="/sell"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Sell with Auctra
            </Link>

            {session ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold uppercase text-white dark:bg-white dark:text-slate-900">
                    {initials ?? "A"}
                  </span>
                  <span>{session.user?.name ?? "Account"}</span>
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-12 z-40 w-72 rounded-2xl border border-slate-200 bg-white/95 p-5 text-slate-700 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
                    <p className="text-sm font-semibold">
                      Hi, {session.user?.name ?? "Collector"}
                    </p>
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                      <Link href="/dashboard">Account dashboard</Link>
                      <Link href="/favorites">Saved lots</Link>
                      <Link href="/bids">Active bids</Link>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="ml-auto inline-flex items-center rounded-full border border-slate-200 bg-white/85 p-2 text-slate-600 lg:hidden dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[80vw] overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold">Menu</div>
              <button
                type="button"
                className="rounded-full border border-slate-300 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2 text-sm">
              {PRIMARY_LINKS.concat(SECONDARY_LINKS).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              {session ? (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {session.user?.name}
                  </p>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Dashboard <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Sign in to bid
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
