"use client";

import { motion } from "framer-motion";

// Genbrugelig wrapper: toner indhold ind når det kommer i viewport.
// Brug: <FadeIn className="..."> ...indhold... </FadeIn>
export default function FadeIn({ children, delay = 0, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
