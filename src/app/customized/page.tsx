"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import toast from "react-hot-toast";

interface Fabric {
  id: string;
  name: string;
  image: string;
  price: number;
}

// Fabrics are loaded dynamically from the database

export default function CustomizedPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loadingFabrics, setLoadingFabrics] = useState(true);

  // Measurements state
  const [shoulder, setShoulder] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [length, setLength] = useState("");
  const [sleeves, setSleeves] = useState("");

  // Shipping & Checkout state
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchFabrics = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        // Filter for unstitched products (case-insensitive check for 'unstitched' in category slug)
        const unstitched = (data.products || []).filter((p: any) => 
          p.category?.slug?.toLowerCase().includes("unstitched")
        );
        
        const mapped: Fabric[] = unstitched.map((p: any) => ({
          id: p.id,
          name: p.name,
          image: p.images?.[0] || "/images/placeholder.png",
          price: p.salePrice ?? p.price,
        }));
        
        setFabrics(mapped);
      } catch (err) {
        console.error("Error fetching fabrics:", err);
        toast.error("Failed to load fabrics. Please refresh the page.");
      } finally {
        setLoadingFabrics(false);
      }
    };

    fetchFabrics();
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Require user authentication
  if (!session) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center py-section-lg font-montserrat">
        <div className="max-w-md w-full px-6 text-center">
          <span className="text-label-caps text-gold block mb-4">Bespoke Tailoring</span>
          <h1 className="font-garamond text-display-lg-mobile md:text-headline-md mb-6 text-primary">
            Sign In to Book a Custom Fitting
          </h1>
          <p className="text-body-md text-text-muted mb-8">
            To provide the best personalized experience, you need to sign in to your Khizar Fabric Store account before ordering custom outfits.
          </p>
          <button
            onClick={() => router.push("/login?callbackUrl=/customized")}
            className="btn-primary"
          >
            Log In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleNextStep2 = () => {
    if (!selectedFabric) {
      toast.error("Please select a fabric first");
      return;
    }
    setStep(2);
  };

  const handleNextStep3 = () => {
    const shVal = parseFloat(shoulder);
    const chVal = parseFloat(chest);
    const waVal = parseFloat(waist);
    const hiVal = parseFloat(hips);
    const leVal = parseFloat(length);
    const slVal = parseFloat(sleeves);

    if (isNaN(shVal) || isNaN(chVal) || isNaN(waVal) || isNaN(hiVal) || isNaN(leVal) || isNaN(slVal)) {
      toast.error("Please enter valid positive numbers for all measurements");
      return;
    }

    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim() || !city.trim() || !address.trim()) {
      toast.error("Please enter complete shipping information");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        totalAmount: selectedFabric!.price,
        paymentMethod,
        deliveryAddress: address,
        city,
        phone,
        fabricChoice: selectedFabric!.name,
        specialInstructions,
        measurements: {
          chest: parseFloat(chest),
          waist: parseFloat(waist),
          hips: parseFloat(hips),
          length: parseFloat(length),
          sleeves: parseFloat(sleeves),
        },
      };

      const res = await fetch("/api/orders/custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit customized request");
      }

      toast.success("Bespoke order request submitted!");
      router.push(`/order-confirmation/${data.order.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Image */}
        <div className="lg:w-1/2 relative h-[40vh] lg:h-auto lg:sticky lg:top-0">
          <Image src="/images/bespoke.png" alt="Bespoke Tailoring" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
            <span className="text-label-caps text-gold mb-2 block tracking-[0.2em] uppercase">Signature Bespoke</span>
            <h1 className="text-display-lg-mobile md:text-display-md font-garamond mb-4">
              Crafted For Your Unique Silhouette
            </h1>
            <p className="text-body-md text-white/80 max-w-md">
              Our master artisans blend generations of tailoring expertise with your personal vision, creating garments that fit perfectly and reflect your individual style.
            </p>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="lg:w-1/2 bg-cream py-16 px-6 lg:px-16 font-montserrat flex flex-col justify-center">
          <div className="max-w-xl mx-auto w-full">
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-16 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-outline/20 -z-10" />
              {[
                { num: 1, label: "Fabric" },
                { num: 2, label: "Measures" },
                { num: 3, label: "Checkout" },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center bg-cream px-2 sm:px-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step >= s.num
                        ? "bg-primary text-white"
                        : "bg-outline/10 text-text-muted border border-outline/30"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mt-2 ${
                      step >= s.num ? "text-primary" : "text-text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Fabric Selection */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-headline-sm font-garamond text-primary mb-2">Select Your Base Fabric</h2>
                <p className="text-body-md text-text-muted mb-8">Choose from our curated selection of premium textiles.</p>

                {loadingFabrics ? (
                  <div className="py-20 flex flex-col items-center justify-center text-text-muted">
                    <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-medium">Loading premium fabrics...</p>
                  </div>
                ) : fabrics.length === 0 ? (
                  <div className="py-20 text-center text-text-muted">
                    <p className="font-medium">No fabrics available at the moment.</p>
                    <p className="text-sm mt-1">Please ensure Unstitched fabrics are added in the admin dashboard.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-12">
                    {fabrics.map((fabric) => (
                      <div
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric)}
                        className={`cursor-pointer group relative aspect-[3/4] overflow-hidden border-2 transition-all ${
                          selectedFabric?.id === fabric.id ? "border-gold" : "border-transparent hover:border-primary/20"
                        }`}
                      >
                        <img src={fabric.image} alt={fabric.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-sm font-semibold mb-1">{fabric.name}</h3>
                          <p className="text-gold text-xs font-semibold">Rs. {fabric.price.toLocaleString()}</p>
                        </div>
                        {selectedFabric?.id === fabric.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white shadow">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end border-t border-outline/20 pt-8">
                  <button
                    onClick={handleNextStep2}
                    disabled={!selectedFabric}
                    className={`btn-primary w-full sm:w-auto cursor-pointer ${!selectedFabric ? "opacity-50 cursor-not-allowed hover:bg-primary" : ""}`}
                  >
                    Continue to Measurements
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Measurements */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-headline-sm font-garamond text-primary mb-2">Your Measurements (Inches)</h2>
                <p className="text-body-md text-text-muted mb-8">Provide accurate measurements in inches for a perfect fit.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mb-12">
                  {[
                    { id: "shoulder", label: "Shoulder", val: shoulder, setter: setShoulder },
                    { id: "chest", label: "Chest / Bust", val: chest, setter: setChest },
                    { id: "waist", label: "Waist", val: waist, setter: setWaist },
                    { id: "hips", label: "Hips", val: hips, setter: setHips },
                    { id: "length", label: "Shirt Length", val: length, setter: setLength },
                    { id: "sleeves", label: "Sleeves Length", val: sleeves, setter: setSleeves },
                  ].map((field, idx) => (
                    <motion.div 
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        step="0.1"
                        id={field.id}
                        value={field.val}
                        onChange={(e) => field.setter(e.target.value)}
                        className="input-minimal peer placeholder-transparent border-primary/20 focus:border-gold"
                        placeholder={field.label}
                        required
                      />
                      <label
                        htmlFor={field.id}
                        className="absolute left-0 -top-3.5 text-xs text-text-muted transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-primary"
                      >
                        {field.label} *
                      </label>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-outline/20 pt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="text-label-caps text-text-muted hover:text-primary transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button onClick={handleNextStep3} className="btn-primary cursor-pointer">
                    Proceed to Checkout
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Checkout & Details */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-headline-sm font-garamond text-primary mb-2">Bespoke Checkout</h2>
                <p className="text-body-md text-text-muted mb-8">Enter your delivery information to complete the order.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-body-md text-primary mb-2 font-medium">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 03001234567"
                        className="w-full bg-white border border-primary/20 p-3 text-body-md focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-body-md text-primary mb-2 font-medium">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lahore"
                        className="w-full bg-white border border-primary/20 p-3 text-body-md focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-body-md text-primary mb-2 font-medium">Delivery Address *</label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street Address, Apartment/House/Suite Number"
                      rows={3}
                      className="w-full bg-white border border-primary/20 p-3 text-body-md focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-body-md text-primary mb-2 font-medium">Special Instructions / Style</label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="E.g. A deep neck line, specific lace work..."
                      rows={2}
                      className="w-full bg-white border border-primary/20 p-3 text-body-md focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-body-md text-primary mb-3 font-medium">Payment Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                          paymentMethod === "COD" ? "border-gold bg-white shadow-sm" : "border-primary/10 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                            className="text-gold focus:ring-gold"
                          />
                          <div>
                            <span className="block text-body-sm font-semibold text-primary">Cash on Delivery</span>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                          paymentMethod === "ONLINE" ? "border-gold bg-white shadow-sm" : "border-primary/10 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "ONLINE"}
                            onChange={() => setPaymentMethod("ONLINE")}
                            className="text-gold focus:ring-gold"
                          />
                          <div>
                            <span className="block text-body-sm font-semibold text-primary">Online Payment</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-white p-6 border border-primary/10 mt-6 shadow-sm">
                    <h3 className="font-garamond text-lg font-medium text-primary mb-3">Custom Order Summary</h3>
                    <div className="space-y-2 text-sm text-text-muted">
                      <div className="flex justify-between">
                        <span>Fabric Choice:</span>
                        <span className="font-semibold text-primary">{selectedFabric?.name}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono py-2">
                        <span>C:{chest}" W:{waist}" H:{hips}" L:{length}" S:{sleeves}"</span>
                      </div>
                      <div className="flex justify-between border-t border-primary/10 pt-3 text-body-lg font-bold">
                        <span className="text-primary">Total Price:</span>
                        <span className="text-gold">Rs. {selectedFabric?.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between border-t border-outline/20 pt-8 items-center mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-label-caps text-text-muted hover:text-primary transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary cursor-pointer w-auto"
                    >
                      {isSubmitting ? "Submitting..." : "Place Order"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
