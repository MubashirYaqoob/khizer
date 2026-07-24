import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  let products: any[] = [];
  if (query.trim() !== "") {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Fetch all categories for suggestions
  const categories = await prisma.category.findMany({
    take: 6,
  });

  return (
    <div className="bg-white min-h-screen py-12 md:py-24 font-jost">
      <div className="max-w-container mx-auto px-6">
        <h1 className="font-garamond text-display-lg-mobile md:text-headline-md text-primary mb-2">
          Search Results
        </h1>
        <p className="text-text-muted text-sm mb-12">
          {query ? `Showing results for "${query}"` : "Search our collections"}
        </p>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-outline/10 max-w-2xl mx-auto p-8">
            <svg className="w-12 h-12 text-primary/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="font-garamond text-2xl text-primary mb-3">No results found</h2>
            <p className="text-text-muted text-sm mb-8">
              We couldn't find any products matching your search query. Try checking for typos or browse our popular collections below.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 border border-outline/20 hover:border-gold hover:text-gold transition-colors text-xs font-semibold uppercase tracking-wider bg-white rounded-full text-primary"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.salePrice ?? undefined}
                image={product.images[0] || "/images/placeholder.jpg"}
                href={`/product/${product.id}`}
                inStock={product.stock > 0}
                sizes={product.sizes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
