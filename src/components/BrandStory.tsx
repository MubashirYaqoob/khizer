"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface BrandStoryProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const stats = [
  { value: "2024", label: "Established" },
  { value: "500+", label: "Products" },
  { value: "10K+", label: "Happy Customers" },
  { value: "100%", label: "Authentic Fabric" },
];

export default function BrandStory({ title, subtitle, description, imageUrl }: BrandStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0e0c09]">
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[680px]">
        {/* ── Left: Image Panel ── */}
        <div className="relative overflow-hidden min-h-[400px] lg:min-h-[680px]">
          <motion.div style={{ y: imgY }} className="absolute inset-[-10%] w-[120%] h-[120%]">
            <Image
              src={imageUrl}
              alt="Khizar Fabric Store – Our Heritage"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          {/* Gradient bleed into right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e0c09] hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c09] via-[#0e0c09]/30 to-transparent lg:hidden" />

          {/* Gold corner accent */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#B8962E]/60" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#B8962E]/60 hidden lg:block" />
        </div>

        {/* ── Right: Content Panel ── */}
        <div className="flex flex-col justify-center px-8 md:px-14 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#B8962E]" />
              <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.35em] uppercase">
                {subtitle}
              </span>
            </div>

            {/* Heading */}
            <h2
              className="font-garamond text-white leading-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", lineHeight: 1.08 }}
            >
              {title}
            </h2>

            {/* Gold rule */}
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#B8962E] to-[#e8c96e] mb-8" />

            {/* Description */}
            <p className="text-white/65 font-jost text-base md:text-[17px] leading-[1.8] mb-10 font-light">
              {description}
            </p>

            {/* CTA */}
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 bg-[#B8962E] text-[#0e0c09] px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#e8c96e] transition-colors duration-300"
            >
              Discover Our Story
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* ── Stats Row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-10 border-t border-white/10"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="text-[#B8962E] font-garamond text-2xl md:text-3xl font-semibold">
                  {s.value}
                </p>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gold accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#B8962E] to-transparent" />
    </section>
  );
}
