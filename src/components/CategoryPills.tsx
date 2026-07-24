"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  href: string;
}

export default function CategoryPills({ categories }: { categories: Category[] }) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-8 pb-4 snap-x snap-mandatory w-full px-2">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="snap-center flex-shrink-0"
        >
          <Link
            href={cat.href}
            className="group flex flex-col items-center min-w-[90px] md:min-w-[120px]"
          >
            {/* Circle image */}
            <motion.div
              whileHover={{ scale: 1.07 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-outline/20 group-hover:border-gold transition-colors duration-300 p-[2px] bg-surface shadow-sm group-hover:shadow-md"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden bg-outline/5">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 80px, 112px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </motion.div>

            {/* Label */}
            <span className="mt-3 text-xs md:text-sm font-jost font-medium text-primary text-center group-hover:text-gold transition-colors tracking-wide leading-tight">
              {cat.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
