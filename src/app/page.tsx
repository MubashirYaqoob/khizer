import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import EditorialLookbook from "@/components/EditorialLookbook";
import BrandStory from "@/components/BrandStory";
import SpotlightSection from "@/components/SpotlightSection";
import ScrollReveal from "@/components/ScrollReveal";
import CategoryPills from "@/components/CategoryPills";
import SaleBanner from "@/components/SaleBanner";
import FlashSaleCarousel from "@/components/FlashSaleCarousel";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let banners: any[] = [];
  let featuredProducts: any[] = [];
  let trendingProducts: any[] = [];
  let displayCategories: any[] = [];
  let settings: any[] = [];
  let spotlightCategory: any = null;

  try {
    [banners, featuredProducts, trendingProducts, displayCategories, settings] = await Promise.all([
      prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        include: {
          category: { select: { slug: true } },
          reviews: { select: { rating: true } },
        },
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: { select: { slug: true } },
          reviews: { select: { rating: true } },
        },
        take: 4,
        orderBy: { price: "desc" },
      }),
      prisma.category.findMany(),
      prisma.setting.findMany(),
    ]);
  } catch (err) {
    console.error("Home page DB error:", err);
  }

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const spotlightSlug = settingsMap["spotlight_category_slug"] || "ready-to-wear";
  try {
    spotlightCategory = await prisma.category.findUnique({
      where: { slug: spotlightSlug },
      include: {
        products: {
          where: { isActive: true },
          take: 6,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (err) {
    console.error("Spotlight category DB error:", err);
  }

  const defaultCategoryImageMap: Record<string, string> = {
    "unstitched": "/images/category-unstitched.png",
    "ready-to-wear": "/images/product-sage.png",
    "bridal": "/images/product-rose.png",
    "sale": "/images/product-emerald.png",
    "customized": "/images/bespoke.png",
    "printed-unstitched": "/images/category-unstitched.png",
    "embroidered-unstitched": "/images/product-rose.png",
    "pret": "/images/product-sage.png",
    "summer-vol-1": "/images/hero-homepage.png",
    "one-piece": "/images/product-sage.png",
    "two-piece": "/images/product-ivory.png",
    "kurti-shirt": "/images/product-sage.png",
  };

  const activeCategories = displayCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    imageUrl: cat.imageUrl || defaultCategoryImageMap[cat.slug] || "/images/placeholder.jpg",
    href: cat.slug === "customized" ? "/customized" : `/category/${cat.slug}`,
  })).filter((c) => c.imageUrl);

  return (
    <div className="font-jost bg-white">

      {/* ── Hero Carousel ── */}
      <HeroCarousel banners={banners} />

      {/* ── Shop by Category — Animated pill/circle strip ── */}
      <section className="py-12 md:py-20 bg-white border-b border-outline/10">
        <div className="max-w-container mx-auto px-4 md:px-6">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3 block">Discover</span>
            <h2 className="text-3xl md:text-5xl font-garamond text-primary">Shop by Category</h2>
          </ScrollReveal>
          {/* Client-side animated pill strip */}
          <CategoryPills categories={activeCategories} />
        </div>
      </section>

      {/* ── Second Banner Carousel (Flash Sale Banners) ── */}
      <FlashSaleCarousel
        slides={[
          {
            imageUrl: settingsMap["flash_sale_banner_1_img"] || "/images/banner1.png",
            linkUrl: settingsMap["flash_sale_banner_1_link"] || "/category/sale",
          },
          {
            imageUrl: settingsMap["flash_sale_banner_2_img"] || "/images/banner2.png",
            linkUrl: settingsMap["flash_sale_banner_2_link"] || "/category/unstitched",
          },
          {
            imageUrl: settingsMap["flash_sale_banner_3_img"] || "/images/hero-homepage.png",
            linkUrl: settingsMap["flash_sale_banner_3_link"] || "/category/ready-to-wear",
          },
        ]}
      />

      {/* ── Editorial Lookbook ── */}
      <EditorialLookbook
        title={settingsMap["lookbook_title"] || "The Heritage Masterpieces"}
        subtitle={settingsMap["lookbook_subtitle"] || "Editor's Pick"}
        description={settingsMap["lookbook_text"] || "Experience the pinnacle of craftsmanship with our signature collection. Every thread is woven with tradition, bringing you timeless elegance and unparalleled modern luxury."}
        image1={settingsMap["lookbook_image_1"] || "/images/ai_promo_1.png"}
        image2={settingsMap["lookbook_image_2"] || "/images/ai_promo_2.png"}
        ctaLink={settingsMap["lookbook_cta_link"] || "/category/ready-to-wear"}
      />

      {/* ── Featured Arrivals ── */}
      <section className="py-20 md:py-32 bg-surface">
        <div className="max-w-container mx-auto px-6">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant mb-4 block">New In</span>
              <h2 className="text-3xl md:text-5xl font-garamond text-primary">Featured Arrivals</h2>
            </div>
            <Link
              href="/category/unstitched"
              className="text-xs font-semibold tracking-[0.2em] uppercase text-primary border-b border-primary/20 pb-1 hover:border-primary transition-colors self-start md:self-auto"
            >
              View All →
            </Link>
          </ScrollReveal>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.salePrice || product.price}
                  originalPrice={product.salePrice ? product.price : undefined}
                  image={product.images[0] || "/images/placeholder.jpg"}
                  href={`/product/${product.id}`}
                  inStock={product.stock > 0}
                  sizes={product.sizes}
                  reviews={product.reviews}
                />
              ))}
            </div>
          ) : (
            <ScrollReveal className="text-center py-20">
              <p className="font-garamond text-2xl text-on-surface-variant">No featured products yet.</p>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── Spotlight / Bestsellers ── */}
      {spotlightCategory && (
        <SpotlightSection
          title={settingsMap["spotlight_title"] || "Our Bestsellers"}
          subtitle={settingsMap["spotlight_subtitle"] || "Top Rated"}
          categoryName={spotlightCategory.name}
          categorySlug={spotlightCategory.slug}
          categoryImage={spotlightCategory.imageUrl || defaultCategoryImageMap[spotlightCategory.slug] || "/images/placeholder.jpg"}
          products={spotlightCategory.products}
        />
      )}

      {/* ── Sale Banner — animated client component ── */}
      <SaleBanner
        headline={settingsMap["sale_banner_headline"] || "Summer Season Sale — Up to 25% Off"}
        subtext={settingsMap["sale_banner_subtext"] || "Elevate your wardrobe with Khizar Fabric Store's premium fabrics. Nationwide delivery and cash on delivery."}
        ctaText={settingsMap["sale_banner_cta"] || "Shop The Sale"}
        ctaLink={settingsMap["sale_banner_link"] || "/category/sale"}
        bgImage="/images/banner1.png"
      />

      {/* ── Trending Now ── */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-container mx-auto px-6">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-on-surface-variant mb-4 block">Most Loved</span>
              <h2 className="text-3xl md:text-5xl font-garamond text-primary">Trending Now</h2>
            </div>
            <Link
              href="/category/ready-to-wear"
              className="text-xs font-semibold tracking-[0.2em] uppercase text-primary border-b border-primary/20 pb-1 hover:border-primary transition-colors self-start md:self-auto"
            >
              View All →
            </Link>
          </ScrollReveal>

          {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.salePrice || product.price}
                  originalPrice={product.salePrice ? product.price : undefined}
                  image={product.images[0] || "/images/placeholder.jpg"}
                  href={`/product/${product.id}`}
                  inStock={product.stock > 0}
                  sizes={product.sizes}
                  reviews={product.reviews}
                />
              ))}
            </div>
          ) : (
            <ScrollReveal className="text-center py-20">
              <p className="font-garamond text-2xl text-on-surface-variant">No trending products yet.</p>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ── Brand Story ── */}
      <BrandStory
        title={settingsMap["brand_story_title"] || "Crafted With Heritage"}
        subtitle={settingsMap["brand_story_subtitle"] || "Our Legacy"}
        description={settingsMap["brand_story_text"] || "At Khizar Fabric Store, we believe in preserving the intricate artistry of traditional Pakistani fashion. Every garment is a testament to our master weavers and artisans, bringing you timeless elegance tailored to perfection."}
        imageUrl={settingsMap["brand_story_image"] || "/images/about-story.png"}
      />
    </div>
  );
}
