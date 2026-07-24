"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState(
    "Free Delivery on Orders Above Rs. 10,000 | Cash on Delivery Available Nationwide"
  );

  useEffect(() => {
    if (sessionStorage.getItem("announcement-dismissed") === "true") {
      setIsVisible(false);
      return;
    }
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.announcement) setText(data.settings.announcement);
      })
      .catch(() => {});
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("announcement-dismissed", "true");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("announcement-dismissed"));
    }
  };

  const message = `${text}  •  Style in Every Thread  •  `;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="announcement"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 36, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="bg-black text-white relative overflow-hidden flex items-center z-50 w-full"
        >
          {/* Framer Motion marquee — 100% reliable across all browsers */}
          <div className="flex-1 overflow-hidden relative flex items-center h-full">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: 22,
                repeat: Infinity,
              }}
              className="flex whitespace-nowrap text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] pl-4"
            >
              {/* Copy 1 */}
              <span className="inline-block pr-8">
                {message}{message}{message}{message}
              </span>
              {/* Copy 2 */}
              <span className="inline-block pr-8">
                {message}{message}{message}{message}
              </span>
            </motion.div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute right-0 top-0 bottom-0 px-4 bg-gradient-to-l from-black via-black/90 to-transparent flex items-center justify-center text-white hover:text-[#B8962E] transition-colors z-10"
            aria-label="Dismiss announcement"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
