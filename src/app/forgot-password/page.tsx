"use client";

import { useState } from "react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-8 border border-outline/20">
          {!submitted ? (
            <>
              <h1 className="text-3xl font-garamond text-primary mb-2 text-center">
                Forgot Password
              </h1>
              <p className="text-on-surface-variant text-sm text-center mb-8">
                Enter your email address and we'll generate a password reset link for you.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-primary mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Generating Link..." : "Generate Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <Link href="/login" className="text-gold hover:underline">
                  ← Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-garamond text-primary mb-2 text-center">
                Reset Link Ready
              </h1>

              {resetUrl ? (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-on-surface-variant text-center">
                    Your password reset link has been generated. Copy the link below and open it in your browser:
                  </p>
                  <div className="bg-surface border border-outline/20 rounded p-3 break-all text-xs text-primary font-mono select-all">
                    {resetUrl}
                  </div>
                  <a
                    href={resetUrl}
                    className="block w-full btn-primary text-center cursor-pointer"
                  >
                    Open Reset Link Now
                  </a>
                  <p className="text-xs text-center text-on-surface-variant">
                    This link expires in 1 hour.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant text-center mt-4">
                  If an account exists with that email, a reset link has been generated. Please contact the admin to get your reset link.
                </p>
              )}

              <div className="mt-6 text-center text-sm">
                <Link href="/login" className="text-gold hover:underline">
                  ← Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
