"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  images: string[];
  stock: number;
  sizes: string[];
}

interface SpotlightSectionProps {
  title: string;
  subtitle: string;
  categoryName: string;
  categorySlug: string;
  categoryImage: string;
  products: Product[];
}

export default function SpotlightSection({
  title,
  subtitle,
  categoryName,
  categorySlug,
  categoryImage,
  products,
}: SpotlightSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden border-b border-outline/10">
      <div className="max-w-container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3 block">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-garamond text-primary">
            {title}
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Big Feature Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 relative group min-h-[400px] lg:min-h-auto rounded-lg overflow-hidden flex flex-col justify-end p-8 text-white shadow-xl"
          >
            {/* Background Image */}
            <Image 
              src={categoryImage || "/images/placeholder.jpg"} 
              alt={categoryName}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>

            {/* Decorative Gold Border Frame */}
            <div className="absolute inset-4 border border-gold/25 pointer-events-none group-hover:border-gold/50 transition-colors duration-500"></div>

            {/* Content */}
            <div className="relative z-10 space-y-4">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold block">
                Highlighted Collection
              </span>
              <h3 className="text-2xl md:text-3xl font-garamond font-medium tracking-wide">
                {categoryName}
              </h3>
              <p className="text-white/70 font-jost text-xs leading-relaxed max-w-xs">
                Hand-selected premium designs representing the pinnacle of class and modern tailoring.
              </p>
              <div className="pt-2">
                <Link 
                  href={`/category/${categorySlug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white hover:text-gold transition-colors group/btn"
                >
                  Explore Collection 
                  <span className="inline-block transform transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Scrolling Products Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 flex flex-col justify-center"
          >
            <div className="flex overflow-x-auto scrollbar-hide gap-6 pb-6 snap-x snap-mandatory px-2">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="min-w-[240px] md:min-w-[280px] snap-center flex-shrink-0"
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.salePrice ?? undefined}
                    image={product.images[0] || "/images/placeholder.jpg"}
                    href={`/product/${product.id}`}
                    inStock={product.stock > 0}
                    sizes={product.sizes}
                  />
                </div>
              ))}
            </div>

            {/* Pagination / Scroll Assist hint */}
            <div className="flex items-center gap-2 mt-4 text-xs text-text-muted justify-end px-2">
              <span>Swipe to explore</span>
              <div className="w-12 h-[1px] bg-outline/25"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
