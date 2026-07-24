export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    
    const banner = await prisma.heroBanner.create({
      data: {
        imageUrl: body.imageUrl,
        title: body.title,
        subtitle: body.subtitle,
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      }
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
