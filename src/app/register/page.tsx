"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to register. Please try again.");
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full bg-white p-8 border border-outline/20 font-montserrat">
          <h1 className="text-3xl font-garamond text-primary mb-2 text-center">Create Account</h1>
          <p className="text-on-surface-variant text-sm text-center mb-8">Join Khizar Fabric Store</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-primary mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-primary mb-2">Password (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-on-surface-variant">Already have an account? </span>
            <Link href="/login" className="text-gold hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
