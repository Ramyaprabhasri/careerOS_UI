"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="pointer-events-none absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex lg:bottom-8"
      aria-hidden
    >
      <span className="text-[10px] font-medium tracking-[0.28em] text-muted-soft uppercase">
        Scroll
      </span>
      <div className="relative h-9 w-px overflow-hidden bg-white/10">
        <motion.span
          className="absolute inset-x-0 top-0 h-3 bg-accent"
          animate={{ y: [0, 24, 0], opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
