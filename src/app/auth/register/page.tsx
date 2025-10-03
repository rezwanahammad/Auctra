"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified auth page
    router.replace("/auth/signin");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Redirecting...
        </div>
        <div className="text-slate-500 dark:text-slate-400">
          Taking you to the sign-up page
        </div>
      </div>
    </div>
  );
}
