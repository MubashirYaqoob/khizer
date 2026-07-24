"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: string;
  city: string;
  phone: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
  customizedOrder: any;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load orders");
        }
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-montserrat">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="font-garamond text-display-lg-mobile md:text-display-lg mb-8 text-primary border-b border-primary/10 pb-4">
          My Orders
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 border border-red-200">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white p-8 text-center border border-primary/5 shadow-sm">
            <p className="text-body-md text-text-muted mb-6">You haven&apos;t placed any orders yet.</p>
            <Link href="/" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 shadow-sm border border-primary/5"
              >
                <div className="flex flex-col sm:flex-row justify-between border-b border-primary/10 pb-4 mb-4 gap-4">
                  <div>
                    <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">
                      Order ID
                    </span>
                    <span className="font-semibold text-primary break-all">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">
                      Placed On
                    </span>
                    <span className="font-semibold text-primary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">
                      Status
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">
                      Total
                    </span>
                    <span className="font-bold text-gold">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-primary/5">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center text-body-md">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 bg-cream overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images?.[0] || "/images/placeholder.jpg"}
                            alt={item.product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-primary block">{item.product.name}</span>
                          <span className="text-xs text-text-muted block">
                            Size: {item.size || "Standard"} | Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {order.customizedOrder && (
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <span className="text-xs text-gold uppercase tracking-wider font-semibold block mb-2">
                      Customized Fit Details
                    </span>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs bg-cream p-2 font-mono">
                      <div>
                        <span className="block text-text-muted">Chest</span>
                        <span className="font-bold">{order.customizedOrder.chest}&quot;</span>
                      </div>
                      <div>
                        <span className="block text-text-muted">Waist</span>
                        <span className="font-bold">{order.customizedOrder.waist}&quot;</span>
                      </div>
                      <div>
                        <span className="block text-text-muted">Hips</span>
                        <span className="font-bold">{order.customizedOrder.hips}&quot;</span>
                      </div>
                      <div>
                        <span className="block text-text-muted">Length</span>
                        <span className="font-bold">{order.customizedOrder.length}&quot;</span>
                      </div>
                      <div>
                        <span className="block text-text-muted">Sleeves</span>
                        <span className="font-bold">{order.customizedOrder.sleeves}&quot;</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
