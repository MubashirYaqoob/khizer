"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  image: string;
  href: string;
  index?: number;
}

export default function CategoryCard({ title, image, href, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group relative w-full aspect-[4/5] sm:aspect-square md:aspect-[3/4] overflow-hidden rounded-lg bg-surface block cursor-pointer"
    >
      <Link href={href} className="absolute inset-0 z-20" aria-label={`Explore ${title}`} />
      
      {/* Background Image with Zoom on Hover */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 ease-[0.25,0.46,0.45,0.94] group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Dark Overlay that darkens on hover */}
      <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40 z-10" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
        <div className="overflow-hidden">
          <h3 className="text-white text-3xl md:text-4xl font-garamond font-medium tracking-wide">
            {title}
          </h3>
        </div>
        
        {/* Explore Link (Slides in on hover) */}
        <div className="overflow-hidden mt-3 h-0 group-hover:h-auto transition-all duration-300">
          <span className="text-white font-jost text-sm uppercase tracking-widest flex items-center gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            Explore <span className="group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
