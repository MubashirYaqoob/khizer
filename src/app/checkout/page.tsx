"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepopulate if logged in
  useEffect(() => {
    if (session?.user) {
      if (!name) setName(session.user.name || "");
      if (!email) setEmail(session.user.email || "");
    }
  }, [session, name, email]);

  useEffect(() => {
    if (mounted && items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
    }
  }, [mounted, items, router]);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const delivery = subtotal > 5000 ? 0 : 250;
  const total = subtotal + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!items || items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!name.trim() || !email.trim() || !address.trim() || !city.trim() || !phone.trim()) {
      toast.error("Please fill in all the required fields");
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        name: name.trim(),
        email: email.trim(),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity > 0 ? item.quantity : 1,
          price: item.price,
          size: item.size || "Default",
        })),
        totalAmount: total,
        paymentMethod,
        deliveryAddress: address.trim(),
        city: city.trim(),
        phone: phone.trim(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error("Server returned an invalid response. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data?.error || `Something went wrong (${res.status})`);
      }

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.");
      setIsSubmitting(false); // Only re-enable if there was an error
    }
  };

  return (
    <div className="bg-white min-h-screen py-12 md:py-24 font-inter">
      <div className="max-w-container mx-auto px-6 lg:px-12">
        <h1 className="font-playfair text-display-lg-mobile md:text-display-lg mb-12 text-primary border-b border-primary/10 pb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-white">
            <h2 className="text-xl font-playfair text-primary mb-8 tracking-wide">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Checkout Notice */}
              {!session && (
                <div className="bg-gold/5 border border-gold/30 p-4 flex items-start gap-3 rounded-sm">
                  <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-primary">Ordering as Guest</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      You can checkout without an account. Just fill in your details below.{" "}
                      <a href="/login" className="text-gold underline hover:no-underline">Sign in</a> to track orders easily.
                    </p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full bg-surface border-none p-4 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-surface border-none p-4 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-surface border-none p-4 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm text-on-surface-variant mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-surface border-none p-4 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-2">
                  Delivery Address *
                </label>
                <textarea
                  placeholder="Street Address, Apartment/House/Suite Number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-surface border-none p-4 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-shadow resize-none"
                />
              </div>

              {/* Payment Method */}
              <div className="pt-6">
                <h3 className="text-lg font-playfair text-primary mb-6 tracking-wide">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center p-5 cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "bg-primary text-white"
                        : "bg-surface text-primary hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "COD" ? "border-white" : "border-primary/20"}`}>
                        {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="hidden"
                      />
                      <div>
                        <span className="block text-sm font-medium">
                          Cash on Delivery
                        </span>
                      </div>
                    </div>
                  </label>

                  <label
                    className="flex items-center p-5 cursor-pointer transition-all bg-surface text-primary/40 hover:bg-gray-50 border border-dashed border-outline/25"
                    onClick={() => {
                      toast.error("This service is not available yet. Jald hi is par kaam hoga!", {
                        duration: 5000,
                        icon: "💳",
                      });
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center border-outline/20">
                        {/* Always unselected */}
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={false}
                        readOnly
                        className="hidden"
                      />
                      <div>
                        <span className="block text-sm font-medium">
                          Online Payment
                        </span>
                        <span className="text-xs text-text-muted">Coming Soon</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-center block text-sm tracking-[0.15em] py-5"
                >
                  {isSubmitting ? "Processing..." : `Place Order — Rs. ${total.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-5 bg-surface p-8 lg:p-12">
            <h2 className="text-xl font-playfair text-primary mb-8 tracking-wide">Order Summary</h2>
            
            <div className="space-y-6 mb-10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <div className="relative w-20 h-24 bg-white overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-playfair text-base text-primary mb-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-on-surface-variant mb-2">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base text-primary">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm border-t border-primary/10 pt-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="text-primary">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span className="text-primary">{delivery === 0 ? "Free" : `Rs. ${delivery}`}</span>
              </div>
              <div className="border-t border-primary/10 pt-6 mt-4 flex justify-between items-center text-lg font-playfair text-primary">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
