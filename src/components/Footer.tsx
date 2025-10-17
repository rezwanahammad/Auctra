"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-100 dark:bg-slate-950">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col leading-tight mb-6">
              <span className="text-3xl font-bold tracking-tight text-white">
                Auctra
              </span>
              <span className="text-sm uppercase tracking-[0.30em] text-slate-40 mt-1">
                Curated Auctions
              </span>
            </Link>

            <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
              Online auction house, connecting collectors with exceptional fine
              art, antiques, jewelry, and collectibles from around the globe.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm">raad13086@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm">+88 01712-345678</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm">RK Mission Road, Mymensingh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/auctions", label: "Live Auctions" },
                { href: "/categories", label: "Browse Categories" },
                { href: "/buy", label: "Buy Now" },
                { href: "/about", label: "About Us" },
                { href: "/stories", label: "Stories" },
                { href: "/favorites", label: "My Favorites" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Account & Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/auth/signin", label: "Sign In" },
                { href: "/auth/register", label: "Create Account" },
                { href: "/dashboard", label: "My Dashboard" },
                { href: "/bids", label: "My Bids" },
                { href: "/services", label: "Customer Support" },
                { href: "/finance", label: "Payment & Finance" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-slate-400">
              © {currentYear} Auctra. All rights reserved.
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/cookies", label: "Cookie Policy" },
                { href: "/accessibility", label: "Accessibility" },
              ].map((link, index) => (
                <span key={link.href} className="flex items-center gap-6">
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < 3 && (
                    <span className="text-slate-600 hidden sm:inline">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
