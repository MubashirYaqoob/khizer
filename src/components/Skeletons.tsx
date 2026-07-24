"use client";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col w-full animate-pulse">
      <div className="skeleton aspect-[3/4] w-full rounded-sm" />
      <div className="mt-4 space-y-2">
        <div className="skeleton h-5 w-3/4 mx-auto rounded" />
        <div className="skeleton h-4 w-1/3 mx-auto rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="skeleton aspect-[3/4] w-full rounded-lg" />
  );
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div
      className="skeleton w-full"
      style={{ height: "clamp(340px, 56vw, 620px)" }}
    />
  );
}
