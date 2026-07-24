export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    // We now expect 'email' and 'name' in the body for guest checkouts
    const data = orderSchema.parse(body);

    let userId: string | null = null;

    if (session && session.user) {
      userId = (session.user as any).id;
    }
    // For guest checkout, userId stays null — schema now supports optional userId

    // Use Prisma Transaction for order and items
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          ...(userId ? { userId } : {}),
          guestName: userId ? null : data.name,
          guestEmail: userId ? null : data.email,
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
          size: item.size,
        })),
      });

      // Validate and Decrement stock for each product
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { sizeStocks: true },
        });
        if (!product) throw new Error(`Product not found`);

        if (item.size && product.sizeStocks.length > 0) {
          // Per-size stock management
          const sizeRecord = product.sizeStocks.find((s) => s.size === item.size);
          if (!sizeRecord || sizeRecord.stock < item.quantity) {
            throw new Error(`Insufficient stock for size ${item.size} of ${product.name}`);
          }
          // Decrement the specific size stock
          await tx.productSize.update({
            where: { productId_size: { productId: item.productId, size: item.size } },
            data: { stock: { decrement: item.quantity } },
          });
          // Recalculate and update total stock cache
          const remaining = product.sizeStocks.reduce((sum, s) => {
            if (s.size === item.size) return sum + (s.stock - item.quantity);
            return sum + s.stock;
          }, 0);
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: remaining },
          });
        } else {
          // Fallback: no size tracking, decrement total
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("Insufficient stock")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { orderItems: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
