"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

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
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-montserrat">
      <div className="flex justify-between items-center border-b border-primary/10 pb-4">
        <div>
          <h1 className="font-garamond text-display-lg-mobile md:text-headline-md text-primary">
            Orders Management
          </h1>
          <p className="text-body-md text-text-muted">
            View, track, and update customer order statuses.
          </p>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4 font-montserrat">
        {orders.length === 0 ? (
          <div className="text-center py-8 bg-white border border-primary/10 text-text-muted">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white border border-primary/10 p-4 rounded-lg shadow-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-primary/10">
                <span className="font-mono text-xs font-semibold text-primary">ID: {order.id.slice(-8)}</span>
                <span className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-1.5 text-sm">
                <div>
                  <span className="text-xs text-text-muted block uppercase">Customer</span>
                  <span className="font-semibold text-primary block">{order.user?.name ?? order.guestName ?? <span className="italic text-text-muted">Guest</span>}</span>
                  <span className="text-xs text-text-muted block">{order.user?.email ?? order.guestEmail ?? "—"}</span>
                  <span className="text-xs text-text-muted block">Phone: {order.phone}</span>
                </div>
                
                <div className="pt-2">
                  <span className="text-xs text-text-muted block uppercase">Location</span>
                  <span className="font-semibold text-primary block">{order.city}</span>
                  <span className="text-xs text-text-muted block">{order.deliveryAddress}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-outline/10 text-xs">
                  <div>
                    <span className="text-text-muted block">Items: {order._count.orderItems}</span>
                    <span className="font-semibold text-gold block">Rs. {order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted block">Payment: {order.paymentMethod}</span>
                    <span className="text-xs font-semibold text-primary block">{order.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-primary/10">
                <span className="text-xs text-text-muted block uppercase mb-1">Status</span>
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block bg-white border border-primary/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream text-label-caps text-gold border-b border-primary/10">
                <th className="p-4 text-xs font-semibold">Order ID</th>
                <th className="p-4 text-xs font-semibold">Customer</th>
                <th className="p-4 text-xs font-semibold">Date</th>
                <th className="p-4 text-xs font-semibold">Location</th>
                <th className="p-4 text-xs font-semibold">Items</th>
                <th className="p-4 text-xs font-semibold">Total</th>
                <th className="p-4 text-xs font-semibold">Payment</th>
                <th className="p-4 text-xs font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10 text-body-md text-primary">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-muted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 font-mono text-xs break-all max-w-[120px]">
                      {order.id}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block">{order.user?.name ?? order.guestName ?? <span className="italic text-text-muted">Guest</span>}</span>
                      <span className="text-xs text-text-muted block">{order.user?.email ?? order.guestEmail ?? "—"}</span>
                      <span className="text-xs text-text-muted block">{order.phone}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block">{order.city}</span>
                      <span className="text-xs text-text-muted block max-w-[200px] truncate" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold">
                      {order._count.orderItems}
                    </td>
                    <td className="p-4 font-semibold text-gold">
                      Rs. {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="block font-semibold">{order.paymentMethod}</span>
                      <span className="text-xs text-text-muted block">{order.paymentStatus}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="bg-transparent border border-primary/20 p-2 text-xs font-semibold tracking-wider uppercase rounded focus:outline-none focus:border-gold disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
