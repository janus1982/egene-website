"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/rideskole", label: "Rideskole" },
  { href: "/opstaldning", label: "Opstaldning" },
  { href: "/spring", label: "Spring & stævner" },
  { href: "/om-os", label: "Om os" },
  { href: "/sponsorer", label: "Sponsorer" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteNav({ variant = "solid" }) {
  const [open, setOpen] = useState(false);
  const transparent = variant === "transparent";

  return (
    <>
      <nav
        className={
          (transparent
            ? "absolute bg-transparent"
            : "sticky bg-green-900 shadow-md") +
          " top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        }
      >
        <Link href="/" className="flex items-center">
          <span className="bg-white/95 rounded-xl p-1.5 shadow-sm">
            <Image src="/logo.jpg" alt="Egene Rideklub" width={52} height={52} className="object-contain" />
          </span>
        </Link>

        {/* Menu — computer */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-white">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-green-200 transition-colors drop-shadow">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger — mobil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-3xl leading-none drop-shadow"
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobil-menu der folder ud */}
      {open && (
        <div className="fixed inset-0 z-40 bg-green-900/95 flex flex-col items-center justify-center gap-7 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white text-2xl font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
