"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: "fallback-1",
    imageUrl: "/images/hero-homepage.png",
    title: "New Season Edit",
    subtitle: "Premium Collection",
    ctaText: "SHOP NOW",
    ctaLink: "/category/unstitched",
  },
  {
    id: "fallback-2",
    imageUrl: "/images/banner1.png",
    title: "Bridal Couture",
    subtitle: "Exclusively Crafted",
    ctaText: "SHOP NOW",
    ctaLink: "/category/bridal",
  },
  {
    id: "fallback-3",
    imageUrl: "/images/banner2.png",
    title: "Ready To Wear",
    subtitle: "Timeless Elegance",
    ctaText: "SHOP NOW",
    ctaLink: "/category/ready-to-wear",
  },
];

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useMotionValue(0);
  const AUTO_MS = 5500;

  const goTo = useCallback(
    (idx: number) => {
      setDir(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo(current === displayBanners.length - 1 ? 0 : current + 1);
  }, [current, displayBanners.length, goTo]);

  const prev = useCallback(() => {
    goTo(current === 0 ? displayBanners.length - 1 : current - 1);
  }, [current, displayBanners.length, goTo]);

  /* Auto-advance */
  useEffect(() => {
    if (paused || displayBanners.length <= 1) return;
    const t = setTimeout(() => next(), AUTO_MS);
    return () => clearTimeout(t);
  }, [current, paused, displayBanners.length, next]);

  /* Slide variants */
  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0, scale: 0.97 }),
  };

  const banner = displayBanners[current];

  return (
    <section className="w-full bg-[#faf7f2] py-4 md:py-6 px-4 md:px-6 lg:px-10">
      {/* ── Outer container: max-width + rounding ── */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ maxWidth: 1320, borderRadius: 16 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Slide track ── */}
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 16, height: "clamp(320px, 52vw, 600px)" }}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={current}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              style={{ x: dragX }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 60) prev();
                else if (info.offset.x < -60) next();
                dragX.set(0);
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
            >
              {/* Background image */}
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority={current === 0}
                quality={95}
                className="object-cover object-center pointer-events-none"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-end pb-10 px-8 md:px-14 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="max-w-lg pointer-events-auto"
                >
                  {banner.subtitle && (
                    <p className="text-[10px] md:text-xs font-semibold tracking-[0.35em] uppercase text-white/70 mb-2 md:mb-3">
                      {banner.subtitle}
                    </p>
                  )}
                  <h1
                    className="font-garamond text-white leading-none mb-4 md:mb-6 drop-shadow"
                    style={{ fontSize: "clamp(2rem, 5.5vw, 4.2rem)", lineHeight: 1.05 }}
                  >
                    {banner.title}
                  </h1>
                  <Link
                    href={banner.ctaLink || "/category/unstitched"}
                    className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/40 text-white text-[10px] font-semibold tracking-[0.28em] uppercase px-6 py-3 hover:bg-white hover:text-[#1A1A1A] transition-all duration-300"
                    style={{ borderRadius: 4 }}
                  >
                    {banner.ctaText || "SHOP NOW"}
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Left / Right arrow buttons (inside slide, vertically centered) ── */}
          {displayBanners.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:scale-110 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:scale-110 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Slide counter — top right */}
          {displayBanners.length > 1 && (
            <div className="absolute top-5 right-5 z-20 bg-black/30 backdrop-blur-sm text-white text-[10px] font-semibold tracking-widest px-3 py-1.5 rounded-full tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(displayBanners.length).padStart(2, "0")}
            </div>
          )}
        </div>

        {/* ── Thumbnail strip (LAAM-style peeking slides below) ── */}
        {displayBanners.length > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4 pb-1">
            {displayBanners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative overflow-hidden flex-shrink-0 transition-all duration-400 ${
                  idx === current
                    ? "ring-2 ring-[#B8962E] ring-offset-2 ring-offset-[#faf7f2]"
                    : "opacity-50 hover:opacity-80"
                }`}
                style={{
                  width: idx === current ? 80 : 56,
                  height: idx === current ? 52 : 36,
                  borderRadius: 6,
                  transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}
              >
                <Image
                  src={b.imageUrl}
                  alt={b.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Dot navigation below the container ── */}
      {displayBanners.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {displayBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="relative overflow-hidden rounded-full transition-all duration-400"
              style={{
                width: idx === current ? 28 : 8,
                height: 8,
                backgroundColor: idx === current ? "#B8962E" : "#D4C5AD",
                transition: "all 0.4s ease",
              }}
            >
              {idx === current && (
                <motion.span
                  className="absolute inset-0 bg-[#B8962E] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  key={current}
                  transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                  style={{ originX: 0 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
