import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-green-950 text-green-100 px-6 py-14">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3 items-start">
        {/* Logo + navn */}
        <div className="flex flex-col items-center md:items-start">
          <span className="bg-white rounded-xl p-2.5 mb-4">
            <Image src="/logo.png" alt="Egene Rideklub" width={80} height={80} className="object-contain" />
          </span>
          <p className="text-green-300/70 text-sm text-center md:text-left">
            Et af Nordsjællands smukkest beliggende ridecentre - i Holte.
          </p>
        </div>

        {/* Hurtige links */}
        <div className="text-center md:text-left">
          <p className="font-semibold mb-3 text-white">Genveje</p>
          <ul className="space-y-2 text-sm text-green-200">
            <li><Link href="/rideskole" className="hover:text-white">Rideskole</Link></li>
            <li><Link href="/opstaldning" className="hover:text-white">Opstaldning</Link></li>
            <li><Link href="/spring" className="hover:text-white">Spring & stævner</Link></li>
            <li><Link href="/kontakt" className="hover:text-white">Kontakt</Link></li>
          </ul>
        </div>

        {/* Kontakt */}
        <div className="text-center md:text-left">
          <p className="font-semibold mb-3 text-white">Find os</p>
          <p className="text-sm text-green-200">Egene Ridecenter v/Sigurd Nielsen</p>
          <p className="text-sm text-green-200">Høje Sandbjergvej 4, 2840 Holte</p>
          <p className="text-sm text-green-200 mt-1">
            <a href="tel:+4527140133" className="hover:text-white">+45 27 14 01 33</a>
          </p>
          <p className="text-sm text-green-200">
            <a href="mailto:kontakt@egene.dk" className="hover:text-white">kontakt@egene.dk</a>
          </p>
          <p className="text-sm text-green-200 mt-3 flex gap-3 justify-center md:justify-start">
            <a href="https://www.facebook.com/groups/88953719351" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Facebook</a>
            <a href="https://www.instagram.com/teamegene/" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Instagram</a>
          </p>
        </div>
      </div>

      <p className="text-green-300/40 text-xs text-center mt-10">
        © {new Date().getFullYear()} Egene Rideklub · CHR 128903 · Medlem af Dansk Rideforbund
      </p>
    </footer>
  );
}
