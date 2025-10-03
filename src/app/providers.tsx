"use client";

import type { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/Toast";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
