"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Baggrunden bevæger sig langsommere end resten (parallax)
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="relative w-full h-full scale-125">
          <Image
            src="/forside.jpg"
            alt="Egene Rideklub på en sommerdag"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 px-6 max-w-3xl"
      >
        <p className="text-green-100 uppercase tracking-[0.3em] text-sm mb-4">Nordsjælland · Holte</p>
        <h1 className="text-white text-4xl sm:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
          En rideklub i særklasse
        </h1>
        <p className="text-white/90 text-lg sm:text-xl mb-10 drop-shadow">
          Et lille sted med en helt særlig beliggenhed — hjem for springning,
          fællesskab og heste i smukke rammer under de gamle ege.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#tilbud" className="bg-white text-green-900 font-semibold px-8 py-3.5 rounded-full hover:bg-green-50 transition-colors shadow-lg">
            Se hvad vi tilbyder
          </a>
          <Link href="/kontakt" className="border border-white/80 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors">
            Kontakt os
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
