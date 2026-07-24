"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface SaleBannerProps {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  bgImage: string;
}

export default function SaleBanner({
  headline,
  subtext,
  ctaText,
  ctaLink,
  bgImage,
}: SaleBannerProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 text-white">
      {/* Background image */}
      <Image
        src={bgImage}
        fill
        className="object-cover absolute inset-0 -z-20"
        alt="Sale Banner Background"
        quality={85}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/68 -z-10" />

      {/* Decorative glows */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"
      />

      {/* Content */}
      <div className="max-w-container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-gold text-[10px] font-semibold tracking-[0.35em] uppercase mb-4 block"
        >
          Limited Time Offer
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-garamond mb-6 tracking-wide leading-tight max-w-3xl"
          dangerouslySetInnerHTML={{
            __html: headline.replace(
              /(25%|Off|Sale)/gi,
              '<span class="text-gold">$1</span>'
            ),
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/75 font-jost text-sm md:text-base max-w-xl mb-10 leading-relaxed"
        >
          {subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href={ctaLink}
            className="group inline-flex items-center gap-3 bg-gold text-white px-10 py-4 text-[10px] font-semibold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-gold/25"
          >
            {ctaText}
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
