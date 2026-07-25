"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="max-w-md w-full bg-white p-8 border border-outline/20 text-center">
        <h1 className="text-3xl font-garamond text-primary mb-4">Invalid Link</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          This password reset link is invalid or missing. Please request a new one.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-block">
          Request New Link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md w-full bg-white p-8 border border-outline/20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-garamond text-primary mb-2">Password Reset!</h1>
        <p className="text-sm text-on-surface-variant">
          Your password has been updated. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white p-8 border border-outline/20">
      <h1 className="text-3xl font-garamond text-primary mb-2 text-center">Set New Password</h1>
      <p className="text-on-surface-variant text-sm text-center mb-8">
        Choose a strong new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-primary mb-2">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-primary mb-2">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your new password"
            className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Updating..." : "Set New Password"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/login" className="text-gold hover:underline">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <Suspense fallback={
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </PageTransition>
  );
}
