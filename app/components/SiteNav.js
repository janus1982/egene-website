"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/rideskole", label: "Rideskole" },
  { href: "/opstaldning", label: "Opstaldning" },
  { href: "/spring", label: "Spring & stævner" },
  { href: "/om-os", label: "Om os" },
  { href: "/nyheder", label: "Nyheder" },
  { href: "/sponsorer", label: "Sponsorer" },
  { href: "/shop", label: "Webshop" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/platform", label: "Medlemmer" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = scrolled
    ? "text-green-900 hover:text-green-600"
    : "text-white hover:text-green-200 drop-shadow";

  return (
    <>
      <nav
        className={
          "fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 transition-all duration-300 " +
          (scrolled
            ? "bg-white/85 backdrop-blur-md shadow-md"
            : "bg-transparent")
        }
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Egene Rideklub"
            width={56}
            height={56}
            className={
              "object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] " +
              (scrolled ? "logo-moerk" : "logo-lys")
            }
          />
        </Link>

        {/* Menu - computer */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={"transition-colors " + linkClass}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger - mobil */}
        <button
          onClick={() => setOpen(!open)}
          className={
            "md:hidden text-3xl leading-none transition-colors " +
            (scrolled ? "text-green-900" : "text-white drop-shadow")
          }
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
