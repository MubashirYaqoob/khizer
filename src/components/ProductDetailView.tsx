"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";

interface SizeStock {
  size: string;
  stock: number;
}

interface Category {
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  sizes: string[];
  sizeChartUrl: string | null;
  details?: any;
  stock: number;
  categoryId: string;
  category: Category;
  sizeStocks: SizeStock[];
}

interface Props {
  product: Product;
  relatedProducts: any[];
}

export default function ProductDetailView({ product, relatedProducts }: Props) {
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const [activeTab, setActiveTab] = useState<"chart" | "measure">("chart");

  const price = product.salePrice || product.price;

  // Review states & logic
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewEmail, setNewReviewEmail] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewEmail.trim() || !newReviewComment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReviewName,
          email: newReviewEmail,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted successfully!");
        setNewReviewName("");
        setNewReviewEmail("");
        setNewReviewComment("");
        setNewReviewRating(5);
        fetchReviews();
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // Helper: get stock for a specific size
  const getSizeStock = (size: string): number => {
    if (product.sizeStocks && product.sizeStocks.length > 0) {
      return product.sizeStocks.find((s) => s.size === size)?.stock ?? 0;
    }
    // fallback: divide total stock equally
    return product.sizes.length > 0 ? Math.floor(product.stock / product.sizes.length) : product.stock;
  };

  const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : product.stock;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }

    const stockForSize = selectedSize ? getSizeStock(selectedSize) : product.stock;
    if (stockForSize < quantity) {
      toast.error(`Only ${stockForSize} items available in this size`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: price,
      image: product.images[0] || "",
      size: selectedSize || "Standard",
      quantity: quantity,
      stock: product.stock,
    });

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="font-inter bg-white">
      {/* Breadcrumb - Clean & Spacious */}
      <div className="max-w-container mx-auto px-6 py-6 md:py-10">
        <nav className="text-xs tracking-widest uppercase text-on-surface-variant flex items-center gap-3">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-primary/30">/</span>
          <Link href={`/category/${product.category?.slug}`} className="hover:text-primary transition-colors">
            {product.category?.name}
          </Link>
          <span className="text-primary/30">/</span>
          <span className="text-primary font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-container mx-auto px-6 pb-20">
        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="relative aspect-[3/4] md:aspect-[4/5] w-full bg-surface overflow-hidden group rounded-3xl md:rounded-[40px] shadow-lg">
              <Image
                src={product.images[activeImageIdx] || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative aspect-[3/4] w-24 md:w-32 shrink-0 rounded-2xl overflow-hidden transition-all snap-center ${
                      activeImageIdx === i 
                        ? "ring-2 ring-primary ring-offset-4 shadow-md opacity-100 scale-105" 
                        : "opacity-60 hover:opacity-100 hover:scale-100 scale-95"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="128px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col lg:py-10">
            {/* Category Label */}
            <Link href={`/category/${product.category?.slug}`} className="text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant hover:text-primary mb-4 transition-colors">
              {product.category?.name}
            </Link>

            <h1 className="text-3xl md:text-5xl font-playfair text-primary leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            {reviews.length > 0 ? (
              <div className="flex items-center gap-2 mb-6 text-sm select-none">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-current" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-on-surface-variant font-medium text-xs">
                  {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-6 text-xs text-text-muted select-none">
                <div className="flex text-gray-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>No reviews yet</span>
              </div>
            )}

            {/* Price Area */}
            <div className="flex items-center gap-4 mb-8">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-inter font-medium text-primary">Rs. {product.salePrice.toLocaleString()}</span>
                  <span className="text-lg font-inter text-on-surface-variant line-through">Rs. {product.price.toLocaleString()}</span>
                  <span className="bg-primary text-white text-xs font-medium px-3 py-1 tracking-wider uppercase">
                    Sale
                  </span>
                </>
              ) : (
                <span className="text-2xl font-inter font-medium text-primary">Rs. {product.price.toLocaleString()}</span>
              )}
            </div>

            <hr className="border-t border-primary/10 mb-8" />

            {/* Description */}
            <div className="prose prose-sm text-on-surface-variant mb-6 leading-relaxed max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Product Specifications Details */}
            {product.details && (
              <div className="mb-8 p-5 bg-surface border border-outline/15 rounded-2xl">
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-primary mb-3">Product Specifications</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  {Object.entries(
                    typeof product.details === 'string' 
                      ? JSON.parse(product.details) 
                      : product.details
                  ).map(([key, value]) => {
                    if (!value) return null;
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key} className="flex flex-col border-b border-primary/5 pb-1">
                        <span className="text-text-muted font-medium">{formattedKey}</span>
                        <span className="text-primary font-semibold mt-0.5">{value as string}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold tracking-widest uppercase text-primary">Size</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="text-xs text-gold hover:text-primary font-semibold uppercase tracking-wider underline transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const sStock = getSizeStock(size);
                    const isOOS = sStock === 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !isOOS && setSelectedSize(size)}
                        disabled={isOOS}
                        className={`min-w-[4rem] h-12 border px-4 flex items-center justify-center text-sm transition-all ${
                          isOOS
                            ? "border-primary/10 text-primary/30 cursor-not-allowed bg-surface relative overflow-hidden"
                            : selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-primary/20 text-primary hover:border-primary"
                        }`}
                      >
                        {size}
                        {isOOS && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-primary/20 rotate-45" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-8">
              <p className={`text-sm font-medium ${
                selectedSize
                  ? (selectedSizeStock > 0 ? "text-primary/70" : "text-red-500")
                  : (product.stock > 0 ? "text-primary/70" : "text-red-500")
              }`}>
                {selectedSize
                  ? (selectedSizeStock > 0 ? `In Stock` : `Sold Out in this size`)
                  : (product.stock > 0 ? `In Stock` : "Out of Stock")
                }
              </p>
            </div>

            {/* Actions: Quantity & Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Quantity */}
              <div className="flex items-center border border-primary/20 h-14 w-full sm:w-32 shrink-0">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex-1 flex items-center justify-center text-primary hover:bg-surface h-full transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex-1 flex items-center justify-center text-primary hover:bg-surface h-full transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || (!!selectedSize && getSizeStock(selectedSize) === 0)}
                className="flex-1 h-14 bg-primary text-white text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(selectedSize && getSizeStock(selectedSize) === 0)
                  ? `Sold Out`
                  : product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-14 h-14 shrink-0 flex items-center justify-center border border-primary/20 text-primary hover:border-primary transition-colors"
                aria-label="Add to Wishlist"
              >
                <svg
                  className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-primary" : "fill-transparent"}`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            <a
              href={`https://wa.me/923493955066?text=Hi! I'm interested in ordering: ${product.name} ${
                selectedSize ? `(Size: ${selectedSize})` : ""
              } — Rs. ${price.toLocaleString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full h-14 border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 transition-colors text-sm font-semibold tracking-widest uppercase"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>

            <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/50 text-amber-900 text-xs rounded flex gap-2">
              <svg className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span><strong>Disclaimer:</strong> Actual product color may vary slightly from the image.</span>
            </div>

            <hr className="border-t border-primary/10 mt-8 mb-8" />

            {/* Accordion Details (Static Placeholders for Luxury Feel) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">Delivery & Returns</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Standard delivery within 3-5 working days. Returns accepted within 14 days of purchase. Items must be unworn and in their original condition.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">Care Instructions</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Dry clean only. Do not bleach. Iron at moderate temperature.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-primary/10 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || (!!selectedSize && getSizeStock(selectedSize) === 0)}
          className="w-full h-12 bg-primary text-white text-sm font-semibold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      {/* ── Customer Reviews Section ── */}
      <section className="border-t border-[#E8E2D9] py-16 md:py-20 mt-16 max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Summary */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl md:text-3xl font-garamond text-primary">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl font-semibold font-playfair text-primary">
                {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
              </span>
              <div className="space-y-1">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-current" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant font-medium">
                  Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-6 border-t border-[#E8E2D9]">
              <h3 className="font-garamond text-lg font-medium text-primary">Write a Review</h3>
              
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const stars = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewReviewRating(stars)}
                        className="text-amber-500 hover:scale-110 transition-transform p-0.5 focus:outline-none"
                      >
                        <svg
                          className={`w-6 h-6 ${stars <= newReviewRating ? "fill-current" : "text-gray-300 fill-none stroke-current stroke-1.5"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline/35 focus:border-gold outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={newReviewEmail}
                  onChange={(e) => setNewReviewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline/35 focus:border-gold outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Comment</label>
                <textarea
                  rows={4}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface border border-outline/35 focus:border-gold outline-none text-sm transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full btn-primary py-3 text-xs tracking-widest disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-garamond text-primary border-b border-[#E8E2D9] pb-4">
              Recent Reviews ({reviews.length})
            </h3>
            
            {reviewsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 bg-[#faf8f5] rounded-xl border border-outline/10">
                <p className="text-sm text-on-surface-variant font-light">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8E2D9] max-h-[600px] overflow-y-auto pr-2 space-y-6">
                {reviews.map((r) => (
                  <div key={r.id} className="pt-6 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-primary text-sm">{r.name}</p>
                      <span className="text-[10px] text-text-muted">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "text-gray-200 fill-none stroke-current stroke-1"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-surface py-20 mt-10">
          <div className="max-w-container mx-auto px-6">
            <h2 className="text-3xl font-playfair text-primary mb-10 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.salePrice || p.price}
                  originalPrice={p.salePrice ? p.price : undefined}
                  image={p.images[0] || "/images/placeholder.jpg"}
                  href={`/product/${p.id}`}
                  inStock={p.stock > 0}
                  sizes={p.sizes}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6 transition-all duration-300">
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-primary/40 hover:text-primary transition-colors p-2 rounded-full hover:bg-surface"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="p-6 pb-4 border-b border-outline/10 text-center">
              <h2 className="text-xl md:text-2xl font-garamond font-medium text-primary">Size Chart</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-outline/10">
              <button 
                onClick={() => setActiveTab("chart")}
                className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === "chart" 
                    ? "border-gold text-gold" 
                    : "border-transparent text-primary/55 hover:text-primary"
                }`}
              >
                Size Chart
              </button>
              <button 
                onClick={() => setActiveTab("measure")}
                className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === "measure" 
                    ? "border-gold text-gold" 
                    : "border-transparent text-primary/55 hover:text-primary"
                }`}
              >
                How to measure
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {activeTab === "chart" ? (
                <>
                  {/* CM / IN Switch & Description */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary font-garamond">Standard Measurements</span>
                    <div className="flex items-center bg-surface p-1 rounded-lg border border-outline/10">
                      <button 
                        onClick={() => setSizeUnit("cm")}
                        className={`px-3 py-1 text-xs font-semibold rounded ${sizeUnit === "cm" ? "bg-white text-primary shadow" : "text-primary/55"}`}
                      >
                        Cm
                      </button>
                      <button 
                        onClick={() => setSizeUnit("in")}
                        className={`px-3 py-1 text-xs font-semibold rounded ${sizeUnit === "in" ? "bg-white text-primary shadow" : "text-primary/55"}`}
                      >
                        In
                      </button>
                    </div>
                  </div>

                  {/* Trouser Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-primary tracking-wide">Trouser</h3>
                    <div className="overflow-x-auto border border-outline/15 rounded-lg">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="bg-surface text-primary/70 font-semibold border-b border-outline/15">
                            <th className="p-3">Sizes</th>
                            <th className="p-3 text-right">S ({sizeUnit === "in" ? "In" : "Cm"})</th>
                            <th className="p-3 text-right">M ({sizeUnit === "in" ? "In" : "Cm"})</th>
                            <th className="p-3 text-right">L ({sizeUnit === "in" ? "In" : "Cm"})</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-outline/10">
                            <td className="p-3 font-medium">Outseam (total leg length)</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "40" : "101.6"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "40" : "101.6"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "40" : "101.6"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Kaftan / Top Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-primary tracking-wide">Kaftan / Shirt</h3>
                    <div className="overflow-x-auto border border-outline/15 rounded-lg">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="bg-surface text-primary/70 font-semibold border-b border-outline/15">
                            <th className="p-3">Sizes</th>
                            <th className="p-3 text-right">S ({sizeUnit === "in" ? "In" : "Cm"})</th>
                            <th className="p-3 text-right">M ({sizeUnit === "in" ? "In" : "Cm"})</th>
                            <th className="p-3 text-right">L ({sizeUnit === "in" ? "In" : "Cm"})</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-outline/10">
                            <td className="p-3 font-medium">Chest</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "19" : "48.3"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "21" : "53.3"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "23" : "58.4"}</td>
                          </tr>
                          <tr className="border-b border-outline/10">
                            <td className="p-3 font-medium">Daman</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "33" : "83.8"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "33" : "83.8"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "33" : "83.8"}</td>
                          </tr>
                          <tr className="border-b border-outline/10">
                            <td className="p-3 font-medium">Shirt Length</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "52" : "132.1"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "52" : "132.1"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "52" : "132.1"}</td>
                          </tr>
                          <tr className="border-b border-outline/10">
                            <td className="p-3 font-medium">Shoulder</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "16" : "40.6"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "17" : "43.2"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "18" : "45.7"}</td>
                          </tr>
                          <tr className="border-b border-outline/10">
                            <td className="p-3 font-medium">Sleeve Length</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "21" : "53.3"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "21" : "53.3"}</td>
                            <td className="p-3 text-right">{sizeUnit === "in" ? "21" : "53.3"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  <p className="font-semibold text-primary">To find your perfect fit, please follow these measuring guidelines:</p>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="font-bold text-gold shrink-0">1. Chest:</span>
                      <p>Measure around the fullest part of your chest, keeping the tape horizontal under your arms.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold text-gold shrink-0">2. Shoulder:</span>
                      <p>Measure from one shoulder tip to the other across the natural curve of your upper back.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold text-gold shrink-0">3. Shirt Length:</span>
                      <p>Measure from the highest point of the shoulder seam down to your desired hemline length.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold text-gold shrink-0">4. Sleeve Length:</span>
                      <p>Measure from the shoulder joint tip down to the wrist bone.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="font-bold text-gold shrink-0">5. Trouser Outseam:</span>
                      <p>Measure from the natural waistline down to the ankle bone or desired bottom length.</p>
                    </div>
                  </div>

                  <div className="bg-surface p-4 rounded-xl border border-outline/10 mt-6 text-center text-xs">
                    <span className="font-semibold text-primary block mb-1">Need custom measurements?</span>
                    Choose the "Custom" option when ordering or contact us via WhatsApp for customized sizing services.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-outline/10 text-center bg-surface">
              <button 
                onClick={() => setShowSizeChart(false)}
                className="bg-primary text-white text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gold transition-colors"
              >
                Close Size Guide
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
