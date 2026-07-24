import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Khizar Fabric Store",
  description: "Learn the story behind Khizar Fabric Store — a Karachi-based label built on authentic craftsmanship, premium fabrics, and a deep love for Pakistani fashion.",
};

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Authentic Quality",
    desc: "Every fabric is hand-selected from master weavers and verified for authenticity before it reaches you.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Customer First",
    desc: "We've built our reputation stitch by stitch, order by order, with honesty and service that goes beyond the transaction.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    title: "Timeless Design",
    desc: "We don't chase trends — we create pieces that feel relevant season after season, year after year.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
      </svg>
    ),
    title: "Nationwide Delivery",
    desc: "From Karachi to Gilgit, we deliver Pakistan-wide with tracked shipping and Cash on Delivery available.",
  },
];

const milestones = [
  { year: "2024", event: "Khizar Fabric Store founded in Karachi" },
  { year: "2024", event: "Launched online store with nationwide shipping" },
  { year: "2024", event: "Reached 500+ products across all categories" },
  { year: "2025", event: "10,000+ happy customers served across Pakistan" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen font-jost text-primary">

      {/* ── Hero Banner ── */}
      <div className="relative h-[420px] md:h-[520px] overflow-hidden">
        <Image
          src="/images/about-story.png"
          alt="Khizar Fabric Store Heritage"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
            Our Heritage
          </span>
          <h1 className="font-garamond text-white text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
            Khizar Fabric Store
          </h1>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#B8962E] to-transparent" />
          <p className="text-white/70 mt-6 max-w-xl text-sm md:text-base leading-relaxed">
            Born in Karachi. Built on authenticity. Worn with pride across Pakistan.
          </p>
        </div>
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[#B8962E]/50" />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-[#B8962E]/50" />
      </div>

      {/* ── Story Section ── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/banner2.png"
                alt="Khizar Fabric craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            {/* Gold frame offset */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#B8962E]/30 pointer-events-none" />
            {/* Badge */}
            <div className="absolute -top-5 -left-5 w-24 h-24 bg-[#0e0c09] rounded-full flex flex-col items-center justify-center shadow-xl">
              <span className="text-[#B8962E] font-garamond text-lg leading-none">Est.</span>
              <span className="text-[#B8962E] font-garamond text-2xl leading-none">2024</span>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#B8962E]" />
              <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.35em] uppercase">How We Started</span>
            </div>
            <h2 className="font-garamond text-4xl md:text-5xl leading-tight">
              A Passion Stitched Into Every Thread
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Khizar Fabric Store began as a simple but powerful idea — give Pakistani women access to premium, authentic fabrics without compromise. What started as a carefully curated selection of lawn, chiffon, and cotton has grown into a complete fashion destination.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              We work directly with artisans, printers, and weavers to bring you collections that honour tradition while embracing contemporary elegance. Every stitch, every print, every colour has been chosen with intention.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Today, Khizar Fabric Store serves customers across all of Pakistan — from Karachi to Lahore, Islamabad to Peshawar — with the same personal touch we started with: honesty, quality, and genuine care.
            </p>
            <Link href="/category/unstitched" className="inline-flex items-center gap-2 bg-[#0e0c09] text-white px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#B8962E] transition-colors duration-300 mt-2">
              Explore Collections
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section className="bg-[#0e0c09] py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: "2024", l: "Founded" },
            { n: "500+", l: "Products" },
            { n: "10K+", l: "Customers" },
            { n: "100%", l: "Genuine Fabric" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-garamond text-[#B8962E] text-3xl md:text-4xl">{s.n}</p>
              <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mt-2">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.35em] uppercase mb-3 block">What We Stand For</span>
            <h2 className="font-garamond text-4xl md:text-5xl">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white p-8 border border-[#e8e0d5] hover:border-[#B8962E]/40 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#B8962E]/10 rounded-full flex items-center justify-center mb-5 text-[#B8962E] group-hover:bg-[#B8962E] group-hover:text-white transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="font-garamond text-xl mb-3">{v.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width Quote Image ── */}
      <section className="relative h-[380px] md:h-[460px] overflow-hidden">
        <Image
          src="/images/banner3.png"
          alt="Khizar Fabric Store collection"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl">
            <p className="text-[#B8962E] text-4xl font-garamond mb-2">"</p>
            <h2 className="font-garamond text-white text-2xl md:text-4xl leading-snug">
              Every fabric tells a story. Every garment carries our promise of authenticity.
            </h2>
            <p className="text-[#B8962E] text-4xl font-garamond mt-2 rotate-180 inline-block">"</p>
            <p className="text-white/50 text-xs tracking-widest uppercase mt-4">— Khizar Fabric Store</p>
          </div>
        </div>
      </section>

      {/* ── Craft Section ── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#B8962E]" />
              <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.35em] uppercase">The Craft & The Care</span>
            </div>
            <h2 className="font-garamond text-4xl md:text-5xl leading-tight">
              Generations of Trust, Stitch by Stitch
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              We don't chase fast fashion. Our collections — from everyday printed lawn to heavy bridal couture and customized bespoke suits — are created with immense attention to detail and a deep respect for the art of Pakistani textile.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              When you buy from Khizar Fabric Store, you get more than a garment. You get the expertise of a team that genuinely loves what they do, and the assurance that we stand behind every single product we sell.
            </p>

            {/* Milestones */}
            <div className="pt-4 space-y-4">
              {milestones.map((m) => (
                <div key={m.event} className="flex items-start gap-4">
                  <span className="text-[#B8962E] font-garamond text-lg min-w-[52px] pt-0.5">{m.year}</span>
                  <div className="flex-1 border-l border-[#B8962E]/20 pl-4">
                    <p className="text-sm text-on-surface-variant">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/hero-homepage.png"
                alt="Khizar Fabric Store craftsmanship"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-full h-full border border-[#B8962E]/30 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#0e0c09] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.35em] uppercase mb-4 block">Experience It Yourself</span>
          <h2 className="font-garamond text-white text-3xl md:text-5xl mb-6">
            Ready to Find Your Perfect Suit?
          </h2>
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#B8962E] to-transparent mx-auto mb-8" />
          <p className="text-white/60 text-base leading-relaxed max-w-xl mx-auto mb-10">
            Browse our latest collections online, or reach out to us directly. Our team is always ready to help you find exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/category/unstitched" className="inline-flex items-center justify-center gap-2 bg-[#B8962E] text-[#0e0c09] px-10 py-4 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-[#e8c96e] transition-colors duration-300">
              Shop Collections
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-10 py-4 text-[11px] font-bold tracking-[0.25em] uppercase hover:border-[#B8962E] hover:text-[#B8962E] transition-colors duration-300">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
