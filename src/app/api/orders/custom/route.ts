export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { customOrderSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Ensure we have a valid custom product for fabric choice
    let fabricChoice = body.fabricChoice || "Raw Silk";
    let price = body.totalAmount || 15000;

    // We need a category for customized products
    let category = await prisma.category.findUnique({
      where: { slug: "customized" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Customized",
          slug: "customized",
          description: "Bespoke tailored outfits",
        },
      });
    }

    // Find or create the product corresponding to fabric choice
    let product = await prisma.product.findFirst({
      where: {
        categoryId: category.id,
        name: { contains: fabricChoice, mode: "insensitive" },
      },
    });

    if (!product) {
      const slug = `custom-${fabricChoice.toLowerCase().replace(/\s+/g, "-")}`;
      product = await prisma.product.create({
        data: {
          name: `Customized ${fabricChoice}`,
          slug: slug,
          description: `Bespoke tailored outfit using premium ${fabricChoice} fabric.`,
          price: price,
          images: ["/images/product-emerald.png"],
          sizes: ["CUSTOM"],
          stock: 9999,
          categoryId: category.id,
        },
      });
    }

    // Map fabric product to order items if not provided
    if (!body.items || body.items.length === 0) {
      body.items = [
        {
          productId: product.id,
          quantity: 1,
          price: price,
          size: "CUSTOM",
        },
      ];
    }

    const data = customOrderSchema.parse(body);
    const userId = (session.user as any).id;

    // Use Prisma Transaction for order, items, and custom measurements
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          deliveryAddress: data.deliveryAddress,
          city: data.city,
          phone: data.phone,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: "CUSTOM",
        })),
      });

      // Create customized order details
      await tx.customizedOrder.create({
        data: {
          orderId: newOrder.id,
          chest: data.measurements.chest,
          waist: data.measurements.waist,
          hips: data.measurements.hips,
          length: data.measurements.length,
          sleeves: data.measurements.sleeves,
          fabricChoice: data.fabricChoice,
          specialInstructions: data.specialInstructions,
        },
      });

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error("Custom order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
