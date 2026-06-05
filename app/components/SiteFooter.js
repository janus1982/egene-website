import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-green-950 text-green-100 px-6 py-14">
      <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3 items-start">
        {/* Logo + navn */}
        <div className="flex flex-col items-center md:items-start">
          <span className="bg-white rounded-xl p-2.5 mb-4">
            <Image src="/logo.jpg" alt="Egene Rideklub" width={80} height={80} className="object-contain" />
          </span>
          <p className="text-green-300/70 text-sm text-center md:text-left">
            Et af Nordsjællands smukkest beliggende ridecentre.
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
          <p className="text-sm text-green-200">Nordsjælland</p>
          <p className="text-sm text-green-200">kontakt@egene.dk</p>
          <p className="text-sm text-green-200 mt-2">Facebook · Instagram</p>
        </div>
      </div>

      <p className="text-green-300/40 text-xs text-center mt-10">
        © {new Date().getFullYear()} Egene Rideklub · Medlem af Dansk Rideforbund
      </p>
    </footer>
  );
}
