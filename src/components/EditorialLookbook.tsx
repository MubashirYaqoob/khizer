"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface EditorialLookbookProps {
  title: string;
  subtitle: string;
  description: string;
  image1: string;
  image2: string;
  ctaLink: string;
}

export default function EditorialLookbook({
  title,
  subtitle,
  description,
  image1,
  image2,
  ctaLink,
}: EditorialLookbookProps) {
  // Extract words for design layout formatting
  const words = title.split(" ");
  const highlightWord = words[words.length - 1];
  const mainTitleText = words.slice(0, -1).join(" ");

  return (
    <section className="py-20 md:py-28 bg-[#faf7f2] overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Block */}
          <div className="w-full lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-[#B8962E] text-xs font-semibold tracking-[0.25em] uppercase mb-4 block">
                {subtitle}
              </span>
              <h2 className="font-garamond text-primary tracking-tight leading-[1.08] mb-6" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
                {mainTitleText}{" "}
                <span className="text-[#B8962E] font-light italic block lg:inline-block relative">
                  {highlightWord}
                </span>
              </h2>
              
              <div className="w-12 h-[1px] bg-[#B8962E] mx-auto lg:mx-0 mb-8" />
              
              <p className="text-sm md:text-base text-text-muted mb-10 leading-relaxed font-jost max-w-md mx-auto lg:mx-0">
                {description}
              </p>
              
              <div>
                <Link
                  href={ctaLink}
                  className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase text-primary hover:text-[#B8962E] transition-all duration-300"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="w-8 h-[1px] bg-primary group-hover:bg-[#B8962E] group-hover:w-12 transition-all duration-300" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Image Block - Overlapping clean editorial setup */}
          <div className="w-full lg:col-span-7 grid grid-cols-12 gap-4 relative items-center">
            
            {/* Background decorative grid pattern */}
            <div className="absolute inset-0 -z-10 opacity-30 flex items-center justify-center pointer-events-none">
              <div className="w-[85%] h-[85%] rounded-full bg-[#B8962E]/5 blur-3xl" />
            </div>

            {/* Left/Under image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="col-span-7 aspect-[4/5] relative rounded-md overflow-hidden shadow-lg group"
            >
              <Image
                src={image1}
                alt="Editorial Highlight Left"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 35vw"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>

            {/* Right/Overlapping image */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="col-span-5 aspect-[3/4] relative rounded-md overflow-hidden shadow-2xl border-4 border-[#faf7f2] -ml-8 mt-12 z-20 group"
            >
              <Image
                src={image2}
                alt="Editorial Highlight Right"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 40vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>

            {/* Floating elegant badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-4 top-12 hidden md:flex w-24 h-24 rounded-full bg-white border border-[#B8962E]/20 shadow-xl items-center justify-center z-30"
            >
              <span className="font-garamond italic text-[#B8962E] text-lg tracking-wider">Luxe</span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
