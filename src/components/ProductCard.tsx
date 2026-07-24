"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "SALE" | "RESTOCKED";
  badgeType?: "dark" | "gold";
  href: string;
  inStock?: boolean;
  sizes?: string[];
  slug?: string;
  reviews?: { rating: number }[];
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  badgeType = "dark",
  href,
  inStock = true,
  sizes = [],
  slug,
  reviews = [],
}: ProductProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  // Dynamic discount calculation
  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;



  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;

    const hasSizes = sizes && sizes.length > 0 && !(sizes.length === 1 && sizes[0].toUpperCase() === "CUSTOM");
    if (hasSizes) {
      router.push(href);
      return;
    }

    addItem({
      productId: id,
      name,
      slug: slug || href.split("/").pop() || id,
      price,
      quantity: 1,
      image,
      size: "Default",
      stock: 9999,
    });
    toast.success(`${name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from Wishlist" : "Added to Wishlist", {
      icon: isWishlisted ? "❌" : "❤️",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative flex flex-col w-full"
    >
      <div className="block overflow-hidden relative bg-surface aspect-[3/4] rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300">
        <Link href={href} className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-[0.25,0.46,0.45,0.94] group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-black text-white font-jost text-xs tracking-widest uppercase px-4 py-2 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover Dark Gradient Overlay (fades in at bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

        {/* Top Badges (New, Sale etc) */}
        {badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className={`px-3 py-1 text-[10px] font-jost uppercase tracking-widest font-medium rounded-full ${
              badgeType === "gold" ? "bg-gold text-white" : "bg-black text-white"
            }`}>
              {badge}
            </span>
          </div>
        )}

        {/* Dynamic Discount off tag overlay (LAAM Style) */}
        {discount > 0 && (
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-[#FFEBEE] text-[#D32F2F] text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
              Upto {discount}% off
            </span>
          </div>
        )}

        {/* Wishlist Icon */}
        <button 
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-4 right-4 z-20 p-2 text-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 drop-shadow-md"
        >
          <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isWishlisted ? 0 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Hover Slide-up Details & Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-end z-20 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[0.25,0.46,0.45,0.94]">
          <Link href={href}>
            <h3 className="text-white font-garamond text-xl md:text-2xl mb-1 text-center tracking-[0.03em] drop-shadow-md">
              {name}
            </h3>
          </Link>
          <div className="flex items-center gap-3 font-jost text-sm text-white/90 mb-4 drop-shadow-md">
            {originalPrice && (
              <span className="line-through text-white/60 text-xs">
                Rs. {originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-medium">Rs. {price.toLocaleString()}</span>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full bg-white text-black border border-primary/10 py-3 px-4 font-jost text-[11px] uppercase tracking-widest font-medium hover:bg-gold hover:text-white hover:border-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg rounded-sm"
          >
            {sizes && sizes.length > 0 && !(sizes.length === 1 && sizes[0].toUpperCase() === "CUSTOM")
              ? "View Detail"
              : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Default (Non-hover) Text under image */}
      <div className="mt-4 text-center group-hover:opacity-0 transition-opacity duration-300">
        <Link href={href}>
          <h3 className="text-primary font-garamond text-lg font-semibold tracking-[0.03em] mb-1 line-clamp-1">
            {name}
          </h3>
        </Link>
        
        {/* Prices */}
        <div className="flex items-center justify-center gap-2 font-jost text-sm">
          {originalPrice && (
            <span className="text-text-muted line-through text-xs">
              Rs. {originalPrice.toLocaleString()}
            </span>
          )}
          <span className="font-semibold text-primary">Rs. {price.toLocaleString()}</span>
        </div>

        {/* Rating Stars / Trust badge */}
        {reviews.length > 0 ? (
          <div className="flex items-center justify-center gap-1.5 mt-1.5 text-xs text-text-muted select-none">
            <span className="text-amber-500 font-bold">
              ★ {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-[10px] tracking-wide font-medium">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-text-muted select-none">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="tracking-wide">Verified Product</span>
          </div>
        )}

        <div className="mt-3 block md:hidden">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full bg-white text-black border border-primary/20 hover:border-primary py-2 px-3 font-jost text-[10px] uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
          >
            {sizes && sizes.length > 0 && !(sizes.length === 1 && sizes[0].toUpperCase() === "CUSTOM")
              ? "View Detail"
              : "Add to Bag"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
