"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 border-b">
      <Link href="/" className="text-xl font-bold">
        Auctra
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/browse" className="hover:underline">
          Browse
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>

        {status === "loading" ? (
          <p>Loading...</p>
        ) : session ? (
          <>
            <span className="text-sm text-gray-600">
              Hi, {session.user?.name} ({session.user?.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/signin"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
