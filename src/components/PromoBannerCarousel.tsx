"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface PromoBannerCarouselProps {
  banners: { id: string; imageUrl: string; title: string; link: string }[];
  title: string;
  subtitle: string;
  description: string;
}

export default function PromoBannerCarousel({ banners, title, subtitle, description }: PromoBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="py-20 md:py-32 bg-primary text-white overflow-hidden">
      <div className="max-w-container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Content */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center order-2 lg:order-1">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-6 block">
              {subtitle}
            </span>
            <h2 className="text-4xl md:text-6xl font-playfair leading-tight mb-8">
              {title}
            </h2>
            <p className="text-base md:text-lg text-white/80 mb-12 leading-relaxed max-w-lg font-jost">
              {description}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
                aria-label="Previous banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
                aria-label="Next banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="w-full lg:w-7/12 order-1 lg:order-2">
            <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-bl-[100px] rounded-tr-[100px] shadow-2xl">
              {banners.map((banner, idx) => (
                <Link href={banner.link} key={banner.id} className="block">
                  <div
                    className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                      idx === currentIndex ? "translate-x-0 opacity-100 z-10" : "translate-x-full opacity-0 z-0"
                    }`}
                  >
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/0" />
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex ? "bg-gold w-8" : "bg-white/20 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
