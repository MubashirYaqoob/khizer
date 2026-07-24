"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-[85vh] bg-cream flex items-center justify-center py-section-lg font-montserrat">
      <div className="max-w-md w-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[120px] font-garamond text-gold leading-none block font-light">
            404
          </span>
          <h1 className="font-garamond text-display-lg-mobile md:text-headline-md mb-4 text-primary">
            Page Not Found
          </h1>
          <p className="text-body-md text-text-muted mb-8">
            The page you are looking for does not exist. You will be automatically redirected to the homepage in{" "}
            <span className="text-gold font-bold">{countdown}</span> seconds.
          </p>
          <Link href="/" className="btn-primary">
            Return Home Immediately
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
