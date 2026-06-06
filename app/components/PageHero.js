"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function PageHero({ image, alt, title, subtitle }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative h-[42vh] min-h-[320px] flex items-center justify-center text-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="relative w-full h-full scale-125">
          <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-black/45" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 px-6 max-w-2xl"
      >
        <h1 className="text-white text-4xl sm:text-5xl font-bold drop-shadow-lg mb-3">{title}</h1>
        {subtitle && <p className="text-white/90 text-lg drop-shadow">{subtitle}</p>}
      </motion.div>
    </section>
  );
}
