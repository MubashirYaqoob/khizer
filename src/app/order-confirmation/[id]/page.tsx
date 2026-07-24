"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface OrderItemDetails {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  product: {
    name: string;
    slug: string;
    images: string[];
  };
}

interface OrderDetails {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: string;
  city: string;
  phone: string;
  status: string;
  createdAt: string;
  orderItems: OrderItemDetails[];
}

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to load order details");
        }
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4 text-center">
        <h1 className="font-garamond text-2xl text-red-600 mb-4">Error</h1>
        <p className="text-body-md text-text-muted mb-8">{error || "Order not found"}</p>
        <Link href="/" className="btn-primary">
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20 font-montserrat">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 md:p-10 shadow-sm border border-primary/5 text-center"
        >
          {/* Success Checkmark */}
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <span className="text-label-caps text-gold block mb-2">Order Confirmed</span>
          <h2 className="text-2xl md:text-4xl font-garamond text-primary mb-2 font-semibold font-playfair" dir="rtl">
            خریداری کا بہت شکریہ! 🌸
          </h2>
          <h1 className="font-garamond text-display-lg-mobile md:text-2xl mb-4 text-primary">
            Shukriya! Thank You for Your Order
          </h1>
          <p className="text-body-md text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
            الھدیٰ فیبرکس سے شاپنگ کرنے کا شکریہ۔ آپ کا آرڈر کامیابی سے موصول ہو گیا ہے، ہم جلد ہی اسے تیار کر کے روانہ کریں گے۔
            <br />
            <span className="text-xs text-text-muted mt-2 block">
              Your order has been successfully placed. We will process and ship it shortly.
            </span>
          </p>

          <div className="border-t border-b border-primary/10 py-6 my-6 text-left grid grid-cols-2 gap-4 text-body-md">
            <div>
              <span className="text-xs text-text-muted block uppercase tracking-wider font-semibold">
                Order ID
              </span>
              <span className="font-semibold text-primary break-all">{order.id}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block uppercase tracking-wider font-semibold">
                Date
              </span>
              <span className="font-semibold text-primary">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-text-muted block uppercase tracking-wider font-semibold">
                Payment Method
              </span>
              <span className="font-semibold text-primary">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block uppercase tracking-wider font-semibold">
                Total Amount
              </span>
              <span className="font-semibold text-gold font-montserrat">
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-left mt-8">
            <h3 className="text-label-caps text-gold mb-4">Shipping Details</h3>
            <div className="bg-cream p-4 text-body-md text-primary rounded">
              <p className="font-semibold mb-1">Phone: <span className="font-normal">{order.phone}</span></p>
              <p className="font-semibold mb-1">City: <span className="font-normal">{order.city}</span></p>
              <p className="font-semibold">Address: <span className="font-normal">{order.deliveryAddress}</span></p>
            </div>
          </div>

          <div className="text-left mt-8">
            <h3 className="text-label-caps text-gold mb-4">Items Ordered</h3>
            <div className="divide-y divide-primary/10 border-t border-primary/10">
              {order.orderItems.map((item) => (
                <div key={item.id} className="py-4 flex justify-between items-center text-body-md">
                  <div>
                    <span className="font-semibold text-primary block">{item.product.name}</span>
                    <span className="text-xs text-text-muted block">
                      Size: {item.size || "Standard"} | Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-primary">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary px-8">
              Continue Shopping
            </Link>
            <Link href="/orders" className="btn-outline px-8">
              View My Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
