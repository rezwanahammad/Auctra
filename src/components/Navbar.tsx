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
  { href: "/private-sales", label: "Private Sales" },
  { href: "/sell", label: "Sell" },
  { href: "/finance", label: "Finance" },
  { href: "/about", label: "About" },
  { href: "/stories", label: "Stories" },
  { href: "/services", label: "Services" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isAccountOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!accountMenuRef.current) return;
      if (accountMenuRef.current.contains(event.target as Node)) return;
      setIsAccountOpen(false);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeydown);
    };
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
    : "fixed inset-x-0 top-0 z-50 bg-white/80 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:bg-slate-950/80";

  const linkContainerClasses = isHome
    ? "hidden flex-1 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm text-white lg:flex"
    : "hidden flex-1 items-center justify-center gap-2 rounded-full border border-slate-200/70 bg-white/50 px-3 py-1.5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/50 lg:flex";

  const linkClass = (active: boolean) =>
    isHome
      ? `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          active
            ? "bg-white text-slate-900 shadow-sm"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`
      : `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          active
            ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
            : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        }`;

  const searchButtonClasses = isHome
    ? "flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white/80 shadow-sm transition hover:-translate-y-0.5 hover:border-white/50 hover:text-white"
    : "flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white";

  const iconLinkClasses = isHome
    ? "rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
    : "rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

  const ctaClasses = isHome
    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-slate-200"
    : "rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";

  const accountButtonClasses = isHome
    ? "flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white/80 transition hover:border-white/50 hover:text-white"
    : "flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200";

  const signInClasses = isHome
    ? "rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
    : "rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200";

  const mobileToggleClasses = isHome
    ? "ml-auto inline-flex items-center rounded-full border border-white/30 bg-white/10 p-2 text-white transition hover:border-white/50"
    : "ml-auto inline-flex items-center rounded-full border border-slate-200 bg-white/85 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200";

  return (
    <>
      <nav className={navClasses}>
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center gap-8 px-6 sm:px-8 lg:px-10">
          <Link
            href="/"
            className={`flex flex-col leading-tight ${
              isHome ? "text-white" : "text-slate-900 dark:text-slate-50"
            }`}
          >
            <span className="text-2xl font-semibold tracking-tight">Auctra</span>
            <span
              className={`text-[11px] uppercase tracking-[0.4em] ${
                isHome ? "text-white/70" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Curated auctions
            </span>
          </Link>

          <div className={linkContainerClasses}>
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(Boolean(pathname?.startsWith(link.href)))}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={searchButtonClasses}
            >
              <Search className={`h-4 w-4 ${isHome ? "text-white" : ""}`} />
              <span>{isHome ? "Search" : "Search"}</span>
              <span
                className={`hidden rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isHome
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                } sm:inline`}
              >
                ⌘K
              </span>
            </button>

            <Link
              href="/favorites"
              className={iconLinkClasses}
              aria-label="View favorites"
            >
              <Heart className={`h-5 w-5 ${isHome ? "text-current" : ""}`} />
            </Link>

            <Link
              href="/cart"
              className={iconLinkClasses}
              aria-label="View cart"
            >
              <ShoppingBag className={`h-5 w-5 ${isHome ? "text-current" : ""}`} />
            </Link>

            <Link
              href="/sell"
              className={ctaClasses}
            >
              Sell with Auctra
            </Link>

            {session ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  className={accountButtonClasses}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
                    {initials ?? session.user?.role?.[0] ?? "A"}
                  </span>
                  <span className={isHome ? "text-white" : undefined}>
                    {session.user?.name ?? "Account"}
                  </span>
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-12 z-40 w-72 rounded-2xl border border-slate-200 bg-white/95 p-5 text-slate-700 shadow-2xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
                    <p className="text-sm font-semibold">
                      Hi, {session.user?.name ?? "Collector"}
                    </p>
                    {session.user?.email && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {session.user.email}
                      </p>
                    )}
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                      <Link href="/dashboard" className="transition hover:text-slate-900 dark:hover:text-white">
                        Account dashboard
                      </Link>
                      <Link href="/favorites" className="transition hover:text-slate-900 dark:hover:text-white">
                        Saved lots
                      </Link>
                      <Link href="/bids" className="transition hover:text-slate-900 dark:hover:text-white">
                        Active bids
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300"
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
                className={signInClasses}
              >
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            className={`${mobileToggleClasses} lg:hidden`}
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
              setIsAccountOpen(false);
            }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className={`h-5 w-5 ${isHome ? "text-white" : ""}`} />
            ) : (
              <Menu className={`h-5 w-5 ${isHome ? "text-white" : ""}`} />
            )}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/45" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[80vw] overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg font-semibold">Menu</div>
              <button
                type="button"
                className="rounded-full border border-slate-300 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-200"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Close menu"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-600 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
            >
              <Search className="h-4 w-4" />
              <span>Search the marketplace</span>
            </button>

            <nav className="space-y-2 text-sm">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-4">
              {session ? (
                <div className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {session.user?.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {session.user?.email}
                  </p>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Account dashboard
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Sign in to bid
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 backdrop-blur-sm px-4 pt-32 sm:px-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900/95">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <input
                autoFocus
                type="search"
                placeholder="Search artists, categories, or catalogue numbers"
                className="flex-1 border-none bg-transparent text-base text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              />
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-800 dark:border-slate-700 dark:text-slate-300"
                onClick={() => setIsSearchOpen(false)}
              >
                ESC
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Quick links
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {PRIMARY_LINKS.slice(0, 6).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
