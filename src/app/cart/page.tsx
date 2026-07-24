"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B8962E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const FREE_DELIVERY_THRESHOLD = 5000;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 250;
  const total = subtotal + delivery;
  const progressPct = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  const handleQtyChange = (id: string, newQty: number, name: string) => {
    updateQuantity(id, newQty);
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast.success(`${name} removed`);
  };

  /* ── Empty Cart ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          {/* Bag icon */}
          <div className="w-20 h-20 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center mx-auto mb-8 shadow-sm">
            <svg className="w-9 h-9 text-[#B8962E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#B8962E] mb-3">Your Shopping Bag</p>
          <h1 className="font-garamond text-4xl md:text-5xl text-[#1A1A1A] mb-4 leading-tight">Your Bag is Empty</h1>
          <div className="w-10 h-[1px] bg-[#B8962E] mx-auto mb-6" />
          <p className="text-sm text-[#6B6560] font-jost leading-relaxed mb-10">
            Explore our premium collections and discover timeless Pakistani heritage craftsmanship.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-[0.25em] uppercase px-10 py-4 hover:bg-[#B8962E] transition-colors duration-300"
          >
            Discover Collections
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Cart with Items ── */
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E8E2D9]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#B8962E] mb-1">Review</p>
          <h1 className="font-garamond text-3xl md:text-4xl text-[#1A1A1A]">
            Shopping Bag
            <span className="ml-3 text-lg text-[#6B6560] font-jost font-normal">({items.length} {items.length === 1 ? "item" : "items"})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">

          {/* ── LEFT: Cart Items ── */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, overflow: "hidden" }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="bg-white border border-[#E8E2D9] mb-4 flex flex-col sm:flex-row group hover:shadow-md transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.slug}`} className="relative w-full sm:w-44 md:w-52 flex-shrink-0 aspect-[3/4] sm:aspect-auto sm:h-auto overflow-hidden bg-[#f5f0e8]">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, 208px"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link href={`/product/${item.slug}`}>
                            <h3 className="font-garamond text-xl md:text-2xl text-[#1A1A1A] hover:text-[#B8962E] transition-colors leading-tight mb-1">
                              {item.name}
                            </h3>
                          </Link>
                          {item.size && item.size !== "Default" && (
                            <p className="text-xs text-[#6B6560] font-jost tracking-wider uppercase">
                              Size: <span className="text-[#1A1A1A] font-medium">{item.size}</span>
                            </p>
                          )}
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          aria-label="Remove item"
                          className="w-8 h-8 flex items-center justify-center text-[#6B6560] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-4 w-8 h-[1px] bg-[#E8E2D9]" />
                    </div>

                    {/* Bottom Row: Qty + Price */}
                    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-[#E8E2D9] bg-[#faf7f2]">
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity - 1, item.name)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] hover:text-[#B8962E] disabled:opacity-30 transition-colors text-lg font-light"
                        >
                          −
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center font-jost text-sm font-semibold text-[#1A1A1A] border-x border-[#E8E2D9]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, item.quantity + 1, item.name)}
                          disabled={item.stock ? item.quantity >= item.stock : false}
                          className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] hover:text-[#B8962E] disabled:opacity-30 transition-colors text-lg font-light"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6B6560] mb-1">
                          Rs. {item.price.toLocaleString()} each
                        </p>
                        <p className="font-garamond text-2xl text-[#1A1A1A]">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.25em] uppercase text-[#1A1A1A] hover:text-[#B8962E] transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Order Summary (Sticky) ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white border border-[#E8E2D9] p-7 md:p-9">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#B8962E] mb-5">Order Summary</p>

              {/* Free Delivery Progress */}
              <div className="mb-7 pb-7 border-b border-[#E8E2D9]">
                {delivery === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-semibold tracking-wider uppercase">Free Delivery Unlocked!</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#6B6560] font-jost mb-2">
                    Add <span className="text-[#1A1A1A] font-semibold">Rs. {remaining.toLocaleString()}</span> more for free delivery
                  </p>
                )}
                <div className="h-[3px] bg-[#E8E2D9] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#B8962E] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-jost text-[#6B6560]">Subtotal</span>
                  <span className="text-sm font-jost font-semibold text-[#1A1A1A]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-jost text-[#6B6560]">Delivery</span>
                  <span className={`text-sm font-jost font-semibold ${delivery === 0 ? "text-emerald-600" : "text-[#1A1A1A]"}`}>
                    {delivery === 0 ? "FREE" : `Rs. ${delivery}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#E8E2D9] pt-5 mb-8">
                <div className="flex items-center justify-between">
                  <span className="font-garamond text-xl text-[#1A1A1A]">Total</span>
                  <span className="font-garamond text-2xl text-[#1A1A1A]">Rs. {total.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#6B6560] font-jost mt-1 tracking-wide">Including all taxes</p>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="group flex items-center justify-center gap-3 w-full bg-[#1A1A1A] text-white text-[10px] font-semibold tracking-[0.25em] uppercase px-8 py-4 hover:bg-[#B8962E] transition-colors duration-300 mb-3"
              >
                Proceed to Checkout
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Trust Badges */}
              <div className="mt-7 pt-6 border-t border-[#E8E2D9] grid grid-cols-2 gap-4">
                {[
                  { icon: "🚚", label: "Cash on Delivery" },
                  { icon: "🔄", label: "Easy Returns" },
                  { icon: "🔒", label: "Secure Payment" },
                  { icon: "✨", label: "100% Authentic" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2">
                    <span className="text-base">{badge.icon}</span>
                    <span className="text-[10px] font-jost text-[#6B6560] tracking-wide leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
