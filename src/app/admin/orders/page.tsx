"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  product: {
    name: string;
    images: string[];
    slug: string;
  } | null;
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
  guestName?: string | null;
  guestEmail?: string | null;
  user: {
    name: string;
    email: string;
  } | null;
  _count: {
    orderItems: number;
  };
  orderItems: OrderItem[];
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      toast.success("Order status updated");
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-primary/10 pb-4">
        <div>
          <h1 className="font-garamond text-display-lg-mobile md:text-headline-md text-primary">
            Orders Management
          </h1>
          <p className="text-body-md text-text-muted">
            View, track, and update customer order statuses. Click an order to see which suits were ordered.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-text-muted block">Total Orders</span>
          <span className="text-2xl font-bold text-primary">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-primary/10 rounded-lg text-text-muted">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            const customerName = order.user?.name ?? order.guestName ?? "Guest";
            const customerEmail = order.user?.email ?? order.guestEmail ?? "—";

            return (
              <div
                key={order.id}
                className="bg-white border border-primary/10 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Order Header Row — always visible */}
                <div className="p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
                  {/* Order ID + Date */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[10px] text-text-muted block">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-xs text-text-muted block mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-semibold text-sm text-primary block truncate">{customerName}</span>
                    <span className="text-xs text-text-muted block truncate">{customerEmail}</span>
                    <span className="text-xs text-text-muted block">{order.phone}</span>
                  </div>

                  {/* Location */}
                  <div className="hidden md:block">
                    <span className="font-semibold text-sm text-primary block">{order.city}</span>
                    <span className="text-xs text-text-muted block truncate max-w-[150px]" title={order.deliveryAddress}>
                      {order.deliveryAddress}
                    </span>
                  </div>

                  {/* Amount + Payment */}
                  <div className="hidden lg:block">
                    <span className="font-bold text-gold block">Rs. {order.totalAmount.toLocaleString()}</span>
                    <span className="text-xs text-text-muted block">{order.paymentMethod}</span>
                    <span className="text-xs text-text-muted block">{order.paymentStatus}</span>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="w-full bg-surface border border-primary/20 p-2 text-xs font-semibold tracking-wider uppercase rounded focus:outline-none focus:border-gold disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Expand Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-gold transition-colors border border-primary/20 hover:border-gold px-3 py-2 rounded"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {order._count.orderItems} {order._count.orderItems === 1 ? "Suit" : "Suits"}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expandable Order Items */}
                {isExpanded && (
                  <div className="border-t border-primary/10 bg-cream/40 px-4 md:px-6 py-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-primary mb-3">
                      Ordered Items
                    </h3>
                    <div className="space-y-3">
                      {order.orderItems.length === 0 ? (
                        <p className="text-xs text-text-muted italic">No item details available.</p>
                      ) : (
                        order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 bg-white border border-primary/10 rounded-lg p-3"
                          >
                            {/* Product Image */}
                            <div className="relative w-14 h-16 shrink-0 rounded overflow-hidden bg-surface">
                              {item.product?.images?.[0] ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name ?? "Product"}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-muted/30">
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-primary truncate">
                                {item.product?.name ?? "Unknown Product"}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                                {item.size && (
                                  <span className="text-xs text-text-muted">
                                    Size: <span className="font-semibold text-primary">{item.size}</span>
                                  </span>
                                )}
                                <span className="text-xs text-text-muted">
                                  Qty: <span className="font-semibold text-primary">{item.quantity}</span>
                                </span>
                                <span className="text-xs text-text-muted">
                                  Price: <span className="font-semibold text-gold">Rs. {item.price.toLocaleString()}</span>
                                </span>
                              </div>
                            </div>

                            {/* Line Total */}
                            <div className="text-right shrink-0">
                              <span className="text-sm font-bold text-gold">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-text-muted block">subtotal</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Mobile-only extra info */}
                    <div className="mt-4 pt-3 border-t border-primary/10 flex flex-wrap gap-4 text-xs text-text-muted md:hidden">
                      <span>📍 {order.city} — {order.deliveryAddress}</span>
                      <span>💳 {order.paymentMethod} ({order.paymentStatus})</span>
                      <span className="font-bold text-gold">Total: Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
