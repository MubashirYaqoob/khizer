"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function CategoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [isOpen, setIsOpen] = useState(false);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (selectedSize) params.set("size", selectedSize);
    else params.delete("size");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedSize("");
    setSort("newest");
    router.push(pathname);
    setIsOpen(false);
  };

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSelectedSize(searchParams.get("size") || "");
    setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  return (
    <div className="font-jost">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden flex items-center justify-between border border-primary/10 bg-white p-4 mb-6 shadow-sm">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-primary"
        >
          <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter & Sort
        </button>
        {searchParams.toString() && (
          <button onClick={clearFilters} className="text-xs text-red-600 underline">
            Clear All
          </button>
        )}
      </div>

      {/* Desktop Sidebar (Sidebar View) */}
      <aside className="hidden lg:block w-72 shrink-0 border border-primary/10 bg-white p-6 sticky top-28 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/10">
          <h2 className="text-base font-bold uppercase tracking-wider text-primary">Filters</h2>
          {searchParams.toString() && (
            <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-800 transition-colors underline">
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Sort By */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Sort By</h3>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const params = new URLSearchParams(searchParams.toString());
                params.set("sort", e.target.value);
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="w-full bg-surface border border-primary/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors font-medium text-primary rounded-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Price Range (Rs.)</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-surface border border-primary/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors font-medium text-primary rounded-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-surface border border-primary/10 p-3 text-sm focus:outline-none focus:border-gold transition-colors font-medium text-primary rounded-sm"
              />
            </div>
            <button
              onClick={applyFilters}
              className="w-full bg-primary text-white py-3 text-xs font-semibold tracking-widest uppercase hover:bg-gold transition-colors rounded-sm"
            >
              Apply Price
            </button>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Filter by Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    const nextSize = selectedSize === sz ? "" : sz;
                    setSelectedSize(nextSize);
                    const params = new URLSearchParams(searchParams.toString());
                    if (nextSize) params.set("size", nextSize);
                    else params.delete("size");
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className={`py-2 px-3 border text-xs tracking-wider font-semibold rounded-sm transition-all ${
                    selectedSize === sz
                      ? "border-gold bg-gold text-white shadow-sm"
                      : "border-primary/10 text-primary hover:border-gold"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer (Drawer View) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-primary/10 mb-6">
              <span className="font-garamond text-xl text-primary font-semibold">Filter & Sort</span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-primary hover:text-gold transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* Sort By */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Sort By</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-surface border border-primary/10 p-3 text-sm focus:outline-none focus:border-gold font-medium text-primary rounded-sm"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Price Range (Rs.)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-surface border border-primary/10 p-3 text-sm focus:outline-none focus:border-gold font-medium text-primary rounded-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-surface border border-primary/10 p-3 text-sm focus:outline-none focus:border-gold font-medium text-primary rounded-sm"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Filter by Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
                      className={`py-2 px-3 border text-xs tracking-wider font-semibold rounded-sm transition-all ${
                        selectedSize === sz
                          ? "border-gold bg-gold text-white"
                          : "border-primary/10 text-primary hover:border-gold"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-primary/10 mt-6 space-y-3">
              <button
                onClick={applyFilters}
                className="w-full bg-primary text-white py-4 text-xs font-semibold tracking-widest uppercase hover:bg-gold transition-colors rounded-sm"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="w-full border border-primary/10 text-primary py-4 text-xs font-semibold tracking-widest uppercase hover:bg-surface transition-colors rounded-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
