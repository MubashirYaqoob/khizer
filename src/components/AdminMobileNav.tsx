"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  path: string;
}

interface AdminMobileNavProps {
  navItems: NavItem[];
}

export default function AdminMobileNav({ navItems }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden w-full mb-6 font-jost">
      {/* Top Bar for Admin Mobile */}
      <div className="flex items-center justify-between bg-white border border-primary/10 px-4 py-3 rounded-lg shadow-sm">
        <span className="text-sm font-semibold tracking-wider text-gold uppercase">
          Admin Panel
        </span>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 border border-primary/10 rounded text-xs font-semibold uppercase tracking-wider text-primary hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Menu
        </button>
      </div>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-[75%] max-w-[280px] bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-primary/10 mb-6">
              <span className="font-garamond text-xl text-primary font-semibold">Admin Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-primary hover:text-gold transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-semibold tracking-wider uppercase transition-colors ${
                      isActive
                        ? "bg-gold/10 text-gold font-bold"
                        : "text-primary hover:bg-surface hover:text-gold"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
