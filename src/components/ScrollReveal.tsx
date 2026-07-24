"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "up" (default), "left", "right", "fade" */
  direction?: "up" | "left" | "right" | "fade";
  once?: boolean;
  threshold?: number;
}

const directionMap = {
  up:    { opacity: 0, y: 30 },
  left:  { opacity: 0, x: -30 },
  right: { opacity: 0, x: 30 },
  fade:  { opacity: 0 },
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
  threshold = 0.2,
  ...rest
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={directionMap[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount: threshold }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
