"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface Volume {
  id: string;
  name: string;
  slug: string;
}

interface VolumePillsProps {
  volumes: Volume[];
  categorySlug: string;
}

export default function VolumePills({ volumes, categorySlug }: VolumePillsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeVolume = searchParams.get("volume");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSelect = (slug: string | null) => {
    if (slug) {
      router.push(`/category/${categorySlug}?${createQueryString("volume", slug)}`, { scroll: false });
    } else {
      router.push(`/category/${categorySlug}`, { scroll: false });
    }
  };

  if (!volumes || volumes.length === 0) return null;

  return (
    <div className="relative w-full mb-8">
      {/* Optional: Add gradient fades on edges for long scrollable lists */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <button
          onClick={() => handleSelect(null)}
          className={`
            shrink-0 px-6 py-2 rounded-full border transition-all duration-300 font-jost text-sm tracking-wide snap-start
            ${!activeVolume 
              ? 'bg-gold text-white border-gold shadow-md' 
              : 'bg-transparent text-primary border-outline hover:border-gold hover:text-gold'}
          `}
        >
          All
        </button>

        {volumes.map((vol) => {
          const isActive = activeVolume === vol.slug;
          return (
            <button
              key={vol.id}
              onClick={() => handleSelect(vol.slug)}
              className={`
                shrink-0 px-6 py-2 rounded-full border transition-all duration-300 font-jost text-sm tracking-wide snap-start
                ${isActive 
                  ? 'bg-gold text-white border-gold shadow-md' 
                  : 'bg-transparent text-primary border-outline hover:border-gold hover:text-gold'}
              `}
            >
              {vol.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
