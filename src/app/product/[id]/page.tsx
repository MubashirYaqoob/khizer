import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailView from "@/components/ProductDetailView";

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: { select: { name: true, slug: true } },
      sizeStocks: { orderBy: { size: "asc" } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return <ProductDetailView product={product as any} relatedProducts={relatedProducts} />;
}
