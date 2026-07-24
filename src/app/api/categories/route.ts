export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ZodError } from "zod";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    });
    return NextResponse.json(
      { categories },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json({ categories: [] }, { status: 200 });
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
    
    // We override validation locally since we just added imageUrl to schema
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      slug: z.string().min(1, "Slug is required"),
      description: z.string().optional(),
      imageUrl: z.string().optional().nullable(),
    });

    const data = schema.parse(body);

    const category = await prisma.category.create({
      data,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    // Handle unique constraint violation (P2002) for slug
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
