"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import toast from "react-hot-toast";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered")) {
      toast.success("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      setLoading(false);
    } else {
      toast.success("Successfully logged in!");
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 border border-outline/20">
      <h1 className="text-3xl font-garamond text-primary mb-2 text-center">Welcome Back</h1>
      <p className="text-on-surface-variant text-sm text-center mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-primary mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-primary mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-outline/30 focus:border-gold outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-on-surface-variant hover:text-gold transition-colors">
            Forgot your password?
          </Link>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-on-surface-variant">Don&apos;t have an account? </span>
        <Link href="/register" className="text-gold hover:underline">Register</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <Suspense fallback={
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </PageTransition>
  );
}
