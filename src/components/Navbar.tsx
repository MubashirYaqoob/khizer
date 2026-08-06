"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store";

/* ─── Dropdown menu animation ─── */
const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

/* ─── Mobile/Desktop drawer animation ─── */
const drawerVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { x: "-100%", transition: { duration: 0.28, ease: "easeIn" as const } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

/* ─── Cart badge pop animation ─── */
const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 20 },
  },
  bump: {
    scale: [1, 1.45, 1],
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function Navbar() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);
  const [cartBumped, setCartBumped] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const [emptyCategorySlugs, setEmptyCategorySlugs] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalItems = useCartStore((s) => s.getTotalItems());

  const placeholders = [
    'Search for "embroidered pashmina shawl"...',
    'Search for "bridal wear"...',
    'Search for "kurti & shirts"...',
    'Search for "ready-to-wear"...',
    'Search for "unstitched lawn"...',
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  /* Bounce badge when cart count increases */
  useEffect(() => {
    if (!mounted) return;
    if (totalItems > prevCartCount) {
      setCartBumped(true);
      const t = setTimeout(() => setCartBumped(false), 400);
      return () => clearTimeout(t);
    }
    setPrevCartCount(totalItems);
  }, [totalItems]);

  const [hasAnnouncement, setHasAnnouncement] = useState(true);

  useEffect(() => {
    setMounted(true);
    setPrevCartCount(totalItems);

    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("announcement-dismissed") === "true";
      setHasAnnouncement(!dismissed);
    }

    const handleDismissEvent = () => setHasAnnouncement(false);
    window.addEventListener("announcement-dismissed", handleDismissEvent);

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const emptySlugs = (data.categories || [])
          .filter((c: any) => !c._count || c._count.products === 0)
          .map((c: any) => c.slug.toLowerCase());
        setEmptyCategorySlugs(emptySlugs);
      })
      .catch(() => {});

    // Close search dropdown on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("announcement-dismissed", handleDismissEvent);
    };
  }, []);

  /* Scroll behaviour */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 50);
    setHidden(latest > prev && latest > 150);
  });

  /* Lock body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  /* Search debounce */
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const id = setTimeout(async () => {
      setSearching(true);
      try {
        const catFilter = selectedCat !== "All" ? `&category=${encodeURIComponent(selectedCat.toLowerCase())}` : "";
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}${catFilter}`);
        const d = await res.json();
        setSearchResults(d.products || []);
      } catch {}
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(id);
  }, [searchQuery, selectedCat]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}${selectedCat !== "All" ? `&category=${encodeURIComponent(selectedCat.toLowerCase())}` : ""}`);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Collections",
      path: "#",
      subLinks: [
        { name: "Unstitched", path: "/category/unstitched" },
        { name: "Printed Unstitched", path: "/category/printed-unstitched" },
        { name: "Embroidered Unstitched", path: "/category/embroidered-unstitched" },
        { name: "Ready-To-Wear", path: "/category/ready-to-wear" },
        { name: "1-Piece", path: "/category/one-piece" },
        { name: "2-Piece", path: "/category/two-piece" },
        { name: "Kurti / Shirt", path: "/category/kurti-shirt" },
        { name: "Bridal", path: "/category/bridal" },
        { name: "Sale", path: "/category/sale" },
      ],
    },
  ];

  return (
    <>
      {/* ─────────── HEADER ─────────── */}
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.32, ease: "easeInOut" }}
        className={`w-full z-40 fixed left-0 right-0 transition-all duration-300 ${
          isScrolled || !hasAnnouncement ? "top-0" : "top-9"
        } ${
          isScrolled
            ? "bg-white/96 backdrop-blur-md shadow-[0_1px_12px_rgba(0,0,0,0.07)]"
            : "bg-white border-b border-[#E8E2D9]"
        }`}
      >
        {/* Main top row navbar content */}
        <div
          className={`max-w-container mx-auto px-6 flex items-center justify-between transition-all duration-300 gap-4 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo & Category trigger */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="p-2 -ml-2 text-primary hover:text-gold transition-colors flex items-center gap-1.5 focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu drawer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider text-primary">Menu</span>
            </button>

            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <Image
                src="/images/logo.jpg"
                alt="Khizar Fabric Store"
                width={44}
                height={44}
                className="w-9 h-9 md:w-11 md:h-11 object-contain rounded-full border border-outline/25"
                priority
              />
              <span className="font-garamond text-lg md:text-2xl tracking-tight text-primary font-bold whitespace-nowrap">
                Khizar Fabric Store
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 min-w-0 max-w-lg relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#faf7f2] border border-[#E8E2D9] rounded-md overflow-hidden w-full transition-all focus-within:border-gold shadow-sm">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                  className="px-3 md:px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#E8E2D9]/30 border-r border-[#E8E2D9] flex items-center gap-1 focus:outline-none whitespace-nowrap"
                >
                  {selectedCat}
                  <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {catDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-1 w-40 bg-white shadow-xl border border-outline/10 flex flex-col py-1.5 z-50 rounded-md origin-top-left"
                    >
                      {["All", "Unstitched", "Ready-To-Wear", "Bridal", "Sale"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => { setSelectedCat(cat); setCatDropdownOpen(false); }}
                          className="px-4 py-2 text-left text-xs font-semibold text-primary hover:text-gold hover:bg-[#faf7f2] transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1 flex items-center">
                <svg className="w-4 h-4 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={placeholders[placeholderIdx]}
                  className="w-full bg-transparent pl-9 pr-4 py-2 text-xs text-primary font-medium focus:outline-none placeholder-text-muted/60"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <AnimatePresence>
              {searchFocused && (searchQuery.trim() || searchResults.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl border border-outline/25 rounded-md p-4 max-h-[300px] overflow-y-auto z-50"
                >
                  {searching ? (
                    <div className="text-center py-4 text-xs font-medium text-text-muted">Searching collections...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-[10px] font-semibold text-gold tracking-widest uppercase">Matching Products</p>
                      {searchResults.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={() => setSearchFocused(false)}
                          className="flex items-center gap-3 p-1.5 hover:bg-[#faf7f2] transition-colors rounded-sm group"
                        >
                          <div className="relative w-10 h-12 bg-surface rounded overflow-hidden flex-shrink-0">
                            <Image src={p.images[0] || "/images/placeholder.jpg"} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-primary truncate group-hover:text-gold transition-colors">{p.name}</h4>
                            <p className="text-[10px] text-text-muted mt-0.5">Rs. {p.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs font-medium text-text-muted">No results found for "{searchQuery}"</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right section icons */}
          <div className="flex items-center justify-end gap-3 md:gap-5 shrink-0 min-w-[44px]">
            <div className="hidden lg:flex flex-col items-end text-[10px] font-medium text-[#6B6560] border-r border-[#E8E2D9] pr-4 select-none">
              <span className="text-[8px] text-[#9A9590] uppercase font-bold tracking-widest">Deliver To / Currency</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm">🇵🇰</span>
                <span className="font-semibold text-primary uppercase">PK / PKR</span>
              </div>
            </div>

            {session ? (
              <div
                className="relative py-2 hidden sm:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button className="hover:text-gold transition-colors p-1" aria-label="Account Menu">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full w-48 bg-white shadow-xl border border-outline/10 flex flex-col py-2 z-50 rounded-md origin-top-right"
                    >
                      <span className="px-4 py-2 text-[10px] font-bold text-gold tracking-wide border-b border-outline/10 truncate">
                        Hi, {session.user?.name}
                      </span>
                      <Link href="/orders" onClick={() => setAccountOpen(false)} className="px-4 py-2.5 text-xs font-semibold text-primary hover:text-gold hover:bg-[#faf7f2] transition-colors">
                        My Orders
                      </Link>
                      {(session.user as any)?.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setAccountOpen(false)} className="px-4 py-2.5 text-xs font-semibold text-primary hover:text-gold hover:bg-[#faf7f2] transition-colors">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { setAccountOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="px-4 py-2.5 text-xs font-semibold text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block hover:text-gold transition-colors p-1" aria-label="Login">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            <Link href="/cart" className="hover:text-gold transition-colors relative p-1" aria-label="Cart Page">
              <svg className="w-5 h-5 text-primary hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <AnimatePresence>
                {mounted && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    variants={badgeVariants}
                    initial="initial"
                    animate={cartBumped ? "bump" : "animate"}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                    className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[9px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center font-bold leading-none"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* Clean, centered bottom row category links (hidden when scrolled) */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 38, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full bg-[#faf7f2] border-t border-[#E8E2D9] overflow-hidden"
            >
              <div className="max-w-container mx-auto px-6 h-full flex items-center justify-center gap-6 md:gap-8">
                {navLinks.map((link) =>
                  link.subLinks ? (
                    link.subLinks.slice(0, 7).map((sub) => {
                      const slug = sub.path.replace("/category/", "").toLowerCase();
                      const isEmpty = false; // Show all categories even if empty
                      return isEmpty ? null : (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-text-muted hover:text-gold transition-colors whitespace-nowrap"
                        >
                          {sub.name}
                        </Link>
                      );
                    })
                  ) : (
                    <Link
                      key={link.name}
                      href={link.path}
                      className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-text-muted hover:text-gold transition-colors whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className={`transition-all duration-300 ${isScrolled ? "h-[calc(36px+64px)]" : "h-[calc(36px+118px)]"}`} />

      {/* ─────────── SIDE CATEGORIES PANEL / DRAWER ─────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Left Drawer panel */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-[82%] max-w-[320px] bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-primary/10 flex items-center justify-between bg-[#faf7f2]">
                <span className="font-garamond text-2xl text-primary font-bold">Categories</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-primary hover:text-gold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                    className="flex flex-col w-full"
                  >
                    {link.subLinks ? (
                      <>
                        <span className="text-xs font-bold tracking-widest text-[#B8962E] uppercase mb-3">{link.name}</span>
                        <div className="flex flex-col gap-2.5 pl-2 border-l border-primary/10">
                          {link.subLinks.map((sub) => {
                            const slug = sub.path.replace("/category/", "").toLowerCase();
                            const isEmpty = false; // Show all categories even if empty
                            return isEmpty ? (
                              <div key={sub.name} className="flex items-center justify-between text-text-muted/50 cursor-not-allowed py-1 text-xs">
                                <span className="font-semibold">{sub.name}</span>
                                <span className="text-[8px] bg-outline/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Soon</span>
                              </div>
                            ) : (
                              <Link
                                key={sub.name}
                                href={sub.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs font-semibold text-text-muted hover:text-gold transition-colors py-1 flex items-center justify-between"
                              >
                                <span>{sub.name}</span>
                                <span className="text-[10px] text-gray-300">&rarr;</span>
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-garamond text-xl text-primary font-bold hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* Account Settings for Drawer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="pt-6 border-t border-primary/10 flex flex-col gap-4"
                >
                  {session ? (
                    <>
                      <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-semibold text-primary hover:text-gold transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        My Orders
                      </Link>
                      {(session.user as any)?.role === "ADMIN" && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-semibold text-primary hover:text-gold transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="flex items-center gap-3 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors text-left"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-semibold text-primary hover:text-gold transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                      Login / Register
                    </Link>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
