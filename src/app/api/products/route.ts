export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Filters
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("featured");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const q = searchParams.get("q");

    let whereClause: any = { isActive: true };

    if (q) {
      whereClause.name = { contains: q, mode: "insensitive" };
    }

    if (category) whereClause.category = { slug: category };
    if (isFeatured === "true") whereClause.isFeatured = true;
    if (size) whereClause.sizes = { has: size };
    
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        sizeStocks: { orderBy: { size: "asc" } },
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Admin check
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { sizeStocks: sizeStocksInput, ...restOfBody } = body;
    const data = productSchema.parse(restOfBody);
    const productData = data as any;

    // Calculate total stock from sizeStocks if provided
    let totalStock = productData.stock ?? 0;
    if (sizeStocksInput && Array.isArray(sizeStocksInput)) {
      totalStock = sizeStocksInput.reduce((sum: number, s: any) => sum + (s.stock || 0), 0);
    }

    const product = await prisma.product.create({
      data: { ...productData, stock: totalStock },
      include: { category: true }
    });

    // Create per-size stock records if sizes + sizeStocks provided
    if (sizeStocksInput && Array.isArray(sizeStocksInput)) {
      await prisma.productSize.createMany({
        data: sizeStocksInput.map((ss: any) => ({
          productId: product.id,
          size: ss.size,
          stock: ss.stock ?? 0,
        })),
        skipDuplicates: true,
      });
    } else if (product.sizes && product.sizes.length > 0) {
      // If no per-size stock provided, create equal distribution
      await prisma.productSize.createMany({
        data: product.sizes.map((size: string) => ({
          productId: product.id,
          size,
          stock: Math.floor(totalStock / product.sizes.length),
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Product slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
