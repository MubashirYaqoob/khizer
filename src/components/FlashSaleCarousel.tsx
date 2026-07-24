"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface FlashSaleBanner {
  imageUrl: string;
  linkUrl: string;
}

interface FlashSaleCarouselProps {
  slides: FlashSaleBanner[];
}

export default function FlashSaleCarousel({ slides }: FlashSaleCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(0);
  const [paused, setPaused] = useState(false);
  const AUTO_MS = 5000;

  const activeSlides = slides.filter((s) => s.imageUrl);

  const goTo = useCallback(
    (idx: number) => {
      setDir(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const next = useCallback(() => {
    if (activeSlides.length <= 1) return;
    goTo(current === activeSlides.length - 1 ? 0 : current + 1);
  }, [current, activeSlides.length, goTo]);

  const prev = () => {
    if (activeSlides.length <= 1) return;
    goTo(current === 0 ? activeSlides.length - 1 : current - 1);
  };

  useEffect(() => {
    if (paused || activeSlides.length <= 1) return;
    const t = setTimeout(() => next(), AUTO_MS);
    return () => clearTimeout(t);
  }, [current, paused, activeSlides.length, next]);

  if (activeSlides.length === 0) return null;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const slide = activeSlides[current];

  return (
    <section className="w-full bg-[#faf7f2] py-6 md:py-10 px-4 md:px-6 lg:px-10">
      <div
        className="relative mx-auto overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ maxWidth: 1320, borderRadius: 16 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 16, height: "clamp(120px, 24vw, 360px)" }}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={current}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 w-full h-full cursor-pointer select-none"
            >
              <Link href={slide.linkUrl || "#"}>
                <Image
                  src={slide.imageUrl}
                  alt={`Flash Sale Slide ${current + 1}`}
                  fill
                  priority
                  quality={90}
                  className="object-cover object-center"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Left/Right buttons */}
          {activeSlides.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:scale-105 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:scale-105 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Small Dot Nav */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: idx === current ? 16 : 6,
                  backgroundColor: idx === current ? "#B8962E" : "rgba(255, 255, 255, 0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
