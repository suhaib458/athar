"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MotionReveal({ children, delay = 0, className = "", scale = false }: { children: React.ReactNode; delay?: number; className?: string; scale?: boolean }) {
  const reduceMotion = useReducedMotion();
  return <motion.div
    className={className}
    initial={reduceMotion ? false : { opacity: 0, y: 18, scale: scale ? 0.98 : 1 }}
    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.18 }}
    transition={{ duration: 0.52, delay, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>;
}
