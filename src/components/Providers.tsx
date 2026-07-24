"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1c1917',
          color: '#f5f5f4',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        },
        success: {
          iconTheme: {
            primary: '#d4af37',
            secondary: '#1c1917',
          },
        },
      }} />
    </SessionProvider>
  );
}

