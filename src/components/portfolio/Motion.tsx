import { motion, type HTMLMotionProps } from "motion/react";
import type { MouseEvent } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ delay = 0, y = 24, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay }}
      {...props}
    />
  );
}

export const trackSpotlight = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export function GlassCard({ className = "", ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      onMouseMove={trackSpotlight}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`glass spotlight rounded-3xl ${className}`}
      {...props}
    />
  );
}
