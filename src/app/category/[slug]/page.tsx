import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import VolumePills from "@/components/VolumePills";
import CategoryFilters from "@/components/CategoryFilters";

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
  searchParams: { size?: string; minPrice?: string; maxPrice?: string; volume?: string; sort?: string };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      volumes: {
        orderBy: { displayOrder: 'asc' }
      }
    }
  });

  if (!category) {
    notFound();
  }

  const where: any = { isActive: true, categoryId: category.id };
  if (searchParams.size) where.sizes = { has: searchParams.size };
  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) where.price.gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) where.price.lte = parseFloat(searchParams.maxPrice);
  }
  
  if (searchParams.volume) {
    const selectedVolume = category.volumes.find((v: any) => v.slug === searchParams.volume);
    if (selectedVolume) {
      where.volumeId = selectedVolume.id;
    }
  }

  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (searchParams.sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (searchParams.sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      reviews: { select: { rating: true } },
    },
  });

  return (
    <div className="max-w-container mx-auto px-6 py-12 lg:py-20">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl font-garamond text-primary mb-4 gold-rule-bottom inline-block">{category.name}</h1>
        {category.description && (
          <p className="text-text-muted font-jost max-w-2xl mt-6 mx-auto lg:mx-0">{category.description}</p>
        )}
      </div>

      {category.volumes && category.volumes.length > 0 && (
        <VolumePills volumes={category.volumes} categorySlug={category.slug} />
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start mt-10">
        <CategoryFilters />

        <div className="flex-1 w-full">
          {products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-outline/30 rounded-sm bg-white/50 w-full">
              <p className="font-garamond text-2xl text-primary mb-3">No products found</p>
              <p className="text-text-muted font-jost text-sm">Try adjusting your filters or checking back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.salePrice || product.price}
                  originalPrice={product.salePrice ? product.price : undefined}
                  image={product.images[0] || "/images/product-emerald.png"}
                  href={`/product/${product.id}`}
                  badge={product.isFeatured ? "NEW" : undefined}
                  inStock={product.stock > 0}
                  sizes={product.sizes}
                  reviews={product.reviews}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
