import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("GET Reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const { name, email, rating, comment } = result.data;

    const review = await prisma.review.create({
      data: {
        productId,
        name,
        email,
        rating,
        comment,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("POST Review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
