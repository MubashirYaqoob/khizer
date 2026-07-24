export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Support lookup by either id or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id },
        ],
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        sizeStocks: { orderBy: { size: "asc" } },
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { sizeStocks: sizeStocksInput, stock, ...rest } = body;

    // Upsert product fields (excluding sizeStocks)
    const product = await prisma.product.update({
      where: { id: params.id },
      data: rest,
    });

    // Upsert per-size stock records if provided
    if (sizeStocksInput && Array.isArray(sizeStocksInput)) {
      for (const ss of sizeStocksInput) {
        await prisma.productSize.upsert({
          where: { productId_size: { productId: product.id, size: ss.size } },
          update: { stock: ss.stock },
          create: { productId: product.id, size: ss.size, stock: ss.stock },
        });
      }

      // Delete any size records for sizes that were removed
      const activeSizes = sizeStocksInput.map((s: any) => s.size);
      await prisma.productSize.deleteMany({
        where: { productId: product.id, size: { notIn: activeSizes } },
      });

      // Recalculate total stock cache
      const total = sizeStocksInput.reduce((sum: number, s: any) => sum + (s.stock || 0), 0);
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: total },
      });
    }

    const updated = await prisma.product.findUnique({
      where: { id: product.id },
      include: { sizeStocks: true },
    });

    return NextResponse.json({ product: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Handle foreign key constraint error (P2003) by soft-deleting
    if (error.code === 'P2003') {
      const product = await prisma.product.findUnique({
        where: { id: params.id },
      });
      if (product) {
        await prisma.product.update({
          where: { id: params.id },
          data: {
            isActive: false,
            slug: `${product.slug}-deleted-${Date.now()}`,
          },
        });
        return NextResponse.json({ success: true, message: "Product is referenced by orders. Deactivated." }, { status: 200 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
